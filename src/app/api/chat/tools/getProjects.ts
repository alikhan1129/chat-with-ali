
import { tool } from "ai";
import { z } from "zod";
import { getConfig } from "@/lib/config-loader";

export const getProjects = tool({
  description:
    "This tool showcases a comprehensive project portfolio, highlighting technical achievements and real-world impact.",
  parameters: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      projects: config.projects.map(project => ({
        title: project.title,
        type: project.category,
        date: project.date,
        description: project.description,
        techStack: project.techStack,
        status: project.status,
        featured: project.featured,
        links: project.links,
        highlights: project.achievements || project.metrics || []
      })),
      summary: "I'm excited to share my project portfolio with you. These projects represent my journey as a developer and demonstrate my ability to take ideas from conception to deployment. Each project has taught me something different - from technical implementation to project management and problem-solving. I've worked across various technology stacks and domains, which has given me a broad perspective on software development. What I'm most proud of is how these projects have allowed me to solve real-world problems while continuously learning and growing as a developer. I'd be happy to dive deeper into any specific project that interests you or discuss how the experience from these projects would apply to roles at your organization."
    };
  },
});