"use client";

import { motion } from "framer-motion";
import {
  Award,
  Code,
  GraduationCap,
  Mail,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import React from "react";

import { presetReplies, getConfig } from "@/lib/config-loader";

interface ChatLandingProps {
  submitQuery: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
}

const ChatLanding: React.FC<ChatLandingProps> = ({
  submitQuery,
  handlePresetReply,
}) => {
  const config = getConfig();
  // Suggested questions that the user can click on
  const suggestedQuestions = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: "Who are you?",
    },
    {
      icon: <Code className="h-4 w-4" />,
      text: "What projects are you most proud of?",
    },
    {
      icon: <Award className="h-4 w-4" />,
      text: "What are your skills?",
    },
    {
      icon: <Briefcase className="h-4 w-4" />,
      text: "Am I available for opportunities?",
    },
    {
      icon: <Mail className="h-4 w-4" />,
      text: "How can I reach you?",
    },
  ];

  const handleQuestionClick = (questionText: string) => {
    // Check if this question has a preset reply
    const preset = presetReplies[questionText as keyof typeof presetReplies];

    if (preset && handlePresetReply) {
      // Show preset reply first
      handlePresetReply(questionText, preset.reply, preset.tool);
    } else {
      // Fall back to AI query
      submitQuery(questionText);
    }
  };

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center px-4 pt-4 pb-6 "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome message */}
      <motion.div className="mb-8 text-center" variants={itemVariants}>
        <h2 className="mb-3 text-2xl font-semibold">
          I'm {config.chatbot.name}'s Digital Twin
        </h2>
       
        <p className="text-muted-foreground mx-auto max-w-md">
          Begin your interview with my Digital Twin.
        </p>
      </motion.div>

      {/* Available for Opportunities Button */}
      <motion.div className="mb-8" variants={itemVariants}>
        <motion.button
          onClick={() =>
            handleQuestionClick("Am I available for opportunities?")
          }
          className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Available for Opportunities
        </motion.button>
      </motion.div>

      {/* Suggested questions */}
      <motion.div
        className="w-full max-w-md space-y-3"
        variants={containerVariants}
      >
        {suggestedQuestions.map((question, index) => (
          <motion.button
            key={index}
            className="bg-accent hover:bg-accent/80 flex w-full items-center rounded-lg px-4 py-3 transition-colors"
            onClick={() => handleQuestionClick(question.text)}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bg-background mr-3 rounded-full p-2">
              {question.icon}
            </span>
            <span className="text-left">{question.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatLanding;
