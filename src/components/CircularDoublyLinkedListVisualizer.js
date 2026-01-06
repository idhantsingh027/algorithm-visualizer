import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Visualizer.css';

const OPERATIONS = [
  { key: 'insert_begin', label: 'Insert at Beginning' },
  { key: 'insert_end', label: 'Insert at End' },
  { key: 'insert_pos', label: 'Insert at Position' },
  { key: 'delete_begin', label: 'Delete from Beginning' },
  { key: 'delete_end', label: 'Delete from End' },
  { key: 'delete_pos', label: 'Delete at Position' },
  { key: 'traverse', label: 'Traverse (forward)' },
  { key: 'search', label: 'Search' }
];

const codeByOp = {
  insert_begin: {
    python: [
      { line: 1, code: 'def insert_begin(head, tail, value):' },
      { line: 2, code: '    node = Node(value)' },
      { line: 3, code: '    if head is None:' },
      { line: 4, code: '        node.next = node' },
      { line: 5, code: '        node.prev = node' },
      { line: 6, code: '        return node, node' },
      { line: 7, code: '    node.next = head' },
      { line: 8, code: '    node.prev = tail' },
      { line: 9, code: '    head.prev = node' },
      { line: 10, code: '    tail.next = node' },
      { line: 11, code: '    head = node' },
      { line: 12, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertBegin(Node** head, Node** tail, int val) {' },
      { line: 2, code: '    Node* node = createNode(val);' },
      { line: 3, code: '    if (*head == NULL) {' },
      { line: 4, code: '        node->next = node;' },
      { line: 5, code: '        node->prev = node;' },
      { line: 6, code: '        *head = *tail = node;' },
      { line: 7, code: '        return;' },
      { line: 8, code: '    }' },
      { line: 9, code: '    node->next = *head;' },
      { line: 10, code: '    node->prev = *tail;' },
      { line: 11, code: '    (*head)->prev = node;' },
      { line: 12, code: '    (*tail)->next = node;' },
      { line: 13, code: '    *head = node;' },
      { line: 14, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertBegin(Node*& head, Node*& tail, int val) {' },
      { line: 2, code: '    Node* node = new Node(val);' },
      { line: 3, code: '    if (!head) {' },
      { line: 4, code: '        node->next = node;' },
      { line: 5, code: '        node->prev = node;' },
      { line: 6, code: '        head = tail = node;' },
      { line: 7, code: '        return;' },
      { line: 8, code: '    }' },
      { line: 9, code: '    node->next = head;' },
      { line: 10, code: '    node->prev = tail;' },
      { line: 11, code: '    head->prev = node;' },
      { line: 12, code: '    tail->next = node;' },
      { line: 13, code: '    head = node;' },
      { line: 14, code: '}' }
    ]
  },
  insert_end: {
    python: [
      { line: 1, code: 'def insert_end(head, tail, value):' },
      { line: 2, code: '    node = Node(value)' },
      { line: 3, code: '    if head is None:' },
      { line: 4, code: '        node.next = node' },
      { line: 5, code: '        node.prev = node' },
      { line: 6, code: '        return node, node' },
      { line: 7, code: '    node.next = head' },
      { line: 8, code: '    node.prev = tail' },
      { line: 9, code: '    tail.next = node' },
      { line: 10, code: '    head.prev = node' },
      { line: 11, code: '    tail = node' },
      { line: 12, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertEnd(Node** head, Node** tail, int val) {' },
      { line: 2, code: '    Node* node = createNode(val);' },
      { line: 3, code: '    if (*head == NULL) {' },
      { line: 4, code: '        node->next = node;' },
      { line: 5, code: '        node->prev = node;' },
      { line: 6, code: '        *head = *tail = node;' },
      { line: 7, code: '        return;' },
      { line: 8, code: '    }' },
      { line: 9, code: '    node->next = *head;' },
      { line: 10, code: '    node->prev = *tail;' },
      { line: 11, code: '    (*tail)->next = node;' },
      { line: 12, code: '    (*head)->prev = node;' },
      { line: 13, code: '    *tail = node;' },
      { line: 14, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertEnd(Node*& head, Node*& tail, int val) {' },
      { line: 2, code: '    Node* node = new Node(val);' },
      { line: 3, code: '    if (!head) {' },
      { line: 4, code: '        node->next = node;' },
      { line: 5, code: '        node->prev = node;' },
      { line: 6, code: '        head = tail = node;' },
      { line: 7, code: '        return;' },
      { line: 8, code: '    }' },
      { line: 9, code: '    node->next = head;' },
      { line: 10, code: '    node->prev = tail;' },
      { line: 11, code: '    tail->next = node;' },
      { line: 12, code: '    head->prev = node;' },
      { line: 13, code: '    tail = node;' },
      { line: 14, code: '}' }
    ]
  },
  insert_pos: {
    python: [
      { line: 1, code: 'def insert_pos(head, tail, value, pos):' },
      { line: 2, code: '    if head is None or pos <= 1:' },
      { line: 3, code: '        return insert_begin(head, tail, value)' },
      { line: 4, code: '    node = Node(value)' },
      { line: 5, code: '    prev = head' },
      { line: 6, code: '    i = 1' },
      { line: 7, code: '    while i < pos - 1 and prev.next != head:' },
      { line: 8, code: '        prev = prev.next' },
      { line: 9, code: '        i += 1' },
      { line: 10, code: '    node.next = prev.next' },
      { line: 11, code: '    node.prev = prev' },
      { line: 12, code: '    prev.next.prev = node' },
      { line: 13, code: '    prev.next = node' },
      { line: 14, code: '    if prev == tail: tail = node' },
      { line: 15, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertPos(Node** head, Node** tail, int val, int pos) {' },
      { line: 2, code: '    if (*head == NULL || pos <= 1) {' },
      { line: 3, code: '        insertBegin(head, tail, val);' },
      { line: 4, code: '        return;' },
      { line: 5, code: '    }' },
      { line: 6, code: '    Node* node = createNode(val);' },
      { line: 7, code: '    Node* prev = *head;' },
      { line: 8, code: '    int i = 1;' },
      { line: 9, code: '    while (i < pos - 1 && prev->next != *head) {' },
      { line: 10, code: '        prev = prev->next;' },
      { line: 11, code: '        i++;' },
      { line: 12, code: '    }' },
      { line: 13, code: '    node->next = prev->next;' },
      { line: 14, code: '    node->prev = prev;' },
      { line: 15, code: '    prev->next->prev = node;' },
      { line: 16, code: '    prev->next = node;' },
      { line: 17, code: '    if (prev == *tail) *tail = node;' },
      { line: 18, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertPos(Node*& head, Node*& tail, int val, int pos) {' },
      { line: 2, code: '    if (!head || pos <= 1) {' },
      { line: 3, code: '        insertBegin(head, tail, val);' },
      { line: 4, code: '        return;' },
      { line: 5, code: '    }' },
      { line: 6, code: '    Node* node = new Node(val);' },
      { line: 7, code: '    Node* prev = head;' },
      { line: 8, code: '    int i = 1;' },
      { line: 9, code: '    while (i < pos - 1 && prev->next != head) {' },
      { line: 10, code: '        prev = prev->next;' },
      { line: 11, code: '        i++;' },
      { line: 12, code: '    }' },
      { line: 13, code: '    node->next = prev->next;' },
      { line: 14, code: '    node->prev = prev;' },
      { line: 15, code: '    prev->next->prev = node;' },
      { line: 16, code: '    prev->next = node;' },
      { line: 17, code: '    if (prev == tail) tail = node;' },
      { line: 18, code: '}' }
    ]
  },
  delete_begin: {
    python: [
      { line: 1, code: 'def delete_begin(head, tail):' },
      { line: 2, code: '    if head is None: return head, tail' },
      { line: 3, code: '    if head == tail:' },
      { line: 4, code: '        return None, None' },
      { line: 5, code: '    new_head = head.next' },
      { line: 6, code: '    tail.next = new_head' },
      { line: 7, code: '    new_head.prev = tail' },
      { line: 8, code: '    head = new_head' },
      { line: 9, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deleteBegin(Node** head, Node** tail) {' },
      { line: 2, code: '    if (*head == NULL) return;' },
      { line: 3, code: '    if (*head == *tail) {' },
      { line: 4, code: '        free(*head);' },
      { line: 5, code: '        *head = *tail = NULL;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    Node* old = *head;' },
      { line: 9, code: '    *head = (*head)->next;' },
      { line: 10, code: '    (*tail)->next = *head;' },
      { line: 11, code: '    (*head)->prev = *tail;' },
      { line: 12, code: '    free(old);' },
      { line: 13, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deleteBegin(Node*& head, Node*& tail) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    if (head == tail) {' },
      { line: 4, code: '        delete head;' },
      { line: 5, code: '        head = tail = nullptr;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    Node* old = head;' },
      { line: 9, code: '    head = head->next;' },
      { line: 10, code: '    tail->next = head;' },
      { line: 11, code: '    head->prev = tail;' },
      { line: 12, code: '    delete old;' },
      { line: 13, code: '}' }
    ]
  },
  delete_end: {
    python: [
      { line: 1, code: 'def delete_end(head, tail):' },
      { line: 2, code: '    if head is None: return head, tail' },
      { line: 3, code: '    if head == tail:' },
      { line: 4, code: '        return None, None' },
      { line: 5, code: '    new_tail = tail.prev' },
      { line: 6, code: '    new_tail.next = head' },
      { line: 7, code: '    head.prev = new_tail' },
      { line: 8, code: '    tail = new_tail' },
      { line: 9, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deleteEnd(Node** head, Node** tail) {' },
      { line: 2, code: '    if (*head == NULL) return;' },
      { line: 3, code: '    if (*head == *tail) {' },
      { line: 4, code: '        free(*head);' },
      { line: 5, code: '        *head = *tail = NULL;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    Node* old = *tail;' },
      { line: 9, code: '    *tail = (*tail)->prev;' },
      { line: 10, code: '    (*tail)->next = *head;' },
      { line: 11, code: '    (*head)->prev = *tail;' },
      { line: 12, code: '    free(old);' },
      { line: 13, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deleteEnd(Node*& head, Node*& tail) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    if (head == tail) {' },
      { line: 4, code: '        delete head;' },
      { line: 5, code: '        head = tail = nullptr;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    Node* old = tail;' },
      { line: 9, code: '    tail = tail->prev;' },
      { line: 10, code: '    tail->next = head;' },
      { line: 11, code: '    head->prev = tail;' },
      { line: 12, code: '    delete old;' },
      { line: 13, code: '}' }
    ]
  },
  delete_pos: {
    python: [
      { line: 1, code: 'def delete_pos(head, tail, pos):' },
      { line: 2, code: '    if head is None or pos < 1: return head, tail' },
      { line: 3, code: '    if pos == 1:' },
      { line: 4, code: '        return delete_begin(head, tail)' },
      { line: 5, code: '    curr = head' },
      { line: 6, code: '    i = 1' },
      { line: 7, code: '    while i < pos and curr.next != head:' },
      { line: 8, code: '        curr = curr.next' },
      { line: 9, code: '        i += 1' },
      { line: 10, code: '    if i < pos: return head, tail' },
      { line: 11, code: '    curr.prev.next = curr.next' },
      { line: 12, code: '    curr.next.prev = curr.prev' },
      { line: 13, code: '    if curr == tail: tail = curr.prev' },
      { line: 14, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deletePos(Node** head, Node** tail, int pos) {' },
      { line: 2, code: '    if (*head == NULL || pos < 1) return;' },
      { line: 3, code: '    if (pos == 1) {' },
      { line: 4, code: '        deleteBegin(head, tail);' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    Node* curr = *head;' },
      { line: 8, code: '    int i = 1;' },
      { line: 9, code: '    while (i < pos && curr->next != *head) {' },
      { line: 10, code: '        curr = curr->next;' },
      { line: 11, code: '        i++;' },
      { line: 12, code: '    }' },
      { line: 13, code: '    if (i < pos) return;' },
      { line: 14, code: '    curr->prev->next = curr->next;' },
      { line: 15, code: '    curr->next->prev = curr->prev;' },
      { line: 16, code: '    if (curr == *tail) *tail = curr->prev;' },
      { line: 17, code: '    free(curr);' },
      { line: 18, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deletePos(Node*& head, Node*& tail, int pos) {' },
      { line: 2, code: '    if (!head || pos < 1) return;' },
      { line: 3, code: '    if (pos == 1) {' },
      { line: 4, code: '        deleteBegin(head, tail);' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    Node* curr = head;' },
      { line: 8, code: '    int i = 1;' },
      { line: 9, code: '    while (i < pos && curr->next != head) {' },
      { line: 10, code: '        curr = curr->next;' },
      { line: 11, code: '        i++;' },
      { line: 12, code: '    }' },
      { line: 13, code: '    if (i < pos) return;' },
      { line: 14, code: '    curr->prev->next = curr->next;' },
      { line: 15, code: '    curr->next->prev = curr->prev;' },
      { line: 16, code: '    if (curr == tail) tail = curr->prev;' },
      { line: 17, code: '    delete curr;' },
      { line: 18, code: '}' }
    ]
  },
  traverse: {
    python: [
      { line: 1, code: 'def traverse(head):' },
      { line: 2, code: '    if head is None: return' },
      { line: 3, code: '    curr = head' },
      { line: 4, code: '    while True:' },
      { line: 5, code: '        print(curr.value)' },
      { line: 6, code: '        curr = curr.next' },
      { line: 7, code: '        if curr == head: break' }
    ],
    c: [
      { line: 1, code: 'void traverse(Node* head) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    Node* curr = head;' },
      { line: 4, code: '    do {' },
      { line: 5, code: '        printf("%d ", curr->value);' },
      { line: 6, code: '        curr = curr->next;' },
      { line: 7, code: '    } while (curr != head);' },
      { line: 8, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void traverse(Node* head) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    Node* curr = head;' },
      { line: 4, code: '    do {' },
      { line: 5, code: '        std::cout << curr->value << " ";' },
      { line: 6, code: '        curr = curr->next;' },
      { line: 7, code: '    } while (curr != head);' },
      { line: 8, code: '}' }
    ]
  },
  search: {
    python: [
      { line: 1, code: 'def search(head, key):' },
      { line: 2, code: '    if head is None: return -1' },
      { line: 3, code: '    idx = 1' },
      { line: 4, code: '    curr = head' },
      { line: 5, code: '    while True:' },
      { line: 6, code: '        if curr.value == key: return idx' },
      { line: 7, code: '        curr = curr.next' },
      { line: 8, code: '        idx += 1' },
      { line: 9, code: '        if curr == head: break' },
      { line: 10, code: '    return -1' }
    ],
    c: [
      { line: 1, code: 'int search(Node* head, int key) {' },
      { line: 2, code: '    if (!head) return -1;' },
      { line: 3, code: '    int idx = 1;' },
      { line: 4, code: '    Node* curr = head;' },
      { line: 5, code: '    do {' },
      { line: 6, code: '        if (curr->value == key) return idx;' },
      { line: 7, code: '        curr = curr->next;' },
      { line: 8, code: '        idx++;' },
      { line: 9, code: '    } while (curr != head);' },
      { line: 10, code: '    return -1;' },
      { line: 11, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'int search(Node* head, int key) {' },
      { line: 2, code: '    if (!head) return -1;' },
      { line: 3, code: '    int idx = 1;' },
      { line: 4, code: '    Node* curr = head;' },
      { line: 5, code: '    do {' },
      { line: 6, code: '        if (curr->value == key) return idx;' },
      { line: 7, code: '        curr = curr->next;' },
      { line: 8, code: '        idx++;' },
      { line: 9, code: '    } while (curr != head);' },
      { line: 10, code: '    return -1;' },
      { line: 11, code: '}' }
    ]
  }
};

function cloneListState(state) {
  const nodes = {};
  for (const [id, node] of Object.entries(state.nodes)) {
    nodes[id] = { ...node };
  }
  return { headId: state.headId, tailId: state.tailId, size: state.size, nodes };
}

function buildStateFromValues(values) {
  const nodes = {};
  let headId = null;
  let tailId = null;

  values.forEach((value, idx) => {
    const id = `n${idx + 1}`;
    nodes[id] = { id, value, prevId: null, nextId: null };
    if (!headId) headId = id;
    if (tailId) {
      nodes[tailId].nextId = id;
      nodes[id].prevId = tailId;
    }
    tailId = id;
  });

  if (headId && tailId) {
    nodes[tailId].nextId = headId;
    nodes[headId].prevId = tailId;
  }

  return { headId, tailId, size: values.length, nodes };
}

function normalizeCircularDoublyState(state) {
  const nodes = state.nodes || {};
  const allIds = Object.keys(nodes);
  if (allIds.length === 0) return { headId: null, tailId: null, size: 0, nodes: {} };

  let headId = state.headId;
  if (!headId || !nodes[headId]) {
    headId = allIds
      .slice()
      .sort((a, b) => {
        const na = Number.parseInt(a.replace(/^n/, ''), 10);
        const nb = Number.parseInt(b.replace(/^n/, ''), 10);
        if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
        return a.localeCompare(b);
      })[0];
  }

  // Walk forward from head to establish a consistent cycle.
  const seen = new Set();
  let curr = headId;
  let tailId = headId;
  while (curr && nodes[curr] && !seen.has(curr)) {
    seen.add(curr);
    tailId = curr;
    let next = nodes[curr].nextId ?? null;
    if (!next || !nodes[next]) {
      next = headId;
      nodes[curr].nextId = next;
    }
    curr = next;
    if (curr === headId) break;
  }

  // Ensure tail and head link both ways.
  if (tailId && nodes[tailId]) nodes[tailId].nextId = headId;
  if (headId && nodes[headId]) nodes[headId].prevId = tailId;

  // Ensure each node's prev pointers are consistent with next pointers.
  let p = headId;
  for (let i = 0; i < seen.size; i++) {
    const next = nodes[p]?.nextId ?? headId;
    if (nodes[next]) nodes[next].prevId = p;
    p = next;
    if (p === headId) break;
  }

  return { headId, tailId, size: seen.size, nodes };
}

function deriveOrder(state) {
  const order = [];
  const seen = new Set();
  let curr = state.headId;
  while (curr && state.nodes[curr] && !seen.has(curr)) {
    seen.add(curr);
    order.push(curr);
    curr = state.nodes[curr]?.nextId ?? null;
    if (curr === state.headId) break;
  }
  return order;
}

function getListLayout(order, listState, canvasWidth) {
  const nodeWidth = 138;
  const nodeThird = nodeWidth / 3;
  const nodeHalf = nodeWidth / 2;
  const marginX = 60;
  const paddingX = nodeHalf + marginX;
  const paddingRightExtra = 40;
  const paddingY = 70;
  const nodeGapX = 168;
  const rowGapY = 165;

  const safeCanvasWidth = Number.isFinite(canvasWidth) && canvasWidth > 0 ? canvasWidth : 900;
  // Override to keep all nodes in one row regardless of canvas width
  const maxPerRow = Math.max(1, order.length);

  // Force a single-row layout; width grows with node count
  const contentWidth = (paddingX * 2) + paddingRightExtra + Math.max(0, order.length - 1) * nodeGapX;
  const width = Math.max(safeCanvasWidth, contentWidth);
  const rows = 1;
  const height = 280; // Fixed height for background box
  
  // Center nodes vertically in the box
  const nodeY = height / 2;

  const nodes = order.map((id, index) => {
    const row = Math.floor(index / maxPerRow);
    const col = index % maxPerRow;
    const x = paddingX + col * nodeGapX;
    const y = nodeY;
    return { id, x, y, row, col };
  });

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const edges = [];

  for (const fromId of order) {
    const fromNode = nodeById.get(fromId);
    if (!fromNode) continue;

    const fromNextAnchor = { x: fromNode.x + nodeThird, y: fromNode.y };
    const fromPrevAnchor = { x: fromNode.x - nodeThird, y: fromNode.y };
    const actualNode = listState.nodes[fromId];

    const toId = actualNode?.nextId ?? null;
    if (toId) {
      const toNode = nodeById.get(toId);
      if (toNode) {
        const toPrevAnchor = { x: toNode.x - nodeThird, y: toNode.y };
        edges.push({ kind: 'next', key: `${fromId}->${toId}`, from: fromNextAnchor, to: toPrevAnchor, fromNode, toNode });
      }
    }

    const prevId = actualNode?.prevId ?? null;
    if (prevId) {
      const prevNode = nodeById.get(prevId);
      if (prevNode) {
        const prevNextAnchor = { x: prevNode.x + nodeThird, y: prevNode.y };
        edges.push({ kind: 'prev', key: `${fromId}<-${prevId}`, from: fromPrevAnchor, to: prevNextAnchor, fromNode, toNode: prevNode });
      }
    }
  }

  return { width, height, nodes, edges, nodeHalf, nodeThird, marginX };
}

function CircularDoublyLinkedListVisualizer() {
  const [language, setLanguage] = useState('python');
  const [operation, setOperation] = useState('insert_begin');

  const [listInput, setListInput] = useState('10, 20, 30, 40');
  const [inputError, setInputError] = useState('');

  const [valueInput, setValueInput] = useState('25');
  const [posInput, setPosInput] = useState('3');
  const [searchInput, setSearchInput] = useState('30');

  const [listState, setListState] = useState(() => buildStateFromValues([10, 20, 30, 40]));
  const nextIdRef = useRef(5);

  const [highlights, setHighlights] = useState({ headId: null, tailId: null, currentId: null, prevId: null, newId: null, targetId: null });
  const [currentLine, setCurrentLine] = useState(null);
  const [output, setOutput] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);

  const [speed, setSpeed] = useState(800);
  const speedRef = useRef(800);

  const containerRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setCanvasWidth(el.clientWidth || 0);
    update();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => update());
      ro.observe(el);
      return () => ro.disconnect();
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const order = useMemo(() => deriveOrder(listState), [listState]);
  const { width, height, nodes, edges, nodeHalf, marginX } = useMemo(
    () => getListLayout(order, listState, canvasWidth),
    [order, listState, canvasWidth]
  );

  const codeLanguageKey = language === 'c++' ? 'cpp' : language;
  const codeLines = useMemo(() => codeByOp[operation]?.[codeLanguageKey] ?? [], [operation, codeLanguageKey]);

  const lineMap = useMemo(() => ({
    insert_begin: {
      python: { def: 1, create: 2, ifEmpty: 3, selfNext: 4, selfPrev: 5, returnPair: 6, linkNext: 7, linkPrev: 8, fixHeadPrev: 9, fixTailNext: 10, setHead: 11, returnPair2: 12 },
      c: { def: 1, create: 2, ifEmpty: 3, selfNext: 4, selfPrev: 5, setHeadTail: 6, returnVoid: 7, linkNext: 9, linkPrev: 10, fixHeadPrev: 11, fixTailNext: 12, setHead: 13 },
      cpp: { def: 1, create: 2, ifEmpty: 3, selfNext: 4, selfPrev: 5, setHeadTail: 6, returnVoid: 7, linkNext: 9, linkPrev: 10, fixHeadPrev: 11, fixTailNext: 12, setHead: 13 }
    },
    insert_end: {
      python: { def: 1, create: 2, ifEmpty: 3, selfNext: 4, selfPrev: 5, returnPair: 6, linkNext: 7, linkPrev: 8, fixTailNext: 9, fixHeadPrev: 10, setTail: 11, returnPair2: 12 },
      c: { def: 1, create: 2, ifEmpty: 3, selfNext: 4, selfPrev: 5, setHeadTail: 6, returnVoid: 7, linkNext: 9, linkPrev: 10, fixTailNext: 11, fixHeadPrev: 12, setTail: 13 },
      cpp: { def: 1, create: 2, ifEmpty: 3, selfNext: 4, selfPrev: 5, setHeadTail: 6, returnVoid: 7, linkNext: 9, linkPrev: 10, fixTailNext: 11, fixHeadPrev: 12, setTail: 13 }
    },
    insert_pos: {
      python: { def: 1, ifGuard: 2, returnBegin: 3, create: 4, initPrev: 5, initI: 6, whileCheck: 7, movePrev: 8, incI: 9, setNodeNext: 10, setNodePrev: 11, fixNextPrev: 12, linkPrevNext: 13, maybeTail: 14, returnPair: 15 },
      c: { def: 1, ifGuard: 2, guardCall: 3, guardReturn: 4, create: 6, initPrev: 7, initI: 8, whileCheck: 9, movePrev: 10, incI: 11, setNodeNext: 13, setNodePrev: 14, fixNextPrev: 15, linkPrevNext: 16, maybeTail: 17 },
      cpp: { def: 1, ifGuard: 2, guardCall: 3, guardReturn: 4, create: 6, initPrev: 7, initI: 8, whileCheck: 9, movePrev: 10, incI: 11, setNodeNext: 13, setNodePrev: 14, fixNextPrev: 15, linkPrevNext: 16, maybeTail: 17 }
    },
    delete_begin: {
      python: { def: 1, empty: 2, single: 3, returnEmpty: 4, newHead: 5, fixTailNext: 6, fixHeadPrev: 7, setHead: 8, returnPair: 9 },
      c: { def: 1, empty: 2, single: 3, freeNode: 4, setNull: 5, returnVoid: 6, old: 8, moveHead: 9, fixTailNext: 10, fixHeadPrev: 11, freeOld: 12 },
      cpp: { def: 1, empty: 2, single: 3, freeNode: 4, setNull: 5, returnVoid: 6, old: 8, moveHead: 9, fixTailNext: 10, fixHeadPrev: 11, freeOld: 12 }
    },
    delete_end: {
      python: { def: 1, empty: 2, single: 3, returnEmpty: 4, newTail: 5, fixTailNext: 6, fixHeadPrev: 7, setTail: 8, returnPair: 9 },
      c: { def: 1, empty: 2, single: 3, freeNode: 4, setNull: 5, returnVoid: 6, old: 8, moveTail: 9, fixTailNext: 10, fixHeadPrev: 11, freeOld: 12 },
      cpp: { def: 1, empty: 2, single: 3, freeNode: 4, setNull: 5, returnVoid: 6, old: 8, moveTail: 9, fixTailNext: 10, fixHeadPrev: 11, freeOld: 12 }
    },
    delete_pos: {
      python: { def: 1, invalid: 2, ifPos1: 3, returnBegin: 4, initCurr: 5, initI: 6, whileCheck: 7, moveCurr: 8, incI: 9, outRange: 10, bypassNext: 11, bypassPrev: 12, maybeTail: 13, returnPair: 14 },
      c: { def: 1, invalid: 2, ifPos1: 3, delCall: 4, delReturn: 5, initCurr: 7, initI: 8, whileCheck: 9, moveCurr: 10, incI: 11, outRange: 13, bypassNext: 14, bypassPrev: 15, maybeTail: 16, freeCurr: 17 },
      cpp: { def: 1, invalid: 2, ifPos1: 3, delCall: 4, delReturn: 5, initCurr: 7, initI: 8, whileCheck: 9, moveCurr: 10, incI: 11, outRange: 13, bypassNext: 14, bypassPrev: 15, maybeTail: 16, freeCurr: 17 }
    },
    traverse: {
      python: { def: 1, empty: 2, init: 3, loopStart: 4, visit: 5, advance: 6, breakCheck: 7 },
      c: { def: 1, empty: 2, init: 3, loopStart: 4, visit: 5, advance: 6, loopCond: 7 },
      cpp: { def: 1, empty: 2, init: 3, loopStart: 4, visit: 5, advance: 6, loopCond: 7 }
    },
    search: {
      python: { def: 1, empty: 2, initIdx: 3, initCurr: 4, loopStart: 5, check: 6, advance: 7, incIdx: 8, breakCheck: 9, returnNotFound: 10 },
      c: { def: 1, empty: 2, initIdx: 3, initCurr: 4, loopStart: 5, check: 6, advance: 7, incIdx: 8, loopCond: 9, returnNotFound: 10 },
      cpp: { def: 1, empty: 2, initIdx: 3, initCurr: 4, loopStart: 5, check: 6, advance: 7, incIdx: 8, loopCond: 9, returnNotFound: 10 }
    }
  }), []);

  const sleep = async () => {
    await new Promise(resolve => setTimeout(resolve, speedRef.current));
    if (isPausedRef.current) {
      await new Promise(resolve => {
        pausedResolve.current = resolve;
      });
    }
  };

  const pauseOperation = () => {
    if (!isRunning || isPausedRef.current) return;
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const resumeOperation = () => {
    if (!isRunning || !isPausedRef.current) return;
    isPausedRef.current = false;
    setIsPaused(false);
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    isPausedRef.current = false;
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
    setCurrentLine(null);
    setHighlights({ headId: null, tailId: null, currentId: null, prevId: null, newId: null, targetId: null });
    setOutput([]);
    setInputError('');
  };

  const applyListInput = () => {
    try {
      const values = listInput
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => {
          const n = Number.parseInt(v, 10);
          if (Number.isNaN(n)) throw new Error('Invalid number');
          if (n < 1 || n > 999) throw new Error('Out of range');
          return n;
        });

      if (values.length > 12) {
        setInputError('List must have 0-12 elements');
        return;
      }

      resetVisualization();
      const next = buildStateFromValues(values);
      setListState(next);
      nextIdRef.current = values.length + 1;
      setInputError('');
    } catch {
      setInputError('Invalid input. Use comma-separated numbers (1-999)');
    }
  };

  const parseValue = () => {
    const n = Number.parseInt(valueInput.trim(), 10);
    if (Number.isNaN(n) || n < 1 || n > 999) return null;
    return n;
  };

  const parsePos = () => {
    const n = Number.parseInt(posInput.trim(), 10);
    if (Number.isNaN(n)) return null;
    return n;
  };

  const parseSearch = () => {
    const n = Number.parseInt(searchInput.trim(), 10);
    if (Number.isNaN(n) || n < 1 || n > 999) return null;
    return n;
  };

  const makeNode = (value) => {
    const id = `n${nextIdRef.current++}`;
    return { id, value, prevId: null, nextId: null };
  };

  const buildStep = (line, state, hl, out, lineKey, op) => ({
    line,
    lineKey: lineKey ?? null,
    op: op ?? null,
    state: state ? cloneListState(state) : null,
    highlights: hl ? { ...hl } : null,
    output: out ? [...out] : null
  });

  const runSteps = async (steps) => {
    for (const step of steps) {
      const resolvedLine = step.lineKey
        ? (lineMap[step.op]?.[codeLanguageKey]?.[step.lineKey] ?? null)
        : (step.line ?? null);
      setCurrentLine(resolvedLine);
      if (step.state) setListState(step.state);
      if (step.highlights) setHighlights(step.highlights);
      if (step.output) setOutput(step.output);
      await sleep();
    }
  };

  const startOperation = async () => {
    if (isRunning) return;
    resetVisualization();
    setIsRunning(true);

    const steps = [];
    let working = normalizeCircularDoublyState(cloneListState(listState));
    let hl = { headId: working.headId, tailId: working.tailId, currentId: null, prevId: null, newId: null, targetId: null };
    let out = [];
    const op = operation;

    const pushKey = (key) => {
      if (!key) return;
      if (lineMap[op]?.[codeLanguageKey]?.[key] == null) return;
      steps.push(buildStep(null, working, hl, out, key, op));
    };

    if (op === 'insert_begin') {
      const v = parseValue();
      if (v == null) { setInputError('Enter a valid value (1-999).'); setIsRunning(false); return; }

      const node = makeNode(v);
      working.nodes[node.id] = node;
      hl.newId = node.id;

      pushKey('def');
      pushKey('create');
      if (!working.headId) {
        pushKey('ifEmpty');
        node.nextId = node.id;
        pushKey(codeLanguageKey === 'python' ? 'selfNext' : 'selfBoth');
        node.prevId = node.id;
        if (codeLanguageKey === 'python') pushKey('selfPrev');

        working.headId = node.id;
        working.tailId = node.id;
        working.size = (working.size || 0) + 1;
        hl.headId = node.id;
        hl.tailId = node.id;

        if (codeLanguageKey === 'python') pushKey('returnPair');
        else pushKey('setHeadTail');
      } else {
        pushKey('ifEmpty');
        const head = working.headId;
        const tail = working.tailId;

        node.nextId = head;
        pushKey('linkNext');
        node.prevId = tail;
        pushKey('linkPrev');

        working.nodes[head].prevId = node.id;
        pushKey('fixHeadPrev');
        working.nodes[tail].nextId = node.id;
        pushKey('fixTailNext');

        working.headId = node.id;
        working.size = (working.size || 0) + 1;
        hl.headId = node.id;

        pushKey('setHead');
        if (codeLanguageKey === 'python') pushKey('returnPair2');
      }
    }

    if (op === 'insert_end') {
      const v = parseValue();
      if (v == null) { setInputError('Enter a valid value (1-999).'); setIsRunning(false); return; }

      const node = makeNode(v);
      working.nodes[node.id] = node;
      hl.newId = node.id;

      pushKey('def');
      pushKey('create');
      if (!working.headId) {
        pushKey('ifEmpty');
        node.nextId = node.id;
        pushKey(codeLanguageKey === 'python' ? 'selfNext' : 'selfBoth');
        node.prevId = node.id;
        if (codeLanguageKey === 'python') pushKey('selfPrev');

        working.headId = node.id;
        working.tailId = node.id;
        working.size = (working.size || 0) + 1;
        hl.headId = node.id;
        hl.tailId = node.id;

        if (codeLanguageKey === 'python') pushKey('returnPair');
        else pushKey('setHeadTail');
      } else {
        pushKey('ifEmpty');
        const head = working.headId;
        const tail = working.tailId;

        node.nextId = head;
        pushKey('linkNext');
        node.prevId = tail;
        pushKey('linkPrev');

        working.nodes[tail].nextId = node.id;
        pushKey('fixTailNext');
        working.nodes[head].prevId = node.id;
        pushKey('fixHeadPrev');

        working.tailId = node.id;
        working.size = (working.size || 0) + 1;
        hl.tailId = node.id;

        pushKey('setTail');
        if (codeLanguageKey === 'python') pushKey('returnPair2');
      }
    }

    if (op === 'insert_pos') {
      const v = parseValue();
      const pos = parsePos();
      if (v == null || pos == null) { setInputError('Enter valid value and position.'); setIsRunning(false); return; }

      pushKey('def');
      if (!working.headId || pos <= 1) {
        if (codeLanguageKey === 'python') {
          pushKey('ifGuard');
          pushKey('returnBegin');
        } else {
          pushKey('ifGuard');
          pushKey('guardCall');
          pushKey('guardReturn');
        }

        // Perform as insert_begin.
        const node = makeNode(v);
        working.nodes[node.id] = node;
        hl.newId = node.id;

        if (!working.headId) {
          node.nextId = node.id;
          node.prevId = node.id;
          working.headId = node.id;
          working.tailId = node.id;
          working.size = (working.size || 0) + 1;
          hl.headId = node.id;
          hl.tailId = node.id;
        } else {
          const head = working.headId;
          const tail = working.tailId;
          node.nextId = head;
          node.prevId = tail;
          working.nodes[head].prevId = node.id;
          working.nodes[tail].nextId = node.id;
          working.headId = node.id;
          working.size = (working.size || 0) + 1;
          hl.headId = node.id;
        }

        // Ensure we capture the mutated state for the animation.
        await runSteps(steps);
        setIsRunning(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setCurrentLine(null);
        return;
      }

      const node = makeNode(v);
      working.nodes[node.id] = node;
      hl.newId = node.id;

      pushKey('create');
      let prev = working.headId;
      hl.prevId = prev;
      pushKey('initPrev');
      let i = 1;
      pushKey('initI');
      pushKey('whileCheck');
      while (i < pos - 1 && prev) {
        const nextNode = working.nodes[prev]?.nextId;
        if (!nextNode || nextNode === working.headId) break;
        pushKey('whileCheck');
        prev = nextNode;
        hl.prevId = prev;
        pushKey('movePrev');
        i += 1;
        pushKey('incI');
      }

      const next = working.nodes[prev]?.nextId ?? working.headId;
      node.nextId = next;
      pushKey('setNodeNext');
      node.prevId = prev;
      pushKey('setNodePrev');

      // Fix surrounding pointers.
      if (working.nodes[next]) {
        working.nodes[next].prevId = node.id;
        pushKey('fixNextPrev');
      }
      working.nodes[prev].nextId = node.id;
      pushKey('linkPrevNext');

      working.size = (working.size || 0) + 1;
      if (prev === working.tailId) {
        working.tailId = node.id;
        hl.tailId = node.id;
        pushKey('maybeTail');
      }

      if (codeLanguageKey === 'python') pushKey('returnPair');
    }

    if (op === 'delete_begin') {
      pushKey('def');
      if (!working.headId) { pushKey('empty'); setIsRunning(false); return; }
      pushKey('empty');

      if (working.headId === working.tailId) {
        pushKey('single');
        hl.targetId = working.headId;
        if (codeLanguageKey !== 'python') {
          pushKey('freeNode');
          pushKey('setNull');
          pushKey('returnVoid');
        }
        delete working.nodes[working.headId];
        working.headId = null;
        working.tailId = null;
        working.size = 0;
        hl.headId = null;
        hl.tailId = null;
        if (codeLanguageKey === 'python') pushKey('returnEmpty');
      } else {
        pushKey('single');
        const old = working.headId;
        hl.targetId = old;
        if (codeLanguageKey !== 'python') pushKey('old');

        const newHead = working.nodes[old]?.nextId ?? null;
        if (!newHead) { setIsRunning(false); return; }
        if (codeLanguageKey === 'python') pushKey('newHead');

        working.headId = newHead;
        hl.headId = newHead;
        pushKey(codeLanguageKey === 'python' ? 'setHead' : 'moveHead');

        const tail = working.tailId;
        working.nodes[tail].nextId = newHead;
        pushKey('fixTailNext');
        working.nodes[newHead].prevId = tail;
        pushKey('fixHeadPrev');

        delete working.nodes[old];
        working.size = Math.max(0, (working.size || 1) - 1);
        if (codeLanguageKey !== 'python') pushKey('freeOld');
        if (codeLanguageKey === 'python') pushKey('returnPair');
      }
    }

    if (op === 'delete_end') {
      pushKey('def');
      if (!working.headId) { pushKey('empty'); setIsRunning(false); return; }
      pushKey('empty');

      if (working.headId === working.tailId) {
        pushKey('single');
        hl.targetId = working.tailId;
        if (codeLanguageKey !== 'python') {
          pushKey('freeNode');
          pushKey('setNull');
          pushKey('returnVoid');
        }
        delete working.nodes[working.tailId];
        working.headId = null;
        working.tailId = null;
        working.size = 0;
        hl.headId = null;
        hl.tailId = null;
        if (codeLanguageKey === 'python') pushKey('returnEmpty');
      } else {
        pushKey('single');
        const old = working.tailId;
        hl.targetId = old;
        if (codeLanguageKey !== 'python') pushKey('old');

        const newTail = working.nodes[old]?.prevId ?? null;
        if (!newTail) { setIsRunning(false); return; }
        if (codeLanguageKey === 'python') pushKey('newTail');

        working.tailId = newTail;
        hl.tailId = newTail;
        pushKey(codeLanguageKey === 'python' ? 'setTail' : 'moveTail');

        const head = working.headId;
        working.nodes[newTail].nextId = head;
        pushKey('fixTailNext');
        working.nodes[head].prevId = newTail;
        pushKey('fixHeadPrev');

        delete working.nodes[old];
        working.size = Math.max(0, (working.size || 1) - 1);
        if (codeLanguageKey !== 'python') pushKey('freeOld');

        if (codeLanguageKey === 'python') pushKey('returnPair');
      }
    }

    if (op === 'delete_pos') {
      const pos = parsePos();
      pushKey('def');
      if (!working.headId || pos == null || pos < 1) {
        pushKey('invalid');
        setIsRunning(false);
        return;
      }

      pushKey('invalid');
      pushKey('ifPos1');
      if (pos === 1) {
        if (codeLanguageKey === 'python') {
          pushKey('returnBegin');
        } else {
          pushKey('delCall');
          pushKey('delReturn');
        }

        // Delete begin mutation.
        if (working.headId === working.tailId) {
          hl.targetId = working.headId;
          delete working.nodes[working.headId];
          working.headId = null;
          working.tailId = null;
          working.size = 0;
          hl.headId = null;
          hl.tailId = null;
        } else {
          const old = working.headId;
          hl.targetId = old;
          const newHead = working.nodes[old]?.nextId ?? null;
          if (newHead) {
            working.headId = newHead;
            hl.headId = newHead;
            const tail = working.tailId;
            working.nodes[tail].nextId = newHead;
            working.nodes[newHead].prevId = tail;
            delete working.nodes[old];
            working.size = Math.max(0, (working.size || 1) - 1);
          }
        }

        await runSteps(steps);
        setIsRunning(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setCurrentLine(null);
        return;
      }

      let curr = working.headId;
      hl.currentId = curr;
      pushKey('initCurr');
      let i = 1;
      pushKey('initI');

      pushKey('whileCheck');
      while (i < pos && curr && working.nodes[curr]?.nextId !== working.headId) {
        pushKey('whileCheck');
        curr = working.nodes[curr].nextId;
        hl.currentId = curr;
        pushKey('moveCurr');
        i += 1;
        pushKey('incI');
      }

      if (i < pos || !curr) {
        pushKey('outRange');
        setIsRunning(false);
        return;
      }

      hl.targetId = curr;
      // Bypass.
      const prev = working.nodes[curr]?.prevId;
      const next = working.nodes[curr]?.nextId;
      if (prev && working.nodes[prev]) {
        working.nodes[prev].nextId = next;
        pushKey('bypassNext');
      }
      if (next && working.nodes[next]) {
        working.nodes[next].prevId = prev;
        pushKey('bypassPrev');
      }

      if (curr === working.tailId) {
        working.tailId = prev;
        hl.tailId = prev;
        pushKey('maybeTail');
      }

      delete working.nodes[curr];
      working.size = Math.max(0, (working.size || 1) - 1);
      if (codeLanguageKey !== 'python') pushKey('freeCurr');
      if (codeLanguageKey === 'python') pushKey('returnPair');
    }

    if (op === 'traverse') {
      pushKey('def');
      if (!working.headId) { pushKey('empty'); setIsRunning(false); return; }
      pushKey('empty');
      pushKey('init');
      let curr = working.headId;
      hl.currentId = curr;
      do {
        pushKey('loopStart');
        const val = working.nodes[curr]?.value;
        out.push(`Visited: ${val}`);
        pushKey('visit');
        curr = working.nodes[curr]?.nextId ?? null;
        hl.currentId = curr;
        pushKey('advance');
      } while (curr && curr !== working.headId);

      if (lineMap.traverse[codeLanguageKey]?.breakCheck) pushKey('breakCheck');
      if (lineMap.traverse[codeLanguageKey]?.loopCond) pushKey('loopCond');
    }

    if (op === 'search') {
      const key = parseSearch();
      pushKey('def');
      if (key == null) { setInputError('Enter a valid search value'); setIsRunning(false); return; }
      if (!working.headId) {
        pushKey('empty');
        out.push(`Not found: ${key}`);
        pushKey('returnNotFound');
        await runSteps(steps);
        setIsRunning(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setCurrentLine(null);
        return;
      }
      pushKey('empty');

      let idx = 1;
      pushKey('initIdx');
      let curr = working.headId;
      hl.currentId = curr;
      pushKey('initCurr');
      let found = false;

      do {
        pushKey('loopStart');
        pushKey('check');
        if (working.nodes[curr]?.value === key) {
          out.push(`Found: ${key} at position ${idx}`);
          pushKey('check');
          found = true;
          break;
        }
        curr = working.nodes[curr]?.nextId ?? null;
        hl.currentId = curr;
        pushKey('advance');
        idx += 1;
        pushKey('incIdx');
      } while (curr && curr !== working.headId);

      if (!found) {
        if (lineMap.search[codeLanguageKey]?.breakCheck) pushKey('breakCheck');
        if (lineMap.search[codeLanguageKey]?.loopCond) pushKey('loopCond');
        out.push(`Not found: ${key}`);
        pushKey('returnNotFound');
      }
    }

    // Clear any stale "new" highlight at the end of mutations.
    hl.newId = null;

    await runSteps(steps);
    setIsRunning(false);
    setIsPaused(false);
    isPausedRef.current = false;
    setCurrentLine(null);
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">Circular Doubly Linked List</h1>
        <p className="algorithm-description">A doubly linked list where tail.next points to head and head.prev points to tail.</p>
        <div className="complexity-info">
          <div className="complexity-badge">Insert/Delete at Head/Tail: O(1)</div>
          <div className="complexity-badge">Insert/Delete at Position: O(n)</div>
          <div className="complexity-badge">Search/Traverse: O(n)</div>
        </div>
      </div>

      <div className="visualizer-content">
        <div className="code-section">
          <div className="code-header">
            <div className="language-tabs">
              {['python', 'c', 'c++'].map(lang => (
                <button
                  key={lang}
                  className={`language-tab ${language === lang ? 'active' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="code-display">
            {codeLines.map(({ line, code }) => (
              <div key={line} className={`code-line ${currentLine === line ? 'highlighted' : ''}`}>
                <span className="line-number">{String(line).padStart(2, '0')}</span>
                <span className="line-code">{code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="visualization-section">
          <div className="controls">
            <div className="control-group">
              <label className="control-label" htmlFor="list-input">Initial List (comma-separated)</label>
              <div className="input-group">
                <input
                  id="list-input"
                  type="text"
                  className="array-input"
                  value={listInput}
                  onChange={e => setListInput(e.target.value)}
                  placeholder="e.g., 10, 20, 30"
                  disabled={isRunning}
                />
                <button onClick={applyListInput} disabled={isRunning} className="control-btn apply-btn">Set List</button>
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="operation-select">Operation</label>
              <select
                id="operation-select"
                className="select-input"
                value={operation}
                onChange={e => setOperation(e.target.value)}
                disabled={isRunning}
              >
                {OPERATIONS.map(op => (
                  <option key={op.key} value={op.key}>{op.label}</option>
                ))}
              </select>
            </div>

            {(operation.includes('insert') || operation.includes('pos')) && (
              <div className="control-group">
                <label className="control-label" htmlFor="value-input">Value</label>
                <input
                  id="value-input"
                  type="text"
                  className="array-input"
                  value={valueInput}
                  onChange={e => setValueInput(e.target.value)}
                  disabled={isRunning}
                  placeholder="Enter value"
                />
              </div>
            )}

            {operation.includes('pos') && (
              <div className="control-group">
                <label className="control-label" htmlFor="pos-input">Position</label>
                <input
                  id="pos-input"
                  type="text"
                  className="array-input"
                  value={posInput}
                  onChange={e => setPosInput(e.target.value)}
                  disabled={isRunning}
                  placeholder="Enter position"
                />
              </div>
            )}

            {operation === 'search' && (
              <div className="control-group">
                <label className="control-label" htmlFor="search-input">Search Value</label>
                <input
                  id="search-input"
                  type="text"
                  className="array-input"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  disabled={isRunning}
                  placeholder="Enter value to search"
                />
              </div>
            )}

            <div className="control-group">
              <div className="controls-row">
                <button onClick={startOperation} disabled={isRunning} className="control-btn primary">Run</button>
                <button onClick={pauseOperation} disabled={!isRunning || isPaused} className="control-btn">Pause</button>
                <button onClick={resumeOperation} disabled={!isRunning || !isPaused} className="control-btn">Resume</button>
              </div>
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label className="control-label" htmlFor="speed-slider">Speed</label>
                <span className="control-value">{speed}ms</span>
              </div>
              <input
                id="speed-slider"
                className="slider"
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={e => {
                  const s = Number(e.target.value);
                  setSpeed(s);
                  speedRef.current = s;
                }}
              />
              <div className="slider-labels"><span>Fast</span><span>Slow</span></div>
            </div>

            {output.length > 0 && (
              <div className="output-section">
                <h3>Output</h3>
                <div className="output-content">{output.map((line, idx) => (<div key={idx}>{line}</div>))}</div>
              </div>
            )}
          </div>

          <div ref={containerRef} className="linkedlist-container" style={{ minHeight: `${height}px`, minWidth: `${width}px` }}>
            <svg width={width} height={height} className="linkedlist-svg">
              <defs>
                <linearGradient id="ll-line-grad" x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.9)" />
                </linearGradient>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" className="linkedlist-arrow-marker" />
                </marker>
              </defs>

              {edges.map(edge => {
                const { from, to, key, kind, fromNode, toNode } = edge;

                // Compute global extents for smooth symmetric loop arcs
                const minX = Math.min(...nodes.map(n => n.x));
                const maxX = Math.max(...nodes.map(n => n.x));
                const minY = Math.min(...nodes.map(n => n.y));
                const maxY = Math.max(...nodes.map(n => n.y));
                const sep = 13; // vertical separation between prev (top) and next (bottom) lines
                const padLeftX = 25;   // loop padding on the left side
                const padRightX = 60;  // loop padding on the right side (slightly larger for visual balance)
                const r = 20;          // corner radius
                const arcOffset = 6;   // distance of loop from nodes

                const isNextLoop = kind === 'next' && fromNode?.id === listState.tailId && toNode?.id === listState.headId;
                const isPrevLoop = kind === 'prev' && fromNode?.id === listState.headId && toNode?.id === listState.tailId;

                if (isNextLoop || isPrevLoop) {
                  // Define symmetric boundaries and offsets
                  const leftX = minX - nodeHalf - padLeftX;
                  const rightX = maxX + nodeHalf + padRightX;

                  const arcY = isNextLoop
                    ? maxY + nodeHalf + arcOffset
                    : minY - nodeHalf - arcOffset;

                  const startY = isNextLoop ? from.y + sep : from.y - sep;
                  const endY   = isNextLoop ? to.y + sep   : to.y - sep;

                  const pathD = isNextLoop
                    ? [
                        `M ${from.x} ${startY}`,
                        `H ${rightX - r}`,
                        `Q ${rightX} ${startY} ${rightX} ${startY + r}`,
                        `V ${arcY - r}`,
                        `Q ${rightX} ${arcY} ${rightX - r} ${arcY}`,
                        `H ${leftX + r}`,
                        `Q ${leftX} ${arcY} ${leftX} ${arcY - r}`,
                        `V ${endY + r}`,
                        `Q ${leftX} ${endY} ${leftX + r} ${endY}`,
                        `H ${to.x}`
                      ].join(' ')
                    : [
                        `M ${from.x} ${startY}`,
                        `H ${leftX + r}`,
                        `Q ${leftX} ${startY} ${leftX} ${startY - r}`,
                        `V ${arcY + r}`,
                        `Q ${leftX} ${arcY} ${leftX + r} ${arcY}`,
                        `H ${rightX - r}`,
                        `Q ${rightX} ${arcY} ${rightX} ${arcY + r}`,
                        `V ${endY - r}`,
                        `Q ${rightX} ${endY} ${rightX - r} ${endY}`,
                        `H ${to.x}`
                      ].join(' ');

                  const cls = kind === 'prev' ? 'doublylist-prev-line' : 'linkedlist-connector-line';
                  const extra = ' loop-edge';
                  return (
                    <path
                      key={key}
                      d={pathD}
                      className={`${cls}${extra}`}
                      fill="none"
                      stroke="url(#ll-line-grad)"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                }


                if (fromNode?.row === toNode?.row) {
                  // Symmetric bezier curves for same-row connections
                  const dx = Math.min(50, Math.abs(to.x - from.x) / 3);
                  const yFrom = kind === 'next' ? from.y + sep : from.y - sep;
                  const yTo = kind === 'next' ? to.y + sep : to.y - sep;
                  const outDX = kind === 'next' ? dx : -dx;
                  const inDX = kind === 'next' ? dx : -dx;
                  const pathD = `M ${from.x} ${yFrom} C ${from.x + outDX} ${yFrom} ${to.x - inDX} ${yTo} ${to.x} ${yTo}`;
                  const cls = kind === 'prev' ? 'doublylist-prev-line' : 'linkedlist-connector-line';
                  return (
                    <path
                      key={key}
                      d={pathD}
                      className={cls}
                      fill="none"
                      stroke="url(#ll-line-grad)"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                }

                const rr = 14;
                const localGutter = Math.min(width - marginX, Math.max(from.x, to.x) + 36);
                const midY = (from.y + to.y) / 2;
                const x1 = localGutter;
                const y1 = from.y;
                const x2 = to.x;
                const y2 = to.y;
                const pathD = [
                  `M ${from.x} ${from.y}`,
                  `H ${x1 - rr}`,
                  `Q ${x1} ${y1} ${x1} ${y1 + rr}`,
                  `V ${midY - rr}`,
                  `Q ${x1} ${midY} ${x1 - rr} ${midY}`,
                  `H ${x2 + rr}`,
                  `Q ${x2} ${midY} ${x2} ${midY + rr}`,
                  `V ${y2}`
                ].join(' ');

                const cls = kind === 'prev' ? 'doublylist-prev-line' : 'linkedlist-connector-line';
                return (
                  <path
                    key={key}
                    d={pathD}
                    className={cls}
                    fill="none"
                    stroke="url(#ll-line-grad)"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </svg>

            <div className="linkedlist-nodes">
              {nodes.map(nodeInfo => {
                const node = listState.nodes[nodeInfo.id];
                const isHead = nodeInfo.id === listState.headId;
                const isTail = nodeInfo.id === listState.tailId;
                const isCurrent = nodeInfo.id === highlights.currentId;
                const isPrev = nodeInfo.id === highlights.prevId;
                const isNew = nodeInfo.id === highlights.newId;
                const isTarget = nodeInfo.id === highlights.targetId;

                let highlightClass = '';
                if (isNew) highlightClass = 'new';
                else if (isTarget) highlightClass = 'target';
                else if (isCurrent) highlightClass = 'current';
                else if (isPrev) highlightClass = 'prev';

                return (
                  <div
                    key={nodeInfo.id}
                    className={`doublylist-node-card ${highlightClass}`}
                    style={{ position: 'absolute', left: `${nodeInfo.x - nodeHalf}px`, top: `${nodeInfo.y - nodeHalf}px` }}
                  >
                    <div className="doublylist-node-cell doublylist-node-cell-prev">
                      <div className="linkedlist-node-pointer" aria-hidden="true" />
                      <div className="linkedlist-node-cell-label">prev</div>
                    </div>
                    <div className="doublylist-node-cell doublylist-node-cell-data">
                      <div className="linkedlist-node-value">{node?.value ?? ''}</div>
                      <div className="linkedlist-node-cell-label">data</div>
                    </div>
                    <div className="doublylist-node-cell doublylist-node-cell-next">
                      <div className="linkedlist-node-pointer" aria-hidden="true" />
                      <div className="linkedlist-node-cell-label">next</div>
                    </div>

                    {(isHead || isTail) && (
                      <div className="linkedlist-node-labels">
                        {isHead && <span className="linkedlist-label-badge head">HEAD</span>}
                        {isTail && <span className="linkedlist-label-badge tail">TAIL</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CircularDoublyLinkedListVisualizer;