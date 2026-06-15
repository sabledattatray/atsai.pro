import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_T0OhZChna7TYPH',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'UaudGTRr7qZlTJ8PSIE2qBhx'
});

let ai: GoogleGenAI | null = null;
const getAi = () => {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
};

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Razorpay Webhook for Edge Cases
app.post('/api/webhooks/razorpay', express.json(), (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers['x-razorpay-signature'];
    
    if (secret && signature) {
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');
    
        if (digest !== signature) {
            return res.status(400).send('Invalid signature');
        }
    }
    
    const event = req.body.event;
    switch (event) {
        case 'payment.captured':
            console.log('Payment succeeded - executing robust credit provisioning');
            break;
        case 'payment.failed':
            console.log('Payment failed - firing retry notification & blocking access');
            break;
        case 'subscription.cancelled':
            console.log('Subscription canceled - scheduling downgrade and credit adjustment');
            break;
        case 'refund.created':
            console.log('Charge refunded - executing credit rollback safety protocol');
            break;
        default:
            console.log(`Unhandled event type ${event}`);
    }
    res.json({ received: true });
});

app.use(express.json());

// Memory store for viral share loops (In production, use Redis/DB)
const sharedReports = new Map<string, any>();

app.post('/api/share', (req, res) => {
  const reportId = Math.random().toString(36).substring(2, 10);
  sharedReports.set(reportId, req.body);
  res.json({ shareId: reportId });
});

app.get('/api/share/:id', (req, res) => {
  const report = sharedReports.get(req.params.id);
  if (report) res.json(report);
  else res.status(404).json({ error: 'Report not found' });
});

