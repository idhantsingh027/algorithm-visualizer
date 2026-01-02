# 📊 Algorithm Visualizer

A modern, interactive algorithm visualizer built with React that helps you understand sorting algorithms and data structures through step-by-step visual demonstrations and code highlighting.

## 🚀 Features

- **Interactive Visualization**: Watch algorithms execute in real-time with color-coded array elements
- **Line-by-Line Code Tracking**: Follow along with highlighted code as the algorithm runs
- **Multi-Language Support**: View algorithm implementations in Python, C, and C++
- **Custom Input**: Enter your own array values to visualize
- **Adjustable Speed**: Control animation speed from 100ms to 2000ms
- **Professional UI**: Modern dark theme with smooth animations and hover effects

## ⚙️ Algorithms & Data Structures

### Sorting Algorithms:
- **Selection Sort** - O(N²) time, O(1) space - Finds minimum element and moves it to sorted position
- **Bubble Sort** - O(N²) time, O(1) space - Repeatedly swaps adjacent elements if they're in wrong order
- **Insertion Sort** - O(N²) time, O(1) space - Builds sorted array one element at a time
- **Merge Sort** - O(N log N) time, O(N) space - Divide and conquer sorting with merging
- **Quick Sort** - O(N log N) time, O(log N) space - Partitions array around pivot element
- **Heap Sort** - O(N log N) time, O(1) space - Builds a max-heap and extracts elements to sort

### Data Structures:
- **Singly Linked List** - Linear data structure with 8 operations:
  - Insert at Beginning - O(1)
  - Insert at End - O(1)
  - Insert at Position - O(n)
  - Delete from Beginning - O(1)
  - Delete from End - O(n)
  - Delete at Position - O(n)
  - Traverse - O(n)
  - Search - O(n)
 
- **Doubly Linked List** - Each node points to both previous and next:
  - Insert at Beginning/End - O(1)
  - Insert/Delete at Position - O(n)
  - Traverse/Search - O(n)

- **Circular Singly Linked List** - Tail points back to head (circular):
  - Insert at Beginning/End - O(1)
  - Insert/Delete at Position - O(n)
  - Delete from End - O(n)
  - Traverse/Search - O(n)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/idhantsingh027/algorithm-visualizer.git
cd algorithm-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Usage

1. **Select an Algorithm**: Click on an algorithm card from the home page
2. **Enter Custom Array**: Input comma-separated numbers
3. **Adjust Speed**: Use the slider to control animation speed
4. **Start Visualization**: Click the "Start" button to begin

## 🏗️ Built With

- **React** - Frontend framework
- **CSS3** - Styling with modern features
- **Google Fonts** - Inter & JetBrains Mono

## 📁 Project Structure

```
algorithm-visualizer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js/css
│   │   ├── AlgorithmCard.js/css
│   │   ├── SelectionSortVisualizer.js
│   │   ├── BubbleSortVisualizer.js
│   │   ├── InsertionSortVisualizer.js
│   │   ├── MergeSortVisualizer.js
│   │   ├── QuickSortVisualizer.js
│   │   ├── HeapSortVisualizer.js
│   │   ├── SinglyLinkedListVisualizer.js
│   │   ├── DoublyLinkedListVisualizer.js
│   │   ├── CircularLinkedListVisualizer.js
│   │   └── Visualizer.css
│   ├── App.js/css
│   ├── index.js/css
│   └── ...
├── package.json
└── README.md
```

## 🎯 Features Breakdown

### Sorting Algorithm Visualizers Include:
- Real-time array visualization with dynamic bar heights
- Step-by-step code execution highlighting
- Color-coded element states (comparing, swapping, sorted)
- Multi-language support
- Input validation for custom arrays
- Smooth animations with configurable speed
- Algorithm complexity information

### Singly Linked List Visualizer Includes:
- Visual node representation with data and next pointer
- Animated arrows showing node connections
- HEAD and TAIL labels for tracking list boundaries
- NULL indicator for end of list
- Responsive layout adapting to different list sizes
- Support for all basic operations with step-by-step execution
- Color-coded node states (current, previous, new, target)

### Doubly Linked List Visualizer Includes:
- Three-column node layout (prev | data | next)
- Bidirectional connectors with refined gradients and arrowheads
- HEAD and TAIL badges, NULL labeling for ends
- All core operations with forward traversal and search output

### Circular Singly Linked List Visualizer Includes:
- Circular tail→head connector
- HEAD indicator and TAIL badge for tracking boundaries
- Step-by-step execution with per-language code highlighting

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 👨‍💻 Author

**Idhant Singh**
- GitHub: [@idhantsingh027](https://github.com/idhantsingh027)

## 🌟 Acknowledgments

- Inspired by the need to make algorithms more accessible and understandable
- Built with modern web technologies for optimal performance
