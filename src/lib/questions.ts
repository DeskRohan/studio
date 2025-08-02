
export type Question = {
    id: number;
    title: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    url: string;
};

export const allQuestions: Question[] = [
    // Arrays & Hashing
    { id: 1, title: "Contains Duplicate", topic: "Arrays & Hashing", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/" },
    { id: 2, title: "Valid Anagram", topic: "Arrays & Hashing", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
    { id: 3, title: "Two Sum", topic: "Arrays & Hashing", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
    { id: 4, title: "Group Anagrams", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
    { id: 5, title: "Top K Frequent Elements", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
    { id: 6, title: "Product of Array Except Self", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
    { id: 7, title: "Valid Sudoku", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/valid-sudoku/" },
    { id: 8, title: "Longest Consecutive Sequence", topic: "Arrays & Hashing", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },

    // Two Pointers
    { id: 9, title: "Valid Palindrome", topic: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
    { id: 10, title: "Two Sum II - Input Array Is Sorted", topic: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
    { id: 11, title: "3Sum", topic: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
    { id: 12, title: "Container With Most Water", topic: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
    { id: 13, title: "Trapping Rain Water", topic: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },

    // Sliding Window
    { id: 14, title: "Best Time to Buy and Sell Stock", topic: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: 15, title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: 16, title: "Longest Repeating Character Replacement", topic: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
    { id: 17, title: "Permutation in String", topic: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/permutation-in-string/" },
    { id: 18, title: "Minimum Window Substring", topic: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
    { id: 19, title: "Sliding Window Maximum", topic: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },

    // Stack
    { id: 20, title: "Valid Parentheses", topic: "Stack", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
    { id: 21, title: "Min Stack", topic: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
    { id: 22, title: "Evaluate Reverse Polish Notation", topic: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
    { id: 23, title: "Generate Parentheses", topic: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/generate-parentheses/" },
    { id: 24, title: "Daily Temperatures", topic: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
    { id: 25, title: "Car Fleet", topic: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/car-fleet/" },
    { id: 26, title: "Largest Rectangle in Histogram", topic: "Stack", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },

    // Binary Search
    { id: 27, title: "Binary Search", topic: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
    { id: 28, title: "Search a 2D Matrix", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
    { id: 29, title: "Koko Eating Bananas", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
    { id: 30, title: "Search in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { id: 31, title: "Find Minimum in Rotated Sorted Array", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
    { id: 32, title: "Time Based Key-Value Store", topic: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/time-based-key-value-store/" },
    { id: 33, title: "Median of Two Sorted Arrays", topic: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

    // Linked List
    { id: 34, title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
    { id: 35, title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: 36, title: "Reorder List", topic: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
    { id: 37, title: "Remove Nth Node From End of List", topic: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
    { id: 38, title: "Copy List with Random Pointer", topic: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
    { id: 39, title: "Add Two Numbers", topic: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/add-two-numbers/" },
    { id: 40, title: "Linked List Cycle", topic: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
    { id: 41, title: "Find the Duplicate Number", topic: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
    { id: 42, title: "LRU Cache", topic: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
    { id: 43, title: "Merge k Sorted Lists", topic: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: 44, title: "Reverse Nodes in k-Group", topic: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },

    // Trees
    { id: 45, title: "Invert Binary Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
    { id: 46, title: "Maximum Depth of Binary Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    { id: 47, title: "Diameter of Binary Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
    { id: 48, title: "Balanced Binary Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/balanced-binary-tree/" },
    { id: 49, title: "Same Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/" },
    { id: 50, title: "Subtree of Another Tree", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
    { id: 51, title: "Lowest Common Ancestor of a BST", topic: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
    { id: 52, title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    { id: 53, title: "Binary Tree Right Side View", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
    { id: 54, title: "Count Good Nodes in Binary Tree", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
    { id: 55, title: "Validate Binary Search Tree", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
    { id: 56, title: "Kth Smallest Element in a BST", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
    { id: 57, title: "Construct Binary Tree from Preorder and Inorder Traversal", topic: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
    { id: 58, title: "Binary Tree Maximum Path Sum", topic: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
    { id: 59, title: "Serialize and Deserialize Binary Tree", topic: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

    // Tries
    { id: 60, title: "Implement Trie (Prefix Tree)", topic: "Tries", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
    { id: 61, title: "Design Add and Search Words Data Structure", topic: "Tries", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
    { id: 62, title: "Word Search II", topic: "Tries", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/" },

    // Heap / Priority Queue
    { id: 63, title: "Kth Largest Element in a Stream", topic: "Heap", difficulty: "Easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
    { id: 64, title: "Last Stone Weight", topic: "Heap", difficulty: "Easy", url: "https://leetcode.com/problems/last-stone-weight/" },
    { id: 65, title: "K Closest Points to Origin", topic: "Heap", difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
    { id: 66, title: "Kth Largest Element in an Array", topic: "Heap", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
    { id: 67, title: "Task Scheduler", topic: "Heap", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" },
    { id: 68, title: "Design Twitter", topic: "Heap", difficulty: "Medium", url: "https://leetcode.com/problems/design-twitter/" },
    { id: 69, title: "Find Median from Data Stream", topic: "Heap", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },

    // Backtracking
    { id: 70, title: "Subsets", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" },
    { id: 71, title: "Combination Sum", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/" },
    { id: 72, title: "Permutations", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/" },
    { id: 73, title: "Subsets II", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/subsets-ii/" },
    { id: 74, title: "Combination Sum II", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-ii/" },
    { id: 75, title: "Word Search", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },
    { id: 76, title: "Palindrome Partitioning", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/palindrome-partitioning/" },
    { id: 77, title: "Letter Combinations of a Phone Number", topic: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: 78, title: "N-Queens", topic: "Backtracking", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/" },

    // Graphs
    { id: 79, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
    { id: 80, title: "Clone Graph", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
    { id: 81, title: "Max Area of Island", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/max-area-of-island/" },
    { id: 82, title: "Pacific Atlantic Water Flow", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
    { id: 83, title: "Surrounded Regions", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/surrounded-regions/" },
    { id: 84, title: "Rotting Oranges", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
    { id: 85, title: "Walls and Gates", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/walls-and-gates/" },
    { id: 86, title: "Course Schedule", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
    { id: 87, title: "Course Schedule II", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule-ii/" },
    { id: 88, title: "Redundant Connection", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/redundant-connection/" },
    { id: 89, title: "Number of Connected Components in an Undirected Graph", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
    { id: 90, title: "Graph Valid Tree", topic: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/graph-valid-tree/" },
    { id: 91, title: "Word Ladder", topic: "Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/" },
    
    // Advanced Graphs
    { id: 92, title: "Reconstruct Itinerary", topic: "Advanced Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/reconstruct-itinerary/" },
    { id: 93, title: "Min Cost to Connect All Points", topic: "Advanced Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
    { id: 94, title: "Network Delay Time", topic: "Advanced Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/" },
    { id: 95, title: "Cheapest Flights Within K Stops", topic: "Advanced Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
    
    // 1-D Dynamic Programming
    { id: 96, title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
    { id: 97, title: "Min Cost Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
    { id: 98, title: "House Robber", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/" },
    { id: 99, title: "House Robber II", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/" },
    { id: 100, title: "Longest Palindromic Substring", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: 101, title: "Palindromic Substrings", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/palindromic-substrings/" },
    { id: 102, title: "Decode Ways", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/" },
    { id: 103, title: "Coin Change", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
    { id: 104, title: "Maximum Product Subarray", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/" },
    { id: 105, title: "Word Break", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/word-break/" },
    { id: 106, title: "Longest Increasing Subsequence", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
    
    // 2-D Dynamic Programming
    { id: 107, title: "Unique Paths", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/" },
    { id: 108, title: "Longest Common Subsequence", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
    { id: 109, title: "Best Time to Buy and Sell Stock with Cooldown", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
    { id: 110, title: "Coin Change II", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change-ii/" },
    { id: 111, title: "Target Sum", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/target-sum/" },
    { id: 112, title: "Interleaving String", topic: "Dynamic Programming", difficulty: "Medium", url: "https://leetcode.com/problems/interleaving-string/" },
    { id: 113, title: "Distinct Subsequences", topic: "Dynamic Programming", difficulty: "Hard", url: "https://leetcode.com/problems/distinct-subsequences/" },
    { id: 114, title: "Edit Distance", topic: "Dynamic Programming", difficulty: "Hard", url: "https://leetcode.com/problems/edit-distance/" },
    { id: 115, title: "Burst Balloons", topic: "Dynamic Programming", difficulty: "Hard", url: "https://leetcode.com/problems/burst-balloons/" },
    { id: 116, title: "Regular Expression Matching", topic: "Dynamic Programming", difficulty: "Hard", url: "https://leetcode.com/problems/regular-expression-matching/" },

    // Greedy
    { id: 117, title: "Maximum Subarray", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/" },
    { id: 118, title: "Jump Game", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/" },
    { id: 119, title: "Jump Game II", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game-ii/" },
    { id: 120, title: "Gas Station", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" },
    { id: 121, title: "Hand of Straights", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/hand-of-straights/" },
    { id: 122, title: "Merge Triplets to Form Target Triplet", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
    { id: 123, title: "Partition Labels", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/partition-labels/" },
    { id: 124, title: "Valid Parenthesis String", topic: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/valid-parenthesis-string/" },
    
    // Intervals
    { id: 125, title: "Insert Interval", topic: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/insert-interval/" },
    { id: 126, title: "Merge Intervals", topic: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
    { id: 127, title: "Non-overlapping Intervals", topic: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
    { id: 128, title: "Meeting Rooms", topic: "Intervals", difficulty: "Easy", url: "https://leetcode.com/problems/meeting-rooms/" },
    { id: 129, title: "Meeting Rooms II", topic: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
    { id: 130, title: "Minimum Interval to Include Each Query", topic: "Intervals", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },

    // Bit Manipulation
    { id: 131, title: "Single Number", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/single-number/" },
    { id: 132, title: "Number of 1 Bits", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/number-of-1-bits/" },
    { id: 133, title: "Counting Bits", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/counting-bits/" },
    { id: 134, title: "Reverse Bits", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-bits/" },
    { id: 135, title: "Missing Number", topic: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/" },
    { id: 136, title: "Sum of Two Integers", topic: "Bit Manipulation", difficulty: "Medium", url: "https://leetcode.com/problems/sum-of-two-integers/" },
    { id: 137, title: "Reverse Integer", topic: "Bit Manipulation", difficulty: "Medium", url: "https://leetcode.com/problems/reverse-integer/" },

    // Math & Geometry
    { id: 138, title: "Rotate Image", topic: "Math & Geometry", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-image/" },
    { id: 139, title: "Spiral Matrix", topic: "Math & Geometry", difficulty: "Medium", url: "https://leetcode.com/problems/spiral-matrix/" },
    { id: 140, title: "Set Matrix Zeroes", topic: "Math & Geometry", difficulty: "Medium", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
    { id: 141, title: "Happy Number", topic: "Math & Geometry", difficulty: "Easy", url: "https://leetcode.com/problems/happy-number/" },
    { id: 142, title: "Plus One", topic: "Math & Geometry", difficulty: "Easy", url: "https://leetcode.com/problems/plus-one/" },
    { id: 143, title: "Pow(x, n)", topic: "Math & Geometry", difficulty: "Medium", url: "https://leetcode.com/problems/powx-n/" },
    { id: 144, title: "Multiply Strings", topic: "Math & Geometry", difficulty: "Medium", url: "https://leetcode.com/problems/multiply-strings/" },
    { id: 145, title: "Detect Squares", topic: "Math & Geometry", difficulty: "Medium", url: "https://leetcode.com/problems/detect-squares/" },
];
