
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Book, Laptop, Rocket, Brain } from "lucide-react";
import Link from "next/link";
import { Recommendations } from "@/components/resources/recommendations";
import { Skeleton } from '@/components/ui/skeleton';

const USER_DATA_KEY = 'user-profile-data';

const placementResources = {
  dsa: [
    { title: "Striver's A2Z DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", icon: Book, description: "The ultimate resource for practicing DSA problems from easy to hard." },
    { title: "Abdul Bari's Algorithms Playlist", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", icon: Youtube, description: "Gold standard for understanding core algorithm concepts visually." },
  ],
  subjects: [
    { title: "DBMS by Riti Kumari", url: "https://www.youtube.com/playlist?list=PLrL_PSQ6q062cD0vPMGYW_AIpNg6T0_Fq", icon: Youtube, description: "A comprehensive playlist covering all essential DBMS topics for interviews." },
    { title: "Operating Systems - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", icon: Youtube, description: "Clear and concise videos on all important OS concepts." },
    { title: "Computer Networks - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_", icon: Youtube, description: "The most popular and effective playlist for understanding Computer Networks." },
  ],
  aptitude: [
      { title: "Indiabix", url: "https://www.indiabix.com/", icon: Laptop, description: "A vast collection of aptitude questions and mock tests for practice." },
      { title: "GeeksforGeeks Aptitude", url: "https://www.geeksforgeeks.org/aptitude-questions-and-answers/", icon: Laptop, description: "A comprehensive platform with a wide range of aptitude questions and detailed solutions." },
  ],
  projects: [
      { title: "freeCodeCamp Projects", url: "https://www.freecodecamp.org/learn/", icon: Rocket, description: "Build real-world projects with guided tutorials on various tech stacks." },
      { title: "50+ Project Ideas - Traversy Media", url: "https://www.youtube.com/watch?v=Jg6E2CMdV_Y", icon: Youtube, description: "A great video to brainstorm ideas for your next portfolio project." },
  ]
};

const gateResources = {
  coreSubjects: [
     { title: "Gate Smashers Playlists", url: "https://www.youtube.com/@GateSmashers/playlists", icon: Youtube, description: "The go-to channel for all core GATE subjects like TOC, COA, Digital Logic, and more." },
     { title: "Made Easy - CSE", url: "https://www.youtube.com/@MADEASYFORYOU/playlists", icon: Youtube, description: "High-quality lectures and problem-solving sessions for various GATE subjects." },
     { title: "GeeksforGeeks GATE CSE", url: "https://www.geeksforgeeks.org/gate-cs-notes-gq/", icon: Book, description: "Structured notes, articles, and quizzes for all GATE CSE subjects." },
  ],
  maths: [
      { title: "Engineering Mathematics - Saurabh Thakur", url: "https://www.youtube.com/playlist?list=PL_5_i72_h13uJnJ_r4gWIMaFp_b5VjS2s", icon: Youtube, description: "Excellent playlist for mastering Engineering & Discrete Mathematics for GATE." },
      { title: "Applied Course - GATE", url: "https://www.youtube.com/@AppliedCourse/playlists", icon: Youtube, description: "In-depth videos on complex topics in Engineering Mathematics." },
  ],
  practice: [
       { title: "GATE Overflow", url: "https://gateoverflow.in/", icon: Brain, description: "A massive, community-driven collection of previous year questions with detailed solutions." },
       { title: "Unacademy - GATE & ESE", url: "https://www.youtube.com/@UnacademyGATECECH", icon: Laptop, description: "Live classes, PYQ sessions, and test series from top educators." },
  ],
};


const ResourceCard = ({ title, url, icon: Icon, description }: { title: string, url: string, icon: React.ElementType, description: string }) => (
    <Card className="card-glow-effect flex flex-col">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <CardDescription className="pt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
             <Link href={url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">
                    Go to Resource
                </Button>
            </Link>
        </CardContent>
    </Card>
);

const ResourceSection = ({ title, resources }: { title: string, resources: any[] }) => (
    <section>
        <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">{title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(res => <ResourceCard key={res.title} {...res} />)}
        </div>
    </section>
);


export default function ResourcesPage() {
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);

  useEffect(() => {
    const loadGoal = () => {
        const userData = localStorage.getItem(USER_DATA_KEY);
        const goal = userData ? JSON.parse(userData).goal : 'Placement Preparation';
        setPrimaryGoal(goal || 'Placement Preparation');
    };

    loadGoal();
    window.addEventListener('storage', loadGoal);
    return () => window.removeEventListener('storage', loadGoal);
  }, []);

  if (primaryGoal === null) {
      return (
          <div className="space-y-8">
               <Skeleton className="h-12 w-1/2" />
               <Skeleton className="h-64 w-full" />
               <Skeleton className="h-48 w-full" />
          </div>
      )
  }

  const isPlacement = primaryGoal === 'Placement Preparation';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Curated Resources</h1>
        <p className="text-muted-foreground">
          Handpicked resources for your goal: <span className="font-semibold text-primary">{primaryGoal}</span>
        </p>
      </div>

      <Recommendations />

      {isPlacement ? (
        <>
            <ResourceSection title="Data Structures & Algorithms" resources={placementResources.dsa} />
            <ResourceSection title="Core CS Subjects" resources={placementResources.subjects} />
            <ResourceSection title="Aptitude Practice" resources={placementResources.aptitude} />
            <ResourceSection title="Project Development" resources={placementResources.projects} />
        </>
      ) : (
        <>
            <ResourceSection title="Core Subjects & Concepts" resources={gateResources.coreSubjects} />
            <ResourceSection title="Engineering & Discrete Mathematics" resources={gateResources.maths} />
            <ResourceSection title="Practice Platforms & PYQs" resources={gateResources.practice} />
        </>
      )}

    </div>
  );
}
