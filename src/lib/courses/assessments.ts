import "server-only";
import { COURSES, type CourseModule } from "@/lib/courses/catalog";

export type CourseQuestion = { question: string; options: string[]; answer: number };
export type CourseTestCase = { input: string; expected_output: string; is_sample: boolean };
export type CourseCodingTest = { prompt: string; inputFormat: string; outputFormat: string; starterCode: string; cases: CourseTestCase[] };

const distractors = [
  "Skip validation and assume every input has the expected shape.",
  "Use the first construct you remember, even if its behavior is unclear.",
  "Ignore boundary cases because the example already works.",
  "Put all logic in one block so it is harder to test separately.",
];

function makeQuestions(module: CourseModule): CourseQuestion[] {
  const otherTopics = module.topics.slice(1).concat(["Deployment and version control", "Graphic design fundamentals", "Network cabling"]);
  const keyIdea = module.lesson.split(/[.!?]/)[0].trim().slice(0, 150);
  const challenges = [module.exercise, "Build a responsive color palette picker.", "Write a program that draws a maze using text characters."].map((text) => text.slice(0, 160));
  const questions: CourseQuestion[] = [
    { question: `Which concept is directly covered in “${module.title}”?`, options: [module.topics[0], ...otherTopics.slice(0, 3)], answer: 0 },
    { question: "Which statement best matches the chapter's core guidance?", options: [keyIdea, ...distractors.slice(0, 3)], answer: 0 },
    { question: "After reading the example, what is the best next learning step?", options: ["Trace it with a small input, then change one thing and predict the result.", ...distractors.slice(1)], answer: 0 },
    { question: "Which test set gives the strongest first check for your solution?", options: ["A normal case, a boundary case, and an invalid or empty case.", "Only the exact example shown in the lesson.", "One very large random case with no expected answer.", "No tests if the code compiles."], answer: 0 },
    { question: "What practical task is assigned in this chapter?", options: [challenges[0], ...challenges.slice(1)], answer: 0 },
  ];
  return questions.map((item, index) => {
    const shift = (index + module.title.length) % item.options.length;
    return { ...item, options: item.options.slice(shift).concat(item.options.slice(0, shift)), answer: (item.options.length - shift) % item.options.length };
  });
}

const taskText = [
  "Read two integers and print their sum.",
  "Read one integer and print positive, negative, or zero in lowercase.",
  "Read n followed by n integers; print their sum.",
  "Read one line of text and print its characters in reverse order.",
  "Read one line and print the number of vowels (a, e, i, o, u), ignoring case.",
  "Read one word and print YES if it is a palindrome ignoring case; otherwise print NO.",
];

function starter(language: string, index: number) {
  if (language === "python") return `import sys\ndata = sys.stdin.read().split()\n# ${taskText[index]}\n`;
  if (language === "c") return `#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    /* ${taskText[index]} */\n    return 0;\n}\n`;
  if (language === "cpp") return `#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // ${taskText[index]}\n    return 0;\n}\n`;
  if (language === "java") return `import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    // ${taskText[index]}\n  }\n}\n`;
  if (language === "javascript" || language === "typescript") return `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8');\n// ${taskText[index]}\n`;
  if (language === "go") return `package main\nimport (\n  "bufio"\n  "fmt"\n  "os"\n)\nfunc main() {\n  in := bufio.NewReader(os.Stdin)\n  _ = in\n  // ${taskText[index]}\n  fmt.Println()\n}\n`;
  if (language === "rust") return `use std::io::{self, Read};\nfn main() {\n  let mut input = String::new();\n  io::stdin().read_to_string(&mut input).unwrap();\n  // ${taskText[index]}\n}\n`;
  return "-- SQL checkpoint: write a query that returns the required result.\n";
}

function codingTest(language: string, index: number): CourseCodingTest {
  const cases: CourseTestCase[][] = [
    [{ input: "2 3\n", expected_output: "5", is_sample: true }, { input: "-8 11\n", expected_output: "3", is_sample: false }, { input: "0 0\n", expected_output: "0", is_sample: false }],
    [{ input: "8\n", expected_output: "positive", is_sample: true }, { input: "-4\n", expected_output: "negative", is_sample: false }, { input: "0\n", expected_output: "zero", is_sample: false }],
    [{ input: "4\n1 2 3 4\n", expected_output: "10", is_sample: true }, { input: "3\n-5 2 1\n", expected_output: "-2", is_sample: false }, { input: "1\n9\n", expected_output: "9", is_sample: false }],
    [{ input: "PSG\n", expected_output: "GSP", is_sample: true }, { input: "hello world\n", expected_output: "dlrow olleh", is_sample: false }, { input: "a\n", expected_output: "a", is_sample: false }],
    [{ input: "Education\n", expected_output: "5", is_sample: true }, { input: "rhythm\n", expected_output: "0", is_sample: false }, { input: "AEIOU\n", expected_output: "5", is_sample: false }],
    [{ input: "level\n", expected_output: "YES", is_sample: true }, { input: "hello\n", expected_output: "NO", is_sample: false }, { input: "Racecar\n", expected_output: "YES", is_sample: false }],
  ];
  const sql = language === "sql";
  return {
    prompt: sql ? "Write a SQLite query that returns the exact text value COURSE CHECK. Your query must produce one column and one row." : taskText[index],
    inputFormat: sql ? "No input. Submit one SQLite SELECT statement." : "Read the values from standard input exactly as shown in the examples.",
    outputFormat: sql ? "Print one column containing COURSE CHECK." : "Print only the requested result followed by a newline.",
    starterCode: starter(language, index),
    cases: sql ? [{ input: "", expected_output: "COURSE CHECK", is_sample: true }] : cases[index],
  };
}

export function getCourseAssessment(courseSlug: string, chapterIndex: number) {
  const course = COURSES.find((item) => item.slug === courseSlug);
  const chapterModule = course?.modules[chapterIndex];
  if (!course || !chapterModule) return null;
  const codeIndex = chapterIndex % taskText.length;
  const courseQuestions = makeQuestions(chapterModule);
  return { course, module: chapterModule, questions: courseQuestions, codingTest: codingTest(course.language, codeIndex) };
}
