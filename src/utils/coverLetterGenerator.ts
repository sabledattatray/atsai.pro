export type CoverLetterStyle = 'Professional' | 'Creative' | 'Modern';

export function getBaseRole(templateName: string): string {
  return templateName.replace(/\sCover\sLetter$/i, '').trim();
}

export function generateCoverLetter(role: string, style: CoverLetterStyle, companyName: string = '[Company Name]', candidateName: string = '[Your Name]'): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  if (style === 'Professional') {
    return `${candidateName}
[Your Address]
[Your Phone] | [Your Email]

${date}

Hiring Manager
${companyName}

Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${companyName}. With a proven track record of consistently delivering high-quality results and a deep understanding of the core principles required for this role, I am confident in my ability to make an immediate and positive impact on your team.

Throughout my career, I have dedicated myself to mastering the skills necessary to excel as a ${role}. In my most recent position, I successfully drove key initiatives that aligned with organizational objectives, resulting in improved operational efficiency and measurable success. I am highly organized, detail-oriented, and capable of managing complex workflows while adhering to strict deadlines.

What draws me specifically to ${companyName} is your commitment to excellence and innovation in the industry. I am eager to bring my strategic mindset, problem-solving abilities, and collaborative spirit to your organization. I thrive in dynamic environments and am deeply passionate about continuously improving processes and outcomes.

Thank you for considering my application. I have attached my resume for your review, and I would welcome the opportunity to discuss how my background, skills, and enthusiasm align with the goals of your team.

Sincerely,

${candidateName}`;
  }

  if (style === 'Creative') {
    return `Hey Team ${companyName},

I have always believed that a truly exceptional ${role} doesn’t just fulfill a list of responsibilities—they elevate the entire team and fundamentally change the way work gets done. When I came across the opening for a ${role} at ${companyName}, I knew I had to introduce myself.

I've spent my career thinking outside the box, taking on challenges that others shy away from, and bringing a creative, human-centric approach to my work as a ${role}. For me, it’s not just about hitting metrics; it’s about crafting solutions that are innovative, sustainable, and impactful. I love turning complex problems into elegant outcomes, and I am obsessed with finding new ways to push the boundaries of what’s possible.

Your recent projects truly caught my eye, and I admire how ${companyName} continuously shatters industry norms. I am looking for a workplace that values bold ideas, and I am ready to bring my energy, fresh perspective, and dedicated expertise to help your team achieve its next big milestone.

I would love to grab a virtual coffee and chat about how my unconventional approach and proven abilities can help shape the future of your projects. Let's do great work together!

Cheers,

${candidateName}`;
  }

  // Modern
  return `${candidateName}
[Your Phone] | [Your Email] | [LinkedIn Profile]

${date}

To the ${companyName} Hiring Team,

I am applying for the ${role} position because my professional background aligns seamlessly with the requirements of your job description, and I am excited about the trajectory of ${companyName}.

I am a results-driven professional who brings a strategic, analytical approach to the table. As a ${role}, I specialize in execution, speed, and tangible impact. 

Here is what I bring to your team:
• Action-Oriented Problem Solving: A track record of identifying bottlenecks and rapidly deploying effective solutions.
• Communication & Leadership: Proven ability to collaborate cross-functionally and communicate complex concepts clearly.
• Adaptability: Quick to learn new systems, adjust to pivoting priorities, and maintain high performance under pressure.

${companyName} is building exactly the kind of environment where I thrive—fast-paced, innovative, and focused on tangible outcomes. I am ready to hit the ground running and start contributing on day one.

My resume is attached, which outlines my career history and successes in greater detail. I look forward to the possibility of discussing this exciting opportunity with you further in an interview.

Best regards,

${candidateName}`;
}
