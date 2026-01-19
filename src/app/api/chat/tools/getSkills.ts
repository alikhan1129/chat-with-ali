import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getSkills = tool({
  description:
    'This tool provides a comprehensive overview of technical skills, expertise, and professional qualifications.',
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      technicalSkills: {
        programming: config.skills.programming,
        machineLearning: config.skills.ml_ai,
        webDevelopment: config.skills.web_development,
        databases: config.skills.databases,
        devOpsCloud: config.skills.devops_cloud,
        iotHardware: config.skills.iot_hardware
      },
      education: {
        degree: config.education.current.degree,
        institution: config.education.current.institution,
        cgpa: config.education.current.cgpa,
        duration: config.education.current.duration
      },
      achievements: config.education.achievements || [],
      experience: config.experience.map(exp => ({
        position: exp.position,
        company: exp.company,
        duration: exp.duration,
        type: exp.type,
        technologies: exp.technologies,
        description: exp.description
      })),
      message: "I'd be happy to walk you through my technical skills and expertise. I've built a diverse skill set across multiple domains through both my academic coursework and hands-on project experience. I'm particularly passionate about machine learning and intelligent automation, where I've been able to apply these technologies to solve real-world problems. Each area of my expertise has been strengthened through practical application - from building complex automation pipelines to developing ML models for complex data analysis. I believe my combination of theoretical knowledge and practical experience, along with my enthusiasm for continuous learning, would allow me to contribute effectively to your team. What specific technical areas would you like me to elaborate on?"
    };
  },
});
