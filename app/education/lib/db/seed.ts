import { Course, Topic, Lesson, Question, Student, TopicMastery, Assignment, StudyPlan, Recommendation } from './schema'

export const INITIAL_STUDENT: Student = {
  id: 'student_1',
  userId: 'user_1',
  name: 'Alex Rivera',
  gradeOrLevel: 'Undergraduate Computer Science & Communications',
  targetGoal: 'Master Data Structures, Algorithms & Technical Communication',
  dailyStudyMinutesGoal: 45,
  currentStreak: 6,
  totalPoints: 1250,
  preferredLearningStyle: 'visual',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString()
}

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_dsa',
    title: 'Data Structures & Algorithms Mastery',
    slug: 'data-structures-algorithms',
    category: 'Computer Science',
    level: 'INTERMEDIATE',
    description: 'Master core computer science data structures, graph traversals, dynamic programming, and recursion.',
    icon: '⚡',
    duration: '10 weeks',
    isFree: true,
    rating: 4.9,
    studentsCount: 3420,
    createdAt: new Date().toISOString()
  },
  {
    id: 'course_comm',
    title: 'Professional Communication & English',
    slug: 'professional-communication',
    category: 'Communication',
    level: 'BEGINNER',
    description: 'Enhance professional speaking, listening comprehension, grammar precision, and presentation skills.',
    icon: '🎙️',
    duration: '8 weeks',
    isFree: true,
    rating: 4.8,
    studentsCount: 2500,
    createdAt: new Date().toISOString()
  }
]

export const INITIAL_TOPICS: Topic[] = [
  // DSA topics
  {
    id: 'topic_arrays',
    courseId: 'course_dsa',
    title: 'Arrays & Memory Layout',
    slug: 'arrays',
    category: 'core',
    description: 'Contiguous memory allocations, index arithmetic, multidimensional arrays, and dynamic resizing.',
    orderIndex: 1,
    prerequisites: [],
    difficulty: 'EASY',
    x: 180,
    y: 120
  },
  {
    id: 'topic_sorting',
    courseId: 'course_dsa',
    title: 'Sorting Algorithms',
    slug: 'sorting',
    category: 'skill',
    description: 'Comparison and non-comparison sorting: MergeSort, QuickSort, HeapSort, and time complexity tradeoffs.',
    orderIndex: 2,
    prerequisites: ['topic_arrays'],
    difficulty: 'MEDIUM',
    x: 320,
    y: 100
  },
  {
    id: 'topic_stack',
    courseId: 'course_dsa',
    title: 'Stack & LIFO Structures',
    slug: 'stack',
    category: 'skill',
    description: 'Last-In-First-Out semantics, call stacks, expression evaluation, and monotonic stack patterns.',
    orderIndex: 3,
    prerequisites: ['topic_arrays'],
    difficulty: 'EASY',
    x: 200,
    y: 240
  },
  {
    id: 'topic_queue',
    courseId: 'course_dsa',
    title: 'Queue & Buffering',
    slug: 'queue',
    category: 'skill',
    description: 'First-In-First-Out queues, circular buffers, priority queues, and sliding window patterns.',
    orderIndex: 4,
    prerequisites: ['topic_arrays'],
    difficulty: 'EASY',
    x: 340,
    y: 230
  },
  {
    id: 'topic_linked_list',
    courseId: 'course_dsa',
    title: 'Linked List & Pointer Chaining',
    slug: 'linked-list',
    category: 'core',
    description: 'Singly, doubly, and circular linked lists. Pointer manipulation, fast/slow pointer cycle detection, reversing.',
    orderIndex: 5,
    prerequisites: ['topic_arrays'],
    difficulty: 'MEDIUM',
    x: 480,
    y: 160
  },
  {
    id: 'topic_recursion',
    courseId: 'course_dsa',
    title: 'Recursion & Backtracking',
    slug: 'recursion',
    category: 'skill',
    description: 'Base cases, recursive call stacks, recurrence relations, divide-and-conquer, and tree backtracks.',
    orderIndex: 6,
    prerequisites: ['topic_stack', 'topic_linked_list'],
    difficulty: 'HARD',
    x: 620,
    y: 130
  },
  {
    id: 'topic_trees',
    courseId: 'course_dsa',
    title: 'Binary Trees & BSTs',
    slug: 'trees',
    category: 'core',
    description: 'Tree traversals (in-order, pre-order, post-order, BFS), Binary Search Trees, and balancing principles.',
    orderIndex: 7,
    prerequisites: ['topic_recursion', 'topic_linked_list'],
    difficulty: 'HARD',
    x: 680,
    y: 260
  },
  // Communication topics
  {
    id: 'topic_grammar',
    courseId: 'course_comm',
    title: 'Grammar & Syntax Precision',
    slug: 'grammar',
    category: 'assessment',
    description: 'Tenses, subject-verb agreement, active vs passive voice, and clause structures in technical prose.',
    orderIndex: 8,
    prerequisites: [],
    difficulty: 'MEDIUM',
    x: 220,
    y: 360
  },
  {
    id: 'topic_speaking',
    courseId: 'course_comm',
    title: 'Technical Speaking & Articulation',
    slug: 'speaking',
    category: 'assessment',
    description: 'Structured impromptu speech, concise engineering explanations, and confident vocal delivery.',
    orderIndex: 9,
    prerequisites: ['topic_grammar'],
    difficulty: 'MEDIUM',
    x: 440,
    y: 350
  },
  {
    id: 'topic_listening',
    courseId: 'course_comm',
    title: 'Active Listening & Comprehension',
    slug: 'listening',
    category: 'assessment',
    description: 'Passage comprehension, audio cue inference, and technical lecture synthesis.',
    orderIndex: 10,
    prerequisites: [],
    difficulty: 'EASY',
    x: 640,
    y: 360
  }
]

