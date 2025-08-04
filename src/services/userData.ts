
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { defaultRoadmap } from '@/lib/data';

// Define the types for our data structures
export type RoadmapTopic = {
  id: number;
  text: string;
  completed: boolean;
};

export type RoadmapPhase = {
  id: number;
  title: string;
  duration: string;
  goal: string;
  topics: RoadmapTopic[];
  practiceGoal: string;
  totalProblems: number;
  problemsSolved: number;
};

export type StreakData = {
    count: number;
    lastCompletedDate: string | null;
};

export type UserData = {
    name: string;
    roadmap: RoadmapPhase[];
    streak: StreakData;
    consistency: string[];
};

export const DEFAULT_USER_ID = "default-user";

/**
 * Fetches user data from Firestore. If the user doesn't exist, it returns null.
 * @param userId - The unique ID of the user.
 * @returns The user's data or null.
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserData;
    } 
    return null; // User doesn't exist and no default data provided
};

/**
 * Fetches the expert-curated roadmap. It first tries from Firestore,
 * and if it fails, it falls back to the local defaultRoadmap data.
 * @returns The expert roadmap.
 */
export const getExpertRoadmap = async (): Promise<RoadmapPhase[]> => {
    try {
        const roadmapDocRef = doc(db, 'roadmaps', 'expert-roadmap');
        const roadmapDocSnap = await getDoc(roadmapDocRef);
        if (roadmapDocSnap.exists()) {
            return (roadmapDocSnap.data() as { roadmap: RoadmapPhase[] }).roadmap;
        }
    } catch (error) {
        console.error("Error fetching expert roadmap from Firestore, using local fallback:", error);
    }
    // Fallback to local data if Firestore fetch fails or doc doesn't exist
    return defaultRoadmap;
}

/**
 * Saves the entire user data object to Firestore.
 * Uses set with merge to create the document if it doesn't exist or update it if it does.
 * @param userId - The unique ID of the user.
 * @param userData - The complete user data object.
 */
export const saveUserData = async (userId: string, userData: UserData): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  await setDoc(userDocRef, userData, { merge: true });
};

/**
 * Saves a new roadmap to the user's document in Firestore.
 * This also resets the streak and consistency data.
 * Uses set with merge to be robust.
 * @param userId - The unique ID of the user.
 * @param roadmap - The new roadmap array.
 */
export const saveUserRoadmap = async (userId: string, roadmap: RoadmapPhase[]): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);
  const newRoadmapData = {
    roadmap: roadmap,
    streak: { count: 0, lastCompletedDate: null },
    consistency: [],
  };
  // Use set with merge to create the doc if it doesn't exist, or update if it does.
  await setDoc(userDocRef, newRoadmapData, { merge: true });
};


/**
 * Deletes a user's data from Firestore.
 * @param userId - The unique ID of the user to delete.
 */
export const clearUserData = async (userId: string): Promise<void> => {
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
};


/**
 * Resets a user's progress (roadmap, streak, consistency) to its initial state.
 * @param userId The user's unique ID.
 * @returns The updated user data.
 */
export const resetUserProgress = async (userId: string): Promise<UserData | null> => {
    const data = await getUserData(userId);
    if (!data) return null;

    const newRoadmap = data.roadmap.map((phase: RoadmapPhase) => ({
        ...phase,
        problemsSolved: 0,
        topics: phase.topics.map(topic => ({
            ...topic,
            completed: false,
        })),
    }));

    const updatedData: UserData = {
        ...data,
        roadmap: newRoadmap,
        streak: { count: 0, lastCompletedDate: null },
        consistency: [],
    };

    await saveUserData(userId, updatedData);
    return updatedData;
};

/**
 * Restores the default roadmap for a user, resetting their progress.
 * @param userId The user's unique ID.
 * @returns The updated user data.
 */
export const restoreDefaultRoadmap = async (userId: string): Promise<UserData | null> => {
    const data = await getUserData(userId);
    if (!data) return null;

    const expertRoadmap = await getExpertRoadmap();
    
    if (!expertRoadmap) {
        console.error("Could not find expert roadmap in the database or local files.");
        return data; 
    }

    const updatedData: UserData = {
        ...data,
        roadmap: expertRoadmap,
        streak: { count: 0, lastCompletedDate: null },
        consistency: [],
    };
    
    await saveUserData(userId, updatedData);
    return updatedData;
};
