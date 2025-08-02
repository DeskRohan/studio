
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Book, Laptop, Rocket } from "lucide-react";
import Link from "next/link";
import { Recommendations } from "@/components/resources/recommendations";

const placementResources = {
  dsa: [
    { title: "Striver's A2Z DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", icon: Book, description: "The ultimate resource for practicing DSA problems from easy to hard." },
    { title: "Abdul Bari's Algorithms Playlist", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", icon: Youtube, description: "Gold standard for understanding core algorithm concepts visually." },
    { title: "Aditya Verma's DP Playlist", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY", icon: Youtube, description: "The definitive guide to mastering Dynamic Programming patterns for interviews." },
  ],
  subjects: [
    { title: "DBMS by Riti Kumari", url: "https://www.youtube.com/playlist?list=PLrL_PSQ6q062cD0vPMGYW_AIpNg6T0_Fq", icon: Youtube, description: "A comprehensive playlist covering all essential DBMS topics for interviews." },
    { title: "Operating Systems - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", icon: Youtube, description: "Clear and concise videos on all important OS concepts." },
    { title: "Computer Networks - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_", icon: Youtube, description: "The most popular and effective playlist for understanding Computer Networks." },
  ],
  projects: [
      { title: "freeCodeCamp Projects", url: "https://www.freecodecamp.org/learn/", icon: Rocket, description: "Build real-world projects with guided tutorials on various tech stacks." },
      { title: "50+ Project Ideas - Traversy Media", url: "https://www.youtube.com/watch?v=Jg6E2CMdV_Y", icon: Youtube, description: "A great video to brainstorm ideas for your next portfolio project." },
      { title: "JavaScript30", url: "https://javascript30.com/", icon: Laptop, description: "Build 30 things in 30 days with 30 tutorials. No frameworks, no libraries." },
  ]
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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Curated Resources</h1>
        <p className="text-muted-foreground">
          Handpicked resources for your placement preparation journey.
        </p>
      </div>

      <Recommendations />

      <>
          <ResourceSection title="Data Structures & Algorithms" resources={placementResources.dsa} />
          <ResourceSection title="Core CS Subjects" resources={placementResources.subjects} />
          <ResourceSection title="Project Development" resources={placementResources.projects} />
      </>
    </div>
  );
}
