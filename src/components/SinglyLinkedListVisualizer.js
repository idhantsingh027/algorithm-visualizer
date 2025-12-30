import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Visualizer.css';

const OPERATIONS = [
  { key: 'insert_begin', label: 'Insert at Beginning' },
  { key: 'insert_end', label: 'Insert at End' },
  { key: 'insert_pos', label: 'Insert at Position' },
  { key: 'delete_begin', label: 'Delete from Beginning' },
  { key: 'delete_end', label: 'Delete from End' },
  { key: 'delete_pos', label: 'Delete at Position' },
  { key: 'traverse', label: 'Traverse' },
  { key: 'search', label: 'Search' }
];

const codeByOp = {
  insert_begin: {
    python: [
      { line: 1, code: 'def insert_begin(head, tail, value):' },
      { line: 2, code: '    new = Node(value)' },
      { line: 3, code: '    if head is None:' },
      { line: 4, code: '        head = tail = new' },
      { line: 5, code: '        return head, tail' },
      { line: 6, code: '    new.next = head' },
      { line: 7, code: '    head = new' },
      { line: 8, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertBegin(Node** head, Node** tail, int val) {' },
      { line: 2, code: '    Node* node = createNode(val);' },
      { line: 3, code: '    if (*head == NULL) {' },
      { line: 4, code: '        *head = *tail = node;' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    node->next = *head;' },
      { line: 8, code: '    *head = node;' },
      { line: 9, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertBegin(Node*& head, Node*& tail, int val) {' },
      { line: 2, code: '    Node* node = new Node(val);' },
      { line: 3, code: '    if (!head) {' },
      { line: 4, code: '        head = tail = node;' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    node->next = head;' },
      { line: 8, code: '    head = node;' },
      { line: 9, code: '}' }
    ]
  },
  insert_end: {
    python: [
      { line: 1, code: 'def insert_end(head, tail, value):' },
      { line: 2, code: '    new = Node(value)' },
      { line: 3, code: '    if head is None:' },
      { line: 4, code: '        head = tail = new' },
      { line: 5, code: '        return head, tail' },
      { line: 6, code: '    tail.next = new' },
      { line: 7, code: '    tail = new' },
      { line: 8, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertEnd(Node** head, Node** tail, int val) {' },
      { line: 2, code: '    Node* node = createNode(val);' },
      { line: 3, code: '    if (*head == NULL) {' },
      { line: 4, code: '        *head = *tail = node;' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    (*tail)->next = node;' },
      { line: 8, code: '    *tail = node;' },
      { line: 9, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertEnd(Node*& head, Node*& tail, int val) {' },
      { line: 2, code: '    Node* node = new Node(val);' },
      { line: 3, code: '    if (!head) {' },
      { line: 4, code: '        head = tail = node;' },
      { line: 5, code: '        return;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    tail->next = node;' },
      { line: 8, code: '    tail = node;' },
      { line: 9, code: '}' }
    ]
  },
  insert_pos: {
    python: [
      { line: 1, code: 'def insert_pos(head, tail, value, pos):' },
      { line: 2, code: '    if pos < 1: return head, tail' },
      { line: 3, code: '    if pos == 1:' },
      { line: 4, code: '        return insert_begin(head, tail, value)' },
      { line: 5, code: '    new = Node(value)' },
      { line: 6, code: '    prev = head' },
      { line: 7, code: '    i = 1' },
      { line: 8, code: '    while i < pos - 1 and prev:' },
      { line: 9, code: '        prev = prev.next' },
      { line: 10, code: '        i += 1' },
      { line: 11, code: '    if not prev: return head, tail' },
      { line: 12, code: '    new.next = prev.next' },
      { line: 13, code: '    prev.next = new' },
      { line: 14, code: '    if new.next is None: tail = new' },
      { line: 15, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void insertPos(Node** head, Node** tail, int val, int pos) {' },
      { line: 2, code: '    if (pos < 1) return;' },
      { line: 3, code: '    if (pos == 1) { insertBegin(head, tail, val); return; }' },
      { line: 4, code: '    Node* node = createNode(val);' },
      { line: 5, code: '    Node* prev = *head;' },
      { line: 6, code: '    for (int i = 1; i < pos - 1 && prev; i++)' },
      { line: 7, code: '        prev = prev->next;' },
      { line: 8, code: '    if (!prev) return;' },
      { line: 9, code: '    node->next = prev->next;' },
      { line: 10, code: '    prev->next = node;' },
      { line: 11, code: '    if (!node->next) *tail = node;' },
      { line: 12, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void insertPos(Node*& head, Node*& tail, int val, int pos) {' },
      { line: 2, code: '    if (pos < 1) return;' },
      { line: 3, code: '    if (pos == 1) { insertBegin(head, tail, val); return; }' },
      { line: 4, code: '    Node* node = new Node(val);' },
      { line: 5, code: '    Node* prev = head;' },
      { line: 6, code: '    for (int i = 1; i < pos - 1 && prev; i++)' },
      { line: 7, code: '        prev = prev->next;' },
      { line: 8, code: '    if (!prev) return;' },
      { line: 9, code: '    node->next = prev->next;' },
      { line: 10, code: '    prev->next = node;' },
      { line: 11, code: '    if (!node->next) tail = node;' },
      { line: 12, code: '}' }
    ]
  },
  delete_begin: {
    python: [
      { line: 1, code: 'def delete_begin(head, tail):' },
      { line: 2, code: '    if head is None: return head, tail' },
      { line: 3, code: '    head = head.next' },
      { line: 4, code: '    if head is None: tail = None' },
      { line: 5, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deleteBegin(Node** head, Node** tail) {' },
      { line: 2, code: '    if (*head == NULL) return;' },
      { line: 3, code: '    Node* temp = *head;' },
      { line: 4, code: '    *head = (*head)->next;' },
      { line: 5, code: '    if (*head == NULL) *tail = NULL;' },
      { line: 6, code: '    free(temp);' },
      { line: 7, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deleteBegin(Node*& head, Node*& tail) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    Node* temp = head;' },
      { line: 4, code: '    head = head->next;' },
      { line: 5, code: '    if (!head) tail = nullptr;' },
      { line: 6, code: '    delete temp;' },
      { line: 7, code: '}' }
    ]
  },
  delete_end: {
    python: [
      { line: 1, code: 'def delete_end(head, tail):' },
      { line: 2, code: '    if head is None: return head, tail' },
      { line: 3, code: '    if head.next is None:' },
      { line: 4, code: '        return None, None' },
      { line: 5, code: '    prev = head' },
      { line: 6, code: '    while prev.next.next:' },
      { line: 7, code: '        prev = prev.next' },
      { line: 8, code: '    prev.next = None' },
      { line: 9, code: '    tail = prev' },
      { line: 10, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deleteEnd(Node** head, Node** tail) {' },
      { line: 2, code: '    if (*head == NULL) return;' },
      { line: 3, code: '    if ((*head)->next == NULL) {' },
      { line: 4, code: '        free(*head); *head = *tail = NULL; return;' },
      { line: 5, code: '    }' },
      { line: 6, code: '    Node* prev = *head;' },
      { line: 7, code: '    while (prev->next->next) prev = prev->next;' },
      { line: 8, code: '    free(prev->next);' },
      { line: 9, code: '    prev->next = NULL;' },
      { line: 10, code: '    *tail = prev;' },
      { line: 11, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deleteEnd(Node*& head, Node*& tail) {' },
      { line: 2, code: '    if (!head) return;' },
      { line: 3, code: '    if (!head->next) {' },
      { line: 4, code: '        delete head; head = tail = nullptr; return;' },
      { line: 5, code: '    }' },
      { line: 6, code: '    Node* prev = head;' },
      { line: 7, code: '    while (prev->next->next) prev = prev->next;' },
      { line: 8, code: '    delete prev->next;' },
      { line: 9, code: '    prev->next = nullptr;' },
      { line: 10, code: '    tail = prev;' },
      { line: 11, code: '}' }
    ]
  },
  delete_pos: {
    python: [
      { line: 1, code: 'def delete_pos(head, tail, pos):' },
      { line: 2, code: '    if pos < 1 or head is None:' },
      { line: 3, code: '        return head, tail' },
      { line: 4, code: '    if pos == 1:' },
      { line: 5, code: '        return delete_begin(head, tail)' },
      { line: 6, code: '    prev = head' },
      { line: 7, code: '    i = 1' },
      { line: 8, code: '    while i < pos - 1 and prev.next:' },
      { line: 9, code: '        prev = prev.next' },
      { line: 10, code: '        i += 1' },
      { line: 11, code: '    if not prev.next: return head, tail' },
      { line: 12, code: '    target = prev.next' },
      { line: 13, code: '    prev.next = target.next' },
      { line: 14, code: '    if prev.next is None: tail = prev' },
      { line: 15, code: '    return head, tail' }
    ],
    c: [
      { line: 1, code: 'void deletePos(Node** head, Node** tail, int pos) {' },
      { line: 2, code: '    if (pos < 1 || *head == NULL) return;' },
      { line: 3, code: '    if (pos == 1) { deleteBegin(head, tail); return; }' },
      { line: 4, code: '    Node* prev = *head;' },
      { line: 5, code: '    for (int i = 1; i < pos - 1 && prev->next; i++)' },
      { line: 6, code: '        prev = prev->next;' },
      { line: 7, code: '    if (!prev->next) return;' },
      { line: 8, code: '    Node* target = prev->next;' },
      { line: 9, code: '    prev->next = target->next;' },
      { line: 10, code: '    if (!prev->next) *tail = prev;' },
      { line: 11, code: '    free(target);' },
      { line: 12, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void deletePos(Node*& head, Node*& tail, int pos) {' },
      { line: 2, code: '    if (pos < 1 || !head) return;' },
      { line: 3, code: '    if (pos == 1) { deleteBegin(head, tail); return; }' },
      { line: 4, code: '    Node* prev = head;' },
      { line: 5, code: '    for (int i = 1; i < pos - 1 && prev->next; i++)' },
      { line: 6, code: '        prev = prev->next;' },
      { line: 7, code: '    if (!prev->next) return;' },
      { line: 8, code: '    Node* target = prev->next;' },
      { line: 9, code: '    prev->next = target->next;' },
      { line: 10, code: '    if (!prev->next) tail = prev;' },
      { line: 11, code: '    delete target;' },
      { line: 12, code: '}' }
    ]
  },
  traverse: {
    python: [
      { line: 1, code: 'def traverse(head):' },
      { line: 2, code: '    curr = head' },
      { line: 3, code: '    while curr is not None:' },
      { line: 4, code: '        print(curr.value)' },
      { line: 5, code: '        curr = curr.next' }
    ],
    c: [
      { line: 1, code: 'void traverse(Node* head) {' },
      { line: 2, code: '    Node* curr = head;' },
      { line: 3, code: '    while (curr != NULL) {' },
      { line: 4, code: '        printf("%d ", curr->data);' },
      { line: 5, code: '        curr = curr->next;' },
      { line: 6, code: '    }' },
      { line: 7, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'void traverse(Node* head) {' },
      { line: 2, code: '    Node* curr = head;' },
      { line: 3, code: '    while (curr) {' },
      { line: 4, code: '        cout << curr->data << " ";' },
      { line: 5, code: '        curr = curr->next;' },
      { line: 6, code: '    }' },
      { line: 7, code: '}' }
    ]
  },
  search: {
    python: [
      { line: 1, code: 'def search(head, key):' },
      { line: 2, code: '    curr = head' },
      { line: 3, code: '    while curr is not None:' },
      { line: 4, code: '        if curr.value == key:' },
      { line: 5, code: '            return curr' },
      { line: 6, code: '        curr = curr.next' },
      { line: 7, code: '    return None' }
    ],
    c: [
      { line: 1, code: 'Node* search(Node* head, int key) {' },
      { line: 2, code: '    Node* curr = head;' },
      { line: 3, code: '    while (curr != NULL) {' },
      { line: 4, code: '        if (curr->data == key) return curr;' },
      { line: 5, code: '        curr = curr->next;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    return NULL;' },
      { line: 8, code: '}' }
    ],
    cpp: [
      { line: 1, code: 'Node* search(Node* head, int key) {' },
      { line: 2, code: '    Node* curr = head;' },
      { line: 3, code: '    while (curr) {' },
      { line: 4, code: '        if (curr->data == key) return curr;' },
      { line: 5, code: '        curr = curr->next;' },
      { line: 6, code: '    }' },
      { line: 7, code: '    return nullptr;' },
      { line: 8, code: '}' }
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
    nodes[id] = { id, value, nextId: null };
    if (!headId) headId = id;
    if (tailId) nodes[tailId].nextId = id;
    tailId = id;
  });
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
  const nodeWidth = 92;
  const nodeDataWidth = nodeWidth / 2;
  const nodeHalf = nodeWidth / 2;
  const marginX = 35;
  const paddingX = nodeHalf + marginX;
  const paddingY = 90;
  const nodeGapX = 146;
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
    } else {
      // If this node ends a row (and another row follows), keep NULL closer to the node
      // so the wrap connector has more breathing room.
      const isLastInRow = (i + 1) % maxPerRow === 0 && i < order.length - 1;
      const nullOffset = isLastInRow ? 44 : 64;
      const nullX = fromNode.x + nullOffset;
      const nullY = fromNode.y - 28;
      edges.push({ kind: 'null', key: `${fromId}->null`, from: fromAnchor, to: { x: nullX, y: nullY }, fromNode });
    }
  }

  return { width, height, nodes, edges, nodeHalf, marginX };
}

function SinglyLinkedListVisualizer() {
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
  const codeLines = useMemo(() => codeByOp[operation]?.[language] ?? [], [operation, language]);

  const sleep = async () => {
    await new Promise(resolve => setTimeout(resolve, speedRef.current));
    if (isPausedRef.current) {
      await new Promise(resolve => {
        pausedResolve.current = resolve;
      });
    }
  };

  const togglePause = () => {
    if (!isRunning) return;
    if (isPausedRef.current) {
      isPausedRef.current = false;
      setIsPaused(false);
      if (pausedResolve.current) {
        pausedResolve.current();
        pausedResolve.current = null;
      }
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
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
      setCurrentLine(step.line ?? null);
      if (step.state) setListState(step.state);
      if (step.highlights) setHighlights(step.highlights);
      if (step.output) setOutput(step.output);
      await sleep();
    }
  };

  const buildStep = (line, state, hl, out) => ({
    line,
    state: state ? cloneListState(state) : null,
    highlights: hl ? { ...hl } : null,
    output: out ? [...out] : null
  });

  const startOperation = async () => {
    if (isRunning) return;
    resetVisualization();
    setIsRunning(true);

    const steps = [];
    let working = cloneListState(listState);
    let hl = {
      headId: working.headId,
      tailId: working.tailId,
      currentId: null,
      prevId: null,
      newId: null,
      targetId: null
    };
    let out = [];

    const push = (line) => {
      steps.push(buildStep(line, working, hl, out));
    };

    const op = operation;

    if (op === 'insert_begin') {
      const v = parseValue();
      if (v == null) {
        setInputError('Enter a valid value (1-999).');
        setIsRunning(false);
        return;
      }

      const node = makeNode(v);
      working.nodes[node.id] = node;
      hl.newId = node.id;

      push(1);
      push(2);
      if (!working.headId) {
        push(3);
        working.headId = node.id;
        working.tailId = node.id;
        working.size += 1;
        hl.headId = working.headId;
        hl.tailId = working.tailId;
        push(4);
        push(5);
      } else {
        push(3);
        node.nextId = working.headId;
        push(6);
        working.headId = node.id;
        working.size += 1;
        hl.headId = working.headId;
        push(7);
        push(8);
      }
    }

    if (op === 'insert_end') {
      const v = parseValue();
      if (v == null) {
        setInputError('Enter a valid value (1-999).');
        setIsRunning(false);
        return;
      }

      const node = makeNode(v);
      working.nodes[node.id] = node;
      hl.newId = node.id;

      push(1);
      push(2);
      if (!working.headId) {
        push(3);
        working.headId = node.id;
        working.tailId = node.id;
        working.size += 1;
        hl.headId = working.headId;
        hl.tailId = working.tailId;
        push(4);
        push(5);
      } else {
        push(3);
        const tail = working.tailId;
        hl.currentId = tail;
        push(6);
        working.nodes[tail].nextId = node.id;
        working.tailId = node.id;
        working.size += 1;
        hl.tailId = working.tailId;
        push(7);
        push(8);
      }
    }

    if (op === 'insert_pos') {
      const v = parseValue();
      const pos = parsePos();
      if (v == null || pos == null) {
        setInputError('Enter valid value and position.');
        setIsRunning(false);
        return;
      }

      const node = makeNode(v);
      working.nodes[node.id] = node;
      hl.newId = node.id;

      push(1);
      if (pos < 1) {
        push(2);
        setIsRunning(false);
        return;
      }
      push(2);

      if (pos === 1) {
        push(3);
        node.nextId = working.headId;
        working.headId = node.id;
        if (!working.tailId) working.tailId = node.id;
        working.size += 1;
        hl.headId = working.headId;
        push(4);
      } else {
        push(3);
        push(5);
        let prev = working.headId;
        hl.prevId = prev;
        push(6);
        let i = 1;
        push(7);
        push(8);
        while (i < pos - 1 && prev && working.nodes[prev]?.nextId) {
          push(9);
          prev = working.nodes[prev].nextId;
          hl.prevId = prev;
          push(10);
          i += 1;
        }
        push(8);

        if (!prev) {
          push(11);
          setIsRunning(false);
          return;
        }
        push(11);

        node.nextId = working.nodes[prev]?.nextId ?? null;
        push(12);
        working.nodes[prev].nextId = node.id;
        working.size += 1;
        push(13);

        if (!node.nextId) {
          working.tailId = node.id;
          hl.tailId = working.tailId;
          push(14);
        } else {
          push(14);
        }
        push(15);
      }
    }

    if (op === 'delete_begin') {
      push(1);
      if (!working.headId) {
        push(2);
        setIsRunning(false);
        return;
      }
      push(2);

      const oldHead = working.headId;
      hl.targetId = oldHead;
      push(3);

      working.headId = working.nodes[oldHead]?.nextId ?? null;
      hl.headId = working.headId;
      working.size -= 1;
      push(4);

      if (!working.headId) {
        working.tailId = null;
        hl.tailId = null;
        push(5);
      } else {
        push(5);
      }

      delete working.nodes[oldHead];
    }

    if (op === 'delete_end') {
      push(1);
      if (!working.headId) {
        push(2);
        setIsRunning(false);
        return;
      }
      push(2);

      if (!working.nodes[working.headId]?.nextId) {
        push(3);
        hl.targetId = working.headId;
        delete working.nodes[working.headId];
        working.headId = null;
        working.tailId = null;
        working.size = 0;
        hl.headId = null;
        hl.tailId = null;
        push(4);
      } else {
        push(3);
        let prev = working.headId;
        hl.prevId = prev;
        push(5);
        push(6);
        while (working.nodes[prev]?.nextId && working.nodes[working.nodes[prev].nextId]?.nextId) {
          push(7);
          prev = working.nodes[prev].nextId;
          hl.prevId = prev;
        }
        push(6);

        const target = working.nodes[prev]?.nextId;
        hl.targetId = target;
        push(8);
        working.nodes[prev].nextId = null;
        working.tailId = prev;
        working.size -= 1;
        hl.tailId = working.tailId;
        push(9);
        push(10);
        if (target) delete working.nodes[target];
      }
    }

    if (op === 'delete_pos') {
      const pos = parsePos();
      if (pos == null) {
        setInputError('Enter a valid position.');
        setIsRunning(false);
        return;
      }

      push(1);
      if (pos < 1 || !working.headId) {
        push(2);
        push(3);
        setIsRunning(false);
        return;
      }
      push(2);
      push(3);

      if (pos === 1) {
        push(4);
        const oldHead = working.headId;
        hl.targetId = oldHead;
        working.headId = working.nodes[oldHead]?.nextId ?? null;
        hl.headId = working.headId;
        if (!working.headId) {
          working.tailId = null;
          hl.tailId = null;
        }
        working.size -= 1;
        delete working.nodes[oldHead];
        push(5);
      } else {
        push(4);
        let prev = working.headId;
        hl.prevId = prev;
        push(6);
        let i = 1;
        push(7);
        push(8);
        while (i < pos - 1 && working.nodes[prev]?.nextId) {
          push(9);
          prev = working.nodes[prev].nextId;
          hl.prevId = prev;
          push(10);
          i += 1;
        }
        push(8);

        if (!working.nodes[prev]?.nextId) {
          push(11);
          setIsRunning(false);
          return;
        }
        push(11);

        const target = working.nodes[prev].nextId;
        hl.targetId = target;
        push(12);
        working.nodes[prev].nextId = working.nodes[target]?.nextId ?? null;
        working.size -= 1;
        push(13);

        if (!working.nodes[prev].nextId) {
          working.tailId = prev;
          hl.tailId = working.tailId;
          push(14);
        } else {
          push(14);
        }

        delete working.nodes[target];
        push(15);
      }
    }

    if (op === 'traverse') {
      push(1);
      let curr = working.headId;
      hl.currentId = curr;
      push(2);
      push(3);
      while (curr) {
        hl.currentId = curr;
        push(4);
        out.push(`Visited: ${working.nodes[curr]?.value}`);
        push(5);
        curr = working.nodes[curr]?.nextId ?? null;
      }
      push(3);
    }

    if (op === 'search') {
      const key = parseSearch();
      if (key == null) {
        setInputError('Enter a valid search value.');
        setIsRunning(false);
        return;
      }

      push(1);
      let curr = working.headId;
      hl.currentId = curr;
      push(2);
      push(3);
      let found = false;
      let idx = 1;
      while (curr) {
        hl.currentId = curr;
        push(4);
        if (working.nodes[curr]?.value === key) {
          push(5);
          out.push(`Found: ${key} at node n${idx}`);
          found = true;
          break;
        }
        push(4);
        push(6);
        curr = working.nodes[curr]?.nextId ?? null;
        idx += 1;
      }
      push(3);

      if (!found) {
        push(7);
        out.push(`Not found: ${key}`);
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
        <h1 className="visualizer-title">Singly Linked List</h1>
        <p className="algorithm-description">
          A linear data structure where each element (node) contains data and a pointer to the next node in the sequence.
        </p>
        <div className="complexity-info">
          <div className="complexity-badge">Insert/Delete at Head: O(1)</div>
          <div className="complexity-badge">Insert/Delete at Position: O(n)</div>
          <div className="complexity-badge">Search: O(n)</div>
        </div>
      </div>

      <div className="visualizer-content">
        <div className="code-section">
          <div className="code-header">
            <div className="language-tabs">
              <button
                className={`language-tab ${language === 'python' ? 'active' : ''}`}
                onClick={() => setLanguage('python')}
              >
                Python
              </button>
              <button
                className={`language-tab ${language === 'c' ? 'active' : ''}`}
                onClick={() => setLanguage('c')}
              >
                C
              </button>
              <button
                className={`language-tab ${language === 'cpp' ? 'active' : ''}`}
                onClick={() => setLanguage('cpp')}
              >
                C++
              </button>
            </div>
          </div>
          <div className="code-display">
            {codeLines.map(({ line, code }) => (
              <div key={line} className={`code-line ${currentLine === line ? 'highlighted' : ''}`}>
                <span className="line-number">{line}</span>
                <span className="line-code">{code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="visualization-section">
          <div className="controls">
            <div className="control-group">
              <label htmlFor="list-input" className="control-label">Initial List (comma-separated)</label>
              <div className="input-group">
                <input
                  type="text"
                  id="list-input"
                  className="array-input"
                  value={listInput}
                  onChange={e => setListInput(e.target.value)}
                  placeholder="e.g., 10, 20, 30"
                  disabled={isRunning}
                />
                <button onClick={applyListInput} disabled={isRunning} className="control-btn apply-btn">
                  Set List
                </button>
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
            </div>

            <div className="control-group">
              <label htmlFor="operation-select" className="control-label">Operation</label>
              <select
                id="operation-select"
                className="select-input"
                value={operation}
                onChange={e => setOperation(e.target.value)}
                disabled={isRunning}
              >
                {OPERATIONS.map(op => (
                  <option key={op.key} value={op.key}>
                    {op.label}
                  </option>
                ))}
              </select>
            </div>

            {(operation.includes('insert') || operation.includes('pos')) && (
              <div className="control-group">
                <label htmlFor="value-input" className="control-label">Value</label>
                <input
                  type="text"
                  id="value-input"
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
                <label htmlFor="pos-input" className="control-label">Position</label>
                <input
                  type="text"
                  id="pos-input"
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
                <label htmlFor="search-input" className="control-label">Search Value</label>
                <input
                  type="text"
                  id="search-input"
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
                <button onClick={startOperation} disabled={isRunning} className="control-btn primary">
                  Run
                </button>
                <button onClick={togglePause} disabled={!isRunning} className="control-btn">
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              </div>
            </div>

            <div className="control-group">
              <div className="control-label-row">
                <label htmlFor="speed-slider" className="control-label">Speed</label>
                <span className="control-value">{speed}ms</span>
              </div>
              <input
                type="range"
                id="speed-slider"
                className="slider"
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
              <div className="slider-labels">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>

            {output.length > 0 && (
              <div className="output-section">
                <h3>Output</h3>
                <div className="output-content">
                  {output.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={containerRef} className="linkedlist-container" style={{ minHeight: `${height}px` }}>
            <svg width={width} height={height} className="linkedlist-svg">
              <defs>
                <linearGradient id="ll-line-grad" x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.9)" />
                </linearGradient>
                <marker
                  id="arrowhead"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5.5"
                  markerHeight="5.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" className="linkedlist-arrow-marker" />
                </marker>
              </defs>
              {edges.map(edge => {
                const { from, to, key, kind, fromNode, toNode } = edge;
                if (kind === 'null') {
                  const c1x = from.x + 18;
                  const c1y = from.y - 22;
                  const c2x = to.x - 10;
                  const c2y = to.y;
                  const pathD = `M ${from.x} ${from.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${to.x} ${to.y}`;
                  return (
                    <g key={key}>
                      <path d={pathD} className="linkedlist-connector-line" fill="none" stroke="url(#ll-line-grad)" markerEnd="url(#arrowhead)" />
                      <text x={to.x + 12} y={to.y} className="linkedlist-null-label" dominantBaseline="middle" textAnchor="start">
                        NULL
                      </text>
                    </g>
                  );
                }

                if (fromNode.row === toNode.row) {
                  const dx = Math.max(24, Math.min(52, Math.abs(to.x - from.x) / 3));
                  const pathD = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y} ${to.x - dx} ${to.y} ${to.x} ${to.y}`;
                  return (
                    <path
                      key={key}
                      d={pathD}
                      className="linkedlist-connector-line"
                      fill="none"
                      stroke="url(#ll-line-grad)"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                } else {
                  const r = 14;
                  const gutterX = width - marginX;
                  const midY = (from.y + to.y) / 2;

                  const x1 = gutterX;
                  const y1 = from.y;
                  const x2 = to.x;
                  const y2 = to.y;

                  // Rounded-rectangle style routing with smooth corners.
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
                    <path
                      key={key}
                      d={pathD}
                      className="linkedlist-connector-line"
                      fill="none"
                      stroke="url(#ll-line-grad)"
                      markerEnd="url(#arrowhead)"
                    />
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
                    style={{
                      position: 'absolute',
                      left: `${nodeInfo.x - nodeHalf}px`,
                      top: `${nodeInfo.y - nodeHalf}px`
                    }}
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

export default SinglyLinkedListVisualizer;
