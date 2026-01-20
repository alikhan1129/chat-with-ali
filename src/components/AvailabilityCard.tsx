"use client";

import { motion } from "framer-motion";
import { CalendarDays, Code2, Globe, Briefcase } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getConfig } from "@/lib/config-loader";

interface AvailabilityData {
  availability: string;
  preferences: {
    roleTypes: string[];
    industries: string[];
    workMode: string;
    location: string;
  };
  experience: {
    internshipCompleted: string;
    freelanceWork: string;
    projectExperience: string;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  achievements: string[];
  lookingFor: {
    growthOpportunities: string;
    mentorship: string;
    impactfulWork: string;
    technicalChallenges: string;
    collaboration: string;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

interface AvailabilityCardProps {
  data?: AvailabilityData;
}

const AvailabilityCard = ({ data }: AvailabilityCardProps) => {
  const router = useRouter();
  const config = getConfig();
  const internship = config.internship;

  const handleContactClick = () => {
    // Navigate to home page with the contact preset question
    router.push("/?query=How can I reach you?");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-accent mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="bg-muted h-16 w-16 overflow-hidden rounded-full ">
            <Image
              width={64}
              height={64}
              src="/alipic2.jpg"
              alt={`${config.personal.name}'s avatar`}
              className="h-full w-full object-cover object-[center_top_-5%] scale-95 "
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">
              {config.personal.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              Available for Opportunities
            </p>
          </div>
        </div>

        {/* Enhanced Live badge with availability status */}
        <div className="mt-4 flex flex-col items-center gap-2 sm:mt-0 sm:items-end">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Available Now
          </span>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Open to {internship.duration.toLowerCase()} roles
          </p>
        </div>
      </div>

      {/* Availability Highlight Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Current Availability Status
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Status</p>
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
              {data?.availability || `✅ ${internship.availability}`}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Looking for
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              {internship.focusAreas.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Internship Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-blue-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Timeline</p>
            <p className="text-muted-foreground text-sm">
              {data?.availability ||
                `Starting ${internship.startDate} for ${internship.duration}`}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-green-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              {data?.preferences.location ||
                `${internship.preferredLocation} (Based in ${config.personal.location} 🇮🇳)`}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-purple-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Core Expertise</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="decoration-none list-disc pl-4">
                {config.skills.ml_ai.slice(0, 5).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              <ul className="list-disc pl-4">
                {config.skills.programming.slice(0, 4).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
                <li>
                  <a
                    href="/?query=What are your skills?"
                    className="cursor-pointer items-center text-blue-500 underline"
                  >
                    See all skills
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I bring */}
     <div className="mt-10">
  <p className="text-foreground mb-2 text-lg font-semibold">
    What I bring
  </p>
  <p className="text-foreground text-sm">
    {data?.experience.internshipCompleted ||
      `Specialized experience in ${config.skills.ml_ai[0]} and ${config.skills.ml_ai[1]}.`}{" "}
    <br />
    {data?.achievements[0] ||
      config.education.achievements[1]}{" "}
    <br />
    {data?.experience.freelanceWork ||
      config.experience[0].description}
  </p>
</div>


      {/* Goal */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-foreground text-sm">
          {data?.lookingFor.growthOpportunities ||
            internship.goals}{" "}
          I treat AI problems as engineering challenges and focus on building robust, scalable solutions.
          🚀
        </p>
      </div>

      {/* Contact button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleContactClick}
          className="cursor-pointer rounded-full bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-zinc-800"
        >
          Contact me
        </button>
      </div>
    </motion.div>
  );
};

export default AvailabilityCard;
