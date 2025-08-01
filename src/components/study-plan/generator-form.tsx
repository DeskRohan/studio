"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getStudyPlan } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2 } from "lucide-react";
import { syllabus } from "@/lib/data";

const initialState = {
  message: "",
  studyPlan: null,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Generate Plan
    </Button>
  );
}

export function GeneratorForm() {
  const [state, formAction] = useFormState(getStudyPlan, initialState);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Create Your Study Plan</CardTitle>
              <CardDescription>
                Fill in the details below to generate an AI-powered, personalized
                study plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Your Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g., Python, Java, SQL Basics"
                />
                {state.errors?.skills && <p className="text-sm font-medium text-destructive">{state.errors.skills[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="knowledgeGaps">Knowledge Gaps</Label>
                <Input
                  id="knowledgeGaps"
                  name="knowledgeGaps"
                  placeholder="e.g., Dynamic Programming, System Design"
                />
                 {state.errors?.knowledgeGaps && <p className="text-sm font-medium text-destructive">{state.errors.knowledgeGaps[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="syllabus">Placement Syllabus</Label>
                <Textarea
                  id="syllabus"
                  name="syllabus"
                  placeholder="Paste the syllabus here..."
                  defaultValue={syllabus.join("\n")}
                  rows={8}
                />
                 {state.errors?.syllabus && <p className="text-sm font-medium text-destructive">{state.errors.syllabus[0]}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="min-h-full">
          <CardHeader>
            <CardTitle>Your Personalized Plan</CardTitle>
            <CardDescription>
              Your generated 9-month study plan will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.message && !state.studyPlan && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            {state.studyPlan ? (
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                {state.studyPlan}
              </div>
            ) : (
                <div className="text-center text-muted-foreground py-16">
                    <p>Your plan is waiting to be generated.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
