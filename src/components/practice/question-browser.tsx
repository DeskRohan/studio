"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questions, topics } from "@/lib/data";

type Question = (typeof questions)[0];

export function QuestionBrowser() {
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredQuestions = questions.filter((q) => {
    const topicMatch = topicFilter === "all" || q.topic === topicFilter;
    const difficultyMatch =
      difficultyFilter === "all" || q.difficulty === difficultyFilter;
    return topicMatch && difficultyMatch;
  });

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch(difficulty) {
        case 'Easy': return 'default';
        case 'Medium': return 'secondary';
        case 'Hard': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Library</CardTitle>
        <CardDescription>
          Filter and browse through all available practice questions.
        </CardDescription>
        <div className="flex items-center gap-4 pt-4">
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Statement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.id}</TableCell>
                <TableCell>
                  <Badge variant="outline">{topics.find(t => t.value === q.topic)?.label}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyBadgeVariant(q.difficulty) as any}>{q.difficulty}</Badge>
                </TableCell>
                <TableCell>{q.statement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredQuestions.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
                No questions found for the selected filters.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
