import { createHash } from "node:crypto";

const pad = (n, width = 4) => String(n).padStart(width, "0");
const stableUuid = (value) => {
  const hex = createHash("sha256").update(`psgcompile:problem:${value}`).digest("hex").slice(0, 32).split("");
  hex[12] = "5";
  hex[16] = ((parseInt(hex[16], 16) & 3) | 8).toString(16);
  const s = hex.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
};

function random(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (rng, low, high) => low + Math.floor(rng() * (high - low + 1));
const numbers = (rng, n, low, high) => Array.from({ length: n }, () => int(rng, low, high));
const arrayInput = (xs) => `${xs.length}\n${xs.join(" ")}`;
const listOutput = (xs) => xs.join(" ");

function twoSum(xs, target) {
  const first = new Map();
  for (let i = 0; i < xs.length; i++) {
    const complement = target - xs[i];
    if (first.has(complement)) return `${first.get(complement)} ${i}`;
    if (!first.has(xs[i])) first.set(xs[i], i);
  }
  return "-1 -1";
}

function validBrackets(s) {
  const opening = new Set(["(", "[", "{"]);
  const matching = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (opening.has(ch)) stack.push(ch);
    else if (stack.pop() !== matching[ch]) return "NO";
  }
  return stack.length ? "NO" : "YES";
}

function maxSubarray(xs) {
  let current = xs[0], best = xs[0];
  for (const x of xs.slice(1)) {
    current = Math.max(x, current + x);
    best = Math.max(best, current);
  }
  return String(best);
}

function longestUnique(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    if (last.has(s[right])) left = Math.max(left, last.get(s[right]) + 1);
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return String(best);
}

function productExcept(xs) {
  const result = Array(xs.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < xs.length; i++) { result[i] = prefix; prefix *= xs[i]; }
  let suffix = 1;
  for (let i = xs.length - 1; i >= 0; i--) { result[i] *= suffix; suffix *= xs[i]; }
  return listOutput(result);
}

function mergeIntervals(intervals) {
  const sorted = intervals.map((x) => [...x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged = [];
  for (const [left, right] of sorted) {
    const last = merged.at(-1);
    if (!last || left > last[1]) merged.push([left, right]);
    else last[1] = Math.max(last[1], right);
  }
  return `${merged.length}\n${merged.map((x) => x.join(" ")).join("\n")}`;
}

function coinChange(amount, coins) {
  const dp = Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let value = 1; value <= amount; value++) {
    for (const coin of coins) if (coin <= value) dp[value] = Math.min(dp[value], dp[value - coin] + 1);
  }
  return dp[amount] > amount ? "-1" : String(dp[amount]);
}

function dailyTemperatures(xs) {
  const result = Array(xs.length).fill(0), stack = [];
  for (let i = 0; i < xs.length; i++) {
    while (stack.length && xs[i] > xs[stack.at(-1)]) {
      const j = stack.pop(); result[j] = i - j;
    }
    stack.push(i);
  }
  return listOutput(result);
}

function dijkstra(n, edges, start, target) {
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) graph[u].push([v, w]);
  const dist = Array(n).fill(Infinity); dist[start] = 0;
  const todo = [[0, start]];
  while (todo.length) {
    todo.sort((a, b) => b[0] - a[0]);
    const [d, node] = todo.pop();
    if (d !== dist[node]) continue;
    for (const [next, weight] of graph[node]) if (d + weight < dist[next]) {
      dist[next] = d + weight; todo.push([dist[next], next]);
    }
  }
  return Number.isFinite(dist[target]) ? String(dist[target]) : "-1";
}

function lisLength(xs) {
  const tails = [];
  for (const x of xs) {
    let low = 0, high = tails.length;
    while (low < high) { const mid = (low + high) >> 1; if (tails[mid] < x) low = mid + 1; else high = mid; }
    tails[low] = x;
  }
  return String(tails.length);
}

function largestRectangle(heights) {
  const stack = []; let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const current = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack.at(-1)] > current) {
      const height = heights[stack.pop()];
      const width = stack.length ? i - stack.at(-1) - 1 : i;
      best = Math.max(best, height * width);
    }
    stack.push(i);
  }
  return String(best);
}

function minimumSpanningTree(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  let total = 0, used = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    const a = find(u), b = find(v);
    if (a !== b) { parent[a] = b; total += w; used++; }
  }
  return used === n - 1 ? String(total) : "-1";
}

function maximumFlow(n, edges, source, sink) {
  const capacity = Array.from({ length: n }, () => Array(n).fill(0));
  for (const [u, v, c] of edges) capacity[u][v] += c;
  let flow = 0;
  while (true) {
    const parent = Array(n).fill(-1); parent[source] = source;
    const queue = [source];
    for (let h = 0; h < queue.length && parent[sink] < 0; h++) {
      const u = queue[h];
      for (let v = 0; v < n; v++) if (parent[v] < 0 && capacity[u][v] > 0) { parent[v] = u; queue.push(v); }
    }
    if (parent[sink] < 0) break;
    let amount = Infinity;
    for (let v = sink; v !== source; v = parent[v]) amount = Math.min(amount, capacity[parent[v]][v]);
    for (let v = sink; v !== source; v = parent[v]) { const u = parent[v]; capacity[u][v] -= amount; capacity[v][u] += amount; }
    flow += amount;
  }
  return String(flow);
}

function queenCount(n) {
  let total = 0;
  const columns = new Set(), down = new Set(), up = new Set();
  function place(row) {
    if (row === n) { total++; return; }
    for (let col = 0; col < n; col++) {
      if (columns.has(col) || down.has(row - col) || up.has(row + col)) continue;
      columns.add(col); down.add(row - col); up.add(row + col);
      place(row + 1);
      columns.delete(col); down.delete(row - col); up.delete(row + col);
    }
  }
  place(0);
  return String(total);
}

