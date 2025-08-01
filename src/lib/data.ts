export const syllabus = [
  "Data Structures and Algorithms",
  "Object-Oriented Programming",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "System Design",
  "Aptitude & Reasoning",
];

export const topics = [
  { value: "arrays", label: "Arrays" },
  { value: "strings", label: "Strings" },
  { value: "linked_lists", label: "Linked Lists" },
  { value: "stacks_queues", label: "Stacks & Queues" },
  { value: "trees", label: "Trees" },
  { value: "graphs", label: "Graphs" },
  { value: "sorting_searching", label: "Sorting & Searching" },
  { value: "dynamic_programming", label: "Dynamic Programming" },
  { value: "oop_concepts", label: "OOP Concepts" },
  { value: "sql", label: "SQL" },
  { value: "deadlocks", label: "Deadlocks" },
  { value: "tcp_ip", label: "TCP/IP" },
  { value: "scalability", label: "Scalability" },
];

export const questions = [
  {
    id: "Q001",
    topic: "arrays",
    difficulty: "Easy",
    type: "mcq",
    statement: "What is the time complexity to access an element in an array by its index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(1)",
  },
  {
    id: "Q002",
    topic: "linked_lists",
    difficulty: "Medium",
    type: "coding",
    statement: "Write a function to reverse a singly linked list.",
    answer: `
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}
    `,
  },
  {
    id: "Q003",
    topic: "sql",
    difficulty: "Easy",
    type: "mcq",
    statement: "Which SQL clause is used to filter results?",
    options: ["FILTER", "WHERE", "HAVING", "SELECT"],
    answer: "WHERE",
  },
  {
    id: "Q004",
    topic: "sorting_searching",
    difficulty: "Hard",
    type: "coding",
    statement: "Implement the QuickSort algorithm.",
    answer: `
function quickSort(arr, low, high) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
// Partition function implementation needed
    `,
  },
  {
    id: "Q005",
    topic: "trees",
    difficulty: "Medium",
    type: "mcq",
    statement: "What is the maximum number of nodes in a binary tree of height 'h'?",
    options: ["2^h - 1", "2^(h+1) - 1", "2^h", "2h"],
    answer: "2^(h+1) - 1",
  },
];

export const exams = [
  {
    id: "dsa-sprint-1",
    title: "DSA Sprint 1: Arrays & Strings",
    duration: 60, // in minutes
    questions: ["Q001", "Q002"], // Sample question IDs
  },
  {
    id: "full-mock-1",
    title: "Full Mock Test 1",
    duration: 180,
    questions: ["Q001", "Q002", "Q003", "Q004", "Q005"],
  },
];
