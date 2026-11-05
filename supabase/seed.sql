-- PSGCompile Seed Data
-- Run after schema.sql

-- ============================================================
-- INSTITUTIONS
-- ============================================================

INSERT INTO institutions (id, name, slug, short_name, description, is_active, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'PSG College of Technology', 'psg-college-of-technology', 'PSG Tech', 'A premier autonomous institution affiliated to Anna University, offering undergraduate and postgraduate programs in engineering and technology.', true, 1),
  ('11111111-1111-1111-1111-111111111102', 'PSG Polytechnic College', 'psg-polytechnic', 'PSG Poly', 'A leading polytechnic institution offering diploma programs in various engineering disciplines.', true, 2),
  ('11111111-1111-1111-1111-111111111103', 'PSG College of Arts & Science', 'psg-college-of-arts-science', 'PSG CAS', 'An autonomous college offering undergraduate and postgraduate programs in arts, science, and commerce.', true, 3),
  ('11111111-1111-1111-1111-111111111104', 'PSG Institute of Technology and Applied Research', 'psg-institute-of-technology', 'PSG iTech', 'An institute focused on technology and applied research with industry-oriented programs.', true, 4),
  ('11111111-1111-1111-1111-111111111105', 'PSG Institute of Management', 'psg-institute-of-management', 'PSG IM', 'A premier business school offering MBA and other management programs.', true, 5);

-- ============================================================
-- DEPARTMENTS
-- ============================================================

-- PSG College of Technology
INSERT INTO departments (id, institution_id, name, slug, short_name, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Computer Science and Engineering', 'cse', 'CSE', 1),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Information Technology', 'it', 'IT', 2),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'Electronics and Communication Engineering', 'ece', 'ECE', 3),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111101', 'Electrical and Electronics Engineering', 'eee', 'EEE', 4),
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111101', 'Mechanical Engineering', 'mech', 'MECH', 5),
  ('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111101', 'Civil Engineering', 'civil', 'CIVIL', 6),
  ('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111101', 'Computer Science and Business Systems', 'csbs', 'CSBS', 7),
  ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111101', 'Artificial Intelligence and Data Science', 'aids', 'AI&DS', 8);

-- PSG Polytechnic College
INSERT INTO departments (id, institution_id, name, slug, short_name, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111102', 'Computer Engineering', 'comp-eng', 'COMP', 1),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111102', 'Electronics and Communication', 'ec', 'EC', 2),
  ('22222222-2222-2222-2222-222222222213', '11111111-1111-1111-1111-111111111102', 'Mechanical Engineering', 'mech-poly', 'MECH', 3);

-- PSG College of Arts & Science
INSERT INTO departments (id, institution_id, name, slug, short_name, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111103', 'Computer Science', 'cs', 'CS', 1),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111103', 'Information Technology', 'it-cas', 'IT', 2),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111103', 'Computer Applications', 'ca', 'CA', 3),
  ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111103', 'Mathematics', 'math', 'MATH', 4);

-- PSG Institute of Technology
INSERT INTO departments (id, institution_id, name, slug, short_name, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222231', '11111111-1111-1111-1111-111111111104', 'Computer Science and Engineering', 'cse-itech', 'CSE', 1),
  ('22222222-2222-2222-2222-222222222232', '11111111-1111-1111-1111-111111111104', 'Information Technology', 'it-itech', 'IT', 2),
  ('22222222-2222-2222-2222-222222222233', '11111111-1111-1111-1111-111111111104', 'Electronics and Communication', 'ece-itech', 'ECE', 3);

-- PSG Institute of Management
INSERT INTO departments (id, institution_id, name, slug, short_name, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222241', '11111111-1111-1111-1111-111111111105', 'Management Studies', 'mgmt', 'MGMT', 1),
  ('22222222-2222-2222-2222-222222222242', '11111111-1111-1111-1111-111111111105', 'Computer Applications', 'mca', 'MCA', 2);

-- ============================================================
-- PROGRAMS
-- ============================================================

-- PSG Tech Programs
INSERT INTO programs (id, department_id, name, slug, degree_type, duration_years) VALUES
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'B.E. Computer Science and Engineering', 'be-cse', 'B.E.', 4),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'M.E. Computer Science and Engineering', 'me-cse', 'M.E.', 2),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', 'B.Tech Information Technology', 'btech-it', 'B.Tech', 4),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', 'B.E. Electronics and Communication', 'be-ece', 'B.E.', 4),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222204', 'B.E. Electrical and Electronics', 'be-eee', 'B.E.', 4),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222205', 'B.E. Mechanical Engineering', 'be-mech', 'B.E.', 4),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222207', 'B.Tech CSBS', 'btech-csbs', 'B.Tech', 4),
  ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222208', 'B.Tech AI & Data Science', 'btech-aids', 'B.Tech', 4);