function maxMatching(leftCount, rightCount, edges) {
  const graph = Array.from({ length: leftCount }, () => []);
  for (const [u, v] of edges) graph[u].push(v);
  const matched = Array(rightCount).fill(-1);
  function augment(u, seen) {
    for (const v of graph[u]) {
      if (seen[v]) continue;
      seen[v] = true;
      if (matched[v] < 0 || augment(matched[v], seen)) { matched[v] = u; return true; }
    }
    return false;
  }
  let answer = 0;
  for (let u = 0; u < leftCount; u++) if (augment(u, Array(rightCount).fill(false))) answer++;
  return String(answer);
}

function stronglyConnectedComponents(n, edges) {
  const graph = Array.from({ length: n }, () => []), reverse = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { graph[u].push(v); reverse[v].push(u); }
  const seen = Array(n).fill(false), order = [];
  function visit(u) { seen[u] = true; for (const v of graph[u]) if (!seen[v]) visit(v); order.push(u); }
  for (let i = 0; i < n; i++) if (!seen[i]) visit(i);
  seen.fill(false); let count = 0;
  function collect(u) { seen[u] = true; for (const v of reverse[u]) if (!seen[v]) collect(v); }
  for (const u of order.reverse()) if (!seen[u]) { collect(u); count++; }
  return String(count);
}

const python = {
  twoSum: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); target=int(t[1+n]); seen={}\n for j,x in enumerate(a):\n  if target-x in seen: return f"{seen[target-x]} {j}"\n  if x not in seen: seen[x]=j\n return "-1 -1"`,
  rotate: `import sys\ndef solve(t):\n n=int(t[0]); k=int(t[1]); a=list(map(int,t[2:2+n])); k%=n\n return " ".join(map(str,a[-k:]+a[:-k] if k else a))`,
  countTarget: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); x=int(t[1+n])\n return str(sum(v==x for v in a))`,
  maxIndex: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); m=max(a)\n return f"{m} {a.index(m)}"`,
  reverse: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n]))\n return " ".join(map(str,reversed(a)))`,
  brackets: `import sys\ndef solve(t):\n s=t[0]; pairs={")":"(","]":"[","}":"{"}; stack=[]\n for c in s:\n  if c in "([{": stack.append(c)\n  elif not stack or stack.pop()!=pairs[c]: return "NO"\n return "NO" if stack else "YES"`,
  rangeSum: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); l=int(t[n+1]); r=int(t[n+2])\n return str(sum(a[l:r+1]))`,
  digitalRoot: `import sys\ndef solve(t):\n n=int(t[0])\n while n>=10: n=sum(map(int,str(n)))\n return str(n)`,
  maxSubarray: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); cur=best=a[0]\n for x in a[1:]: cur=max(x,cur+x); best=max(best,cur)\n return str(best)`,
  uniqueSubstring: `import sys\ndef solve(t):\n s=t[0]; last={}; left=best=0\n for right,c in enumerate(s):\n  if c in last: left=max(left,last[c]+1)\n  last[c]=right; best=max(best,right-left+1)\n return str(best)`,
  productExcept: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); out=[1]*n; p=1\n for i,x in enumerate(a): out[i]=p; p*=x\n s=1\n for i in range(n-1,-1,-1): out[i]*=s; s*=a[i]\n return " ".join(map(str,out))`,
  mergeIntervals: `import sys\ndef solve(t):\n n=int(t[0]); a=sorted((int(t[1+2*i]),int(t[2+2*i])) for i in range(n)); out=[]\n for l,r in a:\n  if not out or l>out[-1][1]: out.append([l,r])\n  else: out[-1][1]=max(out[-1][1],r)\n return str(len(out))+"\\n"+"\\n".join(f"{l} {r}" for l,r in out)`,
  coinChange: `import sys\ndef solve(t):\n amount=int(t[0]); n=int(t[1]); coins=list(map(int,t[2:2+n])); dp=[amount+1]*(amount+1); dp[0]=0\n for x in range(1,amount+1):\n  for c in coins:\n   if c<=x: dp[x]=min(dp[x],dp[x-c]+1)\n return str(-1 if dp[amount]>amount else dp[amount])`,
  dailyTemperatures: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); out=[0]*n; stack=[]\n for i,x in enumerate(a):\n  while stack and x>a[stack[-1]]:\n   j=stack.pop(); out[j]=i-j\n  stack.append(i)\n return " ".join(map(str,out))`,
  dijkstra: `import sys,heapq\ndef solve(t):\n n=int(t[0]); m=int(t[1]); g=[[] for _ in range(n)]; p=2\n for _ in range(m):\n  u=int(t[p]); v=int(t[p+1]); w=int(t[p+2]); p+=3; g[u].append((v,w))\n s=int(t[p]); target=int(t[p+1]); d=[10**30]*n; d[s]=0; q=[(0,s)]\n while q:\n  cost,u=heapq.heappop(q)\n  if cost!=d[u]: continue\n  for v,w in g[u]:\n   nd=cost+w\n   if nd<d[v]: d[v]=nd; heapq.heappush(q,(nd,v))\n return str(d[target] if d[target]<10**30 else -1)`,
  lis: `import sys,bisect\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n])); tails=[]\n for x in a:\n  i=bisect.bisect_left(tails,x)\n  if i==len(tails): tails.append(x)\n  else: tails[i]=x\n return str(len(tails))`,
  histogram: `import sys\ndef solve(t):\n n=int(t[0]); a=list(map(int,t[1:1+n]))+[0]; st=[]; best=0\n for i,h in enumerate(a):\n  while st and a[st[-1]]>h:\n   height=a[st.pop()]; width=i-st[-1]-1 if st else i; best=max(best,height*width)\n  st.append(i)\n return str(best)`,
  mst: `import sys\ndef solve(t):\n n=int(t[0]); m=int(t[1]); e=[]; p=2\n for _ in range(m): e.append((int(t[p]),int(t[p+1]),int(t[p+2]))); p+=3\n parent=list(range(n))\n def find(x):\n  while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]\n  return x\n total=used=0\n for u,v,w in sorted(e,key=lambda x:x[2]):\n  a=find(u); b=find(v)\n  if a!=b: parent[a]=b; total+=w; used+=1\n return str(total if used==n-1 else -1)`,
  maxFlow: `import sys\ndef solve(t):\n n=int(t[0]); m=int(t[1]); cap=[[0]*n for _ in range(n)]; p=2\n for _ in range(m): u=int(t[p]); v=int(t[p+1]); c=int(t[p+2]); p+=3; cap[u][v]+=c\n s=int(t[p]); z=int(t[p+1]); flow=0\n while True:\n  par=[-1]*n; par[s]=s; q=[s]\n  for u in q:\n   for v in range(n):\n    if par[v]<0 and cap[u][v]>0: par[v]=u; q.append(v)\n    if par[z]>=0: break\n   if par[z]>=0: break\n  if par[z]<0: break\n  f=10**30; v=z\n  while v!=s: f=min(f,cap[par[v]][v]); v=par[v]\n  v=z\n  while v!=s: u=par[v]; cap[u][v]-=f; cap[v][u]+=f; v=u\n  flow+=f\n return str(flow)`,
  queens: `import sys\ndef solve(t):\n n=int(t[0]); cols=set(); down=set(); up=set(); total=0\n def place(r):\n  nonlocal total\n  if r==n: total+=1; return\n  for c in range(n):\n   if c in cols or r-c in down or r+c in up: continue\n   cols.add(c); down.add(r-c); up.add(r+c); place(r+1); cols.remove(c); down.remove(r-c); up.remove(r+c)\n place(0); return str(total)`,
  matching: `import sys\ndef solve(t):\n l=int(t[0]); r=int(t[1]); m=int(t[2]); g=[[] for _ in range(l)]; p=3\n for _ in range(m): u=int(t[p]); v=int(t[p+1]); p+=2; g[u].append(v)\n matched=[-1]*r\n def aug(u,seen):\n  for v in g[u]:\n   if seen[v]: continue\n   seen[v]=1\n   if matched[v]<0 or aug(matched[v],seen): matched[v]=u; return True\n  return False\n return str(sum(aug(u,[0]*r) for u in range(l)))`,
  scc: `import sys\ndef solve(t):\n n=int(t[0]); m=int(t[1]); g=[[] for _ in range(n)]; rg=[[] for _ in range(n)]; p=2\n for _ in range(m): u=int(t[p]); v=int(t[p+1]); p+=2; g[u].append(v); rg[v].append(u)\n seen=[0]*n; order=[]\n def dfs(u):\n  seen[u]=1\n  for v in g[u]:\n   if not seen[v]: dfs(v)\n  order.append(u)\n for u in range(n):\n  if not seen[u]: dfs(u)\n seen=[0]*n; count=0\n def mark(u):\n  seen[u]=1\n  for v in rg[u]:\n   if not seen[v]: mark(v)\n for u in reversed(order):\n  if not seen[u]: count+=1; mark(u)\n return str(count)`,
};

