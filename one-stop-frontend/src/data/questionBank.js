// Question Bank — difficulty 1 (easiest) to 5 (hardest)
// Topics: DSA, OOP, OS, DBMS, Networks, Python, Web, Math

export const questionBank = [
  // ── PYTHON ──────────────────────────────────────────────────────
  { id: 'py1', topic: 'Python', difficulty: 1, question: 'What keyword is used to define a function in Python?', options: ['func', 'def', 'define', 'function'], answer: 1 },
  { id: 'py2', topic: 'Python', difficulty: 1, question: 'Which of the following is a mutable data type in Python?', options: ['tuple', 'string', 'list', 'int'], answer: 2 },
  { id: 'py3', topic: 'Python', difficulty: 2, question: 'What is the output of list(range(2, 10, 3))?', options: ['[2, 5, 8]', '[2, 4, 6, 8]', '[3, 6, 9]', '[2, 3, 4]'], answer: 0 },
  { id: 'py4', topic: 'Python', difficulty: 2, question: 'Which method removes and returns the last element of a list?', options: ['remove()', 'pop()', 'delete()', 'discard()'], answer: 1 },
  { id: 'py5', topic: 'Python', difficulty: 3, question: 'What does the `@staticmethod` decorator do in Python?', options: ['Makes method private', 'Creates class-level method without cls', 'Makes method static with no self or cls', 'Enforces type checking'], answer: 2 },
  { id: 'py6', topic: 'Python', difficulty: 3, question: 'What is a generator in Python?', options: ['A function that returns a list', 'A function using yield that produces values lazily', 'A class that creates objects', 'A module for random numbers'], answer: 1 },
  { id: 'py7', topic: 'Python', difficulty: 4, question: 'What is the time complexity of dictionary lookup in Python on average?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2 },
  { id: 'py8', topic: 'Python', difficulty: 5, question: 'Which Python mechanism allows you to intercept attribute access on an object?', options: ['__repr__', '__slots__', '__getattr__', '__init__'], answer: 2 },

  // ── DATA STRUCTURES & ALGORITHMS ────────────────────────────────
  { id: 'dsa1', topic: 'DSA', difficulty: 1, question: 'What data structure operates on LIFO (Last In First Out) principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1 },
  { id: 'dsa2', topic: 'DSA', difficulty: 1, question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], answer: 2 },
  { id: 'dsa3', topic: 'DSA', difficulty: 2, question: 'Which sorting algorithm has O(n log n) average time complexity?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], answer: 2 },
  { id: 'dsa4', topic: 'DSA', difficulty: 2, question: 'What is the height of a balanced binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
  { id: 'dsa5', topic: 'DSA', difficulty: 3, question: 'In Dijkstra\'s algorithm, what data structure is typically used to find the minimum distance node efficiently?', options: ['Stack', 'Queue', 'Min-Heap / Priority Queue', 'Hash Map'], answer: 2 },
  { id: 'dsa6', topic: 'DSA', difficulty: 3, question: 'What is the worst-case time complexity of QuickSort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 2 },
  { id: 'dsa7', topic: 'DSA', difficulty: 4, question: 'Which technique does Dynamic Programming use to solve problems efficiently?', options: ['Greedy selection', 'Dividing into halves', 'Memoization / Tabulation of subproblems', 'Backtracking all paths'], answer: 2 },
  { id: 'dsa8', topic: 'DSA', difficulty: 4, question: 'What is the space complexity of Merge Sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2 },
  { id: 'dsa9', topic: 'DSA', difficulty: 5, question: 'What does the Knuth-Morris-Pratt (KMP) algorithm improve over naive string matching?', options: ['Space complexity from O(n) to O(1)', 'Time complexity from O(nm) to O(n+m)', 'It handles Unicode strings', 'It uses divide and conquer'], answer: 1 },
  { id: 'dsa10', topic: 'DSA', difficulty: 5, question: 'In a B-Tree of order m, what is the maximum number of keys in a node?', options: ['m', 'm-1', 'm+1', '2m'], answer: 1 },

  // ── OOP ─────────────────────────────────────────────────────────
  { id: 'oop1', topic: 'OOP', difficulty: 1, question: 'Which OOP concept allows a class to inherit properties from another class?', options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction'], answer: 2 },
  { id: 'oop2', topic: 'OOP', difficulty: 1, question: 'What is encapsulation in OOP?', options: ['Hiding internal implementation details', 'Creating multiple objects', 'Deriving new classes', 'Overloading functions'], answer: 0 },
  { id: 'oop3', topic: 'OOP', difficulty: 2, question: 'What is method overriding?', options: ['Defining multiple methods with same name but different params', 'Redefining a parent class method in the child class', 'Making a method private', 'Calling a method inside another'], answer: 1 },
  { id: 'oop4', topic: 'OOP', difficulty: 2, question: 'Which keyword is used to prevent a class from being inherited in Java?', options: ['static', 'abstract', 'final', 'private'], answer: 2 },
  { id: 'oop5', topic: 'OOP', difficulty: 3, question: 'What design pattern ensures only one instance of a class exists?', options: ['Factory', 'Observer', 'Singleton', 'Decorator'], answer: 2 },
  { id: 'oop6', topic: 'OOP', difficulty: 4, question: 'What is the Liskov Substitution Principle (LSP)?', options: ['Classes should have one responsibility', 'Subclasses must be substitutable for their parent class', 'Code should be open for extension, closed for modification', 'Depend on abstractions, not concretions'], answer: 1 },
  { id: 'oop7', topic: 'OOP', difficulty: 5, question: 'What is the diamond problem in multiple inheritance?', options: ['Memory leak caused by circular references', 'Ambiguity when two parent classes define the same method', 'Stack overflow from deep recursion', 'Null pointer in polymorphic calls'], answer: 1 },

  // ── OPERATING SYSTEMS ─────────────────────────────────────────
  { id: 'os1', topic: 'OS', difficulty: 1, question: 'What is a process?', options: ['A program stored on disk', 'A program in execution', 'A thread of execution', 'A file in memory'], answer: 1 },
  { id: 'os2', topic: 'OS', difficulty: 2, question: 'What scheduling algorithm gives CPU to the process with the shortest burst time?', options: ['FCFS', 'Round Robin', 'SJF', 'Priority'], answer: 2 },
  { id: 'os3', topic: 'OS', difficulty: 2, question: 'What is a deadlock?', options: ['A process using 100% CPU', 'A circular wait among processes holding and requesting resources', 'A memory overflow condition', 'A process blocked in I/O'], answer: 1 },
  { id: 'os4', topic: 'OS', difficulty: 3, question: 'Which page replacement algorithm has the lowest page fault rate theoretically?', options: ['FIFO', 'LRU', 'Optimal', 'Clock'], answer: 2 },
  { id: 'os5', topic: 'OS', difficulty: 4, question: 'What is thrashing in an OS context?', options: ['CPU spending more time swapping pages than executing processes', 'Hard disk data corruption', 'Cache miss rate exceeding 80%', 'Kernel panic from driver fault'], answer: 0 },
  { id: 'os6', topic: 'OS', difficulty: 5, question: 'What is the difference between mutex and semaphore?', options: ['Both are identical in behavior', 'Mutex is for memory; semaphore is for CPU', 'Mutex has ownership; semaphore is a signaling mechanism without ownership', 'Semaphore is faster than mutex'], answer: 2 },

  // ── DBMS ──────────────────────────────────────────────────────
  { id: 'db1', topic: 'DBMS', difficulty: 1, question: 'What does SQL stand for?', options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Logic', 'System Query Layer'], answer: 1 },
  { id: 'db2', topic: 'DBMS', difficulty: 1, question: 'Which SQL command retrieves data from a table?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 2 },
  { id: 'db3', topic: 'DBMS', difficulty: 2, question: 'What is a primary key?', options: ['A key that references another table', 'A unique identifier for each row in a table', 'A key used for sorting', 'A composite of two foreign keys'], answer: 1 },
  { id: 'db4', topic: 'DBMS', difficulty: 2, question: 'What is normalization in databases?', options: ['Removing duplicate rows', 'Organizing data to reduce redundancy and improve integrity', 'Indexing all columns', 'Compressing database files'], answer: 1 },
  { id: 'db5', topic: 'DBMS', difficulty: 3, question: 'In which normal form are all transitive dependencies removed?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 2 },
  { id: 'db6', topic: 'DBMS', difficulty: 4, question: 'What is the ACID property "Isolation" in database transactions?', options: ['Transaction is permanent after commit', 'Either all or none of a transaction executes', 'Concurrent transactions do not interfere with each other', 'Database remains consistent before and after'], answer: 2 },
  { id: 'db7', topic: 'DBMS', difficulty: 5, question: 'What is a phantom read in database concurrency?', options: ['Reading uncommitted data from another transaction', 'Getting different values for the same read in one transaction', 'A new row appears in repeated queries within the same transaction', 'Reading deleted data from cache'], answer: 2 },

  // ── COMPUTER NETWORKS ─────────────────────────────────────────
  { id: 'net1', topic: 'Networks', difficulty: 1, question: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'High Transfer Text Program', 'Hyper Terminal Text Process', 'Host Transfer Text Protocol'], answer: 0 },
  { id: 'net2', topic: 'Networks', difficulty: 2, question: 'Which layer of the OSI model is responsible for routing?', options: ['Data Link', 'Transport', 'Network', 'Application'], answer: 2 },
  { id: 'net3', topic: 'Networks', difficulty: 2, question: 'What protocol assigns IP addresses dynamically?', options: ['DNS', 'FTP', 'DHCP', 'SMTP'], answer: 2 },
  { id: 'net4', topic: 'Networks', difficulty: 3, question: 'What is the difference between TCP and UDP?', options: ['TCP is faster; UDP is reliable', 'TCP is connection-oriented and reliable; UDP is connectionless and faster', 'UDP supports encryption; TCP does not', 'Both are identical in speed and reliability'], answer: 1 },
  { id: 'net5', topic: 'Networks', difficulty: 4, question: 'What is the purpose of subnetting?', options: ['Increasing bandwidth', 'Dividing a network into smaller sub-networks for efficiency and security', 'Encryption of network traffic', 'Routing through the internet'], answer: 1 },
  { id: 'net6', topic: 'Networks', difficulty: 5, question: 'What is the BGP protocol used for?', options: ['Internal routing within an AS', 'Routing between autonomous systems on the internet', 'Assigning MAC addresses', 'DNS resolution'], answer: 1 },

  // ── WEB DEVELOPMENT ───────────────────────────────────────────
  { id: 'web1', topic: 'Web Dev', difficulty: 1, question: 'Which HTML tag is used to create a hyperlink?', options: ['<link>', '<a>', '<href>', '<url>'], answer: 1 },
  { id: 'web2', topic: 'Web Dev', difficulty: 1, question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Syntax'], answer: 1 },
  { id: 'web3', topic: 'Web Dev', difficulty: 2, question: 'What is the difference between `==` and `===` in JavaScript?', options: ['Both are identical', '== compares value; === compares value and type', '=== is assignment; == is comparison', '== is for strings; === is for numbers'], answer: 1 },
  { id: 'web4', topic: 'Web Dev', difficulty: 2, question: 'What is a REST API?', options: ['A database schema design', 'An architectural style for networked applications using HTTP methods', 'A JavaScript library', 'A CSS framework'], answer: 1 },
  { id: 'web5', topic: 'Web Dev', difficulty: 3, question: 'What is the Virtual DOM in React?', options: ['A JavaScript engine', 'A lightweight in-memory representation of the real DOM for efficient updates', 'A browser extension', 'A server-side rendering technique'], answer: 1 },
  { id: 'web6', topic: 'Web Dev', difficulty: 3, question: 'What does CORS stand for and why does it matter?', options: ['Cross-Origin Resource Sharing — controls which domains can access your API', 'Cached Object Response System — speeds up page loads', 'Client-Oriented Rendering System — for SSR apps', 'Code Object Runtime Schema — for API versioning'], answer: 0 },
  { id: 'web7', topic: 'Web Dev', difficulty: 4, question: 'What is the difference between `localStorage` and `sessionStorage`?', options: ['localStorage is faster', 'localStorage persists across sessions; sessionStorage clears when tab closes', 'sessionStorage supports 50MB; localStorage only 5MB', 'They are identical in behavior'], answer: 1 },
  { id: 'web8', topic: 'Web Dev', difficulty: 5, question: 'What is the time complexity concern with React\'s reconciliation algorithm?', options: ['O(n³) in all cases', 'O(n) with heuristic assumptions (same type = same subtree)', 'O(log n) using internal binary tree', 'O(1) due to virtual DOM caching'], answer: 1 },

  // ── MATH ──────────────────────────────────────────────────────
  { id: 'math1', topic: 'Math', difficulty: 1, question: 'What is Big-O notation used to express?', options: ['Memory size of a program', 'The upper bound of an algorithm\'s time/space complexity', 'Programming language performance', 'Database query speed'], answer: 1 },
  { id: 'math2', topic: 'Math', difficulty: 2, question: 'What is the result of log₂(1024)?', options: ['8', '10', '12', '16'], answer: 1 },
  { id: 'math3', topic: 'Math', difficulty: 3, question: 'In graph theory, what is a spanning tree?', options: ['A tree containing all nodes with minimum edges (no cycles)', 'A tree with maximum edges', 'A directed graph with no back edges', 'A weighted path between two nodes'], answer: 0 },
  { id: 'math4', topic: 'Math', difficulty: 4, question: 'What is the principle of mathematical induction used to prove?', options: ['Properties that hold for all positive integers', 'Properties of real numbers only', 'Convergence of series', 'Matrix determinants'], answer: 0 },
  { id: 'math5', topic: 'Math', difficulty: 5, question: 'In probability, what is the Bayes\' theorem used for?', options: ['Calculating mean and variance', 'Updating prior probability with new evidence', 'Permutations and combinations', 'Deriving the normal distribution'], answer: 1 },
];

// All unique topics
export const allTopics = [...new Set(questionBank.map(q => q.topic))];

// Get questions for a topic filtered by difficulty
export function getQuestionsForTopic(topic, difficulty) {
  return questionBank.filter(q => q.topic === topic && q.difficulty === difficulty);
}

// Get a question by difficulty (used in adaptive quiz)
export function getNextQuestion(topic, difficulty, usedIds = []) {
  const pool = questionBank.filter(
    q => q.topic === topic && q.difficulty === difficulty && !usedIds.includes(q.id)
  );
  if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
  // fallback: any from topic
  const fallback = questionBank.filter(q => q.topic === topic && !usedIds.includes(q.id));
  return fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : null;
}
