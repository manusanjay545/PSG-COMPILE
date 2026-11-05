import "server-only";
import { COURSES, type CourseModule } from "@/lib/courses/catalog";

export type CourseQuestion = { question: string; options: string[]; answer: number; explanation: string };
export type CourseTestCase = { input: string; expected_output: string; is_sample: boolean };
export type CourseCodingTest = { prompt: string; inputFormat: string; outputFormat: string; starterCode: string; cases: CourseTestCase[] };

const distractors = [
  "Skip validation and assume every input has the expected shape.",
  "Use the first construct you remember, even if its behavior is unclear.",
  "Ignore boundary cases because the example already works.",
  "Put all logic in one block so it is harder to test separately.",
];

function makeQuestions(module: CourseModule, courseModules: CourseModule[]): CourseQuestion[] {
  const otherModules = courseModules.filter((item) => item !== module);
  const otherLessonIdeas = otherModules.map((item) => item.lesson.split(/[.!?]/)[0].trim().slice(0, 150));
  const keyIdea = module.lesson.split(/[.!?]/)[0].trim().slice(0, 150);
  const challenges = [module.exercise, ...otherModules.map((item) => item.exercise)].map((text) => text.slice(0, 160));
  const questions: CourseQuestion[] = [
    { question: `Which topic is introduced first in the “${module.title}” learning sequence?`, options: [module.topics[0], ...module.topics.slice(1, 4)], answer: 0, explanation: `The chapter starts with “${module.topics[0]}” before moving on to the later topics.` },
    { question: "Which statement best matches this chapter's core guidance?", options: [keyIdea, ...otherLessonIdeas.slice(0, 3)], answer: 0, explanation: module.lesson.split(/[.!?]/)[0].trim() + "." },
    { question: "After reading the example, what is the best next learning step?", options: ["Trace it with a small input, then change one thing and predict the result.", ...distractors.slice(1)], answer: 0, explanation: "Tracing a small case makes each step visible; changing an input checks whether you understand the behavior." },
    { question: "Which test set gives the strongest first check for your solution?", options: ["A normal case, a boundary case, and an invalid or empty case.", "Only the exact example shown in the lesson.", "One very large random case with no expected answer.", "No tests if the code compiles."], answer: 0, explanation: "Typical, boundary, and empty or invalid inputs expose different classes of mistakes." },
    { question: "Which practical task is assigned in this chapter?", options: [challenges[0], ...challenges.slice(1, 4)], answer: 0, explanation: module.exercise },
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

function solution(language: string, index: number) {
  const solutions: Record<string, string[]> = {
    python: [
      "import sys\na, b = map(int, sys.stdin.read().split())\nprint(a + b)",
      "n = int(input())\nprint('positive' if n > 0 else 'negative' if n < 0 else 'zero')",
      "data = list(map(int, open(0).read().split()))\nn = data[0]\nprint(sum(data[1:1 + n]))",
      "import sys\nline = sys.stdin.readline().rstrip('\\n')\nprint(line[::-1])",
      "import sys\nline = sys.stdin.readline()\nvowels = set('aeiouAEIOU')\nprint(sum(char in vowels for char in line))",
      "word = input().strip()\nprint('YES' if word.casefold() == word.casefold()[::-1] else 'NO')",
    ],
    c: [
      "#include <stdio.h>\nint main(void){ long long a,b; if(scanf(\"%lld %lld\",&a,&b)==2) printf(\"%lld\\n\",a+b); return 0; }",
      "#include <stdio.h>\nint main(void){ long long n; if(scanf(\"%lld\",&n)!=1)return 0; puts(n>0?\"positive\":n<0?\"negative\":\"zero\"); return 0; }",
      "#include <stdio.h>\nint main(void){ int n; long long x,sum=0; if(scanf(\"%d\",&n)!=1)return 0; for(int i=0;i<n;i++){if(scanf(\"%lld\",&x)!=1)return 0;sum+=x;} printf(\"%lld\\n\",sum); return 0; }",
      "#include <stdio.h>\n#include <string.h>\nint main(void){ char s[20001]; if(!fgets(s,sizeof s,stdin))return 0; size_t n=strcspn(s,\"\\r\\n\"); while(n)putchar(s[--n]); putchar('\\n'); return 0; }",
      "#include <stdio.h>\n#include <ctype.h>\nint main(void){ int c,count=0; while((c=getchar())!=EOF){c=tolower((unsigned char)c);if(c=='a'||c=='e'||c=='i'||c=='o'||c=='u')count++;} printf(\"%d\\n\",count); return 0; }",
      "#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main(void){ char s[20001]; if(!fgets(s,sizeof s,stdin))return 0; size_t n=strcspn(s,\"\\r\\n\"); int ok=1; for(size_t i=0;i<n/2;i++) if(tolower((unsigned char)s[i])!=tolower((unsigned char)s[n-1-i])) ok=0; puts(ok?\"YES\":\"NO\"); return 0; }",
    ],
    cpp: [
      "#include <iostream>\nusing namespace std;\nint main(){long long a,b;if(cin>>a>>b)cout<<a+b<<'\\n';}",
      "#include <iostream>\nusing namespace std;\nint main(){long long n;if(cin>>n)cout<<(n>0?\"positive\":n<0?\"negative\":\"zero\")<<'\\n';}",
      "#include <iostream>\nusing namespace std;\nint main(){int n;long long x,sum=0;if(!(cin>>n))return 0;while(n--&&cin>>x)sum+=x;cout<<sum<<'\\n';}",
      "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main(){string s;getline(cin,s);reverse(s.begin(),s.end());cout<<s<<'\\n';}",
      "#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\nint main(){string s;getline(cin,s);int n=0;for(unsigned char c:s){c=tolower(c);if(c=='a'||c=='e'||c=='i'||c=='o'||c=='u')n++;}cout<<n<<'\\n';}",
      "#include <iostream>\n#include <string>\n#include <algorithm>\n#include <cctype>\nusing namespace std;\nint main(){string s;cin>>s;string t=s;transform(t.begin(),t.end(),t.begin(),[](unsigned char c){return tolower(c);});string r=t;reverse(r.begin(),r.end());cout<<(t==r?\"YES\":\"NO\")<<'\\n';}",
    ],
    java: [
      "import java.util.*;\npublic class Main{public static void main(String[]z){Scanner s=new Scanner(System.in);System.out.println(s.nextLong()+s.nextLong());}}",
      "import java.util.*;\npublic class Main{public static void main(String[]z){long n=new Scanner(System.in).nextLong();System.out.println(n>0?\"positive\":n<0?\"negative\":\"zero\");}}",
      "import java.util.*;\npublic class Main{public static void main(String[]z){Scanner s=new Scanner(System.in);int n=s.nextInt();long sum=0;while(n-->0)sum+=s.nextLong();System.out.println(sum);}}",
      "import java.io.*;\npublic class Main{public static void main(String[]z)throws Exception{String s=new BufferedReader(new InputStreamReader(System.in)).readLine();System.out.println(new StringBuilder(s==null?\"\":s).reverse());}}",
      "import java.io.*;\npublic class Main{public static void main(String[]z)throws Exception{String s=new BufferedReader(new InputStreamReader(System.in)).readLine();int n=0;for(char c:(s==null?\"\":s).toLowerCase().toCharArray())if(\"aeiou\".indexOf(c)>=0)n++;System.out.println(n);}}",
      "import java.util.*;\npublic class Main{public static void main(String[]z){String s=new Scanner(System.in).next().toLowerCase(Locale.ROOT);System.out.println(new StringBuilder(s).reverse().toString().equals(s)?\"YES\":\"NO\");}}",
    ],
    javascript: [
      "const [a,b]=require('fs').readFileSync(0,'utf8').trim().split(/\\s+/).map(Number);console.log(a+b);",
      "const n=Number(require('fs').readFileSync(0,'utf8').trim());console.log(n>0?'positive':n<0?'negative':'zero');",
      "const d=require('fs').readFileSync(0,'utf8').trim().split(/\\s+/).map(Number);console.log(d.slice(1,1+d[0]).reduce((a,b)=>a+b,0));",
      "const s=require('fs').readFileSync(0,'utf8').replace(/[\\r\\n]+$/,'');console.log([...s].reverse().join(''));",
      "const s=require('fs').readFileSync(0,'utf8');console.log((s.match(/[aeiou]/gi)||[]).length);",
      "const s=require('fs').readFileSync(0,'utf8').trim().toLowerCase();console.log(s===[...s].reverse().join('')?'YES':'NO');",
    ],
    go: [
      "package main\nimport(\"bufio\";\"fmt\";\"os\")\nfunc main(){var a,b int64;fmt.Fscan(bufio.NewReader(os.Stdin),&a,&b);fmt.Println(a+b)}",
      "package main\nimport \"fmt\"\nfunc main(){var n int;fmt.Scan(&n);if n>0{fmt.Println(\"positive\")}else if n<0{fmt.Println(\"negative\")}else{fmt.Println(\"zero\")}}",
      "package main\nimport \"fmt\"\nfunc main(){var n int;fmt.Scan(&n);var x,sum int64;for i:=0;i<n;i++{fmt.Scan(&x);sum+=x};fmt.Println(sum)}",
      "package main\nimport(\"bufio\";\"fmt\";\"os\";\"strings\")\nfunc main(){s,_:=bufio.NewReader(os.Stdin).ReadString('\\n');r:=[]rune(strings.TrimRight(s,\"\\r\\n\"));for i,j:=0,len(r)-1;i<j;i,j=i+1,j-1{r[i],r[j]=r[j],r[i]};fmt.Println(string(r))}",
      "package main\nimport(\"bufio\";\"fmt\";\"os\";\"strings\")\nfunc main(){s,_:=bufio.NewReader(os.Stdin).ReadString('\\n');n:=0;for _,c:=range strings.ToLower(s){if strings.ContainsRune(\"aeiou\",c){n++}};fmt.Println(n)}",
      "package main\nimport(\"bufio\";\"fmt\";\"os\";\"strings\")\nfunc main(){s,_:=bufio.NewReader(os.Stdin).ReadString('\\n');r:=[]rune(strings.ToLower(strings.TrimSpace(s)));ok:=true;for i:=0;i<len(r)/2;i++{if r[i]!=r[len(r)-1-i]{ok=false}};if ok{fmt.Println(\"YES\")}else{fmt.Println(\"NO\")}}",
    ],
    rust: [
      "use std::io::{self,Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let n:Vec<i64>=s.split_whitespace().filter_map(|x|x.parse().ok()).collect();if n.len()>=2{println!(\"{}\",n[0]+n[1]);}}",
      "use std::io::{self,Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let n:i64=s.trim().parse().unwrap_or(0);println!(\"{}\",if n>0{\"positive\"}else if n<0{\"negative\"}else{\"zero\"});}",
      "use std::io::{self,Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let mut it=s.split_whitespace();let n:usize=it.next().unwrap_or(\"0\").parse().unwrap_or(0);let sum:i64=it.take(n).filter_map(|x|x.parse::<i64>().ok()).sum();println!(\"{}\",sum);}",
      "use std::io::{self,Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let line=s.trim_end_matches(&['\\r','\\n'][..]);println!(\"{}\",line.chars().rev().collect::<String>());}",
      "use std::io::{self,Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let n=s.chars().filter(|c|\"aeiou\".contains(c.to_ascii_lowercase())).count();println!(\"{}\",n);}",
      "use std::io::{self,Read};\nfn main(){let mut s=String::new();io::stdin().read_to_string(&mut s).unwrap();let w=s.trim().to_lowercase();println!(\"{}\",if w.chars().eq(w.chars().rev()){\"YES\"}else{\"NO\"});}",
    ],
  };
  if (language === "sql") return "SELECT 'COURSE CHECK';";
  return solutions[language]?.[index] ?? "";
}

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
  const courseQuestions = makeQuestions(chapterModule, course.modules);
  return { course, module: chapterModule, questions: courseQuestions, codingTest: codingTest(course.language, codeIndex), solution: solution(course.language, codeIndex) };
}
