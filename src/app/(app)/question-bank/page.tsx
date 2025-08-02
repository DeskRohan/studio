
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allQuestions, Question } from '@/lib/questions';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowUpDown } from 'lucide-react';

const topics = ["All", ...Array.from(new Set(allQuestions.map(q => q.topic)))];
const difficulties = ["All", "Easy", "Medium", "Hard"];

export default function QuestionBankPage() {
    const [topicFilter, setTopicFilter] = useState('All');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Question | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

    const filteredQuestions = useMemo(() => {
        let questions = allQuestions;

        if (topicFilter !== 'All') {
            questions = questions.filter(q => q.topic === topicFilter);
        }

        if (difficultyFilter !== 'All') {
            questions = questions.filter(q => q.difficulty === difficultyFilter);
        }

        if (sortConfig.key) {
            questions.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return questions;
    }, [topicFilter, difficultyFilter, sortConfig]);

    const requestSort = (key: keyof Question) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
                <p className="text-muted-foreground">
                    A curated collection of practice problems to sharpen your skills.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter Questions</CardTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div>
                            <label className="text-sm font-medium">Topic</label>
                            <Select value={topicFilter} onValueChange={setTopicFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a topic" />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map(topic => (
                                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Difficulty</label>
                            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulties.map(difficulty => (
                                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => requestSort('title')} className="cursor-pointer">
                                    <div className="flex items-center gap-1">Title <ArrowUpDown className="h-3 w-3" /></div>
                                </TableHead>
                                <TableHead onClick={() => requestSort('topic')} className="cursor-pointer hidden md:table-cell">
                                     <div className="flex items-center gap-1">Topic <ArrowUpDown className="h-3 w-3" /></div>
                                </TableHead>
                                <TableHead onClick={() => requestSort('difficulty')} className="cursor-pointer">
                                     <div className="flex items-center gap-1">Difficulty <ArrowUpDown className="h-3 w-3" /></div>
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQuestions.map(question => (
                                <TableRow key={question.id}>
                                    <TableCell className="font-medium">{question.title}</TableCell>
                                    <TableCell className="hidden md:table-cell">{question.topic}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            question.difficulty === 'Easy' ? 'secondary' :
                                            question.difficulty === 'Medium' ? 'outline' : 'destructive'
                                        } className={cn(question.difficulty === 'Medium' && 'border-yellow-400 text-yellow-400')}>
                                            {question.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={question.url} target="_blank">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}