-- PSG Polytechnic Programs
INSERT INTO programs (id, department_id, name, slug, degree_type, duration_years) VALUES
  ('33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222211', 'Diploma in Computer Engineering', 'dip-comp', 'Diploma', 3),
  ('33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222212', 'Diploma in EC', 'dip-ec', 'Diploma', 3);

-- PSG CAS Programs
INSERT INTO programs (id, department_id, name, slug, degree_type, duration_years) VALUES
  ('33333333-3333-3333-3333-333333333321', '22222222-2222-2222-2222-222222222221', 'B.Sc Computer Science', 'bsc-cs', 'B.Sc', 3),
  ('33333333-3333-3333-3333-333333333322', '22222222-2222-2222-2222-222222222222', 'B.Sc Information Technology', 'bsc-it', 'B.Sc', 3),
  ('33333333-3333-3333-3333-333333333323', '22222222-2222-2222-2222-222222222223', 'BCA', 'bca', 'BCA', 3),
  ('33333333-3333-3333-3333-333333333324', '22222222-2222-2222-2222-222222222223', 'MCA', 'mca-cas', 'MCA', 2);

-- PSG iTech Programs
INSERT INTO programs (id, department_id, name, slug, degree_type, duration_years) VALUES
  ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222231', 'B.E. CSE', 'be-cse-itech', 'B.E.', 4),
  ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222232', 'B.Tech IT', 'btech-it-itech', 'B.Tech', 4);

-- PSG IM Programs
INSERT INTO programs (id, department_id, name, slug, degree_type, duration_years) VALUES
  ('33333333-3333-3333-3333-333333333341', '22222222-2222-2222-2222-222222222241', 'MBA', 'mba', 'MBA', 2),
  ('33333333-3333-3333-3333-333333333342', '22222222-2222-2222-2222-222222222242', 'MCA', 'mca-im', 'MCA', 2);

-- ============================================================
-- BATCHES
-- ============================================================

INSERT INTO batches (id, program_id, start_year, end_year, label) VALUES
  -- B.Tech IT
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333303', 2023, 2027, '2023–2027'),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333303', 2024, 2028, '2024–2028'),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333303', 2025, 2029, '2025–2029'),
  -- B.E. CSE
  ('44444444-4444-4444-4444-444444444411', '33333333-3333-3333-3333-333333333301', 2023, 2027, '2023–2027'),
  ('44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333301', 2024, 2028, '2024–2028'),
  -- B.Sc CS
  ('44444444-4444-4444-4444-444444444421', '33333333-3333-3333-3333-333333333321', 2024, 2027, '2024–2027'),
  -- MBA
  ('44444444-4444-4444-4444-444444444431', '33333333-3333-3333-3333-333333333341', 2025, 2027, '2025–2027'),
  -- Diploma Computer
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333311', 2024, 2027, '2024–2027');

-- ============================================================
-- SECTIONS
-- ============================================================

