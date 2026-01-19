"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  Download,
  Eye,
  File,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export function Resume() {
  const [showFullResume, setShowFullResume] = useState(false);

  // Resume details
  const resumeData = {
    title: "Md Ali Khan's Resume",
    description: "AI/ML Engineer & Automation Specialist | B.Tech 2025",
    lastUpdated: "January 2026",
    fileSize: "N/A",
    fileType: "PDF",
    downloadUrl: "/MD_Ali_Khan_AI_ML_Resume_2026.pdf",
    previewImage: "/resume_preview.PNG"
  };

  const handleDownload = () => {
    // For external URLs, open in a new tab
    window.open(resumeData.downloadUrl, "_blank");
  };

  return (
    <div className="mx-auto w-full py-8 font-sans">
      {/* Resume Card */}
      <motion.div
        className="group relative overflow-hidden rounded-xl bg-accent p-0 transition-all duration-300 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Details area */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {resumeData.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {resumeData.description}
              </p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeData.fileType}</span>
                <span className="mx-2">•</span>
                <span>Updated {resumeData.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>{resumeData.fileSize}</span>
              </div>
            </div>

            {/* Download button */}
            <motion.button
              onClick={handleDownload}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-black/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* PDF Preview / Image Cover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full rounded-xl overflow-hidden border bg-white shadow-lg relative group"
      >
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Resume {showFullResume ? "Viewer" : "Preview"}
            </span>
          </div>
          <div className="flex gap-2">
            {!showFullResume && (
              <button
                onClick={() => setShowFullResume(true)}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-black text-white rounded-md hover:bg-zinc-800 transition-colors"
              >
                <Eye className="h-3 w-3" />
                View Full
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Open PDF
            </button>
          </div>
        </div>

        <div className="w-full h-[600px] bg-gray-50 relative overflow-hidden">
          {showFullResume ? (
            <iframe
              src={resumeData.downloadUrl}
              width="100%"
              height="100%"
              className="border-0"
              title="Resume Preview"
            />
          ) : (
            <div 
              className="relative w-full h-full cursor-pointer"
              onClick={() => setShowFullResume(true)}
            >
              <Image
                src={resumeData.previewImage}
                alt="Resume Preview"
                fill
                className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Eye className="h-5 w-5 text-black" />
                  <span className="font-semibold text-black">Expand Resume</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Resume;
