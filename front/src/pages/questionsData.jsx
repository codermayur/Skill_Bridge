export const questionsDatabase = {
  javascript: [
    {
      id: 1,
      title: "What is the output of this code?",
      description: "Analyze the following JavaScript code and determine its output:",
      difficulty: "easy",
      code: `console.log(typeof undefined);
console.log(typeof null);`,
      example: `// Output:
undefined
object`,
      options: [
        { id: "a", text: "undefined, undefined" },
        { id: "b", text: "undefined, object", isCorrect: true },
        { id: "c", text: "object, object" },
        { id: "d", text: "undefined, null" }
      ],
      explanation: "typeof null returns 'object' due to a historical bug in JavaScript."
    },
    {
      id: 2,
      title: "Closure Problem",
      description: "What will be printed to the console?",
      difficulty: "medium",
      code: `function outer() {
  let count = 0;
  return function() {
    count++;
    return count;
  }
}

const counter = outer();
console.log(counter());
console.log(counter());
console.log(counter());`,
      example: `// Output:
1
2
3`,
      options: [
        { id: "a", text: "1, 1, 1" },
        { id: "b", text: "1, 2, 3", isCorrect: true },
        { id: "c", text: "0, 1, 2" },
        { id: "d", text: "undefined, undefined, undefined" }
      ],
      explanation: "A closure retains access to the outer function's variables. Each call increments count."
    }
    // Add 998 more questions here following the same structure
  ],

  python: [
    {
      id: 1,
      title: "List Slicing in Python",
      description: "What is the output of this Python code?",
      difficulty: "easy",
      code: `my_list = [1, 2, 3, 4, 5]
print(my_list[1:3])
print(my_list[:2])
print(my_list[2:])`,
      example: `# Output:
[2, 3]
[1, 2]
[3, 4, 5]`,
      options: [
        { id: "a", text: "[2, 3], [1, 2], [3, 4, 5]", isCorrect: true },
        { id: "b", text: "[1, 3], [1, 2, 3], [4, 5]" },
        { id: "c", text: "[2, 4], [2, 3], [4, 5]" },
        { id: "d", text: "[3, 4], [1, 2, 3, 4], [5]" }
      ],
      explanation: "Python slicing uses start:end notation where end is exclusive."
    },
    {
      id: 2,
      title: "Dictionary Keys and Values",
      description: "What will be the output?",
      difficulty: "medium",
      code: `d = {'a': 1, 'b': 2, 'c': 3}
keys = d.keys()
d['d'] = 4
print(keys)`,
      example: `# Output:
dict_keys(['a', 'b', 'c', 'd'])`,
      options: [
        { id: "a", text: "dict_keys(['a', 'b', 'c'])" },
        { id: "b", text: "dict_keys(['a', 'b', 'c', 'd'])", isCorrect: true },
        { id: "c", text: "['a', 'b', 'c']" },
        { id: "d", text: "TypeError: 'dict_keys' object does not support item assignment" }
      ],
      explanation: "Dictionary keys() returns a view object that reflects changes to the dictionary."
    }
    // Add 998 more questions here
  ],

  java: [
    {
      id: 1,
      title: "String Comparison",
      description: "What is the output of this Java code?",
      difficulty: "easy",
      code: `String s1 = "Hello";
String s2 = new String("Hello");
System.out.println(s1 == s2);
System.out.println(s1.equals(s2));`,
      example: `// Output:
false
true`,
      options: [
        { id: "a", text: "true, true" },
        { id: "b", text: "false, false" },
        { id: "c", text: "false, true", isCorrect: true },
        { id: "d", text: "true, false" }
      ],
      explanation: "== checks reference equality, equals() checks content equality."
    },
    {
      id: 2,
      title: "Method Overloading",
      description: "Which method will be called?",
      difficulty: "medium",
      code: `class Test {
  void method(int x) { System.out.println("int"); }
  void method(double x) { System.out.println("double"); }
}
Test t = new Test();
t.method(5);`,
      example: `// Output:
int`,
      options: [
        { id: "a", text: "int", isCorrect: true },
        { id: "b", text: "double" },
        { id: "c", text: "Compilation Error" },
        { id: "d", text: "Runtime Error" }
      ],
      explanation: "Exact match with int parameter calls the int version of the method."
    }
    // Add 998 more questions here
  ],

  cpp: [
    {
      id: 1,
      title: "Pointer Arithmetic",
      description: "What is the output of this C++ code?",
      difficulty: "easy",
      code: `int arr[] = {10, 20, 30, 40};
int *ptr = arr;
cout << *ptr << " " << *(ptr + 2);`,
      example: `// Output:
10 30`,
      options: [
        { id: "a", text: "10 30", isCorrect: true },
        { id: "b", text: "10 40" },
        { id: "c", text: "20 30" },
        { id: "d", text: "10 20" }
      ],
      explanation: "ptr + 2 points to the element at index 2 (30)."
    },
    {
      id: 2,
      title: "Reference vs Pointer",
      description: "What is the difference in behavior?",
      difficulty: "medium",
      code: `int x = 5;
int &ref = x;  // reference
int *ptr = &x; // pointer
ref = 10;
*ptr = 20;
cout << x;`,
      example: `// Output:
20`,
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "10" },
        { id: "c", text: "20", isCorrect: true },
        { id: "d", text: "Compilation Error" }
      ],
      explanation: "Both reference and pointer modify the same variable x."
    }
    // Add 998 more questions here
  ],

  react: [
    {
      id: 1,
      title: "React Hooks - useState",
      description: "What will be logged to the console?",
      difficulty: "easy",
      code: `function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return <button onClick={handleClick}>{count}</button>;
}`,
      example: `// Initial render: button shows "0"
// After clicking: button shows "1", "2", "3", etc.`,
      options: [
        { id: "a", text: "Button displays 0 and updates on click", isCorrect: true },
        { id: "b", text: "Button displays undefined" },
        { id: "c", text: "TypeError: useState is not defined" },
        { id: "d", text: "Button displays 1" }
      ],
      explanation: "useState initializes count to 0 and updates it on each click."
    },
    {
      id: 2,
      title: "React useEffect Dependencies",
      description: "How many times will the effect run?",
      difficulty: "medium",
      code: `function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log("Effect ran");
  }, [count]);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}`,
      example: `// Effect runs: on mount, and whenever count changes`,
      options: [
        { id: "a", text: "Once on mount" },
        { id: "b", text: "Every render" },
        { id: "c", text: "On mount and whenever count changes", isCorrect: true },
        { id: "d", text: "Never" }
      ],
      explanation: "The dependency array [count] means the effect runs when count changes."
    }
    // Add 998 more questions here
  ],

  sql: [
    {
      id: 1,
      title: "SQL JOIN Types",
      description: "What does an INNER JOIN return?",
      difficulty: "easy",
      code: `SELECT * FROM users
INNER JOIN orders ON users.id = orders.user_id;`,
      example: `-- Returns only rows where there's a match in both tables`,
      options: [
        { id: "a", text: "All rows from both tables" },
        { id: "b", text: "Only matching rows from both tables", isCorrect: true },
        { id: "c", text: "All rows from users table" },
        { id: "d", text: "All rows from orders table" }
      ],
      explanation: "INNER JOIN returns only the rows that have matches in both tables."
    },
    {
      id: 2,
      title: "GROUP BY and HAVING",
      description: "What will this query return?",
      difficulty: "medium",
      code: `SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 5;`,
      example: `-- Returns user_ids with more than 5 orders`,
      options: [
        { id: "a", text: "All users and their order counts" },
        { id: "b", text: "Users with more than 5 orders", isCorrect: true },
        { id: "c", text: "Top 5 users" },
        { id: "d", text: "Users with exactly 5 orders" }
      ],
      explanation: "HAVING filters groups based on aggregate conditions."
    },
    {
      id: 3,
      title: "Binary Search Tree Traversal",
      description: "What is the time complexity of finding an element in a BST?",
      difficulty: "medium",
      code: `// Binary Search Tree search operation
Node search(Node root, int key) {
  if (root == null || root.data == key)
    return root;
  if (root.data > key)
    return search(root.left, key);
  return search(root.right, key);
}`,
      example: `// Time complexity: O(h) where h is height`,
      options: [
        { id: "a", text: "O(n)" },
        { id: "b", text: "O(log n) average, O(n) worst", isCorrect: true },
        { id: "c", text: "O(1)" },
        { id: "d", text: "O(n log n)" }
      ],
      explanation: "BST search is O(log n) for balanced trees, O(n) for skewed trees."
    },
    {
      id: 4,
      title: "Two Sum Problem",
      description: "What is the optimal time complexity for finding two numbers that add up to target?",
      difficulty: "medium",
      code: `// Find two numbers that sum to target
int[] twoSum(int[] nums, int target) {
  Map<Integer, Integer> map = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (map.containsKey(complement)) {
      return new int[]{map.get(complement), i};
    }
    map.put(nums[i], i);
  }
  return new int[]{};
}`,
      example: `// Time: O(n), Space: O(n)`,
      options: [
        { id: "a", text: "O(n²) time, O(1) space" },
        { id: "b", text: "O(n) time, O(n) space", isCorrect: true },
        { id: "c", text: "O(n log n) time, O(1) space" },
        { id: "d", text: "O(1) time, O(n) space" }
      ],
      explanation: "Using HashMap gives O(n) time complexity with O(n) space."
    },
    {
      id: 5,
      title: "Linked List Cycle Detection",
      description: "What algorithm is used in this code?",
      difficulty: "hard",
      code: `boolean hasCycle(ListNode head) {
  ListNode slow = head;
  ListNode fast = head;
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
  }
  return false;
}`,
      example: `// Floyd's Cycle Detection Algorithm`,
      options: [
        { id: "a", text: "Floyd's Cycle Detection (Tortoise and Hare)", isCorrect: true },
        { id: "b", text: "Breadth-First Search" },
        { id: "c", text: "Depth-First Search" },
        { id: "d", text: "Dijkstra's Algorithm" }
      ],
      explanation: "This is Floyd's cycle detection using two pointers moving at different speeds."
    }
  ],

  "dsa-java": [
    {
      id: 1,
      title: "Array Rotation",
      description: "What is the time complexity of rotating an array by k positions?",
      difficulty: "medium",
      code: `void rotate(int[] arr, int k) {
  int n = arr.length;
  k = k % n;
  reverse(arr, 0, n - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, n - 1);
}`,
      example: `// Time: O(n), Space: O(1)`,
      options: [
        { id: "a", text: "O(n) time, O(1) space", isCorrect: true },
        { id: "b", text: "O(n²) time, O(1) space" },
        { id: "c", text: "O(n) time, O(n) space" },
        { id: "d", text: "O(log n) time, O(1) space" }
      ],
      explanation: "Reversing approach gives O(n) time with O(1) extra space."
    },
    {
      id: 2,
      title: "Stack Implementation",
      description: "What is the time complexity of push and pop operations?",
      difficulty: "easy",
      code: `class Stack {
  private List<Integer> stack = new ArrayList<>();
  
  void push(int x) {
    stack.add(x);
  }
  
  int pop() {
    return stack.remove(stack.size() - 1);
  }
}`,
      example: `// Push: O(1) amortized, Pop: O(1)`,
      options: [
        { id: "a", text: "Both O(1) amortized", isCorrect: true },
        { id: "b", text: "Both O(n)" },
        { id: "c", text: "Push O(n), Pop O(1)" },
        { id: "d", text: "Both O(log n)" }
      ],
      explanation: "ArrayList operations are O(1) amortized for add/remove at end."
    },
    {
      id: 3,
      title: "Merge Sort Complexity",
      description: "What is the space complexity of merge sort?",
      difficulty: "medium",
      code: `void mergeSort(int[] arr, int left, int right) {
  if (left < right) {
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
}`,
      example: `// Time: O(n log n), Space: O(n)`,
      options: [
        { id: "a", text: "O(n)", isCorrect: true },
        { id: "b", text: "O(1)" },
        { id: "c", text: "O(log n)" },
        { id: "d", text: "O(n²)" }
      ],
      explanation: "Merge sort requires O(n) extra space for merging arrays."
    },
    {
      id: 4,
      title: "Graph BFS",
      description: "What data structure is used in BFS?",
      difficulty: "easy",
      code: `void bfs(Node start) {
  Queue<Node> queue = new LinkedList<>();
  Set<Node> visited = new HashSet<>();
  queue.add(start);
  visited.add(start);
  
  while (!queue.isEmpty()) {
    Node current = queue.poll();
    for (Node neighbor : current.neighbors) {
      if (!visited.contains(neighbor)) {
        visited.add(neighbor);
        queue.add(neighbor);
      }
    }
  }
}`,
      example: `// Uses Queue (FIFO)`,
      options: [
        { id: "a", text: "Queue", isCorrect: true },
        { id: "b", text: "Stack" },
        { id: "c", text: "Priority Queue" },
        { id: "d", text: "Set" }
      ],
      explanation: "BFS uses Queue (FIFO) to process nodes level by level."
    },
    {
      id: 5,
      title: "Dynamic Programming - Fibonacci",
      description: "What is the optimized time complexity?",
      difficulty: "medium",
      code: `int fib(int n) {
  if (n <= 1) return n;
  int prev = 0, curr = 1;
  for (int i = 2; i <= n; i++) {
    int next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
      example: `// Time: O(n), Space: O(1)`,
      options: [
        { id: "a", text: "O(n) time, O(1) space", isCorrect: true },
        { id: "b", text: "O(2^n) time, O(1) space" },
        { id: "c", text: "O(n) time, O(n) space" },
        { id: "d", text: "O(log n) time, O(1) space" }
      ],
      explanation: "Iterative approach gives O(n) time with O(1) space."
    }
  ],

  "dsa-python": [
    {
      id: 1,
      title: "List Comprehension vs Loop",
      description: "Which is more Pythonic and efficient?",
      difficulty: "easy",
      code: `# Option A: List comprehension
squares = [x**2 for x in range(10)]

# Option B: Loop
squares = []
for x in range(10):
    squares.append(x**2)`,
      example: `# List comprehension is preferred`,
      options: [
        { id: "a", text: "List comprehension - more Pythonic and faster", isCorrect: true },
        { id: "b", text: "Loop - more readable" },
        { id: "c", text: "Both are equivalent" },
        { id: "d", text: "Loop - more efficient" }
      ],
      explanation: "List comprehensions are more Pythonic and slightly faster."
    },
    {
      id: 2,
      title: "Dictionary vs List Lookup",
      description: "What is the time complexity of dictionary lookup?",
      difficulty: "easy",
      code: `# Dictionary lookup
d = {'a': 1, 'b': 2, 'c': 3}
value = d['b']  # O(?)

# List lookup
lst = [1, 2, 3]
index = lst.index(2)  # O(?)`,
      example: `# Dict: O(1), List: O(n)`,
      options: [
        { id: "a", text: "Dict: O(1), List: O(n)", isCorrect: true },
        { id: "b", text: "Both O(1)" },
        { id: "c", text: "Both O(n)" },
        { id: "d", text: "Dict: O(n), List: O(1)" }
      ],
      explanation: "Dictionary uses hash table for O(1) lookup, list requires O(n) search."
    },
    {
      id: 3,
      title: "Heap Operations",
      description: "What is the time complexity of heap operations?",
      difficulty: "medium",
      code: `import heapq

heap = []
heapq.heappush(heap, 5)  # O(?)
heapq.heappop(heap)      # O(?)`,
      example: `# Push: O(log n), Pop: O(log n)`,
      options: [
        { id: "a", text: "Push: O(log n), Pop: O(log n)", isCorrect: true },
        { id: "b", text: "Both O(1)" },
        { id: "c", text: "Both O(n)" },
        { id: "d", text: "Push: O(n), Pop: O(1)" }
      ],
      explanation: "Heap operations maintain heap property in O(log n) time."
    },
    {
      id: 4,
      title: "Set Operations",
      description: "What is the time complexity of set intersection?",
      difficulty: "medium",
      code: `set1 = {1, 2, 3, 4, 5}
set2 = {4, 5, 6, 7, 8}
result = set1 & set2  # O(?)`,
      example: `# O(min(len(set1), len(set2)))`,
      options: [
        { id: "a", text: "O(min(len(set1), len(set2)))", isCorrect: true },
        { id: "b", text: "O(len(set1) + len(set2))" },
        { id: "c", text: "O(len(set1) * len(set2))" },
        { id: "d", text: "O(1)" }
      ],
      explanation: "Set intersection iterates through smaller set, checking membership in larger set."
    },
    {
      id: 5,
      title: "Recursion vs Iteration",
      description: "What is the space complexity of recursive factorial?",
      difficulty: "easy",
      code: `def factorial_recursive(n):
    if n <= 1:
        return 1
    return n * factorial_recursive(n - 1)

def factorial_iterative(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result`,
      example: `# Recursive: O(n) space, Iterative: O(1) space`,
      options: [
        { id: "a", text: "Recursive: O(n), Iterative: O(1)", isCorrect: true },
        { id: "b", text: "Both O(1)" },
        { id: "c", text: "Both O(n)" },
        { id: "d", text: "Recursive: O(1), Iterative: O(n)" }
      ],
      explanation: "Recursion uses call stack (O(n) space), iteration uses constant space."
    }
  ],

  "dsa-cpp": [
    {
      id: 1,
      title: "STL Vector vs Array",
      description: "What is the advantage of std::vector?",
      difficulty: "easy",
      code: `// Dynamic array
std::vector<int> vec;
vec.push_back(10);  // Automatically resizes

// Static array
int arr[10];  // Fixed size`,
      example: `// Vector: Dynamic size, Array: Fixed size`,
      options: [
        { id: "a", text: "Vector: Dynamic size, automatic memory management", isCorrect: true },
        { id: "b", text: "Array: Faster access" },
        { id: "c", text: "Both are identical" },
        { id: "d", text: "Array: More memory efficient" }
      ],
      explanation: "Vector provides dynamic sizing and automatic memory management."
    },
    {
      id: 2,
      title: "STL Map vs Unordered Map",
      description: "What is the difference?",
      difficulty: "medium",
      code: `// Ordered map (BST)
std::map<int, string> ordered;
ordered[5] = "five";  // O(log n)

// Unordered map (Hash table)
std::unordered_map<int, string> unordered;
unordered[5] = "five";  // O(1) average`,
      example: `// Map: Ordered, O(log n). Unordered_map: O(1) average`,
      options: [
        { id: "a", text: "Map: Ordered O(log n), Unordered_map: O(1) average", isCorrect: true },
        { id: "b", text: "Both are identical" },
        { id: "c", text: "Map: O(1), Unordered_map: O(log n)" },
        { id: "d", text: "Both O(1)" }
      ],
      explanation: "Map uses BST (ordered, O(log n)), unordered_map uses hash table (O(1) average)."
    },
    {
      id: 3,
      title: "Smart Pointers",
      description: "What does unique_ptr provide?",
      difficulty: "medium",
      code: `std::unique_ptr<int> ptr = std::make_unique<int>(42);
// Automatic memory management
// Only one owner`,
      example: `// Automatic deletion, single ownership`,
      options: [
        { id: "a", text: "Automatic memory management, single ownership", isCorrect: true },
        { id: "b", text: "Shared ownership" },
        { id: "c", text: "Manual memory management" },
        { id: "d", text: "No memory management" }
      ],
      explanation: "unique_ptr provides RAII with automatic deletion and exclusive ownership."
    },
    {
      id: 4,
      title: "STL Algorithm - Sort",
      description: "What is the time complexity of std::sort?",
      difficulty: "easy",
      code: `std::vector<int> vec = {5, 2, 8, 1, 9};
std::sort(vec.begin(), vec.end());  // O(?)`,
      example: `// O(n log n)`,
      options: [
        { id: "a", text: "O(n log n)", isCorrect: true },
        { id: "b", text: "O(n²)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(log n)" }
      ],
      explanation: "std::sort uses introsort, which is O(n log n) on average."
    },
    {
      id: 5,
      title: "Move Semantics",
      description: "What does std::move do?",
      difficulty: "hard",
      code: `std::vector<int> vec1 = {1, 2, 3};
std::vector<int> vec2 = std::move(vec1);
// vec1 is now empty, vec2 owns the data`,
      example: `// Transfers ownership without copying`,
      options: [
        { id: "a", text: "Transfers ownership without copying", isCorrect: true },
        { id: "b", text: "Copies the data" },
        { id: "c", text: "Shares the data" },
        { id: "d", text: "Deletes the data" }
      ],
      explanation: "std::move transfers ownership efficiently without deep copying."
    }
  ],

  "machine-learning": [
    {
      id: 1,
      title: "Overfitting",
      description: "What is overfitting?",
      difficulty: "easy",
      code: `# Model performs well on training data
# but poorly on test data
train_accuracy = 0.99
test_accuracy = 0.65`,
      example: `# High training accuracy, low test accuracy`,
      options: [
        { id: "a", text: "Model memorizes training data, fails on new data", isCorrect: true },
        { id: "b", text: "Model performs well on both" },
        { id: "c", text: "Model performs poorly on both" },
        { id: "d", text: "Model generalizes well" }
      ],
      explanation: "Overfitting occurs when model learns training data too well and fails to generalize."
    },
    {
      id: 2,
      title: "Bias-Variance Tradeoff",
      description: "What does high bias indicate?",
      difficulty: "medium",
      code: `# High bias: Underfitting
# Model is too simple
# Can't capture patterns`,
      example: `# Underfitting: High bias, low variance`,
      options: [
        { id: "a", text: "Model is too simple, underfitting", isCorrect: true },
        { id: "b", text: "Model is too complex, overfitting" },
        { id: "c", text: "Perfect model" },
        { id: "d", text: "High variance" }
      ],
      explanation: "High bias means model is too simple and underfits the data."
    },
    {
      id: 3,
      title: "Cross-Validation",
      description: "What is k-fold cross-validation?",
      difficulty: "medium",
      code: `from sklearn.model_selection import KFold
kf = KFold(n_splits=5)
# Split data into 5 folds
# Train on 4, test on 1, repeat 5 times`,
      example: `# Divides data into k folds, trains k times`,
      options: [
        { id: "a", text: "Divides data into k folds, trains k times", isCorrect: true },
        { id: "b", text: "Uses all data for training" },
        { id: "c", text: "Single train-test split" },
        { id: "d", text: "Only uses test data" }
      ],
      explanation: "K-fold CV splits data into k parts, trains k times using different folds for testing."
    },
    {
      id: 4,
      title: "Gradient Descent",
      description: "What is the learning rate?",
      difficulty: "medium",
      code: `# Update weights
w = w - learning_rate * gradient
# learning_rate controls step size`,
      example: `# Controls how big steps we take`,
      options: [
        { id: "a", text: "Controls step size in optimization", isCorrect: true },
        { id: "b", text: "Number of iterations" },
        { id: "c", text: "Number of features" },
        { id: "d", text: "Number of samples" }
      ],
      explanation: "Learning rate determines the step size when updating model parameters."
    },
    {
      id: 5,
      title: "Regularization",
      description: "What does L2 regularization do?",
      difficulty: "medium",
      code: `# L2 Regularization (Ridge)
loss = mse_loss + lambda * sum(weights^2)
# Penalizes large weights`,
      example: `# Adds penalty for large weights`,
      options: [
        { id: "a", text: "Penalizes large weights to prevent overfitting", isCorrect: true },
        { id: "b", text: "Increases model complexity" },
        { id: "c", text: "Removes features" },
        { id: "d", text: "Increases bias" }
      ],
      explanation: "L2 regularization adds penalty for large weights, helping prevent overfitting."
    }
  ],

  "data-analytics": [
    {
      id: 1,
      title: "Pandas DataFrame Operations",
      description: "What does groupby do?",
      difficulty: "easy",
      code: `import pandas as pd
df.groupby('category').mean()
# Groups data by category column`,
      example: `# Groups rows by category, applies function`,
      options: [
        { id: "a", text: "Groups rows by column values, applies aggregation", isCorrect: true },
        { id: "b", text: "Sorts the dataframe" },
        { id: "c", text: "Filters the dataframe" },
        { id: "d", text: "Merges dataframes" }
      ],
      explanation: "groupby splits data into groups based on column values and applies functions."
    },
    {
      id: 2,
      title: "Missing Data Handling",
      description: "What does dropna() do?",
      difficulty: "easy",
      code: `df.dropna()  # Removes rows with NaN
df.fillna(0)  # Fills NaN with 0`,
      example: `# Removes or fills missing values`,
      options: [
        { id: "a", text: "Removes rows/columns with missing values", isCorrect: true },
        { id: "b", text: "Adds missing values" },
        { id: "c", text: "Sorts by missing values" },
        { id: "d", text: "Groups by missing values" }
      ],
      explanation: "dropna() removes rows or columns containing missing values."
    },
    {
      id: 3,
      title: "SQL Aggregation",
      description: "What does COUNT(*) return?",
      difficulty: "easy",
      code: `SELECT COUNT(*) FROM users;
# Returns total number of rows`,
      example: `# Returns total row count`,
      options: [
        { id: "a", text: "Total number of rows including NULLs", isCorrect: true },
        { id: "b", text: "Number of non-NULL values" },
        { id: "c", text: "Number of unique values" },
        { id: "d", text: "Sum of values" }
      ],
      explanation: "COUNT(*) returns total rows including those with NULL values."
    },
    {
      id: 4,
      title: "Data Visualization",
      description: "When to use histogram vs bar chart?",
      difficulty: "medium",
      code: `# Histogram: Continuous data
plt.hist(data, bins=20)

# Bar chart: Categorical data
plt.bar(categories, values)`,
      example: `# Histogram: Continuous, Bar: Categorical`,
      options: [
        { id: "a", text: "Histogram: Continuous, Bar: Categorical", isCorrect: true },
        { id: "b", text: "Both for continuous" },
        { id: "c", text: "Both for categorical" },
        { id: "d", text: "Histogram: Categorical, Bar: Continuous" }
      ],
      explanation: "Histograms show distribution of continuous data, bar charts compare categories."
    },
    {
      id: 5,
      title: "Correlation vs Causation",
      description: "What is the key difference?",
      difficulty: "medium",
      code: `# Correlation: Variables change together
correlation = df['x'].corr(df['y'])

# Causation: One causes the other
# Requires controlled experiments`,
      example: `# Correlation ≠ Causation`,
      options: [
        { id: "a", text: "Correlation shows relationship, causation requires proof", isCorrect: true },
        { id: "b", text: "They are the same" },
        { id: "c", text: "Correlation always implies causation" },
        { id: "d", text: "Causation is easier to prove" }
      ],
      explanation: "Correlation indicates relationship, but causation requires evidence of cause-effect."
    }
  ]
};

/**
 * IMPORTANT: This file contains template questions. To expand to 1000 questions per language:
 * 
 * 1. Copy the structure of the existing questions
 * 2. Increment the id field for each new question
 * 3. Add unique question titles and descriptions
 * 4. Update the code/example sections
 * 5. Ensure exactly one option has isCorrect: true
 * 6. Add explanations for each question
 * 
 * Total needed: 998 more questions per language (2 are already provided)
 * 
 * Example structure for new questions:
 * {
 *   id: 3,
 *   title: "Question Title",
 *   description: "Question Description",
 *   difficulty: "easy" | "medium" | "hard",
 *   code: "code snippet here",
 *   example: "expected output",
 *   options: [
 *     { id: "a", text: "Option 1" },
 *     { id: "b", text: "Option 2", isCorrect: true },
 *     { id: "c", text: "Option 3" },
 *     { id: "d", text: "Option 4" }
 *   ],
 *   explanation: "Why this answer is correct"
 * }
 */

export const getRandomQuestions = (language, count = 10) => {
  const allQuestions = questionsDatabase[language] || [];
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getQuestionsByDifficulty = (language, difficulty, count = 10) => {
  const allQuestions = questionsDatabase[language] || [];
  const filtered = allQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};