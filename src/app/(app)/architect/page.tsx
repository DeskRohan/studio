
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Github, User } from "lucide-react";
import Link from "next/link";

export default function ArchitectPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight text-center">The Architect</h1>
        <p className="text-muted-foreground text-center">
          Meet the creator behind NextGenSDE.
        </p>
      </div>

      <Card className="w-full max-w-2xl card-glow-effect">
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://github.com/rohan-godakhindi.png" alt="Rohan Godakhindi" />
                <AvatarFallback>
                    <User className="h-12 w-12" />
                </AvatarFallback>
            </Avatar>
          <CardTitle className="text-2xl">Rohan Godakhindi</CardTitle>
          <CardDescription className="text-primary font-semibold">CEO & Founder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-full text-center text-muted-foreground mx-auto space-y-4 px-4 pb-6">
            <p>
              Hi, I’m Rohan – a passionate 3rd year Computer Science student at VTU, driven by a deep interest in coding, design, and problem-solving.
            </p>
            <p>
              Along with building strong foundations in Data Structures & Algorithms, I actively explore full-stack development and competitive programming. This project — NextGenSDE — is my personal attempt to combine structure, motivation, and tech to make placement prep smarter and more aesthetic.
            </p>
            <p>
              I’m also a graphic designer and Blender artist, blending creativity with code to craft digital experiences that not only function well but look and feel great too.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic">
              “Learning is a journey. I just designed the roadmap.”
            </blockquote>
          </div>
          <div className="flex justify-center gap-4 border-t pt-6">
             <Link href="https://www.linkedin.com/in/rohan-godakhindi" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="glow-effect">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                </Button>
            </Link>
             <Link href="https://www.instagram.com/rohan_g_21" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="glow-effect">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                </Button>
            </Link>
             <Link href="https://github.com/rohan-godakhindi" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="glow-effect">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
