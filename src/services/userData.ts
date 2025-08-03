import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { defaultRoadmap } from '@/lib/data';
import type { RoadmapTopic as UIRoadmapTopic, RoadmapPhase as UIRoadmapPhase } from '@/lib/data';

// Re-exporting types for Firestore data structure
export type RoadmapTopic = UIRoadmapTopic;
export type RoadmapPhase = UIRoadmapPhase;

export type StreakData = {
    count: number;
    lastCompletedDate: string;
};

export type UserData = {
    uid: string;
    email: string | null;
    name: string | null;
    roadmap: RoadmapPhase[];
    streak: StreakData;
    consistency: string[];
};

const usersCollection = "users";

// Gets a user's data, or creates it if it doesn't exist
export async function getOrCreateUserDocument(uid: string, name?: string | null, email?: string | null): Promise<UserData | null> {
    const userDocRef = doc(db, usersCollection, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        return userDoc.data() as UserData;
    } else {
        // User doesn't exist, create a new document
        const newUser: UserData = {
            uid,
            email: email || null,
            name: name || "New User",
            roadmap: defaultRoadmap as RoadmapPhase[],
            streak: { count: 0, lastCompletedDate: "" },
            consistency: [],
        };
        await setDoc(userDocRef, newUser);
        return newUser;
    }
}

// Fetches user data
export async function getUserData(uid: string): Promise<UserData | null> {
    const userDocRef = doc(db, usersCollection, uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data() as UserData;
    }
    return null;
}

// Saves the initial roadmap for a new user
export async function saveUserRoadmap(uid: string, roadmap: RoadmapPhase[], name?: string | null, email?: string | null): Promise<void> {
    const userDocRef = doc(db, usersCollection, uid);
    const newUser: UserData = {
        uid,
        email: email || null,
        name: name || "New User",
        roadmap: roadmap,
        streak: { count: 0, lastCompletedDate: "" },
        consistency: [],
    };
    await setDoc(userDocRef, newUser);
}


// Updates the user's entire roadmap
export async function updateUserRoadmap(uid: string, roadmap: RoadmapPhase[]): Promise<void> {
    const userDocRef = doc(db, usersCollection, uid);
    await updateDoc(userDocRef, { roadmap });
}

// Updates the user's streak data
export async function updateUserStreak(uid: string, streak: StreakData): Promise<void> {
    const userDocRef = doc(db, usersCollection, uid);
    await updateDoc(userDocRef, { streak });
}

// Updates the user's consistency data
export async function updateUserConsistency(uid: string, consistency: string[]): Promise<void> {
    const userDocRef = doc(db, usersCollection, uid);
    await updateDoc(userDocRef, { consistency });
}

// Deletes a user's data
export async function deleteUserData(uid: string): Promise<void> {
    const userDocRef = doc(db, usersCollection, uid);
    await deleteDoc(userDocRef);
}
