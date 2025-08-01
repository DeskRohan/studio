import { QuestionBrowser } from "@/components/practice/question-browser";

export default function PracticePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Practice Questions</h1>
                <p className="text-muted-foreground">Sharpen your skills with our extensive question library.</p>
            </div>
            <QuestionBrowser />
        </div>
    );
}
