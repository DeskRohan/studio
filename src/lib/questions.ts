
export type Question = {
    id: number;
    title: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    url: string;
};

export const allQuestions: Question[] = [
    // Arrays
    { id: 1, title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
    { id: 2, title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { id: 3, title: 'Contains Duplicate', topic: 'Arrays', difficulty: 'Easy', url: 'https://leetcode.com/problems/contains-duplicate/' },
    { id: 4, title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { id: 5, title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/' },
    { id: 6, title: '3Sum', topic: 'Arrays', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
    { id: 7, title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 8, title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', url: 'https://leetcode.com/problems/trapping-rain-water/' },
    { id: 9, title: 'Median of Two Sorted Arrays', topic: 'Arrays', difficulty: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
    
    // Binary Search
    { id: 10, title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
    { id: 11, title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { id: 12, title: 'Find Minimum in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
    { id: 13, title: 'Time Based Key-Value Store', topic: 'Binary Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/time-based-key-value-store/' },

    // Linked List
    { id: 14, title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
    { id: 15, title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { id: 16, title: 'Linked List Cycle', topic: 'Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/' },
    { id: 17, title: 'Reorder List', topic: 'Linked List', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorder-list/' },
    { id: 18, title: 'Remove Nth Node From End of List', topic: 'Linked List', difficulty: 'Medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
    { id: 19, title: 'Copy List with Random Pointer', topic: 'Linked List', difficulty: 'Medium', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
    { id: 20, title: 'LRU Cache', topic: 'Linked List', difficulty: 'Medium', url: 'https://leetcode.com/problems/lru-cache/' },
    { id: 21, title: 'Merge k Sorted Lists', topic: 'Linked List', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    { id: 22, title: 'Reverse Nodes in k-Group', topic: 'Linked List', difficulty: 'Hard', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },

    // Stack
    { id: 23, title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
    { id: 24, title: 'Min Stack', topic: 'Stack', difficulty: 'Easy', url: 'https://leetcode.com/problems/min-stack/' },
    { id: 25, title: 'Evaluate Reverse Polish Notation', topic: 'Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
    { id: 26, title: 'Daily Temperatures', topic: 'Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/' },
    { id: 27, title: 'Car Fleet', topic: 'Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/car-fleet/' },
    { id: 28, title: 'Largest Rectangle in Histogram', topic: 'Stack', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },

    // Trees
    { id: 29, title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/' },
    { id: 30, title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { id: 31, title: 'Diameter of Binary Tree', topic: 'Trees', difficulty: 'Easy', url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
    { id: 32, title: 'Subtree of Another Tree', topic: 'Trees', difficulty: 'Easy', url: 'https://leetcode.com/problems/subtree-of-another-tree/' },
    { id: 33, title: 'Lowest Common Ancestor of a BST', topic: 'Trees', difficulty: 'Easy', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
    { id: 34, title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 35, title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    { id: 36, title: 'Kth Smallest Element in a BST', topic: 'Trees', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
    { id: 37, title: 'Binary Tree Maximum Path Sum', topic: 'Trees', difficulty: 'Hard', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
    { id: 38, title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'Hard', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },

    // Heap
    { id: 39, title: 'Kth Largest Element in a Stream', topic: 'Heap', difficulty: 'Easy', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
    { id: 40, title: 'Last Stone Weight', topic: 'Heap', difficulty: 'Easy', url: 'https://leetcode.com/problems/last-stone-weight/' },
    { id: 41, title: 'Kth Largest Element in an Array', topic: 'Heap', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
    { id: 42, title: 'Task Scheduler', topic: 'Heap', difficulty: 'Medium', url: 'https://leetcode.com/problems/task-scheduler/' },
    { id: 43, title: 'Find Median from Data Stream', topic: 'Heap', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },

    // Graphs
    { id: 44, title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 45, title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/' },
    { id: 46, title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
    { id: 47, title: 'Pacific Atlantic Water Flow', topic: 'Graphs', difficulty: 'Medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
    { id: 48, title: 'Rotting Oranges', topic: 'Graphs', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotting-oranges/' },
    { id: 49, title: 'Word Ladder', topic: 'Graphs', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-ladder/' },
    { id: 50, title: 'Cheapest Flights Within K Stops', topic: 'Graphs', difficulty: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },

    // Dynamic Programming
    { id: 51, title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
    { id: 52, title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
    { id: 53, title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { id: 54, title: 'Longest Common Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
    { id: 55, title: 'Word Break', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-break/' },
    { id: 56, title: 'Combination Sum IV', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum-iv/' },
    { id: 57, title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber/' },
    { id: 58, title: 'Decode Ways', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/decode-ways/' },
    { id: 59, title: 'Unique Paths', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-paths/' },
    { id: 60, title: 'Jump Game', topic: 'Dynamic Programming', difficulty: 'Medium', url: 'https://leetcode.com/problems/jump-game/' },
    { id: 61, title: 'Burst Balloons', topic: 'Dynamic Programming', difficulty: 'Hard', url: 'https://leetcode.com/problems/burst-balloons/' },
    { id: 62, title: 'Distinct Subsequences', topic: 'Dynamic Programming', difficulty: 'Hard', url: 'https://leetcode.com/problems/distinct-subsequences/' },
];