function testCase(input, expected, explanation, diagram) { return { input, output: expected, explanation, diagram }; }

const families = [
  { key: "two-sum", difficulty: "easy", variants: 313, solution: python.twoSum,
    title: "Pair-Sum Relay", topic: "hash maps", context: "sensor readings",
    statement: "Find the first pair of distinct readings whose values add to the requested total. Return their zero-based positions; if more than one pair works, use the pair with the smallest second position, then the smallest first position.",
    input_format: "Line 1: n, the number of readings.\nLine 2: n space-separated integers.\nLine 3: the target total.", output_format: "Print the two zero-based positions separated by a space. Print -1 -1 if no pair exists.", constraints: "- 2 ≤ n ≤ 100,000.\n- -10^9 ≤ each reading and target ≤ 10^9.",
    hints: ["Scan the readings from left to right.", "Remember the first position of each value so far."],
    make(rng, v, c) { const n=4+(v+c)%8; const a=numbers(rng,n,-12,22); const i=(v+c)%n, j=(i+1+((v*3+c)% (n-1)))%n; if(j===i) throw Error("pair index"); const target=a[i]+a[j]; const input=`${n}\n${a.join(" ")}\n${target}`; return testCase(input,twoSum(a,target),"The complement of each value is checked against earlier positions.",`index: ${a.map((_,k)=>String(k).padStart(2," ")).join("  ")}\nvalue: ${a.map(x=>String(x).padStart(2," ")).join("  ")}\nneed:  ${target}`); } },
  { key: "rotate-array", difficulty: "easy", variants: 313, solution: python.rotate,
    title: "Circular Queue Shift", topic: "arrays", context: "a circular queue",
    statement: "A circular queue contains integers from front to back. Rotate it right by k positions and print the resulting order. k may be larger than the queue length.",
    input_format: "Line 1: n and k.\nLine 2: n space-separated integers in queue order.", output_format: "Print the rotated values in order, separated by spaces.", constraints: "- 1 ≤ n ≤ 100,000.\n- 0 ≤ k ≤ 10^18.\n- -10^9 ≤ each value ≤ 10^9.",
    hints: ["Only k modulo n positions matter.", "A right rotation moves the last positions to the front."],
    make(rng,v,c) { const n=3+(v+c)%9; const a=numbers(rng,n,-30,50); const k=(v*13+c*7)%(n*4+1); const input=`${n} ${k}\n${a.join(" ")}`; const s=k%n; const out=s?[...a.slice(-s),...a.slice(0,-s)]:a; return testCase(input,listOutput(out),"The final k values wrap around to the front.",`front → [${a.join("] [")}] → back\nrotate right by ${k}`); } },
  { key: "count-occurrences", difficulty: "easy", variants: 313, solution: python.countTarget,
    title: "Signal Frequency", topic: "arrays", context: "a signal log",
    statement: "Count how many times the requested integer appears in a log of readings. Print zero when it does not appear.",
    input_format: "Line 1: n, the number of readings.\nLine 2: n space-separated integers.\nLine 3: the integer x to count.", output_format: "Print the number of readings equal to x.", constraints: "- 1 ≤ n ≤ 200,000.\n- -10^9 ≤ each reading and x ≤ 10^9.",
    hints: ["Inspect each reading once.", "Keep a counter for exact matches."],
    make(rng,v,c) { const n=5+(v+c)%12; const x=int(rng,-5,8); const a=numbers(rng,n,-8,10); if(c!==4) a[(v+c)%n]=x; else for(let i=0;i<n;i++) if(i%2===0)a[i]=x+1; const input=`${n}\n${a.join(" ")}\n${x}`; return testCase(input,String(a.filter(y=>y===x).length),"Count only values equal to the requested integer.",`readings: ${a.join(" ")}\ncount(${x})`); } },
  { key: "maximum-position", difficulty: "easy", variants: 313, solution: python.maxIndex,
    title: "Highest Sensor Peak", topic: "arrays", context: "a sensor strip",
    statement: "Report the largest reading and its zero-based position. If the largest value occurs more than once, report its earliest position.",
    input_format: "Line 1: n, the number of readings.\nLine 2: n space-separated integers.", output_format: "Print the maximum value and its earliest zero-based index separated by a space.", constraints: "- 1 ≤ n ≤ 200,000.\n- -10^9 ≤ each reading ≤ 10^9.",
    hints: ["Keep the best value and its position.", "Update only when a strictly larger value is found."],
    make(rng,v,c) { const n=4+(v+c)%11; const a=numbers(rng,n,-20,35); if(c===0)a[0]=70; const m=Math.max(...a); const input=arrayInput(a); return testCase(input,`${m} ${a.indexOf(m)}`,"The earliest index of the maximum is returned.",`positions: ${a.map((_,i)=>i).join(" ")}\nvalues:   ${a.join(" ")}\nmaximum:  ${m}`); } },
  { key: "reverse-sequence", difficulty: "easy", variants: 312, solution: python.reverse,
    title: "Reverse the Print Queue", topic: "arrays", context: "a print queue",
    statement: "A list of job numbers is given in arrival order. Print the same values in reverse order, separated by single spaces.",
    input_format: "Line 1: n, the number of job numbers.\nLine 2: n space-separated integers.", output_format: "Print the values in reverse order on one line.", constraints: "- 1 ≤ n ≤ 200,000.\n- -10^9 ≤ each value ≤ 10^9.",
    hints: ["The last item becomes the first.", "A reverse traversal is enough; no sorting is needed."],
    make(rng,v,c) { const n=1+(v+c)%13; const a=numbers(rng,n,-99,99); return testCase(arrayInput(a),listOutput([...a].reverse()),"Read the sequence from its final position back to its first.",`front → ${a.map(x=>`[${x}]`).join(" ")} → back\nreverse order`); } },
  { key: "balanced-brackets", difficulty: "easy", variants: 312, solution: python.brackets,
    title: "Bracketed Expression Check", topic: "stacks", context: "a calculator expression",
    statement: "An expression contains only round, square, and curly brackets. Decide whether every closing bracket matches the most recent unmatched opening bracket and no opening brackets remain.",
    input_format: "One line containing a nonempty string of brackets from (), [], and {}.", output_format: "Print YES when the expression is balanced, otherwise print NO.", constraints: "- 1 ≤ expression length ≤ 200,000.",
    hints: ["The most recent opening bracket must close first.", "A stack stores unmatched opening brackets."],
    make(rng,v,c) { const opens=["(","[","{"], close={"(":")","[":"]","{":"}"}; const stack=[]; let s=""; const length=8+(v+c)%20; for(let i=0;i<length;i++){if(!stack.length||rng()<0.58){const ch=opens[int(rng,0,2)];stack.push(ch);s+=ch;}else{s+=close[stack.pop()];}} while(stack.length)s+=close[stack.pop()]; if(c%2===1)s+=")"; return testCase(s,validBrackets(s),"Each closer must match the top item on the stack.",`expression: ${s.split("").join(" ")}\nstack order: last opened closes first`); } },
  { key: "range-sum", difficulty: "easy", variants: 312, solution: python.rangeSum,
    title: "Inclusive Range Meter", topic: "prefix sums", context: "a row of meter readings",
    statement: "Given a row of readings and a zero-based inclusive range [l, r], print the sum of the readings in that range.",
    input_format: "Line 1: n.\nLine 2: n space-separated integers.\nLine 3: l and r, the inclusive zero-based endpoints.", output_format: "Print the sum from index l through index r.", constraints: "- 1 ≤ n ≤ 200,000.\n- 0 ≤ l ≤ r < n.\n- -10^6 ≤ each value ≤ 10^6.",
    hints: ["The interval includes both endpoints.", "For one query, a direct scan of the selected range is sufficient."],
    make(rng,v,c) { const n=5+(v+c)%12; const a=numbers(rng,n,-15,28); const l=(v+c)%n; const r=l+(v*3+c)%(n-l); return testCase(`${arrayInput(a)}\n${l} ${r}`,String(a.slice(l,r+1).reduce((x,y)=>x+y,0)),"Add the entries from position l through position r, including both endpoints.",`index:  ${a.map((_,i)=>i).join(" ")}\nvalue:  ${a.join(" ")}\nrange:  ${"  ".repeat(l)}${"["}${a.slice(l,r+1).join(" ")}${"]"}`); } },
  { key: "digital-root", difficulty: "easy", variants: 312, solution: python.digitalRoot,
    title: "Repeated Digit Check", topic: "number theory", context: "a batch identifier",
    statement: "Repeatedly replace a nonnegative integer by the sum of its decimal digits until one digit remains. Print that digit.",
    input_format: "One line containing a nonnegative integer n.", output_format: "Print the single digit remaining after repeated digit summation.", constraints: "- 0 ≤ n ≤ 10^100, supplied as a decimal integer.",
    hints: ["A number below ten is already finished.", "Each pass strictly reduces every positive multi-digit value."],
    make(rng,v,c) { const n=c===0?0:int(rng,0,99999999); let x=n; while(x>=10)x=String(x).split("").reduce((s,d)=>s+Number(d),0); return testCase(String(n),String(x),"Continue digit summation until the result is a single digit.",`start: ${n}\ndigit sum → ${String(n).split("").join(" + ")}\nrepeat until one digit`); } },
  { key: "maximum-subarray", difficulty: "medium", variants: 250, solution: python.maxSubarray,
    title: "Best Continuous Run", topic: "dynamic programming", context: "a sequence of daily gains",
    statement: "Choose a nonempty contiguous run of values with the greatest possible sum. Print that sum; the run may contain negative values.",
    input_format: "Line 1: n.\nLine 2: n space-separated integers.", output_format: "Print the maximum sum of a nonempty contiguous subarray.", constraints: "- 1 ≤ n ≤ 200,000.\n- -10^9 ≤ each value ≤ 10^9.",
    hints: ["At each position, decide whether to extend the previous run or start again.", "Track the best run ending here and the best seen overall."],
    make(rng,v,c) { const n=5+(v+c)%16; const a=numbers(rng,n,-20,25); if(c===1)for(let i=0;i<n;i++)a[i]=-1-int(rng,0,10); if(c===2)a.fill(0); const input=arrayInput(a); return testCase(input,maxSubarray(a),"The best run ending at each value is either that value alone or an extension.",`values: ${a.join(" ")}\nchoose one continuous segment`); } },
  { key: "longest-unique-window", difficulty: "medium", variants: 250, solution: python.uniqueSubstring,
    title: "Longest Distinct Window", topic: "sliding window", context: "a stream of lowercase symbols",
    statement: "Find the length of the longest contiguous substring with no repeated character. The string contains lowercase English letters only.",
    input_format: "One line containing a nonempty lowercase English string.", output_format: "Print the length of the longest substring with all distinct characters.", constraints: "- 1 ≤ string length ≤ 1,000,000.",
    hints: ["Maintain a window whose characters are unique.", "When a duplicate appears, move the left edge past its previous position."],
    make(rng,v,c) { const n=8+(v+c)%21; const alphabet="abcdefghi"; const s=Array.from({length:n},()=>alphabet[int(rng,0,alphabet.length-1)]).join(""); return testCase(s,longestUnique(s),"A sliding window is advanced whenever its next character is already inside it.",`string: ${s.split("").join(" ")}\nfind the widest duplicate-free window`); } },
  { key: "product-except-self", difficulty: "medium", variants: 250, solution: python.productExcept,
    title: "Products Around Each Position", topic: "prefix and suffix products", context: "a row of multiplier cells",
    statement: "For every position, print the product of all values except the value at that position. Do not use division; the input may contain zero.",
    input_format: "Line 1: n.\nLine 2: n space-separated integers.", output_format: "Print n products in order, separated by spaces.", constraints: "- 2 ≤ n ≤ 200,000.\n- -30 ≤ each value ≤ 30.\n- Output values fit in signed 64-bit integers.",
    hints: ["A prefix product excludes everything to the right.", "Multiply it by a suffix product to cover the remaining values."],
    make(rng,v,c) { const n=3+(v+c)%13; const a=numbers(rng,n,-4,5); if(c===0)a[0]=0; if(c===1)a[1]=0; const input=arrayInput(a); return testCase(input,productExcept(a),"Multiply the product before a position by the product after it.",`values:  ${a.join(" ")}\nresult:  ${productExcept(a)}\n(each result excludes its own index)`); } },
  { key: "merge-intervals", difficulty: "medium", variants: 250, solution: python.mergeIntervals,
    title: "Merge Overlapping Reservations", topic: "sorting", context: "room reservations",
    statement: "Each reservation is a closed integer interval [start, end]. Merge all overlapping or touching intervals, then print the merged intervals in increasing start order.",
    input_format: "Line 1: n.\nNext n lines: a start and end integer for each interval.", output_format: "Print k, the number of merged intervals, followed by k lines containing each merged start and end.", constraints: "- 1 ≤ n ≤ 200,000.\n- -10^9 ≤ start ≤ end ≤ 10^9.",
    hints: ["Sort intervals by their start value.", "A new interval joins the previous one when its start is at most the previous end."],
    make(rng,v,c) { const n=4+(v+c)%9; const rows=[]; for(let i=0;i<n;i++){const l=int(rng,0,25); rows.push([l,l+int(rng,0,8)]);} const data=mergeIntervals(rows); const input=`${n}\n${rows.map(x=>x.join(" ")).join("\n")}`; return testCase(input,data,"After sorting, extend the current merged interval while ranges overlap or touch.",`reservations: ${rows.map(x=>`[${x.join(", ")}]`).join(" ")}\nsort → merge overlaps`); } },
  { key: "minimum-coins", difficulty: "medium", variants: 250, solution: python.coinChange,
    title: "Minimum Token Exchange", topic: "dynamic programming", context: "a token exchange desk",
    statement: "Given token values and a target amount, find the minimum number of tokens needed to make the amount. Each token value can be used any number of times. Print -1 if it cannot be made.",
    input_format: "Line 1: amount and m, the number of token values.\nLine 2: m distinct positive token values.", output_format: "Print the minimum number of tokens, or -1 when the amount cannot be formed.", constraints: "- 0 ≤ amount ≤ 100,000.\n- 1 ≤ m ≤ 100.\n- 1 ≤ each token value ≤ 100,000.",
    hints: ["Build the best answer for smaller amounts first.", "For amount x, try each token value that does not exceed x."],
    make(rng,v,c) { const coins=[...new Set(numbers(rng,3+(v%3),1,11))].sort((a,b)=>a-b); const amount=c===4?coins.reduce((s,x)=>s+x,0)+1:int(rng,0,45); const input=`${amount} ${coins.length}\n${coins.join(" ")}`; return testCase(input,coinChange(amount,coins),"Dynamic programming checks every final token choice for each smaller amount.",`target: ${amount}\ntokens: {${coins.join(", ")}}\nminimize token count`); } },
  { key: "daily-temperatures", difficulty: "medium", variants: 250, solution: python.dailyTemperatures,
    title: "Next Warmer Day", topic: "monotonic stack", context: "a daily temperature forecast",
    statement: "For each day, report how many days must pass until a strictly warmer temperature occurs. Print zero when no warmer day appears later.",
    input_format: "Line 1: n.\nLine 2: n space-separated daily temperatures.", output_format: "Print n wait lengths in order, separated by spaces.", constraints: "- 1 ≤ n ≤ 200,000.\n- -100 ≤ each temperature ≤ 100.",
    hints: ["A day is resolved when a warmer value arrives.", "Keep unresolved days in a stack in decreasing temperature order."],
    make(rng,v,c) { const n=5+(v+c)%15; const a=numbers(rng,n,0,35); if(c===0)a.fill(20); const input=arrayInput(a); return testCase(input,dailyTemperatures(a),"When a warmer reading arrives, it resolves earlier cooler readings still on the stack.",`day:   ${a.map((_,i)=>i).join(" ")}\ntemp:  ${a.join(" ")}\nwait:  ${dailyTemperatures(a)}`); } },
  { key: "shortest-directed-path", difficulty: "hard", variants: 125, solution: python.dijkstra,
    title: "Weighted Dispatch Route", topic: "Dijkstra", context: "a directed dispatch network",
    statement: "A directed graph has nonnegative travel costs. Find the minimum cost from source s to destination t. Print -1 if t is unreachable.",
    input_format: "Line 1: n and m, the vertex and edge counts.\nNext m lines: u, v, w for a directed edge u → v with cost w.\nFinal line: source s and target t.", output_format: "Print the shortest path cost from s to t, or -1 if no path exists.", constraints: "- 1 ≤ n ≤ 200,000; 0 ≤ m ≤ 300,000.\n- Vertices are numbered 0 through n-1.\n- 0 ≤ w ≤ 10^9.",
    hints: ["Always expand the currently known vertex with the smallest distance.", "Ignore a queued distance if a shorter one has since been found."],
    make(rng,v,c) { const n=5+(v+c)%7; const edges=[]; for(let u=0;u<n-1;u++)edges.push([u,u+1,1+int(rng,0,14)]); for(let k=0;k<n;k++){const u=int(rng,0,n-1),w=int(rng,0,n-1); if(u!==w)edges.push([u,w,1+int(rng,0,18)]);} const s=(v+c)%n,t=(s+1+(v*3+c)%(n-1))%n; const input=`${n} ${edges.length}\n${edges.map(e=>e.join(" ")).join("\n")}\n${s} ${t}`; return testCase(input,dijkstra(n,edges,s,t),"Dijkstra's algorithm finalizes vertices in nondecreasing distance order.",edges.slice(0,5).map(e=>`${e[0]} --${e[2]}→ ${e[1]}`).join("\n")+`\nroute: ${s} → ${t}`); } },
  { key: "increasing-subsequence", difficulty: "hard", variants: 125, solution: python.lis,
    title: "Longest Rising Signal", topic: "binary search", context: "a sequence of signal strengths",
    statement: "Find the length of the longest strictly increasing subsequence. Chosen values must keep their original order, but need not be adjacent.",
    input_format: "Line 1: n.\nLine 2: n space-separated integers.", output_format: "Print the length of the longest strictly increasing subsequence.", constraints: "- 1 ≤ n ≤ 1,000,000.\n- -10^9 ≤ each value ≤ 10^9.",
    hints: ["Maintain the smallest ending value for each subsequence length.", "Binary search finds the length whose ending value should be replaced."],
    make(rng,v,c) { const n=8+(v+c)%20; const a=numbers(rng,n,-25,45); if(c===0)for(let i=0;i<n;i++)a[i]=i; if(c===1)for(let i=0;i<n;i++)a[i]=-i; const input=arrayInput(a); return testCase(input,lisLength(a),"The tails array stores the smallest possible ending value for each length.",`sequence: ${a.join(" ")}\nkeep order; skip any positions`); } },
  { key: "largest-histogram", difficulty: "hard", variants: 125, solution: python.histogram,
    title: "Largest Histogram Panel", topic: "monotonic stack", context: "a histogram of workload bars",
    statement: "Each histogram bar has unit width and a nonnegative height. Find the largest rectangular area that fits entirely under consecutive bars.",
    input_format: "Line 1: n.\nLine 2: n nonnegative bar heights.", output_format: "Print the maximum rectangle area.", constraints: "- 1 ≤ n ≤ 1,000,000.\n- 0 ≤ each height ≤ 10^9.",
    hints: ["For each bar, consider it as the shortest bar in a rectangle.", "A monotonic stack finds the first shorter bar on each side."],
    make(rng,v,c) { const n=5+(v+c)%20; const a=numbers(rng,n,0,25); if(c===0)a.fill(4); if(c===1)a.fill(0); const input=arrayInput(a); return testCase(input,largestRectangle(a),"A bar is popped when the next shorter height fixes its widest valid span.",`height: ${a.join(" ")}\nwidth:  ${a.map(()=>1).join(" ")}\nfind maximum area`); } },
  { key: "minimum-spanning-tree", difficulty: "hard", variants: 125, solution: python.mst,
    title: "Minimum-Cost Network", topic: "minimum spanning tree", context: "a set of campus links",
    statement: "Connect all vertices of an undirected weighted graph with minimum total edge cost and no cycles. Print -1 when the graph cannot be connected.",
    input_format: "Line 1: n and m.\nNext m lines: u, v, w for an undirected edge with cost w.", output_format: "Print the minimum spanning tree cost, or -1 when the graph is disconnected.", constraints: "- 1 ≤ n ≤ 200,000; 0 ≤ m ≤ 300,000.\n- Vertices are numbered 0 through n-1.\n- -10^9 ≤ w ≤ 10^9.",
    hints: ["Consider edges in increasing cost order.", "A disjoint-set structure detects whether an edge joins two separate components."],
    make(rng,v,c) { const n=4+(v+c)%7; const edges=[]; for(let u=0;u<n-1;u++)edges.push([u,u+1,1+int(rng,0,18)]); for(let k=0;k<n+2;k++){const u=int(rng,0,n-1),w=int(rng,0,n-1); if(u!==w)edges.push([u,w,1+int(rng,0,22)]);} if(c===4)edges.splice(0,n-1); const input=`${n} ${edges.length}\n${edges.map(e=>e.join(" ")).join("\n")}`; return testCase(input,minimumSpanningTree(n,edges),"Kruskal's algorithm adds the cheapest edge that joins two components.",edges.slice(0,6).map(e=>`${e[0]} ─${e[2]}─ ${e[1]}`).join("\n")+`\nvertices: ${n}`); } },
  { key: "maximum-flow", difficulty: "very_hard", variants: 125, solution: python.maxFlow,
    title: "Maximum Throughput Network", topic: "max flow", context: "a directed data network",
    statement: "Each directed link has an integer capacity. Compute the greatest amount of flow that can be sent from source s to sink t without exceeding any link capacity or violating flow conservation.",
    input_format: "Line 1: n and m.\nNext m lines: u, v, c for a directed edge u → v with capacity c.\nFinal line: source s and sink t.", output_format: "Print the maximum flow from s to t.", constraints: "- 2 ≤ n ≤ 50; 0 ≤ m ≤ 200.\n- Vertices are numbered 0 through n-1.\n- 0 ≤ c ≤ 10^6; s ≠ t.",
    hints: ["Find an augmenting source-to-sink path in the residual graph.", "Update forward and reverse residual capacities after each augmentation."],
    make(rng,v,c) { const n=5+(v+c)%4, s=0,t=n-1,edges=[]; for(let u=0;u<n-1;u++)edges.push([u,u+1,1+int(rng,0,9)]); for(let k=0;k<n+3;k++){const u=int(rng,0,n-2),w=int(rng,u+1,n-1); if(u!==w)edges.push([u,w,1+int(rng,0,10)]);} const input=`${n} ${edges.length}\n${edges.map(e=>e.join(" ")).join("\n")}\n${s} ${t}`; return testCase(input,maximumFlow(n,edges,s,t),"Repeated augmenting paths increase flow until no residual source-to-sink path remains.",edges.slice(0,7).map(e=>`${e[0]} ─${e[2]}→ ${e[1]}`).join("\n")+`\nsource ${s}  →  sink ${t}`); } },
  { key: "n-queens-count", difficulty: "very_hard", variants: 125, solution: python.queens,
    title: "Nonattacking Queen Layouts", topic: "backtracking", context: "a square chessboard",
    statement: "Count the distinct ways to place n queens on an n by n board so that no two queens share a row, column, or diagonal. Print the count.",
    input_format: "One line containing n, the board dimension.", output_format: "Print the number of valid queen placements.", constraints: "- 1 ≤ n ≤ 12.",
    hints: ["Place one queen in each row.", "Track used columns and both diagonal directions to prune conflicts."],
    make(rng,v,c) { const n=4+((v+c)%6); return testCase(String(n),queenCount(n),"Backtracking tries only columns that are free from column and diagonal attacks.",Array.from({length:n},(_,r)=>`${r}: ${"· ".repeat(n).trim()}`).join("\n")+`\nboard: ${n} × ${n}; one queen per row`); } },
  { key: "bipartite-matching", difficulty: "very_hard", variants: 125, solution: python.matching,
    title: "Maximum Pair Assignment", topic: "bipartite matching", context: "a set of workers and tasks",
    statement: "Workers can perform certain tasks. Each worker and each task can appear in at most one assignment. Find the maximum number of compatible worker-task pairs.",
    input_format: "Line 1: L, R, and m, the number of workers, tasks, and compatible pairs.\nNext m lines: worker index u and task index v.", output_format: "Print the maximum number of one-to-one compatible assignments.", constraints: "- 1 ≤ L, R ≤ 500; 0 ≤ m ≤ 10,000.\n- Workers are indexed 0 through L-1 and tasks 0 through R-1.",
    hints: ["Try to assign each left-side vertex to a neighbor.", "An existing assignment may be rerouted along an augmenting path."],
    make(rng,v,c) { const left=4+(v+c)%5,right=4+(v*3+c)%5,edges=[]; for(let u=0;u<left;u++)edges.push([u,(u+v+c)%right]); for(let k=0;k<left+right;k++){const u=int(rng,0,left-1),w=int(rng,0,right-1); if(!edges.some(e=>e[0]===u&&e[1]===w))edges.push([u,w]);} const input=`${left} ${right} ${edges.length}\n${edges.map(e=>e.join(" ")).join("\n")}`; return testCase(input,maxMatching(left,right,edges),"An augmenting path may reassign an earlier pair to make room for another worker.",edges.slice(0,8).map(e=>`W${e[0]} → T${e[1]}`).join("\n")+`\nworkers: ${left}  tasks: ${right}`); } },
  { key: "strong-components", difficulty: "very_hard", variants: 125, solution: python.scc,
    title: "Strongly Connected Regions", topic: "strongly connected components", context: "a directed dependency map",
    statement: "A directed edge means one component can reach another directly. Count the strongly connected components: maximal groups in which every vertex can reach every other vertex.",
    input_format: "Line 1: n and m.\nNext m lines: u and v for each directed edge u → v.", output_format: "Print the number of strongly connected components.", constraints: "- 1 ≤ n ≤ 800; 0 ≤ m ≤ 4,000.\n- Vertices are numbered 0 through n-1.",
    hints: ["Run a graph traversal to record vertices by finishing order.", "Traverse the reversed graph in decreasing finishing order."],
    make(rng,v,c) { const n=5+(v+c)%10,edges=[]; for(let u=0;u<n;u++)if((u+v+c)%3!==0)edges.push([u,(u+1)%n]); for(let k=0;k<n+3;k++){const u=int(rng,0,n-1),w=int(rng,0,n-1); if(u!==w&&!edges.some(e=>e[0]===u&&e[1]===w))edges.push([u,w]);} const input=`${n} ${edges.length}\n${edges.map(e=>e.join(" ")).join("\n")}`; return testCase(input,stronglyConnectedComponents(n,edges),"Kosaraju's two passes group vertices that can mutually reach one another.",edges.slice(0,9).map(e=>`${e[0]} → ${e[1]}`).join("\n")+`\nvertices: ${n}`); } },
];

