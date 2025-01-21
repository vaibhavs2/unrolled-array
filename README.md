# Unrolled Array

A TypeScript implementation of an unrolled linked list that efficiently manages memory and performs fast insertions, deletions, and access operations. This data structure dynamically organizes data into blocks to combine the benefits of both linked lists and arrays.

## Features

- **Dynamic Block Management**: Automatically splits data into blocks for efficient memory usage.
- **Efficient Node Insertion/Deletion**: Insert or delete nodes at any position while maintaining the list's structure.
- **Flexible Block Size**: Customize block size to optimize for different memory and performance requirements.
- **Index-based Access**: Efficient retrieval of elements by index.
- **Traversal Support**: Loop through all elements with a provided callback function.

## Usage

### Installation

To use this implementation, clone the repository and install the dependencies.

```bash
npm i unrolled-array
```

### Example
```typescript
import { UnrolledLinkedlist } from 'unrolled-array';

// or const { UnrolledLinkedlist }  = require("unrolled-array")

const list = new UnrolledLinkedlist<number>(3);

// Add elements
list.push(10);
list.push(20);
list.push(30);

// Access an element by index
console.log(list.get(1));  // Output: 20

// Insert an element at a specific index
list.insert(1, 15);

// Delete an element at a specific index
list.delete(2);

// Traverse through the list
list.loopOver((data, index) => {
  console.log(`Index ${index}: ${data}`);
});

```