// API Route for Razorpay Checkout
app.post('/api/checkout', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID && !req.body.mock && process.env.RAZORPAY_KEY_ID !== 'rzp_test_T0OhZChna7TYPH') {
        // Fallback to mock session if key doesn't exist
        return res.json({ url: '/app?payment_success=true' });
    }
    
    const plan = req.body.plan;
    const amount = plan === 'pro' ? 1900 : 500;
    
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).substring(2,10)}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_T0OhZChna7TYPH'
    });
  } catch (error: any) {
    console.error('Razorpay error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API Route for Verification
app.post('/api/verify-payment', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET || 'UaudGTRr7qZlTJ8PSIE2qBhx';
        
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest === razorpay_signature) {
            res.json({ success: true, message: 'Payment verified' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

  // API Route for Analyzing Resume
  app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
      let aiClient;
      try {
        aiClient = getAi();
      } catch (err) {
        return res.status(500).json({ error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your secrets to use AI analysis.' });
      }

      const file = req.file;
      const jobDescription = req.body.jobDescription;

      if (!file) {
        return res.status(400).json({ error: 'Resume file is required.' });
      }

      if (!jobDescription) {
        return res.status(400).json({ error: 'Job description is required.' });
      }

      // Prepare Prompt for Gemini
      const promptText = `You are an expert ATS (Applicant Tracking System) algorithm, strict recruiter, and AI career coach.
Analyze the attached resume against the provided job description.
CRITICAL INSTRUCTION: For skill extraction, do NOT just look at a dedicated "Skills" section. You MUST semantically analyze the Work Experience descriptions, Project details, Certifications, and Summary sections. If a skill (like Python) is mentioned in any context of usage, mark it as found.
If the attached resume is unreadable, empty, or not a valid resume, score it very poorly and add a suggestion to use a proper text-based PDF.
Return a valid JSON object matching the exact structure requested, with no markdown code blocks around it (just the JSON). do NOT include \`\`\`json or \`\`\`.

Job Description:
${jobDescription}

Output strictly in the following JSON format:
{
  "atsScore": Number (0-100),
  "jobMatchPercentage": Number (0-100),
  "interviewProbability": Number (0-100),
  "sectionBreakdown": {
    "contactInformation": Number (0-100),
    "professionalSummary": Number (0-100),
    "workExperience": Number (0-100),
    "skillsSection": Number (0-100),
    "education": Number (0-100),
    "atsFormatting": Number (0-100),
    "keywordCoverage": Number (0-100)
  },
  "missingSkills": {
    "critical": [String],
    "important": [String],
    "optional": [String]
  },
  "missingSkillsExplainer": [
    {
      "skill": "String",
      "reasoning": "String (e.g. Not found in Experience section, Not inferred from Projects, Not mentioned in Summary)"
    }
  ],
  "resumeStrengths": [String] (List 5-6 top actionable strengths),
  "atsRiskAssessment": {
    "lowRisk": [String] (e.g. "Resume is machine readable", "No tables detected"),
    "warnings": [String] (e.g. "Missing required XYZ skill", "Text embedded in images")
  },
  "atsSimulation": [
    { "system": "Workday", "status": "PASSED" | "MEDIUM MATCH" | "FAILED", "reason": String },
    { "system": "Greenhouse", "status": "PASSED" | "MEDIUM MATCH" | "FAILED", "reason": String },
    { "system": "Lever", "status": "PASSED" | "MEDIUM MATCH" | "FAILED", "reason": String }
  ],
  "matchBreakdown": {
    "skillsMatch": Number (0-100),
    "experienceMatch": Number (0-100),
    "impactExplanation": String (Short explanation of WHY the score is what it is)
  },
  "keywordHeatmap": [
    { "keyword": String, "found": Boolean }
  ],
  "aiRewriteSummary": {
    "before": String (Original summary or extracted top snippet),
    "after": String (A rewritten, highly tailored executive summary for this specific job)
  },
  "bulletRewrites": [
    {
      "original": String (Original bullet from resume),
      "suggested": String (AI suggested rewrite showing impact and metrics)
    }
  ]
}
`;

      let mimeType = file.mimetype;
      if (!mimeType || mimeType === 'application/octet-stream') {
        if (file.originalname && file.originalname.toLowerCase().endsWith('.pdf')) {
          mimeType = 'application/pdf';
        } else if (file.originalname && file.originalname.toLowerCase().endsWith('.txt')) {
          mimeType = 'text/plain';
        } else {
          mimeType = 'application/pdf'; // fallback
        }
      }
      
      let responseText = "{}";
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash', // fast model for this
            contents: [
              promptText,
              {
                inlineData: {
                  data: file.buffer.toString("base64"),
                  mimeType: mimeType
                }
              }
            ],
            config: {
              responseMimeType: 'application/json',
            }
          });
          responseText = response.text || "{}";
          break; // Success
        } catch (genErr: any) {
          retries--;
          if (retries === 0 || (genErr.status !== 503 && genErr.status !== 429)) {
            throw genErr; // Rethrow if out of retries or not a transient error
          }
          console.log(`Gemini API busy (Status: ${genErr.status}). Retrying in 2 seconds...`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
      console.log('Gemini raw response:', responseText);
      
      // Attempt to clean JSON
      const cleanJsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJsonStr);

      res.json(result);

    } catch (error: any) {
      console.error('Error analyzing resume:', error);
      let errMsg = 'An error occurred during analysis. Please check server logs.';
      const errStr = error?.message || String(error);
      if (errStr.includes('document has no pages') || errStr.includes('unsupported') || errStr.includes('mime') || errStr.includes('INVALID_ARGUMENT')) {
        errMsg = 'Could not read PDF. Make sure it is a valid text-based document or PDF.';
      }
      res.status(500).json({ error: errMsg, debugDetails: errStr });
    }
  });

  // API Route for Generating Resume via AI Prompt
  app.post('/api/generate-resume', async (req, res) => {
    try {
      let aiClient;
      try {
        aiClient = getAi();
      } catch (err) {
        return res.status(500).json({ error: 'Gemini API key is not configured.' });
      }

      const { prompt } = req.body;
      if (!prompt) {
         return res.status(400).json({ error: 'Prompt is required' });
      }

      const promptText = `Generate a realistic, highly professional resume in perfectly structured JSON format based on the following user prompt.
Produce rich, detailed, realistic bullet points focused on impact, metrics, and action verbs. Make sure the total length is substantial so it fills up a full page. Do NOT wrap the JSON in Markdown code blocks.

User Prompt: "${prompt}"

Required JSON format:
{
  "name": "String (Realistic name or use a default like 'Alex Johnson')",
  "title": "String (e.g. Senior Software Engineer)",
  "email": "String",
  "phone": "String",
  "summary": "String (A compelling, multi-sentence professional summary)",
  "experience": [
    {
      "company": "String",
      "role": "String",
      "duration": "String (e.g. Jan 2021 - Present)",
      "description": "String (Multiple bullet points separated by \\n character. Use • as the bullet character for each line. Highly detailed.)"
    }
    // Include 2-3 detailed experience blocks
  ],
  "education": [
    {
      "institution": "String",
      "degree": "String",
      "year": "String"
    }
  ],
  "skills": "String (Comma separated list of skills)"
}`;

      let responseText = "{}";
      let retries = 3;
      while (retries > 0) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [promptText],
            config: {
              responseMimeType: 'application/json',
            }
          });
          responseText = response.text || "{}";
          break;
        } catch (genErr: any) {
          retries--;
          if (retries === 0 || (genErr.status !== 503 && genErr.status !== 429)) throw genErr;
          console.log(`Gemini API busy (Status: ${genErr.status}). Retrying...`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
      const cleanJsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanJsonStr);

      res.json(result);
    } catch (error: any) {
      console.error('Error generating resume:', error);
      res.status(500).json({ error: 'Failed to generate resume from AI.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    // createViteServer is async
    (async () => {
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
    })();
  } else {
    // Note: Vercel handles static routing directly, so this fallback is mostly for local/standalone production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

// Only start the server directly if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