function makeCases(family, variant) {
  const rng = random(0x9e3779b9 ^ Math.imul(variant + 1, 0x85ebca6b) ^ family.key.length);
  return Array.from({ length: 5 }, (_, caseIndex) => family.make(rng, variant, caseIndex));
}

function diagramFor(cases) { return cases[0].diagram; }

function editorialFor(family) {
  const complexity = {
    "two-sum": ["O(n)", "O(n)"], "rotate-array": ["O(n)", "O(n)"], "count-occurrences": ["O(n)", "O(1)"],
    "maximum-position": ["O(n)", "O(1)"], "reverse-sequence": ["O(n)", "O(n)"], "balanced-brackets": ["O(n)", "O(n)"],
    "range-sum": ["O(n)", "O(1)"], "digital-root": ["O(log n)", "O(1)"], "maximum-subarray": ["O(n)", "O(1)"],
    "longest-unique-window": ["O(n)", "O(k)"], "product-except-self": ["O(n)", "O(n)"], "merge-intervals": ["O(n log n)", "O(n)"],
    "minimum-coins": ["O(amount × coin types)", "O(amount)"], "daily-temperatures": ["O(n)", "O(n)"],
    "shortest-directed-path": ["O((V + E) log V)", "O(V + E)"], "increasing-subsequence": ["O(n log n)", "O(n)"],
    "largest-histogram": ["O(n)", "O(n)"], "minimum-spanning-tree": ["O(E log E)", "O(V)"],
    "maximum-flow": ["O(VE²) with Edmonds–Karp", "O(V²)"], "n-queens-count": ["O(n!) worst case", "O(n)"],
    "bipartite-matching": ["O(VE)", "O(V + E)"], "strong-components": ["O(V + E)", "O(V + E)"],
  }[family.key];
  const approach = family.editorial ?? `${family.hints[0]} ${family.hints[1]}`;
  return `### Approach\n\n${approach}\n\n### Complexity\n\n- Time: ${complexity[0]}\n- Space: ${complexity[1]}\n\nA runnable Python reference implementation is available in the solution panel.`;
}

