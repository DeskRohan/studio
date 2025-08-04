
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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

/**
 * Generates a consistent, unique ID based on the user's name and passcode.
 * This is a simple hashing approach for this specific use case.
 * In a real-world scenario with sensitive data, a more secure method would be required.
 */
export const generateUserId = (name: string, passcode: string): string => {
  const combined = `${name.toLowerCase().trim()}-${passcode}`;
  // Basic hash function
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `user_${Math.abs(hash)}`;
};

/**
 * Fetches user data from Firestore. If the user doesn't exist, it returns null.
 * @param userId - The unique ID of the user.
 * @returns The user's data or null.
 */
export const getOrCreateUser = async (userId: string): Promise<UserData | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserData;
    } 
    return null; // User doesn't exist and no default data provided
};

/**
 * Fetches the expert-curated roadmap from a dedicated Firestore document.
 * @returns The expert roadmap, or null if not found.
 */
export const getExpertRoadmap = async (): Promise<RoadmapPhase[] | null> => {
    const roadmapDocRef = doc(db, 'roadmaps', 'expert-roadmap');
    const roadmapDocSnap = await getDoc(roadmapDocRef);
    if (roadmapDocSnap.exists()) {
        return (roadmapDocSnap.data() as { roadmap: RoadmapPhase[] }).roadmap;
    }
    return null;
}

/**
 * Fetches a user's data from Firestore.
 * @param userId The user's unique ID.
 * @returns The user's data, or null if not found.
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserData;
    }
    return null;
}


/**
 * Saves the entire user data object to Firestore.
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
  await updateDoc(userDocRef, newRoadmapData);
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
        // Handle case where expert roadmap isn't in DB
        console.error("Could not find expert roadmap in the database.");
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
