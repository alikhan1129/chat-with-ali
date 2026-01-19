import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { projectData, getConfig } from '@/lib/config-loader';

// Get project content from configuration
const config = getConfig();
const PROJECT_CONTENT = config.projects;

// ProjectContent component - now uses config data
const ProjectContent = ({ project }: { project: { title: string } }) => {
  const projectData = PROJECT_CONTENT.find(p => p.title === project.title);
  
  if (!projectData) return null;

  return (
    <div className="bg-card text-card-foreground max-w-4xl space-y-6 p-0">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <Img className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{projectData.title}</h3>
            <p className="text-muted-foreground text-sm">{projectData.date}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed">
          {projectData.description}
        </p>
      </div>

      {/* Status & Achievements */}
      {(projectData.status || projectData.achievements || projectData.metrics) && (
        <div className="space-y-3">
          {projectData.status && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                projectData.status === 'Completed' ? 'bg-green-100 text-green-800' :
                projectData.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {projectData.status}
              </span>
            </div>
          )}
          
          {projectData.achievements && (
            <div>
              <h4 className="font-medium mb-1">Achievements</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                {projectData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
          
          {projectData.metrics && (
            <div>
              <h4 className="font-medium mb-1">Key Metrics</h4>
              <div className="flex flex-wrap gap-2">
                {projectData.metrics.map((metric, index) => (
                  <span key={index} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {projectData.techStack && projectData.techStack.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {projectData.techStack.map((tech, index) => (
              <span
                key={index}
                className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {projectData.links && projectData.links.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Links</h4>
          <div className="flex flex-wrap gap-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
              >
                <Link className="h-4 w-4" />
                {link.name}
                <ChevronRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery */}
      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="w-full h-auto transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main data export - now dynamically generated from config
export const data = projectData.map(project => ({
  category: project.category,
  title: project.title,
  src: project.src,
  content: <ProjectContent project={{ title: project.title }} />,
}));