export const INITIAL_MASTERY: TopicMastery[] = [
  {
    id: 'mastery_arrays',
    studentId: 'student_1',
    topicId: 'topic_arrays',
    masteryScore: 90,
    confidenceScore: 92,
    attemptCount: 18,
    correctCount: 16,
    incorrectCount: 2,
    lastStudiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'EASY',
    status: 'Strong',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_sorting',
    studentId: 'student_1',
    topicId: 'topic_sorting',
    masteryScore: 85,
    confidenceScore: 88,
    attemptCount: 14,
    correctCount: 12,
    incorrectCount: 2,
    lastStudiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'MEDIUM',
    status: 'Strong',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_stack',
    studentId: 'student_1',
    topicId: 'topic_stack',
    masteryScore: 76,
    confidenceScore: 78,
    attemptCount: 10,
    correctCount: 8,
    incorrectCount: 2,
    lastStudiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'MEDIUM',
    status: 'Medium',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_queue',
    studentId: 'student_1',
    topicId: 'topic_queue',
    masteryScore: 71,
    confidenceScore: 74,
    attemptCount: 9,
    correctCount: 6,
    incorrectCount: 3,
    lastStudiedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'EASY',
    status: 'Medium',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_linked_list',
    studentId: 'student_1',
    topicId: 'topic_linked_list',
    masteryScore: 42,
    confidenceScore: 45,
    attemptCount: 12,
    correctCount: 5,
    incorrectCount: 7,
    lastStudiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date().toISOString(), // Due now
    difficultyLevel: 'MEDIUM',
    status: 'Weak',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_recursion',
    studentId: 'student_1',
    topicId: 'topic_recursion',
    masteryScore: 35,
    confidenceScore: 30,
    attemptCount: 15,
    correctCount: 5,
    incorrectCount: 10,
    lastStudiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date().toISOString(), // Due now (Critical weak topic)
    difficultyLevel: 'HARD',
    status: 'Weak',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_trees',
    studentId: 'student_1',
    topicId: 'topic_trees',
    masteryScore: 20,
    confidenceScore: 20,
    attemptCount: 2,
    correctCount: 0,
    incorrectCount: 2,
    lastStudiedAt: null,
    nextRevisionAt: null,
    difficultyLevel: 'HARD',
    status: 'Not Started',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_grammar',
    studentId: 'student_1',
    topicId: 'topic_grammar',
    masteryScore: 82,
    confidenceScore: 85,
    attemptCount: 25,
    correctCount: 21,
    incorrectCount: 4,
    lastStudiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'MEDIUM',
    status: 'Strong',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_speaking',
    studentId: 'student_1',
    topicId: 'topic_speaking',
    masteryScore: 75,
    confidenceScore: 75,
    attemptCount: 8,
    correctCount: 6,
    incorrectCount: 2,
    lastStudiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'MEDIUM',
    status: 'Medium',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mastery_listening',
    studentId: 'student_1',
    topicId: 'topic_listening',
    masteryScore: 80,
    confidenceScore: 82,
    attemptCount: 16,
    correctCount: 13,
    incorrectCount: 3,
    lastStudiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextRevisionAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    difficultyLevel: 'EASY',
    status: 'Strong',
    updatedAt: new Date().toISOString()
  }
]

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson_rec_1',
    topicId: 'topic_recursion',
    title: 'Recursion Fundamentals & Base Case Anatomy',
    content: `# Understanding Recursion Fundamentals

Recursion is a programming technique where a function solves a problem by calling a smaller instance of itself.

## The Two Crucial Pillars:
1. **Base Case**: The termination condition that prevents infinite looping and stack overflow.
2. **Recursive Step**: The progression step that strictly moves the problem closer to the base case.

\`\`\`python
def factorial(n: int) -> int:
    # 1. Base Case
    if n <= 1:
        return 1
    # 2. Recursive Step
    return n * factorial(n - 1)
\`\`\`

### Common Pitfalls:
- Missing base condition leads to \`RecursionError: maximum recursion depth exceeded\`.
- Forgetting to return the recursive call result.
- State accumulation errors on the stack.
`,
    durationMinutes: 15,
    type: 'reading',
    orderIndex: 1
  },
  {
    id: 'lesson_rec_2',
    topicId: 'topic_recursion',
    title: 'Call Stack Visualization & Tree Recursion',
    content: `# Visualizing the Call Stack in Tree Recursion

When a function invokes itself multiple times per frame (e.g. Fibonacci or Tree Traversal), each invocation creates an independent stack frame.

\`\`\`python
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
\`\`\`

Each branch expands top-down until reaching the base case, then collapses bottom-up combining intermediate results.
`,
    durationMinutes: 12,
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/P0cjKUa4-1E',
    orderIndex: 2
  },
  {
    id: 'lesson_ll_1',
    topicId: 'topic_linked_list',
    title: 'Node Construction & Pointer Mechanics',
    content: `# Linked List Node Architecture

A linked list consists of independent memory nodes connected via pointer references.

\`\`\`typescript
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(val: T) {
    this.value = val;
  }
}
\`\`\`

Unlike arrays with O(1) random access, linked lists provide O(1) insertions/deletions at known positions without memory shifting.
`,
    durationMinutes: 15,
    type: 'code',
    orderIndex: 1
  }
]