INSERT INTO sections (id, batch_id, name) VALUES
  ('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 'A'),
  ('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444401', 'B'),
  ('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444411', 'A'),
  ('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444411', 'B'),
  ('55555555-5555-5555-5555-555555555505', '44444444-4444-4444-4444-444444444421', 'A');

-- ============================================================
-- LANGUAGES
-- ============================================================

INSERT INTO languages (id, name, slug, monaco_id, judge_id, version, file_extension, sort_order, template_code) VALUES
  ('66666666-6666-6666-6666-666666666601', 'C', 'c', 'c', 'c', 'GCC 12', '.c', 1, '#include <stdio.h>

int main() {
    // Your code here
    return 0;
}'),
  ('66666666-6666-6666-6666-666666666602', 'C++', 'cpp', 'cpp', 'cpp', 'G++ 12', '.cpp', 2, '#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Your code here
    return 0;
}'),
  ('66666666-6666-6666-6666-666666666603', 'Java', 'java', 'java', 'java', 'OpenJDK 17', '.java', 3, 'import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}'),
  ('66666666-6666-6666-6666-666666666604', 'Python', 'python', 'python', 'python3', 'Python 3.11', '.py', 4, '# Your code here
'),
  ('66666666-6666-6666-6666-666666666605', 'JavaScript', 'javascript', 'javascript', 'nodejs', 'Node.js 20', '.js', 5, '// Your code here
const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    // Process input
});'),
  ('66666666-6666-6666-6666-666666666606', 'TypeScript', 'typescript', 'typescript', 'typescript', 'TypeScript 5', '.ts', 6, '// Your code here
'),
  ('66666666-6666-6666-6666-666666666607', 'Go', 'go', 'go', 'go', 'Go 1.21', '.go', 7, 'package main

import "fmt"

func main() {
    // Your code here
    fmt.Println("Hello")
}'),
  ('66666666-6666-6666-6666-666666666608', 'Rust', 'rust', 'rust', 'rust', 'Rust 1.73', '.rs', 8, 'use std::io;

fn main() {
    // Your code here
}'),
  ('66666666-6666-6666-6666-666666666609', 'SQL', 'sql', 'sql', 'sql', 'PostgreSQL 15', '.sql', 9, '-- Your SQL query here
SELECT 1;');

-- ============================================================
-- TAGS
-- ============================================================

INSERT INTO tags (id, name, slug, category, color) VALUES
  ('77777777-7777-7777-7777-777777777701', 'Arrays', 'arrays', 'topic', '#6366f1'),
  ('77777777-7777-7777-7777-777777777702', 'Strings', 'strings', 'topic', '#8b5cf6'),
  ('77777777-7777-7777-7777-777777777703', 'Hashing', 'hashing', 'topic', '#a78bfa'),
  ('77777777-7777-7777-7777-777777777704', 'Two Pointers', 'two-pointers', 'topic', '#c084fc'),
  ('77777777-7777-7777-7777-777777777705', 'Sliding Window', 'sliding-window', 'topic', '#e879f9'),
  ('77777777-7777-7777-7777-777777777706', 'Stack', 'stack', 'topic', '#f472b6'),
  ('77777777-7777-7777-7777-777777777707', 'Queue', 'queue', 'topic', '#fb7185'),
  ('77777777-7777-7777-7777-777777777708', 'Linked List', 'linked-list', 'topic', '#f87171'),
  ('77777777-7777-7777-7777-777777777709', 'Trees', 'trees', 'topic', '#fb923c'),
  ('77777777-7777-7777-7777-777777777710', 'Graphs', 'graphs', 'topic', '#fbbf24'),
  ('77777777-7777-7777-7777-777777777711', 'DFS', 'dfs', 'topic', '#a3e635'),
  ('77777777-7777-7777-7777-777777777712', 'BFS', 'bfs', 'topic', '#4ade80'),
  ('77777777-7777-7777-7777-777777777713', 'Dynamic Programming', 'dynamic-programming', 'topic', '#34d399'),
  ('77777777-7777-7777-7777-777777777714', 'Greedy', 'greedy', 'topic', '#2dd4bf'),
  ('77777777-7777-7777-7777-777777777715', 'Binary Search', 'binary-search', 'topic', '#22d3ee'),
  ('77777777-7777-7777-7777-777777777716', 'Recursion', 'recursion', 'topic', '#38bdf8'),
  ('77777777-7777-7777-7777-777777777717', 'Backtracking', 'backtracking', 'topic', '#60a5fa'),
  ('77777777-7777-7777-7777-777777777718', 'Heap', 'heap', 'topic', '#818cf8'),
  ('77777777-7777-7777-7777-777777777719', 'Trie', 'trie', 'topic', '#a78bfa'),
  ('77777777-7777-7777-7777-777777777720', 'Bit Manipulation', 'bit-manipulation', 'topic', '#c084fc'),
  ('77777777-7777-7777-7777-777777777721', 'Math', 'math', 'topic', '#e879f9'),
  ('77777777-7777-7777-7777-777777777722', 'SQL', 'sql', 'topic', '#f472b6'),
  ('77777777-7777-7777-7777-777777777723', 'Sorting', 'sorting', 'topic', '#fb7185'),
  ('77777777-7777-7777-7777-777777777724', 'Searching', 'searching', 'topic', '#f87171'),
  ('77777777-7777-7777-7777-777777777725', 'Algorithms', 'algorithms', 'topic', '#fb923c'),
  ('77777777-7777-7777-7777-777777777726', 'Data Structures', 'data-structures', 'topic', '#fbbf24');

-- ============================================================
-- PROBLEMS
-- ============================================================

INSERT INTO problems (id, title, slug, difficulty, description, constraints, input_format, output_format, examples, hints, editorial, starter_code, is_published) VALUES
(
  '88888888-8888-8888-8888-888888888801',
  'Two Sum',
  'two-sum',
  'easy',
  '## Two Sum

Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.',
  '- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- -10⁹ ≤ target ≤ 10⁹
- Only one valid answer exists.',
  'First line: n (size of array)
Second line: n space-separated integers
Third line: target integer',
  'Two space-separated integers representing the indices (0-indexed)',
  '[{"input": "4\n2 7 11 15\n9", "output": "0 1", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}, {"input": "3\n3 2 4\n6", "output": "1 2", "explanation": "nums[1] + nums[2] == 6"}]',
  '["Try using a hash map to store the numbers you''ve seen.", "For each number, check if target - number exists in the hash map."]',
  '## Approach: Hash Map

Use a hash map to store each number and its index as you iterate through the array.

For each number `num`, check if `target - num` exists in the hash map. If it does, you''ve found the pair.

**Time Complexity:** O(n)
**Space Complexity:** O(n)

```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
```',
  '{"python": "def two_sum(nums, target):\n    # Your code here\n    pass\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nresult = two_sum(nums, target)\nprint(*result)", "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    // Your code here\n    return 0;\n}", "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Your code here\n    }\n}"}',
  true
),
(
  '88888888-8888-8888-8888-888888888802',
  'Valid Parentheses',
  'valid-parentheses',
  'easy',
  '## Valid Parentheses

Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.',
  '- 1 ≤ s.length ≤ 10⁴
- s consists of parentheses only `()[]{}`.',
  'A single string s',
  '"true" or "false"',
  '[{"input": "()", "output": "true", "explanation": "Simple valid parentheses"}, {"input": "()[]{}", "output": "true", "explanation": "Multiple types of valid parentheses"}, {"input": "(]", "output": "false", "explanation": "Mismatched parentheses"}]',
  '["Use a stack.", "Push opening brackets onto the stack, pop when you see a closing bracket."]',
  '## Approach: Stack

Use a stack. For each character:
- If it''s an opening bracket, push it.
- If it''s a closing bracket, check if the top of the stack is the matching opening bracket.

**Time:** O(n) | **Space:** O(n)',
  '{"python": "s = input().strip()\n# Your code here\n", "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Your code here\n    return 0;\n}"}',
  true
),
(
  '88888888-8888-8888-8888-888888888803',
  'Maximum Subarray',
  'maximum-subarray',
  'medium',
  '## Maximum Subarray

Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.',
  '- 1 ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴',
  'First line: n (size of array)
Second line: n space-separated integers',
  'A single integer representing the maximum subarray sum',
  '[{"input": "9\n-2 1 -3 4 -1 2 1 -5 4", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum = 6."}, {"input": "1\n1", "output": "1", "explanation": "Single element"}, {"input": "5\n5 4 -1 7 8", "output": "23", "explanation": "The entire array is the max subarray."}]',
  '["Think about Kadane''s algorithm.", "At each position, decide whether to extend the current subarray or start a new one."]',
  '## Kadane''s Algorithm

**Time:** O(n) | **Space:** O(1)',
  '{"python": "n = int(input())\nnums = list(map(int, input().split()))\n# Your code here\n"}',
  true
),
(
  '88888888-8888-8888-8888-888888888804',
  'Merge Intervals',
  'merge-intervals',
  'medium',
  '## Merge Intervals

Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
  '- 1 ≤ intervals.length ≤ 10⁴
- intervals[i].length == 2
- 0 ≤ start_i ≤ end_i ≤ 10⁴',
  'First line: n (number of intervals)
Next n lines: two space-separated integers start and end',
  'Each line contains two space-separated integers representing a merged interval, sorted by start',
  '[{"input": "4\n1 3\n2 6\n8 10\n15 18", "output": "1 6\n8 10\n15 18", "explanation": "[1,3] and [2,6] overlap, so merge into [1,6]."}]',
  '["Sort the intervals by start time.", "Iterate and merge overlapping intervals."]',
  '## Sorting Approach

Sort by start time, then merge greedily.

**Time:** O(n log n) | **Space:** O(n)',
  '{"python": "n = int(input())\nintervals = []\nfor _ in range(n):\n    a, b = map(int, input().split())\n    intervals.append([a, b])\n# Your code here\n"}',
  true
),
(
  '88888888-8888-8888-8888-888888888805',
  'Longest Palindromic Substring',
  'longest-palindromic-substring',
  'medium',
  '## Longest Palindromic Substring

Given a string `s`, return the **longest palindromic substring** in `s`.',
  '- 1 ≤ s.length ≤ 1000
- s consists of only digits and English letters.',
  'A single string s',
  'The longest palindromic substring',
  '[{"input": "babad", "output": "bab", "explanation": "\"aba\" is also a valid answer."}, {"input": "cbbd", "output": "bb", "explanation": ""}]',
  '["Expand around center approach.", "Consider both odd and even length palindromes."]',
  '## Expand Around Center

**Time:** O(n²) | **Space:** O(1)',
  '{"python": "s = input().strip()\n# Your code here\n"}',
  true
),
(
  '88888888-8888-8888-8888-888888888806',
  'Reverse Linked List',
  'reverse-linked-list',
  'easy',
  '## Reverse Linked List

Given the head of a singly linked list, reverse the list, and return the reversed list.

For this problem, the linked list is represented as space-separated values. Output the reversed list as space-separated values.',
  '- The number of nodes in the list is in the range [0, 5000].
- -5000 ≤ Node.val ≤ 5000',
  'Space-separated integers representing the linked list',
  'Space-separated integers representing the reversed linked list',
  '[{"input": "1 2 3 4 5", "output": "5 4 3 2 1", "explanation": ""}, {"input": "1 2", "output": "2 1", "explanation": ""}]',
  '["Use three pointers: prev, current, next.", "Iteratively reverse the links."]',
  '## Iterative Approach

**Time:** O(n) | **Space:** O(1)',
  '{"python": "nums = list(map(int, input().split()))\n# Your code here\nprint(*reversed(nums))\n"}',
  true
),
(
  '88888888-8888-8888-8888-888888888807',
  'Binary Tree Level Order Traversal',
  'binary-tree-level-order-traversal',
  'medium',
  '## Binary Tree Level Order Traversal

Given the root of a binary tree, return the level order traversal of its nodes'' values (i.e., from left to right, level by level).

The tree is given as a space-separated list of values in level-order, where "null" represents empty nodes.',
  '- The number of nodes in the tree is in the range [0, 2000].
- -1000 ≤ Node.val ≤ 1000',
  'Space-separated values in level-order (use "null" for empty nodes)',
  'Each line contains space-separated values at that level',
  '[{"input": "3 9 20 null null 15 7", "output": "3\n9 20\n15 7", "explanation": "Level 0: [3], Level 1: [9,20], Level 2: [15,7]"}]',
  '["Use BFS with a queue.", "Process one level at a time."]',
  '## BFS Approach

Use a queue and process level by level.

**Time:** O(n) | **Space:** O(n)',
  '{}',
  true
),
(
  '88888888-8888-8888-8888-888888888808',
  'Climbing Stairs',
  'climbing-stairs',
  'easy',
  '## Climbing Stairs

You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
  '- 1 ≤ n ≤ 45',
  'A single integer n',
  'A single integer representing the number of distinct ways',
  '[{"input": "2", "output": "2", "explanation": "1+1 or 2"}, {"input": "3", "output": "3", "explanation": "1+1+1, 1+2, or 2+1"}]',
  '["This is a Fibonacci-like problem.", "f(n) = f(n-1) + f(n-2)"]',
  '## Dynamic Programming

**Time:** O(n) | **Space:** O(1)',
  '{"python": "n = int(input())\n# Your code here\n"}',
  true
),
(
  '88888888-8888-8888-8888-888888888809',
  'Trapping Rain Water',
  'trapping-rain-water',
  'hard',
  '## Trapping Rain Water

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
  '- n == height.length
- 1 ≤ n ≤ 2 × 10⁴
- 0 ≤ height[i] ≤ 10⁵',
  'First line: n
Second line: n space-separated integers',
  'A single integer representing the total water trapped',
  '[{"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "output": "6", "explanation": "The elevation map traps 6 units of rain water."}, {"input": "5\n4 2 0 3 2 5", "output": "9", "explanation": ""}]',
  '["Two pointer approach works in O(n) time and O(1) space.", "For each position, water = min(max_left, max_right) - height"]',
  '## Two Pointer Approach

**Time:** O(n) | **Space:** O(1)',
  '{"python": "n = int(input())\nheight = list(map(int, input().split()))\n# Your code here\n"}',
  true
),
(
  '88888888-8888-8888-8888-888888888810',
  'Word Break',
  'word-break',
  'hard',
  '## Word Break

Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.',
  '- 1 ≤ s.length ≤ 300
- 1 ≤ wordDict.length ≤ 1000
- 1 ≤ wordDict[i].length ≤ 20
- s and wordDict[i] consist of only lowercase English letters.',
  'First line: string s
Second line: space-separated words in dictionary',
  '"true" or "false"',
  '[{"input": "leetcode\nleet code", "output": "true", "explanation": "\"leetcode\" can be segmented as \"leet code\"."}, {"input": "applepenapple\napple pen", "output": "true", "explanation": ""}, {"input": "catsandog\ncats dog sand and cat", "output": "false", "explanation": ""}]',
  '["Use dynamic programming.", "dp[i] represents whether s[0:i] can be segmented."]',
  '## DP Approach

**Time:** O(n² × m) | **Space:** O(n)',
  '{"python": "s = input().strip()\nwords = input().strip().split()\n# Your code here\n"}',
  true
);

-- ============================================================
-- PROBLEM TAGS MAPPING
-- ============================================================

INSERT INTO problem_tags (problem_id, tag_id) VALUES
  ('88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777701'), -- Two Sum -> Arrays
  ('88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777703'), -- Two Sum -> Hashing
  ('88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777702'), -- Valid Parentheses -> Strings
  ('88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777706'), -- Valid Parentheses -> Stack
  ('88888888-8888-8888-8888-888888888803', '77777777-7777-7777-7777-777777777701'), -- Max Subarray -> Arrays
  ('88888888-8888-8888-8888-888888888803', '77777777-7777-7777-7777-777777777713'), -- Max Subarray -> DP
  ('88888888-8888-8888-8888-888888888804', '77777777-7777-7777-7777-777777777701'), -- Merge Intervals -> Arrays
  ('88888888-8888-8888-8888-888888888804', '77777777-7777-7777-7777-777777777723'), -- Merge Intervals -> Sorting
  ('88888888-8888-8888-8888-888888888805', '77777777-7777-7777-7777-777777777702'), -- Longest Palindrome -> Strings
  ('88888888-8888-8888-8888-888888888805', '77777777-7777-7777-7777-777777777713'), -- Longest Palindrome -> DP
  ('88888888-8888-8888-8888-888888888806', '77777777-7777-7777-7777-777777777708'), -- Reverse LL -> Linked List
  ('88888888-8888-8888-8888-888888888807', '77777777-7777-7777-7777-777777777709'), -- Level Order -> Trees
  ('88888888-8888-8888-8888-888888888807', '77777777-7777-7777-7777-777777777712'), -- Level Order -> BFS
  ('88888888-8888-8888-8888-888888888808', '77777777-7777-7777-7777-777777777713'), -- Climbing Stairs -> DP
  ('88888888-8888-8888-8888-888888888808', '77777777-7777-7777-7777-777777777721'), -- Climbing Stairs -> Math
  ('88888888-8888-8888-8888-888888888809', '77777777-7777-7777-7777-777777777701'), -- Trapping Rain -> Arrays
  ('88888888-8888-8888-8888-888888888809', '77777777-7777-7777-7777-777777777704'), -- Trapping Rain -> Two Pointers
  ('88888888-8888-8888-8888-888888888809', '77777777-7777-7777-7777-777777777706'), -- Trapping Rain -> Stack
  ('88888888-8888-8888-8888-888888888810', '77777777-7777-7777-7777-777777777702'), -- Word Break -> Strings
  ('88888888-8888-8888-8888-888888888810', '77777777-7777-7777-7777-777777777713'); -- Word Break -> DP

-- ============================================================
-- TEST CASES
-- ============================================================

-- Two Sum test cases
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, is_hidden, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888801', '4
2 7 11 15
9', '0 1', true, false, 1),
  ('88888888-8888-8888-8888-888888888801', '3
3 2 4
6', '1 2', true, false, 2),
  ('88888888-8888-8888-8888-888888888801', '2
3 3
6', '0 1', false, true, 3),
  ('88888888-8888-8888-8888-888888888801', '5
1 5 3 7 2
9', '1 3', false, true, 4),
  ('88888888-8888-8888-8888-888888888801', '4
-1 -2 -3 -4
-6', '1 3', false, true, 5);

-- Valid Parentheses test cases
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, is_hidden, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888802', '()', 'true', true, false, 1),
  ('88888888-8888-8888-8888-888888888802', '()[]{}', 'true', true, false, 2),
  ('88888888-8888-8888-8888-888888888802', '(]', 'false', true, false, 3),
  ('88888888-8888-8888-8888-888888888802', '([)]', 'false', false, true, 4),
  ('88888888-8888-8888-8888-888888888802', '{[]}', 'true', false, true, 5),
  ('88888888-8888-8888-8888-888888888802', '', 'true', false, true, 6);

-- Maximum Subarray test cases
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, is_hidden, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888803', '9
-2 1 -3 4 -1 2 1 -5 4', '6', true, false, 1),
  ('88888888-8888-8888-8888-888888888803', '1
1', '1', true, false, 2),
  ('88888888-8888-8888-8888-888888888803', '5
5 4 -1 7 8', '23', true, false, 3),
  ('88888888-8888-8888-8888-888888888803', '3
-1 -2 -3', '-1', false, true, 4);

-- Climbing Stairs test cases
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, is_hidden, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888808', '2', '2', true, false, 1),
  ('88888888-8888-8888-8888-888888888808', '3', '3', true, false, 2),
  ('88888888-8888-8888-8888-888888888808', '5', '8', false, true, 3),
  ('88888888-8888-8888-8888-888888888808', '10', '89', false, true, 4),
  ('88888888-8888-8888-8888-888888888808', '45', '1836311903', false, true, 5);

-- Trapping Rain Water test cases
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, is_hidden, sort_order) VALUES
  ('88888888-8888-8888-8888-888888888809', '12
0 1 0 2 1 0 1 3 2 1 2 1', '6', true, false, 1),
  ('88888888-8888-8888-8888-888888888809', '6
4 2 0 3 2 5', '9', true, false, 2),
  ('88888888-8888-8888-8888-888888888809', '3
1 0 1', '1', false, true, 3);

-- ============================================================
-- BADGES
-- ============================================================

INSERT INTO badges (id, name, slug, description, icon, category, rule_type, rule_value) VALUES
  ('99999999-9999-9999-9999-999999999901', 'First Solve', 'first-solve', 'Solve your first problem', '🏆', 'problems', 'problems_solved', 1),
  ('99999999-9999-9999-9999-999999999902', '7 Day Streak', '7-day-streak', 'Maintain a 7-day coding streak', '🔥', 'streak', 'streak', 7),
  ('99999999-9999-9999-9999-999999999903', '30 Day Streak', '30-day-streak', 'Maintain a 30-day coding streak', '🔥', 'streak', 'streak', 30),
  ('99999999-9999-9999-9999-999999999904', '100 Problems', '100-problems', 'Solve 100 problems', '💯', 'problems', 'problems_solved', 100),
  ('99999999-9999-9999-9999-999999999905', '500 Problems', '500-problems', 'Solve 500 problems', '🚀', 'problems', 'problems_solved', 500),
  ('99999999-9999-9999-9999-999999999906', '50 Hard Problems', '50-hard', 'Solve 50 hard problems', '🧠', 'problems', 'hard_solved', 50),
  ('99999999-9999-9999-9999-999999999907', 'Speed Solver', 'speed-solver', 'Solve a problem within 5 minutes', '⚡', 'special', 'custom', NULL),
  ('99999999-9999-9999-9999-999999999908', 'Contest Winner', 'contest-winner', 'Win a PSGCompile contest', '🏅', 'contests', 'custom', NULL),
  ('99999999-9999-9999-9999-999999999909', 'PSG Topper', 'psg-topper', 'Reach #1 on the PSG leaderboard', '👑', 'special', 'custom', NULL),
  ('99999999-9999-9999-9999-999999999910', '10 Contests', '10-contests', 'Participate in 10 contests', '🎯', 'contests', 'contests', 10),
  ('99999999-9999-9999-9999-999999999911', '100 Accepted', '100-accepted', 'Get 100 accepted submissions', '💻', 'problems', 'accepted_submissions', 100),
  ('99999999-9999-9999-9999-999999999912', 'Early Adopter', 'early-adopter', 'Join PSGCompile in its first month', '🌟', 'special', 'custom', NULL);

-- ============================================================
-- ADMIN SETTINGS
-- ============================================================

INSERT INTO admin_settings (key, value, description) VALUES
  ('rating_tiers', '{"newbie": 0, "beginner": 1200, "intermediate": 1400, "advanced": 1600, "expert": 1900, "master": 2100, "grandmaster": 2400}', 'Rating tier thresholds'),
  ('allowed_domains', '["psgtech.ac.in", "psgpolytech.ac.in", "psgcas.ac.in", "psgitech.ac.in", "psgim.ac.in", "gmail.com"]', 'Allowed email domains for registration'),
  ('streak_activities', '["accepted_submission", "contest_participation"]', 'Activities that count towards streaks'),
  ('platform_name', '"PSGCompile"', 'Platform display name'),
  ('platform_tagline', '"Code. Compete. Climb."', 'Platform tagline'),
  ('maintenance_mode', 'false', 'Whether the platform is in maintenance mode'),
  ('registration_enabled', 'true', 'Whether new registrations are enabled'),
  ('contest_rating_k_factor', '32', 'K-factor for rating calculations');