function createProblem(family, variant, problemNumber) {
  const cases = makeCases(family, variant);
  const title = `${family.title} ${pad(variant)}`;
  const slug = `${family.key}-${pad(variant)}`;
  const examples = cases.slice(0, 2).map(({ input, output, explanation }) => ({ input, output, explanation }));
  const test_cases = cases.map((test, index) => ({
    id: stableUuid(`${slug}:case:${index + 1}`),
    input: test.input,
    expected_output: test.output,
    is_sample: index < 2,
    is_hidden: index >= 2,
    explanation: index < 2 ? test.explanation : null,
    sort_order: index + 1,
    time_limit_ms: family.difficulty === "very_hard" ? 3000 : 2000,
    memory_limit_mb: 256,
  }));
  return {
    id: stableUuid(slug), problem_number: problemNumber, title, slug, difficulty: family.difficulty,
    description: `${family.statement}\n\nThis task is framed around ${family.context}. Input limits vary across the archive; use an algorithm suitable for the stated limits.`,
    constraints: family.constraints,
    input_format: family.input_format,
    output_format: family.output_format,
    examples, hints: family.hints, editorial: editorialFor(family), starter_code: {
      python: "import sys\n\ndef solve():\n    data = sys.stdin.buffer.read().split()\n    # Parse the input and print the requested result.\n\nif __name__ == '__main__':\n    solve()\n",
    },
    solution_code: { python: `${family.solution}\n\nif __name__ == "__main__":\n import sys\n print(solve(sys.stdin.buffer.read().decode().split()))\n` },
    diagram: diagramFor(cases), topic: family.topic, tags: [{ id: `topic-${slugify(family.topic)}`, name: family.topic, slug: slugify(family.topic) }], is_published: true, is_premium: false,
    submission_count: 0, accepted_count: 0, acceptance_rate: 0,
    test_cases,
  };
}

export function buildProblemBank() {
  const staged = [];
  for (const family of families) for (let variant = 1; variant <= family.variants; variant++) staged.push({ family, variant });
  if (staged.length !== 5000) throw new Error(`Expected 5000 generated problems, got ${staged.length}`);
  const rng = random(0x50534743);
  for (let i = staged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [staged[i], staged[j]] = [staged[j], staged[i]];
  }
  return staged.map(({ family, variant }, index) => createProblem(family, variant, index + 1));
}

let cachedBank;
export function getProblemBank() {
  cachedBank ??= buildProblemBank();
  return cachedBank;
}

export const PROBLEM_TOPICS = [...new Set(families.map((family) => family.topic))].sort((a, b) => a.localeCompare(b));

function slugify(value) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
