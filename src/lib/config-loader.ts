import { PortfolioConfig } from '../types/portfolio';
import ConfigParser from './config-parser';

// Import the configuration file - using dynamic import for better compatibility
let portfolioConfig: PortfolioConfig;

try {
  // Import JSON configuration
  portfolioConfig = require('../../portfolio-config.json') as PortfolioConfig;
} catch (error) {
  console.error('Failed to load portfolio configuration:', error);
  // Provide a fallback minimal config to prevent the app from crashing
  portfolioConfig = {
    personal: {
      name: 'Configuration Error',
      age: 0,
      location: 'Unknown',
      title: 'Error Loading Config',
      email: 'error@example.com',
      handle: '@error',
      bio: 'Configuration file could not be loaded',
      avatar: '/placeholder.jpg',
      fallbackAvatar: '/placeholder.jpg'
    },
    education: {
      current: {
        degree: 'Error',
        institution: 'Error',
        duration: 'Error',
        cgpa: 'Error',
        graduationDate: 'Error'
      },
      achievements: []
    },
    experience: [],
    skills: {
      programming: [],
      frontend: [],
      backend: [],
      ml_ai: [],
      web_development: [],
      databases: [],
      devops_cloud: [],
      iot_hardware: [],
      soft_skills: []
    },
    projects: [],
    social: {
      linkedin: '',
      github: '',
      twitter: '',
      kaggle: '',
      leetcode: '',
      fiverr: ''
    },
    internship: {
      seeking: false,
      duration: '',
      startDate: '',
      preferredLocation: '',
      focusAreas: [],
      availability: '',
      workStyle: '',
      goals: ''
    },
    personality: {
      traits: [],
      interests: [],
      funFacts: [],
      workingStyle: '',
      motivation: ''
    },
    resume: {
      title: '',
      description: '',
      fileType: '',
      lastUpdated: '',
      fileSize: '',
      downloadUrl: ''
    },
    chatbot: {
      name: '',
      personality: '',
      tone: '',
      language: '',
      responseStyle: '',
      useEmojis: false,
      topics: []
    },
    presetQuestions: {
      me: [],
      professional: [],
      projects: [],
      contact: [],
      fun: []
    },
    meta: {
      configVersion: '',
      lastUpdated: '',
      generatedBy: '',
      description: ''
    }
  } as PortfolioConfig;
}

// Create a parser instance
const configParser = new ConfigParser(portfolioConfig);

// Export configuration and parsed data
export const getConfig = (): PortfolioConfig => portfolioConfig;
export const getConfigParser = (): ConfigParser => configParser;

// Export pre-parsed common data for easy access
export const systemPrompt = configParser.generateSystemPrompt();
export const contactInfo = configParser.generateContactInfo();
export const profileInfo = configParser.generateProfileInfo();
export const skillsData = configParser.generateSkillsData();
export const projectData = configParser.generateProjectData();
export const presetReplies = configParser.generatePresetReplies();
export const resumeDetails = configParser.generateResumeDetails();
export const internshipInfo = configParser.generateInternshipInfo();
