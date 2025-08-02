
export type RoadmapTopic = {
  id: number;
  text: string;
  completed: boolean;
};

export type RoadmapPhase = {
  id: number;
  title: string;
  duration: string;
  goal: string;
  topics: RoadmapTopic[];
  practiceGoal: string;
  totalProblems: number;
  problemsSolved: number; // This will be updated by the user later
};

export const defaultRoadmap: RoadmapPhase[] = [
    {
        id: 1,
        title: "PHASE 1: Foundations of DSA & DBMS",
        duration: "Month 1",
        goal: "Build problem-solving base and master DB fundamentals.",
        topics: [
            { id: 101, text: "Complexity Analysis: Time, Space, Big-O", completed: false },
            { id: 102, text: "Arrays: Traversals, Rotations, Kadane’s, Prefix Sum", completed: false },
            { id: 103, text: "Hashing: Frequency Maps, Count, Sets", completed: false },
            { id: 104, text: "Two Pointers & Sliding Window Basics", completed: false },
            { id: 105, text: "Binary Search (Intro): Standard BS, First/Last Occurrence", completed: false },
            { id: 106, text: "DBMS: ER Diagrams, Relational Model, Keys", completed: false },
            { id: 107, text: "DBMS: Normalization (1NF–3NF)", completed: false },
            { id: 108, text: "Dev: HTML, CSS, JS Fundamentals & Git Basics", completed: false },
        ],
        practiceGoal: "50-60 Easy/Medium problems (LeetCode / GFG)",
        totalProblems: 60,
        problemsSolved: 0,
    },
    {
        id: 2,
        title: "PHASE 2: Recursion, Linked Lists, SQL",
        duration: "Month 2",
        goal: "Tackle recursive patterns and core data structures.",
        topics: [
            { id: 201, text: "Recursion & Backtracking (N-Queens, Subsets)", completed: false },
            { id: 202, text: "Linked Lists: Insert, Delete, Reverse, Cycle Detection", completed: false },
            { id: 203, text: "Stack + Queue (Intro): Implementations, Min Stack", completed: false },
            { id: 204, text: "SQL: DDL, DML, DQL, Aggregate Functions, Subqueries", completed: false },
            { id: 205, text: "SQL: JOINS (Inner, Left, Right, Full)", completed: false },
            { id: 206, text: "SQL: Transactions & ACID Properties", completed: false },
            { id: 207, text: "Dev: DOM Manipulation & Build a To-Do App", completed: false },
        ],
        practiceGoal: "40-50 problems on Recursion, LL, Stack, Queue.",
        totalProblems: 50,
        problemsSolved: 0,
    },
    {
        id: 3,
        title: "PHASE 3: Stacks, Queues, OS Intro",
        duration: "Month 3",
        goal: "Deep dive into linear structures and OS concepts.",
        topics: [
            { id: 301, text: "Stacks: Balanced Parens, Infix → Postfix", completed: false },
            { id: 302, text: "Queues: Circular Queue, Deque", completed: false },
            { id: 303, text: "Advanced Sliding Window & Two Pointers", completed: false },
            { id: 304, text: "OS: Process vs Thread, Scheduling, Deadlock", completed: false },
            { id: 305, text: "Dev: JS Events, Forms, Fetch API (Weather App)", completed: false },
        ],
        practiceGoal: "30-40 problems on Stacks, Queues, Sliding Window.",
        totalProblems: 40,
        problemsSolved: 0,
    },
    {
        id: 4,
        title: "PHASE 4: Trees & CN Basics",
        duration: "Month 4",
        goal: "Master non-linear data structures and networking.",
        topics: [
            { id: 401, text: "Binary Trees: Traversals (In, Pre, Post, Level)", completed: false },
            { id: 402, text: "Tree Problems: Diameter, Height, Views", completed: false },
            { id: 403, text: "BST: Insert, Delete, Floor/Ceil, Validate, LCA", completed: false },
            { id: 404, text: "CN: OSI & TCP/IP Layers, IP Addressing, DNS", completed: false },
            { id: 405, text: "CN: TCP vs UDP, MAC, ARP", completed: false },
            { id: 406, text: "Dev: Responsive Design & Host a project", completed: false },
        ],
        practiceGoal: "50-60 problems on Trees and BST.",
        totalProblems: 60,
        problemsSolved: 0,
    },
     {
        id: 5,
        title: "PHASE 5: Graphs & Advanced Topics",
        duration: "Month 5",
        goal: "Conquer graphs and revise core subjects.",
        topics: [
            { id: 501, text: "Graph: Representation, DFS, BFS", completed: false },
            { id: 502, text: "Cycle Detection (Directed & Undirected)", completed: false },
            { id: 503, text: "Topological Sort (DFS & Kahn’s Algo)", completed: false },
            { id: 504, text: "Shortest Paths: Dijkstra, Bellman-Ford", completed: false },
            { id: 505, text: "OS/DBMS Revision: Paging, Indexing", completed: false },
        ],
        practiceGoal: "40-50 graph problems.",
        totalProblems: 50,
        problemsSolved: 0,
    },
    {
        id: 6,
        title: "PHASE 6: Heaps, Tries, OOP",
        duration: "Month 6",
        goal: "Explore advanced data structures and OOP.",
        topics: [
            { id: 601, text: "Heap: Min/Max Heap, Heapify, Top K Problems", completed: false },
            { id: 602, text: "Trie: Insert, Search, Word Suggestions", completed: false },
            { id: 603, text: "Practice: LRU Cache, Median in Stream", completed: false },
            { id: 604, text: "OOP: All pillars (Inheritance, Polymorphism etc.)", completed: false },
            { id: 605, text: "OOP: SOLID Principles", completed: false },
            { id: 606, text: "Dev: Learn React Basics (JSX, Props, State)", completed: false },
        ],
        practiceGoal: "30-40 problems on Heaps and Tries.",
        totalProblems: 40,
        problemsSolved: 0,
    },
    {
        id: 7,
        title: "PHASE 7: Dynamic Programming & CN",
        duration: "Month 7",
        goal: "Master DP and advanced networking.",
        topics: [
            { id: 701, text: "Intro to DP: Memoization & Tabulation", completed: false },
            { id: 702, text: "1D & 2D DP: LCS, Knapsack, Subset Sum", completed: false },
            { id: 703, text: "DP on Trees/Graphs", completed: false },
            { id: 704, text: "CN: TCP Handshake, Congestion Control, SSL", completed: false },
        ],
        practiceGoal: "50-60 DP problems.",
        totalProblems: 60,
        problemsSolved: 0,
    },
    {
        id: 8,
        title: "PHASE 8: System Design & Mock Interviews",
        duration: "Month 8",
        goal: "Prepare for system design rounds and real interviews.",
        topics: [
            { id: 801, text: "System Design: Load Balancers, Caching, Sharding", completed: false },
            { id: 802, text: "Design: URL Shortener, Rate Limiter", completed: false },
            { id: 803, text: "Practice Company-Wise Problem Sets", completed: false },
            { id: 804, text: "Give 2-3 Mock Interviews per week", completed: false },
            { id: 805, text: "Dev: Build a Fullstack MERN/Next.js App", completed: false },
        ],
        practiceGoal: "Solve 100+ quality problems & Leetcode Contests.",
        totalProblems: 100,
        problemsSolved: 0,
    },
    {
        id: 9,
        title: "PHASE 9: Revision & Applications",
        duration: "Month 9",
        goal: "Revise, apply for jobs, and ace interviews.",
        topics: [
            { id: 901, text: "Revisit Weakest DSA & CS Topics", completed: false },
            { id: 902, text: "Time-bound Problem Solving Practice", completed: false },
            { id: 903, text: "Behavioral Prep: HR Questions, STAR Method", completed: false },
            { id: 904, text: "Resume Polishing & GitHub Cleanup", completed: false },
            { id: 905, text: "Start applying for jobs actively", completed: false },
        ],
        practiceGoal: "Consistent mock interviews and problem-solving.",
        totalProblems: 50,
        problemsSolved: 0,
    }
];
