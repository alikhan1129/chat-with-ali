import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getPresentation = tool({
  description:
    'This tool provides a comprehensive professional introduction and personal background, suitable for interviews and formal presentations.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      presentation: config.personal.bio,
      name: config.personal.name,
      title: config.personal.title,
      age: config.personal.age,
      location: config.personal.location,
      education: config.education.current,
      traits: config.personality.traits,
      interests: config.personality.interests,
      motivation: config.personality.motivation,
      professionalSummary: "Thank you for asking! I'm a dedicated software developer with a strong passion for technology and innovation. My journey in tech has been driven by curiosity and a desire to create solutions that make a real impact. Through my academic studies combined with practical experience via internships and freelance work, I've developed both a solid theoretical foundation and hands-on problem-solving skills. I'm particularly drawn to challenges that require creative thinking and technical excellence. I thrive in collaborative environments where I can contribute to innovative projects while continuously learning and growing. My ultimate goal is to work on meaningful projects that leverage cutting-edge technology to solve real-world problems. I'm excited about the possibility of bringing my skills and enthusiasm to your team."
    };
  },
});