export const INITIAL_QUESTIONS: Question[] = [
  // Recursion questions
  {
    id: 'q_rec_1',
    topicId: 'topic_recursion',
    type: 'mcq',
    difficulty: 'EASY',
    prompt: 'What happens if a recursive function does NOT have a valid base case?',
    options: [
      'It automatically returns 0',
      'It causes a stack overflow / maximum recursion depth error',
      'It executes in O(1) time complexity',
      'It converts into an iterative loop automatically'
    ],
    correctAnswer: 'It causes a stack overflow / maximum recursion depth error',
    explanation: 'Without a base case to terminate execution, each function call pushes a new activation frame onto the call stack until memory is exhausted.',
    hints: ['Think about what manages active function calls in memory.']
  },
  {
    id: 'q_rec_2',
    topicId: 'topic_recursion',
    type: 'mcq',
    difficulty: 'MEDIUM',
    prompt: 'What is the time complexity of the naive recursive Fibonacci implementation fib(n) = fib(n-1) + fib(n-2)?',
    options: ['O(n)', 'O(n log n)', 'O(2^n)', 'O(n^2)'],
    correctAnswer: 'O(2^n)',
    explanation: 'Each call to fib(n) branches into two subcalls, generating a binary recursion tree of depth n with roughly 2^n total operations.',
    hints: ['Draw the recursion tree for fib(4).']
  },
  {
    id: 'q_rec_3',
    topicId: 'topic_recursion',
    type: 'code',
    difficulty: 'EASY',
    prompt: 'Complete the recursive function to calculate the sum of digits of a positive integer n.',
    codeSnippet: `function sumDigits(n: number): number {
  if (n === 0) return 0;
  // Complete the recursive step:
  return (n % 10) + sumDigits(Math.floor(n / 10));
}`,
    correctAnswer: '(n % 10) + sumDigits(Math.floor(n / 10))',
    explanation: 'Taking modulo 10 extracts the last digit, while integer division by 10 strips the last digit for the recursive sub-problem.',
    hints: ['How do you extract the units digit of an integer?']
  },
  // Linked List questions
  {
    id: 'q_ll_1',
    topicId: 'topic_linked_list',
    type: 'mcq',
    difficulty: 'EASY',
    prompt: 'What is the time complexity to insert a new node at the beginning (head) of a Singly Linked List?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    correctAnswer: 'O(1)',
    explanation: 'Inserting at head only requires creating the node, setting newNode.next = head, and updating head pointer. No element shifting is needed.',
    hints: ['Does inserting at the front require traversing the rest of the list?']
  },
  {
    id: 'q_ll_2',
    topicId: 'topic_linked_list',
    type: 'mcq',
    difficulty: 'MEDIUM',
    prompt: 'Which pointer technique is optimal for detecting a cycle in a linked list in O(n) time and O(1) extra space?',
    options: [
      'Hash set of visited nodes',
      'Floyd’s Tortoise and Hare (Fast & Slow Pointers)',
      'Binary Search on node addresses',
      'Depth First Search with recursion stack'
    ],
    correctAnswer: 'Floyd’s Tortoise and Hare (Fast & Slow Pointers)',
    explanation: 'Floyds cycle-finding algorithm moves one pointer at 1 step/iteration and another at 2 steps/iteration. If a loop exists, they will meet in O(n) without auxiliary memory.',
    hints: ['Consider two runners on a circular track.']
  }
]

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    studentId: 'student_1',
    courseId: 'course_dsa',
    title: 'Recursion Call Stack & Backtracking Project',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING'
  },
  {
    id: 'asg_2',
    studentId: 'student_1',
    courseId: 'course_comm',
    title: 'Technical Presentation Video Submission',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING'
  }
]

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec_1',
    studentId: 'student_1',
    topicId: 'topic_recursion',
    topicTitle: 'Recursion & Backtracking',
    priority: 'HIGH',
    title: 'Master Recursion Fundamentals',
    reason: 'Recursion mastery is at 35% with 10 incorrect answers in recent assessments, and your project deadline is in 2 days.',
    actionType: 'QUIZ',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec_2',
    studentId: 'student_1',
    topicId: 'topic_linked_list',
    topicTitle: 'Linked List & Pointer Chaining',
    priority: 'HIGH',
    title: 'Pointer Manipulation & Reversal Practice',
    reason: 'Linked List mastery is 42%. Pointer logic mistakes were detected during quiz attempts.',
    actionType: 'LESSON',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec_3',
    studentId: 'student_1',
    topicId: 'topic_sorting',
    topicTitle: 'Sorting Algorithms',
    priority: 'MEDIUM',
    title: 'QuickSort vs MergeSort Complexity Review',
    reason: 'Spaced repetition revision is scheduled to retain 85% mastery score.',
    actionType: 'REVISION',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
]

