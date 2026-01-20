'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { contactInfo } from '@/lib/config-loader';

export function Contact() {
  // Contact information now loaded from configuration

  // Function to handle opening links
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to get icon for social name
  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'github': return <Github className="h-5 w-5" />;
      case 'portfolio': return <Code2 className="h-5 w-5" />;
      default: return <ChevronRight className="h-5 w-5" />;
    }
  };

  return (
    <div className="mx-auto mt-8 w-full">
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Let's Connect
          </h2>
          <span className="mt-2 text-muted-foreground sm:mt-0 font-medium">
            {contactInfo.handle}
          </span>
        </div>

        {/* Email Section */}
        <div className="mt-8 flex flex-col md:mt-10">
          <div
            className="group mb-8 cursor-pointer inline-flex items-center"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            <div className="bg-blue-500/10 p-3 rounded-xl mr-4 group-hover:bg-blue-500/20 transition-colors">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email me</span>
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-foreground border-b border-transparent group-hover:border-blue-500 transition-all sm:text-lg">
                  {contactInfo.email}
                </span>
              </div>
            </div>
          </div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {contactInfo.socials.map((social) => (
              <button
                key={social.name}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-all cursor-pointer border border-transparent hover:border-border group"
                onClick={() => openLink(social.url)}
              >
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {getSocialIcon(social.name)}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                  {social.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
