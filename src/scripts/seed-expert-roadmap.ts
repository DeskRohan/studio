
/**
 * To run this script:
 * 1. Make sure your .env file has your Firebase credentials if needed.
 * 2. Run `npm install -D tsx` if you haven't already.
 * 3. Run `npm run db:seed` from your terminal.
 */
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { defaultRoadmap } from '../lib/data';

async function seedDatabase() {
  try {
    console.log("Starting to seed the expert roadmap...");
    
    const roadmapDocRef = doc(db, 'roadmaps', 'expert-roadmap');
    
    await setDoc(roadmapDocRef, {
      roadmap: defaultRoadmap
    });

    console.log("✅ Successfully seeded the expert roadmap to Firestore!");
    console.log("You can now find it in the 'roadmaps' collection with the document ID 'expert-roadmap'.");

  } catch (error) {
    console.error("🔥 Error seeding database:", error);
  }
}

seedDatabase();
