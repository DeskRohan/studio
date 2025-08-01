
"use server";

import { generatePersonalizedStudyPlan } from "@/ai/flows/generate-personalized-study-plan";
import { recommendTargetedResources } from "@/ai/flows/recommend-targeted-resources";
import { z } from "zod";

const studyPlanSchema = z.object({
  skills: z.string().min(1, "Please list at least one skill."),
  knowledgeGaps: z.string().min(1, "Please list at least one knowledge gap."),
  syllabus: z.string().min(1, "Syllabus cannot be empty."),
});

export async function getStudyPlan(prevState: any, formData: FormData) {
  const validatedFields = studyPlanSchema.safeParse({
    skills: formData.get("skills"),
    knowledgeGaps: formData.get("knowledgeGaps"),
    syllabus: formData.get("syllabus"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      studyPlan: null,
    };
  }

  try {
    const result = await generatePersonalizedStudyPlan(validatedFields.data);
    return {
      message: "Study plan generated successfully.",
      studyPlan: result.studyPlan,
      errors: {},
    };
  } catch (error) {
    return {
      message: "An error occurred while generating the study plan.",
      studyPlan: null,
      errors: {},
    };
  }
}

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
