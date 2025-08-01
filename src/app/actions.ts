
"use server";

import { recommendTargetedResources } from "@/ai/flows/recommend-targeted-resources";

export async function getRecommendedResources() {
  try {
    // In a real app, these would come from user data
    const input = {
      userSkills: ["Arrays", "Basic SQL"],
      knowledgeGaps: ["Dynamic Programming", "Graphs"],
      placementSyllabus: "Standard CSE placement syllabus covering DSA, Core Subjects, and Aptitude.",
      userHistory: "Scored 60% on DSA Sprint 1, struggled with linked list reversal."
    };
    const result = await recommendTargetedResources(input);
    return result;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return null;
  }
}