export const INITIAL_STUDY_PLAN: StudyPlan = {
  id: 'plan_today',
  studentId: 'student_1',
  date: new Date().toISOString().split('T')[0],
  goalMinutes: 45,
  completedMinutes: 0,
  summary: 'Focus on overcoming weak areas in Recursion (35%) and Linked List (42%) with active practice and quick assessments.',
  status: 'ACTIVE',
  sessions: [
    {
      id: 'sess_1',
      studentId: 'student_1',
      topicId: 'topic_recursion',
      title: 'Recursion Fundamentals & Base Cases',
      plannedDurationMinutes: 20,
      status: 'PENDING',
      sessionType: 'LESSON',
      scheduledFor: '10:00 AM'
    },
    {
      id: 'sess_2',
      studentId: 'student_1',
      topicId: 'topic_recursion',
      title: 'Adaptive Recursion Mini-Assessment',
      plannedDurationMinutes: 15,
      status: 'PENDING',
      sessionType: 'QUIZ',
      scheduledFor: '10:25 AM'
    },
    {
      id: 'sess_3',
      studentId: 'student_1',
      topicId: 'topic_linked_list',
      title: 'Linked List Pointer Manipulation Practice',
      plannedDurationMinutes: 10,
      status: 'PENDING',
      sessionType: 'PRACTICE',
      scheduledFor: '10:45 AM'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const INITIAL_WORKFLOWS = [
  {
    id: 'wf_low_quiz_recovery',
    name: 'Low Quiz Score Recovery Loop',
    description: 'Automatically triggers when student scores < 50% on any quiz, diagnoses knowledge gap, generates recovery plan, practice questions, and notifies student.',
    trigger: 'QUIZ_COMPLETED' as const,
    isActive: true,
    nodes: [
      { id: 'node_1', type: 'TRIGGER' as const, label: 'Quiz Completed', config: {}, x: 80, y: 150 },
      { id: 'node_2', type: 'AI_EVALUATE_ANSWER' as const, label: 'Analyze Score & Mistakes', config: { threshold: 50 }, x: 280, y: 150 },
      { id: 'node_3', type: 'LOGIC_IF' as const, label: 'IF Score < 50%', config: { field: 'score', operator: '<', value: 50 }, x: 480, y: 150 },
      { id: 'node_4', type: 'AI_DETECT_WEAK_TOPIC' as const, label: 'Detect Weak Concept', config: {}, x: 680, y: 80 },
      { id: 'node_5', type: 'ACTION_UPDATE_MASTERY' as const, label: 'Update Knowledge Graph', config: {}, x: 880, y: 80 },
      { id: 'node_6', type: 'AI_GENERATE_QUIZ' as const, label: 'Generate Practice Quiz', config: { count: 3, difficulty: 'EASY' }, x: 1080, y: 80 },
      { id: 'node_7', type: 'ACTION_SCHEDULE_REVISION' as const, label: 'Schedule Next-Day Revision', config: { daysAhead: 1 }, x: 1280, y: 80 },
      { id: 'node_8', type: 'ACTION_SEND_NOTIFICATION' as const, label: 'Notify Student of Plan', config: { type: 'WARNING' }, x: 1480, y: 80 },
      { id: 'node_9', type: 'ACTION_CREATE_RECOMMENDATION' as const, label: 'Recommend Next Advanced Topic', config: {}, x: 680, y: 250 }
    ],
    connections: [
      { id: 'c1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
      { id: 'c2', sourceNodeId: 'node_2', targetNodeId: 'node_3' },
      { id: 'c3', sourceNodeId: 'node_3', targetNodeId: 'node_4', sourceHandle: 'true' },
      { id: 'c4', sourceNodeId: 'node_4', targetNodeId: 'node_5' },
      { id: 'c5', sourceNodeId: 'node_5', targetNodeId: 'node_6' },
      { id: 'c6', sourceNodeId: 'node_6', targetNodeId: 'node_7' },
      { id: 'c7', sourceNodeId: 'node_7', targetNodeId: 'node_8' },
      { id: 'c8', sourceNodeId: 'node_3', targetNodeId: 'node_9', sourceHandle: 'false' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wf_daily_login_planner',
    name: 'Daily Smart Study Planner',
    description: 'Runs on student login to assess current mastery levels, prioritize revision, and generate targeted study blocks.',
    trigger: 'STUDENT_LOGIN' as const,
    isActive: true,
    nodes: [
      { id: 'd_node_1', type: 'TRIGGER' as const, label: 'Student Login', config: {}, x: 80, y: 150 },
      { id: 'd_node_2', type: 'AI_ANALYZE_STUDENT' as const, label: 'Analyze Mastery & Streak', config: {}, x: 280, y: 150 },
      { id: 'd_node_3', type: 'AI_CREATE_STUDY_PLAN' as const, label: 'Synthesize Daily Plan', config: { goalMinutes: 45 }, x: 480, y: 150 },
      { id: 'd_node_4', type: 'ACTION_CREATE_STUDY_SESSION' as const, label: 'Populate Study Queue', config: {}, x: 680, y: 150 },
      { id: 'd_node_5', type: 'ACTION_SEND_NOTIFICATION' as const, label: 'Send Welcome Briefing', config: { type: 'INFO' }, x: 880, y: 150 }
    ],
    connections: [
      { id: 'dc1', sourceNodeId: 'd_node_1', targetNodeId: 'd_node_2' },
      { id: 'dc2', sourceNodeId: 'd_node_2', targetNodeId: 'd_node_3' },
      { id: 'dc3', sourceNodeId: 'd_node_3', targetNodeId: 'd_node_4' },
      { id: 'dc4', sourceNodeId: 'd_node_4', targetNodeId: 'd_node_5' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wf_spaced_revision',
    name: 'Spaced Repetition Automation',
    description: 'Identifies topics whose spaced-repetition window is due and triggers interactive quick-check sessions.',
    trigger: 'REVISION_DUE' as const,
    isActive: true,
    nodes: [
      { id: 'r_node_1', type: 'TRIGGER' as const, label: 'Revision Due', config: {}, x: 80, y: 150 },
      { id: 'r_node_2', type: 'AI_GENERATE_REVISION' as const, label: 'Compile Key Points', config: {}, x: 280, y: 150 },
      { id: 'r_node_3', type: 'AI_GENERATE_QUIZ' as const, label: 'Prepare Quick Test', config: { count: 3 }, x: 480, y: 150 },
      { id: 'r_node_4', type: 'ACTION_SEND_NOTIFICATION' as const, label: 'Notify Spaced Review', config: { type: 'REVISION_DUE' }, x: 680, y: 150 }
    ],
    connections: [
      { id: 'rc1', sourceNodeId: 'r_node_1', targetNodeId: 'r_node_2' },
      { id: 'rc2', sourceNodeId: 'r_node_2', targetNodeId: 'r_node_3' },
      { id: 'rc3', sourceNodeId: 'r_node_3', targetNodeId: 'r_node_4' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wf_doc_rag_pipeline',
    name: 'New Educational Material RAG Ingest',
    description: 'Triggers upon document upload, chunks content, generates vector embeddings, and builds instant assessment quiz.',
    trigger: 'NEW_DOCUMENT_UPLOADED' as const,
    isActive: true,
    nodes: [
      { id: 'doc_1', type: 'TRIGGER' as const, label: 'Document Uploaded', config: {}, x: 80, y: 150 },
      { id: 'doc_2', type: 'AI_SUMMARIZE_CONTENT' as const, label: 'Extract Key Topics & Summaries', config: {}, x: 280, y: 150 },
      { id: 'doc_3', type: 'ACTION_UPDATE_KNOWLEDGE_GRAPH' as const, label: 'Add Knowledge Chunks', config: {}, x: 480, y: 150 },
      { id: 'doc_4', type: 'AI_GENERATE_QUIZ' as const, label: 'Generate Material Quiz', config: { count: 5 }, x: 680, y: 150 }
    ],
    connections: [
      { id: 'doc_c1', sourceNodeId: 'doc_1', targetNodeId: 'doc_2' },
      { id: 'doc_c2', sourceNodeId: 'doc_2', targetNodeId: 'doc_3' },
      { id: 'doc_c3', sourceNodeId: 'doc_3', targetNodeId: 'doc_4' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]
