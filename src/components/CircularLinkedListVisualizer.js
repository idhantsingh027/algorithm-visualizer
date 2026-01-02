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

// Multi-language code snippets: concise, one statement per line
const codeByOp = {
  insert_begin: {
    python: [
      { line: 1, code: 'def insert_begin(head, tail, value):' },
      { line: 2, code: '    node = Node(value)' },
      { line: 3, code: '    if head is None:' },
      { line: 4, code: '        head = tail = node' },
      { line: 5, code: '        node.next = node' },
      { line: 6, code: '        return head, tail' },
      { line: 7, code: '    node.next = head' },
      { line: 8, code: '    tail.next = node' },
      { line: 9, code: '    head = node' },
      { line: 10, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertBegin(Node** head, Node** tail, int val) {' },
      { line: 2, code: '    Node* node = createNode(val);' },
      { line: 3, code: '    if (*head == NULL) {' },
      { line: 4, code: '        *head = *tail = node;' },
      { line: 5, code: '        node->next = node;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    node->next = *head;' },
      { line: 9, code: '    (*tail)->next = node;' },
      { line: 10, code: '    *head = node;' },
      { line: 11, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertBegin(Node*& head, Node*& tail, int val) {' },
      { line: 2, code: '    Node* node = new Node(val);' },
      { line: 3, code: '    if (!head) {' },
      { line: 4, code: '        head = tail = node;' },
      { line: 5, code: '        node->next = node;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    node->next = head;' },
      { line: 9, code: '    tail->next = node;' },
      { line: 10, code: '    head = node;' },
      { line: 11, code: '}' }
    ]
  },
  insert_end: {
    python: [
      { line: 1, code: 'def insert_end(head, tail, value):' },
      { line: 2, code: '    node = Node(value)' },
      { line: 3, code: '    if head is None:' },
      { line: 4, code: '        head = tail = node' },
      { line: 5, code: '        node.next = node' },
      { line: 6, code: '        return head, tail' },
      { line: 7, code: '    node.next = head' },
      { line: 8, code: '    tail.next = node' },
      { line: 9, code: '    tail = node' },
      { line: 10, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertEnd(Node** head, Node** tail, int val) {' },
      { line: 2, code: '    Node* node = createNode(val);' },
      { line: 3, code: '    if (*head == NULL) {' },
      { line: 4, code: '        *head = *tail = node;' },
      { line: 5, code: '        node->next = node;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    node->next = *head;' },
      { line: 9, code: '    (*tail)->next = node;' },
      { line: 10, code: '    *tail = node;' },
      { line: 11, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertEnd(Node*& head, Node*& tail, int val) {' },
      { line: 2, code: '    Node* node = new Node(val);' },
      { line: 3, code: '    if (!head) {' },
      { line: 4, code: '        head = tail = node;' },
      { line: 5, code: '        node->next = node;' },
      { line: 6, code: '        return;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    node->next = head;' },
      { line: 9, code: '    tail->next = node;' },
      { line: 10, code: '    tail = node;' },
      { line: 11, code: '}' }
    ]
  },
  insert_pos: {
    python: [
      { line: 1, code: 'def insert_pos(head, tail, value, pos):' },
      { line: 2, code: '    if pos <= 1:' },
      { line: 3, code: '        return insert_begin(head, tail, value)' },
      { line: 4, code: '    node = Node(value)' },
      { line: 5, code: '    prev = head' },
      { line: 6, code: '    i = 1' },
      { line: 7, code: '    while i < pos - 1 and prev.next != head:' },
      { line: 8, code: '        prev = prev.next' },
      { line: 9, code: '        i += 1' },
      { line: 10, code: '    node.next = prev.next' },
      { line: 11, code: '    prev.next = node' },
      { line: 12, code: '    if node.next == head: tail = node' },
      { line: 13, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertPos(Node** head, Node** tail, int val, int pos) {' },
      { line: 2, code: '    if (pos <= 1) {' },
      { line: 3, code: '        insertBegin(head, tail, val);' },
      { line: 4, code: '        return;' },
      { line: 5, code: '    }' },
      { line: 6, code: '    Node* node = createNode(val);' },
      { line: 7, code: '    Node* prev = *head;' },
      { line: 8, code: '    for (int i = 1; i < pos - 1 && prev->next != *head; i++) {' },
      { line: 9, code: '        prev = prev->next;' },
      { line: 10, code: '    }' },
      { line: 11, code: '    node->next = prev->next;' },
      { line: 12, code: '    prev->next = node;' },
      { line: 13, code: '    if (node->next == *head) *tail = node;' },
      { line: 14, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertPos(Node*& head, Node*& tail, int val, int pos) {' },
      { line: 2, code: '    if (pos <= 1) {' },
      { line: 3, code: '        insertBegin(head, tail, val);' },
      { line: 4, code: '        return;' },
      { line: 5, code: '    }' },
      { line: 6, code: '    Node* node = new Node(val);' },
      { line: 7, code: '    Node* prev = head;' },
      { line: 8, code: '    for (int i = 1; i < pos - 1 && prev->next != head; i++) {' },
      { line: 9, code: '        prev = prev->next;' },
      { line: 10, code: '    }' },
      { line: 11, code: '    node->next = prev->next;' },
      { line: 12, code: '    prev->next = node;' },
      { line: 13, code: '    if (node->next == head) tail = node;' },
      { line: 14, code: '}' }
    ]
  },
  delete_begin: {
    python: [
      { line: 1, code: 'def delete_begin(head, tail):' },
      { line: 2, code: '    if head is None: return head, tail' },
      { line: 3, code: '    if head == tail:' },
      { line: 4, code: '        return None, None' },
      { line: 5, code: '    head = head.next' },
      { line: 6, code: '    tail.next = head' },
      { line: 7, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deleteBegin(Node** head, Node** tail) {' },
      { line: 2, code: '    if (*head == NULL) return;' },
      { line: 3, code: '    if (*head == *tail) { free(*head); *head = *tail = NULL; return; }' },
      { line: 4, code: '    *head = (*head)->next;' },
      { line: 5, code: '    (*tail)->next = *head;' },
      { line: 6, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deleteBegin(Node*& head, Node*& tail) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    if (head == tail) { delete head; head = tail = nullptr; return; }' },
      { line: 4, code: '    head = head->next;' },
      { line: 5, code: '    tail->next = head;' },
      { line: 6, code: '}' }
    ]
  },
  delete_end: {
    python: [
      { line: 1, code: 'def delete_end(head, tail):' },
      { line: 2, code: '    if head is None: return head, tail' },
      { line: 3, code: '    if head == tail:' },
      { line: 4, code: '        return None, None' },
      { line: 5, code: '    prev = head' },
      { line: 6, code: '    while prev.next != tail:' },
      { line: 7, code: '        prev = prev.next' },
      { line: 8, code: '    prev.next = head' },
      { line: 9, code: '    tail = prev' },
      { line: 10, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deleteEnd(Node** head, Node** tail) {' },
      { line: 2, code: '    if (*head == NULL) return;' },
      { line: 3, code: '    if (*head == *tail) { free(*head); *head = *tail = NULL; return; }' },
      { line: 4, code: '    Node* prev = *head;' },
      { line: 5, code: '    while (prev->next != *tail) {' },
      { line: 6, code: '        prev = prev->next;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    free(*tail);' },
      { line: 9, code: '    prev->next = *head;' },
      { line: 10, code: '    *tail = prev;' },
      { line: 11, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deleteEnd(Node*& head, Node*& tail) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    if (head == tail) { delete head; head = tail = nullptr; return; }' },
      { line: 4, code: '    Node* prev = head;' },
      { line: 5, code: '    while (prev->next != tail) {' },
      { line: 6, code: '        prev = prev->next;' },
      { line: 7, code: '    }' },
      { line: 8, code: '    delete tail;' },
      { line: 9, code: '    prev->next = head;' },
      { line: 10, code: '    tail = prev;' },
      { line: 11, code: '}' }
    ]
  },
  delete_pos: {
    python: [
      { line: 1, code: 'def delete_pos(head, tail, pos):' },
      { line: 2, code: '    if head is None or pos < 1:' },
      { line: 3, code: '        return head, tail' },
      { line: 4, code: '    if pos == 1:' },
      { line: 5, code: '        return delete_begin(head, tail)' },
      { line: 6, code: '    prev = head' },
      { line: 7, code: '    i = 1' },
      { line: 8, code: '    while i < pos - 1 and prev.next != head:' },
      { line: 9, code: '        prev = prev.next' },
      { line: 10, code: '        i += 1' },
      { line: 11, code: '    target = prev.next' },
      { line: 12, code: '    prev.next = target.next' },
      { line: 13, code: '    if target == tail: tail = prev' },
      { line: 14, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deletePos(Node** head, Node** tail, int pos) {' },
      { line: 2, code: '    if (*head == NULL || pos < 1) return;' },
      { line: 3, code: '    if (pos == 1) {' },
      { line: 4, code: '        deleteBegin(head, tail);' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    Node* prev = *head;' },
      { line: 8, code: '    for (int i = 1; i < pos - 1 && prev->next != *head; i++) {' },
      { line: 9, code: '        prev = prev->next;' },
      { line: 10, code: '    }' },
      { line: 11, code: '    Node* target = prev->next;' },
      { line: 12, code: '    prev->next = target->next;' },
      { line: 13, code: '    if (target == *tail) *tail = prev;' },
      { line: 14, code: '    free(target);' },
      { line: 15, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deletePos(Node*& head, Node*& tail, int pos) {' },
      { line: 2, code: '    if (!head || pos < 1) return;' },
      { line: 3, code: '    if (pos == 1) {' },
      { line: 4, code: '        deleteBegin(head, tail);' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    Node* prev = head;' },
      { line: 8, code: '    for (int i = 1; i < pos - 1 && prev->next != head; i++) {' },
      { line: 9, code: '        prev = prev->next;' },
      { line: 10, code: '    }' },
      { line: 11, code: '    Node* target = prev->next;' },
      { line: 12, code: '    prev->next = target->next;' },
      { line: 13, code: '    if (target == tail) tail = prev;' },
      { line: 14, code: '    delete target;' },
      { line: 15, code: '}' }
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
      { line: 5, code: '        printf("%d ", curr->data);' },
      { line: 6, code: '        curr = curr->next;' },
      { line: 7, code: '    } while (curr != head);' },
      { line: 8, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void traverse(Node* head) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    Node* curr = head;' },
      { line: 4, code: '    do {' },
      { line: 5, code: '        std::cout << curr->data << " ";' },
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
      { line: 6, code: '        if (curr->data == key) return idx;' },
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
      { line: 6, code: '        if (curr->data == key) return idx;' },
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

function normalizeCircularState(state) {
  const nodes = state.nodes || {};
  const allIds = Object.keys(nodes);
  if (allIds.length === 0) {
    return { headId: null, tailId: null, size: 0, nodes: {} };
  }

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

  const seen = new Set();
  let curr = headId;
  let tailId = headId;
  while (curr && nodes[curr] && !seen.has(curr)) {
    seen.add(curr);
    tailId = curr;
    const next = nodes[curr].nextId ?? null;
    if (next && !nodes[next]) {
      nodes[curr].nextId = headId;
      break;
    }
    if (next === headId) break;
    curr = next;
  }

  if (tailId && nodes[tailId]) {
    nodes[tailId].nextId = headId;
  }

  return { headId, tailId, size: seen.size, nodes };
}

function buildStateFromValues(values) {
  const nodes = {};
  let headId = null;
  let tailId = null;
  values.forEach((value, idx) => {
    const id = `n${idx + 1}`;
    nodes[id] = { id, value, nextId: null };
    if (!headId) headId = id;
    if (tailId) nodes[tailId].nextId = id;
    tailId = id;
  });
  if (tailId) nodes[tailId].nextId = headId; // circular link
  return { headId, tailId, size: values.length, nodes };
}

function deriveOrder(state) {
  const order = [];
  const seen = new Set();
  let curr = state.headId;
  while (curr && !seen.has(curr)) {
    seen.add(curr);
    order.push(curr);
    curr = state.nodes[curr]?.nextId ?? null;
  }
  return order;
}

function getListLayout(order, listState, canvasWidth) {
  const nodeWidth = 138;
  const nodeDataWidth = nodeWidth / 2;
  const nodeHalf = nodeWidth / 2;
  const marginX = 35;
  const paddingX = nodeHalf + marginX;
  const paddingY = 70;
  const nodeGapX = 168;
  const rowGapY = 165;
  const maxAllowedPerRow = 8;

  const safeCanvasWidth = Number.isFinite(canvasWidth) && canvasWidth > 0 ? canvasWidth : 900;
  const maxColsFit = Math.max(
    1,
    Math.floor((safeCanvasWidth - 2 * marginX - nodeWidth - 80) / nodeGapX) + 1
  );
  const maxPerRow = Math.min(maxAllowedPerRow, maxColsFit);

  const width = safeCanvasWidth;

  const rows = Math.max(1, Math.ceil(Math.max(order.length, 1) / maxPerRow));
  const height = paddingY + rows * rowGapY + 10;

  const nodes = order.map((id, index) => {
    const row = Math.floor(index / maxPerRow);
    const col = index % maxPerRow;
    const x = paddingX + col * nodeGapX;
    const y = paddingY + row * rowGapY;
    return { id, x, y, row, col };
  });

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const edges = [];
  for (let i = 0; i < order.length; i++) {
    const fromId = order[i];
    const fromNode = nodeById.get(fromId);
    if (!fromNode) continue;

    const fromAnchor = { x: fromNode.x + nodeDataWidth / 2, y: fromNode.y };
    const actualNode = listState.nodes[fromId];
    const toId = actualNode?.nextId ?? null;
    if (toId) {
      const toNode = nodeById.get(toId);
      if (toNode) {
        const toAnchor = { x: toNode.x - nodeDataWidth / 2, y: toNode.y };
        edges.push({ kind: 'node', key: `${fromId}->${toId}`, from: fromAnchor, to: toAnchor, fromNode, toNode });
      }
    }
  }

  return { width, height, nodes, edges, nodeHalf, marginX };
}

function CircularLinkedListVisualizer() {
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

  // Language-specific line maps for operations using tokens
  const lineMap = useMemo(() => ({
    insert_begin: {
      python: { def: 1, create: 2, ifEmpty: 3, setHeadTail: 4, selfLoop: 5, returnPair: 6, linkToHead: 7, linkTailToNew: 8, setHead: 9, returnPair2: 10 },
      c: { def: 1, create: 2, ifEmpty: 3, setHeadTail: 4, selfLoop: 5, returnVoid: 6, linkToHead: 8, linkTailToNew: 9, setHead: 10 },
      cpp: { def: 1, create: 2, ifEmpty: 3, setHeadTail: 4, selfLoop: 5, returnVoid: 6, linkToHead: 8, linkTailToNew: 9, setHead: 10 }
    },
    insert_end: {
      python: { def: 1, create: 2, ifEmpty: 3, setHeadTail: 4, selfLoop: 5, returnPair: 6, linkToHead: 7, linkTailToNew: 8, setTail: 9, returnPair2: 10 },
      c: { def: 1, create: 2, ifEmpty: 3, setHeadTail: 4, selfLoop: 5, returnVoid: 6, linkToHead: 8, linkTailToNew: 9, setTail: 10 },
      cpp: { def: 1, create: 2, ifEmpty: 3, setHeadTail: 4, selfLoop: 5, returnVoid: 6, linkToHead: 8, linkTailToNew: 9, setTail: 10 }
    },
    insert_pos: {
      python: { def: 1, ifPos: 2, returnBegin: 3, create: 4, initPrev: 5, initI: 6, whileCheck: 7, movePrev: 8, incI: 9, setNodeNext: 10, linkPrev: 11, maybeTail: 12, returnPair: 13 },
      c: { def: 1, ifPos: 2, callBegin: 3, returnVoid: 4, create: 6, initPrev: 7, whileCheck: 8, movePrev: 9, setNodeNext: 11, linkPrev: 12, maybeTail: 13 },
      cpp: { def: 1, ifPos: 2, callBegin: 3, returnVoid: 4, create: 6, initPrev: 7, whileCheck: 8, movePrev: 9, setNodeNext: 11, linkPrev: 12, maybeTail: 13 }
    },
    delete_begin: {
      python: { def: 1, empty: 2, single: 3, returnEmpty: 4, moveHead: 5, fixTail: 6, returnPair: 7 },
      c: { def: 1, empty: 2, single: 3, moveHead: 4, fixTail: 5 },
      cpp: { def: 1, empty: 2, single: 3, moveHead: 4, fixTail: 5 }
    },
    delete_end: {
      python: { def: 1, empty: 2, single: 3, returnEmpty: 4, initPrev: 5, whileCheck: 6, movePrev: 7, linkPrevToHead: 8, setTail: 9, returnPair: 10 },
      c: { def: 1, empty: 2, single: 3, initPrev: 4, whileCheck: 5, movePrev: 6, freeTail: 8, linkPrevToHead: 9, setTail: 10 },
      cpp: { def: 1, empty: 2, single: 3, initPrev: 4, whileCheck: 5, movePrev: 6, freeTail: 8, linkPrevToHead: 9, setTail: 10 }
    },
    delete_pos: {
      python: { def: 1, invalid: 2, returnPair: 3, ifPos1: 4, returnBegin: 5, initPrev: 6, initI: 7, whileCheck: 8, movePrev: 9, incI: 10, setTarget: 11, bypass: 12, maybeTail: 13, returnPair2: 14 },
      c: { def: 1, invalid: 2, returnPair: 2, ifPos1: 3, callBegin: 4, returnVoid: 5, initPrev: 7, whileCheck: 8, movePrev: 9, setTarget: 11, bypass: 12, maybeTail: 13, freeTarget: 14 },
      cpp: { def: 1, invalid: 2, returnPair: 2, ifPos1: 3, callBegin: 4, returnVoid: 5, initPrev: 7, whileCheck: 8, movePrev: 9, setTarget: 11, bypass: 12, maybeTail: 13, freeTarget: 14 }
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
    return { id, value, nextId: null };
  };

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

  const buildStep = (line, state, hl, out, lineKey, op) => ({
    line,
    lineKey: lineKey ?? null,
    op: op ?? null,
    state: state ? cloneListState(state) : null,
    highlights: hl ? { ...hl } : null,
    output: out ? [...out] : null
  });

  const startOperation = async () => {
    if (isRunning) return;
    resetVisualization();
    setIsRunning(true);
    setInputError('');

    const steps = [];
    let working = normalizeCircularState(cloneListState(listState));
    let hl = {
      headId: working.headId,
      tailId: working.tailId,
      currentId: null,
      prevId: null,
      newId: null,
      targetId: null
    };
    let out = [];
    const pushKey = (key) => {
      if (!key) return;
      if (lineMap[op]?.[codeLanguageKey]?.[key] == null) return;
      steps.push(buildStep(null, working, hl, out, key, op));
    };

    const op = operation;

    if (op === 'insert_begin') {
      const v = parseValue();
      if (v == null) { setInputError('Enter a valid value (1-999).'); setIsRunning(false); return; }
      const node = makeNode(v);
      working.nodes[node.id] = node; hl.newId = node.id;
      pushKey('def');
      pushKey('create');
      if (!working.headId) {
        pushKey('ifEmpty');
        working.headId = node.id;
        working.tailId = node.id;
        working.size += 1;
        hl.headId = node.id;
        hl.tailId = node.id;
        pushKey('setHeadTail');

        working.nodes[node.id].nextId = node.id;
        pushKey('selfLoop');

        if (codeLanguageKey === 'python') pushKey('returnPair');
        else pushKey('returnVoid');
      } else {
        pushKey('ifEmpty');
        node.nextId = working.headId;
        pushKey('linkToHead');

        if (working.tailId) working.nodes[working.tailId].nextId = node.id;
        pushKey('linkTailToNew');

        working.headId = node.id;
        working.size += 1;
        hl.headId = node.id;
        pushKey('setHead');

        if (codeLanguageKey === 'python') pushKey('returnPair2');
      }
    }

    if (op === 'insert_end') {
      const v = parseValue();
      if (v == null) { setInputError('Enter a valid value (1-999).'); setIsRunning(false); return; }
      const node = makeNode(v);
      working.nodes[node.id] = node; hl.newId = node.id;
      pushKey('def');
      pushKey('create');
      if (!working.headId) {
        pushKey('ifEmpty');
        working.headId = node.id;
        working.tailId = node.id;
        working.size += 1;
        hl.headId = node.id;
        hl.tailId = node.id;
        pushKey('setHeadTail');

        working.nodes[node.id].nextId = node.id;
        pushKey('selfLoop');

        if (codeLanguageKey === 'python') pushKey('returnPair');
        else pushKey('returnVoid');
      } else {
        pushKey('ifEmpty');
        node.nextId = working.headId;
        pushKey('linkToHead');

        if (working.tailId) working.nodes[working.tailId].nextId = node.id;
        pushKey('linkTailToNew');

        working.tailId = node.id;
        working.size += 1;
        hl.tailId = node.id;
        pushKey('setTail');

        if (codeLanguageKey === 'python') pushKey('returnPair2');
      }
    }

    if (op === 'insert_pos') {
      const v = parseValue(); const pos = parsePos();
      if (v == null || pos == null) { setInputError('Enter valid value and position.'); setIsRunning(false); return; }
      pushKey('def');
      if (pos <= 1) {
        pushKey('ifPos');
        // The snippet delegates to insert_begin; perform the actual insert-at-begin mutation.
        const node = makeNode(v);
        working.nodes[node.id] = node;
        hl.newId = node.id;

        if (!working.headId) {
          working.headId = node.id;
          working.tailId = node.id;
          working.size += 1;
          hl.headId = node.id;
          hl.tailId = node.id;
          working.nodes[node.id].nextId = node.id;
        } else {
          node.nextId = working.headId;
          if (working.tailId) working.nodes[working.tailId].nextId = node.id;
          working.headId = node.id;
          working.size += 1;
          hl.headId = node.id;
        }

        if (codeLanguageKey === 'python') {
          pushKey('returnBegin');
        } else {
          pushKey('callBegin');
          pushKey('returnVoid');
        }

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
      let prev = working.headId; hl.prevId = prev; pushKey('initPrev');
      let i = 1; pushKey('initI');
      pushKey('whileCheck');
      while (i < pos - 1 && prev && working.nodes[prev]?.nextId !== working.headId) {
        // Highlight the loop header each iteration (Python: while, C/C++: for)
        pushKey('whileCheck');
        prev = working.nodes[prev].nextId;
        hl.prevId = prev;
        pushKey('movePrev');
        i += 1;
        pushKey('incI');
      }
      node.nextId = working.nodes[prev]?.nextId ?? working.headId;
      pushKey('setNodeNext');
      working.nodes[prev].nextId = node.id;
      pushKey('linkPrev');
      working.size += 1;
      if (node.nextId === working.headId) {
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
        working.headId = null; working.tailId = null; working.size = 0;
        if (lineMap.delete_begin[codeLanguageKey]?.returnEmpty) pushKey('returnEmpty');
        return;
      }
      pushKey('single');
      const oldHead = working.headId; hl.targetId = oldHead;
      working.headId = working.nodes[oldHead]?.nextId ?? null;
      hl.headId = working.headId;
      working.size -= 1;
      pushKey('moveHead');
      if (working.tailId) working.nodes[working.tailId].nextId = working.headId;
      pushKey('fixTail');
      delete working.nodes[oldHead];
    }

    if (op === 'delete_end') {
      // Never show a stale "new" highlight during delete-from-end traversal.
      hl.newId = null;
      hl.currentId = null;
      hl.prevId = null;
      pushKey('def');
      if (!working.headId) { pushKey('empty'); setIsRunning(false); return; }
      pushKey('empty');
      if (working.headId === working.tailId) {
        pushKey('single');
        working.headId = null; working.tailId = null; working.size = 0;
        if (lineMap.delete_end[codeLanguageKey]?.returnEmpty) pushKey('returnEmpty');
        return;
      }
      pushKey('single');
      pushKey('initPrev');
      let prev = working.headId;
      hl.prevId = prev;
      pushKey('whileCheck');
      while (prev && working.nodes[prev]?.nextId !== working.tailId) {
        // Highlight the loop header each iteration.
        hl.newId = null;
        hl.currentId = null;
        pushKey('whileCheck');
        prev = working.nodes[prev].nextId;
        hl.prevId = prev;
        pushKey('movePrev');
      }
      const oldTail = working.tailId;
      hl.targetId = oldTail;
      if (lineMap.delete_end[codeLanguageKey]?.freeTail) pushKey('freeTail');
      working.nodes[prev].nextId = working.headId;
      pushKey('linkPrevToHead');
      working.tailId = prev;
      hl.tailId = prev;
      working.size -= 1;
      pushKey('setTail');
      delete working.nodes[oldTail];
    }

    if (op === 'delete_pos') {
      const pos = parsePos();
      pushKey('def');
      if (!working.headId || pos == null || pos < 1) {
        pushKey('invalid');
        pushKey('returnPair');
        setIsRunning(false);
        return;
      }
      pushKey('ifPos1');
      if (pos === 1) {
        // The snippet delegates to delete_begin; perform the actual delete-at-begin mutation.
        const oldHead = working.headId;
        hl.targetId = oldHead;
        if (working.headId === working.tailId) {
          working.headId = null;
          working.tailId = null;
          working.size = 0;
          hl.headId = null;
          hl.tailId = null;
        } else {
          working.headId = working.nodes[oldHead]?.nextId ?? null;
          hl.headId = working.headId;
          working.size -= 1;
          if (working.tailId) working.nodes[working.tailId].nextId = working.headId;
        }
        delete working.nodes[oldHead];

        if (codeLanguageKey === 'python') {
          pushKey('returnBegin');
        } else {
          pushKey('callBegin');
          pushKey('returnVoid');
        }

        await runSteps(steps);
        setIsRunning(false);
        setIsPaused(false);
        isPausedRef.current = false;
        setCurrentLine(null);
        return;
      }
      let prev = working.headId;
      hl.prevId = prev;
      pushKey('initPrev');
      let i = 1;
      if (lineMap.delete_pos[codeLanguageKey]?.initI) pushKey('initI');
      pushKey('whileCheck');
      while (i < pos - 1 && prev && working.nodes[prev]?.nextId !== working.headId) {
        // Highlight the loop header each iteration (Python: while, C/C++: for)
        pushKey('whileCheck');
        prev = working.nodes[prev].nextId;
        hl.prevId = prev;
        pushKey('movePrev');
        i += 1;
        if (lineMap.delete_pos[codeLanguageKey]?.incI) pushKey('incI');
      }
      const target = working.nodes[prev]?.nextId ?? null;
      hl.targetId = target;
      pushKey('setTarget');
      if (!target) { setIsRunning(false); return; }
      working.nodes[prev].nextId = working.nodes[target]?.nextId ?? working.headId;
      pushKey('bypass');
      if (target === working.tailId) {
        working.tailId = prev;
        hl.tailId = prev;
        pushKey('maybeTail');
      }
      pushKey('freeTarget');
      delete working.nodes[target];
      if (lineMap.delete_pos[codeLanguageKey]?.returnPair2) pushKey('returnPair2');
    }

    if (op === 'traverse') {
      pushKey('def');
      if (!working.headId) { pushKey('empty'); setIsRunning(false); return; }
      pushKey('init');
      let curr = working.headId;
      hl.currentId = curr;
      pushKey('loopStart');
      do {
        const val = working.nodes[curr]?.value;
        out.push(`Visited: ${val}`);
        pushKey('visit');
        curr = working.nodes[curr]?.nextId ?? null;
        hl.currentId = curr;
        pushKey('advance');
      } while (curr && curr !== working.headId);
      // Python uses explicit break-check, C/C++ uses do-while condition
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
        setIsRunning(false);
        return;
      }
      let idx = 1;
      pushKey('initIdx');
      let curr = working.headId;
      pushKey('initCurr');
      hl.currentId = curr;
      pushKey('loopStart');
      do {
        pushKey('check');
        if (working.nodes[curr]?.value === key) {
          out.push(`Found: ${key} at node n${idx}`);
          // For all languages, highlight the return-on-found line (same as check line in snippets)
          pushKey('check');
          break;
        }
        curr = working.nodes[curr]?.nextId ?? null;
        hl.currentId = curr;
        pushKey('advance');
        idx += 1;
        pushKey('incIdx');
      } while (curr && curr !== working.headId);
      const notFound = curr === working.headId && working.nodes[curr]?.value !== key;
      if (notFound) {
        if (lineMap.search[codeLanguageKey]?.breakCheck) pushKey('breakCheck');
        if (lineMap.search[codeLanguageKey]?.loopCond) pushKey('loopCond');
        out.push(`Not found: ${key}`);
        pushKey('returnNotFound');
      }
    }

    await runSteps(steps);
    setIsRunning(false);
    setIsPaused(false);
    isPausedRef.current = false;
    setCurrentLine(null);
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">Circular Singly Linked List</h1>
        <p className="algorithm-description">A singly linked list where the tail re-connects to the head, forming a cycle.</p>
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
              {['python','c','c++'].map(lang => (
                <button key={lang} className={`language-tab ${language === lang ? 'active' : ''}`} onClick={() => setLanguage(lang)}>
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
                <input id="list-input" type="text" className="array-input" value={listInput} onChange={e => setListInput(e.target.value)} placeholder="e.g., 10, 20, 30" disabled={isRunning} />
                <button onClick={applyListInput} disabled={isRunning} className="control-btn apply-btn">Set List</button>
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="operation-select">Operation</label>
              <select id="operation-select" className="select-input" value={operation} onChange={e => setOperation(e.target.value)} disabled={isRunning}>
                {OPERATIONS.map(op => (
                  <option key={op.key} value={op.key}>{op.label}</option>
                ))}
              </select>
            </div>

            {(operation.includes('insert') || operation.includes('pos')) && (
              <div className="control-group">
                <label className="control-label" htmlFor="value-input">Value</label>
                <input id="value-input" type="text" className="array-input" value={valueInput} onChange={e => setValueInput(e.target.value)} disabled={isRunning} placeholder="Enter value" />
              </div>
            )}

            {operation.includes('pos') && (
              <div className="control-group">
                <label className="control-label" htmlFor="pos-input">Position</label>
                <input id="pos-input" type="text" className="array-input" value={posInput} onChange={e => setPosInput(e.target.value)} disabled={isRunning} placeholder="Enter position" />
              </div>
            )}

            {operation === 'search' && (
              <div className="control-group">
                <label className="control-label" htmlFor="search-input">Search Value</label>
                <input id="search-input" type="text" className="array-input" value={searchInput} onChange={e => setSearchInput(e.target.value)} disabled={isRunning} placeholder="Enter value to search" />
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
              <input id="speed-slider" className="slider" type="range" min="100" max="2000" step="100" value={speed} onChange={e => { const s = Number(e.target.value); setSpeed(s); speedRef.current = s; }} />
              <div className="slider-labels"><span>Fast</span><span>Slow</span></div>
            </div>

            {output.length > 0 && (
              <div className="output-section">
                <h3>Output</h3>
                <div className="output-content">{output.map((line, idx) => (<div key={idx}>{line}</div>))}</div>
              </div>
            )}
          </div>

          <div ref={containerRef} className="linkedlist-container" style={{ minHeight: `${height}px` }}>
            <svg width={width} height={height} className="linkedlist-svg">
              <defs>
                <linearGradient id="ll-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.6)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,1)" />
                </linearGradient>
                <marker id="arrowhead" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" className="linkedlist-arrow-marker" />
                </marker>
              </defs>
              {edges.map(edge => {
                const { from, to, key, fromNode, toNode } = edge;
                const isLoop = fromNode.id === listState.tailId && toNode.id === listState.headId;
                if (isLoop) {
                  const pad = 28;
                  const localLeft = Math.max(marginX + 8, Math.min(from.x, to.x) - nodeHalf - pad);
                  const localRight = Math.min(width - marginX - 8, Math.max(from.x, to.x) + nodeHalf + pad);
                  const spanNodes = nodes.filter(n => n.x >= localLeft && n.x <= localRight);
                  const spanMaxY = spanNodes.length ? Math.max(...spanNodes.map(n => n.y)) : Math.max(from.y, to.y);
                  const localBottom = Math.min(height - 30, spanMaxY + nodeHalf + 28);
                  const pathD = [
                    `M ${from.x} ${from.y}`,
                    `H ${localRight}`,
                    `V ${localBottom}`,
                    `H ${localLeft}`,
                    `V ${to.y}`,
                    `H ${to.x}`
                  ].join(' ');
                  return (
                    <path key={key} d={pathD} className="linkedlist-connector-line loop-edge" fill="none" markerEnd="url(#arrowhead)" />
                  );
                }
                if (fromNode.row === toNode.row) {
                  const dx = Math.max(24, Math.min(52, Math.abs(to.x - from.x) / 3));
                  const pathD = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y} ${to.x - dx} ${to.y} ${to.x} ${to.y}`;
                  return (
                    <path key={key} d={pathD} className="linkedlist-connector-line" fill="none" markerEnd="url(#arrowhead)" />
                  );
                } else {
                  const r = 14;
                  // Route cross-row edges near involved nodes to avoid oversized paths
                  const localGutter = Math.min(width - marginX, Math.max(from.x, to.x) + 36);
                  const midY = (from.y + to.y) / 2;
                  const x1 = localGutter; const y1 = from.y; const x2 = to.x; const y2 = to.y;
                  const pathD = [
                    `M ${from.x} ${from.y}`,
                    `H ${x1 - r}`,
                    `Q ${x1} ${y1} ${x1} ${y1 + r}`,
                    `V ${midY - r}`,
                    `Q ${x1} ${midY} ${x1 - r} ${midY}`,
                    `H ${x2 + r}`,
                    `Q ${x2} ${midY} ${x2} ${midY + r}`,
                    `V ${y2}`
                  ].join(' ');
                  return (
                    <path key={key} d={pathD} className="linkedlist-connector-line" fill="none" markerEnd="url(#arrowhead)" />
                  );
                }
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
                    className={`linkedlist-node-card ${highlightClass}`}
                    style={{ position: 'absolute', left: `${nodeInfo.x - nodeHalf}px`, top: `${nodeInfo.y - nodeHalf}px` }}
                  >
                    <div className="linkedlist-node-cell linkedlist-node-cell-data">
                      <div className="linkedlist-node-value">{node?.value ?? ''}</div>
                      <div className="linkedlist-node-cell-label">data</div>
                    </div>
                    <div className="linkedlist-node-cell linkedlist-node-cell-next">
                      <div className="linkedlist-node-pointer" aria-hidden="true" />
                      <div className="linkedlist-node-cell-label">next</div>
                    </div>
                    {(isHead || isTail) && (
                      <div className="linkedlist-node-labels">
                        {isHead && (
                          <>
                            <span className="linkedlist-label-badge head">HEAD</span>
                            <span className="linkedlist-head-arrow">↓</span>
                          </>
                        )}
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

export default CircularLinkedListVisualizer;
