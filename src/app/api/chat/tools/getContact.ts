import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getContact = tool({
  description:
    'This tool provides professional contact information and social media profiles.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      contact: {
        email: config.personal.email,
        location: config.personal.location,
        availability: config.internship.availability
      },
      socialProfiles: {
        github: config.social.github,
        linkedin: config.social.linkedin,
        twitter: config.social.twitter,
        kaggle: config.social.kaggle,
        leetcode: config.social.leetcode,
        fiverr: config.social.fiverr
      },
      message: "I'd be happy to share my contact information with you. I'm very responsive to professional communications and always excited to connect with potential employers and industry professionals. Feel free to reach out to me through any of these channels - I check my email regularly and am active on LinkedIn and GitHub. I'm always open to discussing opportunities, collaborations, or just having a conversation about technology and innovation. What would be the best way for your team to stay in touch with me?"
    };
  },
});
