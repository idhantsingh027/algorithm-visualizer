import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Visualizer.css';

const CODE_SNIPPETS = {
  python: {
    insert_begin: [
      'class Node:',
      '    def __init__(self, value):',
      '        self.value = value',
      '        self.prev = None',
      '        self.next = None',
      '',
      'def insert_begin(head, value):',
      '    node = Node(value)',
      '    node.next = head',
      '    if head:',
      '        head.prev = node',
      '    return node'
    ],
    insert_end: [
      'def insert_end(head, value):',
      '    node = Node(value)',
      '    if head is None:',
      '        return node',
      '    tail = head',
      '    while tail.next:',
      '        tail = tail.next',
      '    tail.next = node',
      '    node.prev = tail',
      '    return head'
    ],
    insert_pos: [
      'def insert_pos(head, value, pos):',
      '    node = Node(value)',
      '    if head is None or pos <= 1:',
      '        node.next = head',
      '        if head:',
      '            head.prev = node',
      '        return node',
      '    i = 1',
      '    prev = head',
      '    while i < pos - 1 and prev.next:',
      '        prev = prev.next',
      '        i += 1',
      '    node.next = prev.next',
      '    node.prev = prev',
      '    if prev.next:',
      '        prev.next.prev = node',
      '    prev.next = node',
      '    return head'
    ],
    delete_begin: [
      'def delete_begin(head):',
      '    if head is None:',
      '        return None',
      '    new_head = head.next',
      '    if new_head:',
      '        new_head.prev = None',
      '    return new_head'
    ],
    delete_end: [
      'def delete_end(head):',
      '    if head is None:',
      '        return None',
      '    tail = head',
      '    while tail.next:',
      '        tail = tail.next',
      '    if tail.prev:',
      '        tail.prev.next = None',
      '    else:',
      '        return None',
      '    return head'
    ],
    delete_pos: [
      'def delete_pos(head, pos):',
      '    if head is None:',
      '        return None',
      '    if pos <= 1:',
      '        new_head = head.next',
      '        if new_head:',
      '            new_head.prev = None',
      '        return new_head',
      '    i = 1',
      '    curr = head',
      '    while i < pos and curr:',
      '        curr = curr.next',
      '        i += 1',
      '    if curr is None:',
      '        return head',
      '    if curr.prev:',
      '        curr.prev.next = curr.next',
      '    if curr.next:',
      '        curr.next.prev = curr.prev',
      '    return head'
    ],
    traverse: [
      'def traverse(head):',
      '    curr = head',
      '    while curr:',
      '        print(curr.value)',
      '        curr = curr.next'
    ],
    search: [
      'def search(head, key):',
      '    idx = 1',
      '    curr = head',
      '    while curr:',
      '        if curr.value == key:',
      '            return idx',
      '        curr = curr.next',
      '        idx += 1',
      '    return -1'
    ]
  },
  c: {
    insert_begin: [
      'typedef struct Node {',
      '    int value;',
      '    struct Node* prev;',
      '    struct Node* next;',
      '} Node;',
      '',
      'Node* insert_begin(Node* head, int value) {',
      '    Node* node = (Node*)malloc(sizeof(Node));',
      '    node->value = value;',
      '    node->prev = NULL;',
      '    node->next = head;',
      '    if (head) head->prev = node;',
      '    return node;',
      '}'
    ],
    insert_end: [
      'Node* insert_end(Node* head, int value) {',
      '    Node* node = (Node*)malloc(sizeof(Node));',
      '    node->value = value;',
      '    node->prev = NULL;',
      '    node->next = NULL;',
      '    if (!head) return node;',
      '    Node* tail = head;',
      '    while (tail->next) {',
      '        tail = tail->next;',
      '    }',
      '    tail->next = node;',
      '    node->prev = tail;',
      '    return head;',
      '}'
    ],
    insert_pos: [
      'Node* insert_pos(Node* head, int value, int pos) {',
      '    Node* node = (Node*)malloc(sizeof(Node));',
      '    node->value = value;',
      '    node->prev = NULL;',
      '    node->next = NULL;',
      '    if (!head || pos <= 1) {',
      '        node->next = head;',
      '        if (head) head->prev = node;',
      '        return node;',
      '    }',
      '    int i = 1;',
      '    Node* prev = head;',
      '    while (i < pos - 1 && prev->next) {',
      '        prev = prev->next;',
      '        i++;',
      '    }',
      '    node->next = prev->next;',
      '    node->prev = prev;',
      '    if (prev->next) prev->next->prev = node;',
      '    prev->next = node;',
      '    return head;',
      '}'
    ],
    delete_begin: [
      'Node* delete_begin(Node* head) {',
      '    if (!head) return NULL;',
      '    Node* newHead = head->next;',
      '    if (newHead) newHead->prev = NULL;',
      '    free(head);',
      '    return newHead;',
      '}'
    ],
    delete_end: [
      'Node* delete_end(Node* head) {',
      '    if (!head) return NULL;',
      '    Node* tail = head;',
      '    while (tail->next) {',
      '        tail = tail->next;',
      '    }',
      '    if (tail->prev) {',
      '        tail->prev->next = NULL;',
      '    } else {',
      '        free(tail);',
      '        return NULL;',
      '    }',
      '    free(tail);',
      '    return head;',
      '}'
    ],
    delete_pos: [
      'Node* delete_pos(Node* head, int pos) {',
      '    if (!head) return NULL;',
      '    if (pos <= 1) {',
      '        Node* newHead = head->next;',
      '        if (newHead) newHead->prev = NULL;',
      '        free(head);',
      '        return newHead;',
      '    }',
      '    int i = 1;',
      '    Node* curr = head;',
      '    while (i < pos && curr) {',
      '        curr = curr->next;',
      '        i++;',
      '    }',
      '    if (!curr) return head;',
      '    if (curr->prev) curr->prev->next = curr->next;',
      '    if (curr->next) curr->next->prev = curr->prev;',
      '    free(curr);',
      '    return head;',
      '}'
    ],
    traverse: [
      'void traverse(Node* head) {',
      '    for (Node* curr = head; curr; curr = curr->next)',
      '        printf("%d\\n", curr->value);',
      '}'
    ],
    search: [
      'int search(Node* head, int key) {',
      '    int idx = 1;',
      '    Node* curr = head;',
      '    while (curr) {',
      '        if (curr->value == key) return idx;',
      '        curr = curr->next;',
      '        idx++;',
      '    }',
      '    return -1;',
      '}'
    ]
  },
  'c++': {
    insert_begin: [
      'struct Node {',
      '    int value; Node* prev; Node* next;',
      '    Node(int v): value(v), prev(nullptr), next(nullptr) {}',
      '};',
      '',
      'Node* insert_begin(Node* head, int value) {',
      '    Node* node = new Node(value);',
      '    node->next = head;',
      '    if (head) head->prev = node;',
      '    return node;',
      '}'
    ],
    insert_end: [
      'Node* insert_end(Node* head, int value) {',
      '    Node* node = new Node(value);',
      '    if (!head) return node;',
      '    Node* tail = head;',
      '    while (tail->next) {',
      '        tail = tail->next;',
      '    }',
      '    tail->next = node;',
      '    node->prev = tail;',
      '    return head;',
      '}'
    ],
    insert_pos: [
      'Node* insert_pos(Node* head, int value, int pos) {',
      '    Node* node = new Node(value);',
      '    if (!head || pos <= 1) {',
      '        node->next = head;',
      '        if (head) head->prev = node;',
      '        return node;',
      '    }',
      '    int i = 1;',
      '    Node* prev = head;',
      '    while (i < pos - 1 && prev->next) {',
      '        prev = prev->next;',
      '        i++;',
      '    }',
      '    node->next = prev->next;',
      '    node->prev = prev;',
      '    if (prev->next) prev->next->prev = node;',
      '    prev->next = node;',
      '    return head;',
      '}'
    ],
    delete_begin: [
      'Node* delete_begin(Node* head) {',
      '    if (!head) return nullptr;',
      '    Node* newHead = head->next;',
      '    if (newHead) newHead->prev = nullptr;',
      '    delete head;',
      '    return newHead;',
      '}'
    ],
    delete_end: [
      'Node* delete_end(Node* head) {',
      '    if (!head) return nullptr;',
      '    Node* tail = head;',
      '    while (tail->next) {',
      '        tail = tail->next;',
      '    }',
      '    if (tail->prev) {',
      '        tail->prev->next = nullptr;',
      '    } else {',
      '        delete tail;',
      '        return nullptr;',
      '    }',
      '    delete tail;',
      '    return head;',
      '}'
    ],
    delete_pos: [
      'Node* delete_pos(Node* head, int pos) {',
      '    if (!head) return nullptr;',
      '    if (pos <= 1) {',
      '        Node* newHead = head->next;',
      '        if (newHead) newHead->prev = nullptr;',
      '        delete head;',
      '        return newHead;',
      '    }',
      '    int i = 1;',
      '    Node* curr = head;',
      '    while (i < pos && curr) {',
      '        curr = curr->next;',
      '        i++;',
      '    }',
      '    if (!curr) return head;',
      '    if (curr->prev) curr->prev->next = curr->next;',
      '    if (curr->next) curr->next->prev = curr->prev;',
      '    delete curr;',
      '    return head;',
      '}'
    ],
    traverse: [
      'void traverse(Node* head) {',
      '    for (Node* curr = head; curr; curr = curr->next)',
      '        std::cout << curr->value << "\\n";',
      '}'
    ],
    search: [
      'int search(Node* head, int key) {',
      '    int idx = 1;',
      '    Node* curr = head;',
      '    while (curr) {',
      '        if (curr->value == key) return idx;',
      '        curr = curr->next;',
      '        idx++;',
      '    }',
      '    return -1;',
      '}'
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
  const nodeThird = nodeWidth / 3;
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
    } else {
      const nullX = fromNode.x + 64;
      const nullY = fromNode.y - 28;
      edges.push({ kind: 'null', key: `${fromId}->null`, from: fromNextAnchor, to: { x: nullX, y: nullY }, fromNode });
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

function DoublyLinkedListVisualizer() {
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
  const { width, height, nodes, edges, nodeHalf } = useMemo(
    () => getListLayout(order, listState, canvasWidth),
    [order, listState, canvasWidth]
  );

  const sleep = async () => {
    await new Promise(resolve => setTimeout(resolve, speedRef.current));
    if (isPausedRef.current) {
      await new Promise(resolve => {
        pausedResolve.current = resolve;
      });
    }
  };

  function findLineIndex(language, operation, contains) {
    const lines = CODE_SNIPPETS[language]?.[operation] || [];
    const idx = lines.findIndex(l => l.includes(contains));
    return idx >= 0 ? idx + 1 : null;
  }

  const buildStep = (line, state, hl, out) => ({
    line,
    state: state ? cloneListState(state) : null,
    highlights: hl ? { ...hl } : null,
    output: out ? [...out] : null
  });

  const runSteps = async (steps) => {
    for (const step of steps) {
      setCurrentLine(step.line ?? null);
      if (step.state) setListState(step.state);
      if (step.highlights) setHighlights(step.highlights);
      if (step.output) setOutput(step.output);
      await sleep();
    }
  };

  const startOperation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setCurrentLine(null);
    setOutput([]);
    setInputError('');

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

    const op = operation;

    const TOKENS = {
      python: {
        insert_begin: {
          create: 'node = Node(value)',
          linkNext: 'node.next = head',
          ifHead: 'if head:',
          fixPrev: 'head.prev = node',
          ret: 'return node'
        },
        insert_end: {
          create: 'node = Node(value)',
          ifEmpty: 'if head is None:',
          retNode: 'return node',
          tailInit: 'tail = head',
          whileNext: 'while tail.next:',
          moveTail: 'tail = tail.next',
          linkTail: 'tail.next = node',
          setPrev: 'node.prev = tail',
          retHead: 'return head'
        },
        insert_pos: {
          create: 'node = Node(value)',
          guard: 'if head is None or pos <= 1:',
          linkNextHead: 'node.next = head',
          ifHead: 'if head:',
          fixHeadPrev: 'head.prev = node',
          retNode: 'return node',
          iInit: 'i = 1',
          prevInit: 'prev = head',
          whilePrev: 'while i < pos - 1 and prev.next:',
          movePrev: 'prev = prev.next',
          incI: 'i += 1',
          setNodeNext: 'node.next = prev.next',
          setNodePrev: 'node.prev = prev',
          ifPrevNext: 'if prev.next:',
          fixNextPrev: 'prev.next.prev = node',
          linkPrevNext: 'prev.next = node',
          retHead: 'return head'
        },
        delete_begin: {
          guard: 'if head is None:',
          retNone: 'return None',
          newHead: 'new_head = head.next',
          ifNewHead: 'if new_head:',
          setPrevNull: 'new_head.prev = None',
          retNew: 'return new_head'
        },
        delete_end: {
          guard: 'if head is None:',
          retNone: 'return None',
          tailInit: 'tail = head',
          whileNext: 'while tail.next:',
          moveTail: 'tail = tail.next',
          ifPrev: 'if tail.prev:',
          setPrevNextNull: 'tail.prev.next = None',
          elseLine: 'else:',
          retNone2: 'return None',
          retHead: 'return head'
        },
        delete_pos: {
          guard: 'if head is None:',
          retNone: 'return None',
          ifPos: 'if pos <= 1:',
          newHead: 'new_head = head.next',
          ifNewHead: 'if new_head:',
          setPrevNull: 'new_head.prev = None',
          retNew: 'return new_head',
          iInit: 'i = 1',
          currInit: 'curr = head',
          whileCurr: 'while i < pos and curr:',
          moveCurr: 'curr = curr.next',
          incI: 'i += 1',
          ifCurrNone: 'if curr is None:',
          retHead: 'return head',
          ifCurrPrev: 'if curr.prev:',
          setPrevNext: 'curr.prev.next = curr.next',
          ifCurrNext: 'if curr.next:',
          setNextPrev: 'curr.next.prev = curr.prev',
          retHead2: 'return head'
        },
        traverse: {
          currInit: 'curr = head',
          whileCurr: 'while curr:',
          print: 'print(curr.value)',
          move: 'curr = curr.next'
        },
        search: {
          idxInit: 'idx = 1',
          currInit: 'curr = head',
          whileCurr: 'while curr:',
          ifEq: 'if curr.value == key:',
          retIdx: 'return idx',
          move: 'curr = curr.next',
          incIdx: 'idx += 1',
          retNeg: 'return -1'
        }
      },
      c: {
        insert_begin: {
          create: 'Node* node = (Node*)malloc(sizeof(Node));',
          linkNext: 'node->next = head;',
          ifHead: 'if (head) head->prev = node;',
          ret: 'return node;'
        },
        insert_end: {
          create: 'Node* node = (Node*)malloc(sizeof(Node));',
          ifEmpty: 'if (!head) return node;',
          tailInit: 'Node* tail = head;',
          whileNext: 'while (tail->next) {',
          moveTail: 'tail = tail->next;',
          linkTail: 'tail->next = node;',
          setPrev: 'node->prev = tail;',
          retHead: 'return head;'
        },
        insert_pos: {
          create: 'Node* node = (Node*)malloc(sizeof(Node));',
          guard: 'if (!head || pos <= 1) {',
          linkNextHead: 'node->next = head;',
          ifHead: 'if (head) head->prev = node;',
          retNode: 'return node;',
          iInit: 'int i = 1;',
          prevInit: 'Node* prev = head;',
          whilePrev: 'while (i < pos - 1 && prev->next) {',
          movePrev: 'prev = prev->next;',
          incI: 'i++;',
          setNodeNext: 'node->next = prev->next;',
          setNodePrev: 'node->prev = prev;',
          fixNextPrev: 'if (prev->next) prev->next->prev = node;',
          linkPrevNext: 'prev->next = node;',
          retHead: 'return head;'
        },
        delete_begin: {
          guard: 'if (!head) return NULL;',
          newHead: 'Node* newHead = head->next;',
          setPrevNull: 'if (newHead) newHead->prev = NULL;',
          retNew: 'return newHead;'
        },
        delete_end: {
          guard: 'if (!head) return NULL;',
          tailInit: 'Node* tail = head;',
          whileNext: 'while (tail->next) {',
          moveTail: 'tail = tail->next;',
          ifPrev: 'if (tail->prev) {',
          setPrevNextNull: 'tail->prev->next = NULL;',
          retNull: 'return NULL;',
          retHead: 'return head;'
        },
        delete_pos: {
          guard: 'if (!head) return NULL;',
          ifPos: 'if (pos <= 1) {',
          newHead: 'Node* newHead = head->next;',
          setPrevNull: 'if (newHead) newHead->prev = NULL;',
          retNew: 'return newHead;',
          iInit: 'int i = 1;',
          currInit: 'Node* curr = head;',
          whileCurr: 'while (i < pos && curr) {',
          moveCurr: 'curr = curr->next;',
          incI: 'i++;',
          ifCurrNull: 'if (!curr) return head;',
          setPrevNext: 'if (curr->prev) curr->prev->next = curr->next;',
          setNextPrev: 'if (curr->next) curr->next->prev = curr->prev;',
          retHead: 'return head;'
        },
        traverse: {
          forLine: 'for (Node* curr = head; curr; curr = curr->next)',
          print: 'printf("%d\\n", curr->value);'
        },
        search: {
          idxInit: 'int idx = 1;',
          currInit: 'Node* curr = head;',
          whileCurr: 'while (curr) {',
          ifEq: 'if (curr->value == key) return idx;',
          move: 'curr = curr->next;',
          incIdx: 'idx++;',
          retNeg: 'return -1;'
        }
      },
      'c++': {
        insert_begin: {
          create: 'Node* node = new Node(value);',
          linkNext: 'node->next = head;',
          ifHead: 'if (head) head->prev = node;',
          ret: 'return node;'
        },
        insert_end: {
          create: 'Node* node = new Node(value);',
          ifEmpty: 'if (!head) return node;',
          tailInit: 'Node* tail = head;',
          whileNext: 'while (tail->next) {',
          moveTail: 'tail = tail->next;',
          linkTail: 'tail->next = node;',
          setPrev: 'node->prev = tail;',
          retHead: 'return head;'
        },
        insert_pos: {
          create: 'Node* node = new Node(value);',
          guard: 'if (!head || pos <= 1) {',
          linkNextHead: 'node->next = head;',
          ifHead: 'if (head) head->prev = node;',
          retNode: 'return node;',
          iInit: 'int i = 1;',
          prevInit: 'Node* prev = head;',
          whilePrev: 'while (i < pos - 1 && prev->next) {',
          movePrev: 'prev = prev->next;',
          incI: 'i++;',
          setNodeNext: 'node->next = prev->next;',
          setNodePrev: 'node->prev = prev;',
          fixNextPrev: 'if (prev->next) prev->next->prev = node;',
          linkPrevNext: 'prev->next = node;',
          retHead: 'return head;'
        },
        delete_begin: {
          guard: 'if (!head) return nullptr;',
          newHead: 'Node* newHead = head->next;',
          setPrevNull: 'if (newHead) newHead->prev = nullptr;',
          retNew: 'return newHead;'
        },
        delete_end: {
          guard: 'if (!head) return nullptr;',
          tailInit: 'Node* tail = head;',
          whileNext: 'while (tail->next) {',
          moveTail: 'tail = tail->next;',
          ifPrev: 'if (tail->prev) {',
          setPrevNextNull: 'tail->prev->next = nullptr;',
          retNull: 'return nullptr;',
          retHead: 'return head;'
        },
        delete_pos: {
          guard: 'if (!head) return nullptr;',
          ifPos: 'if (pos <= 1) {',
          newHead: 'Node* newHead = head->next;',
          setPrevNull: 'if (newHead) newHead->prev = nullptr;',
          retNew: 'return newHead;',
          iInit: 'int i = 1;',
          currInit: 'Node* curr = head;',
          whileCurr: 'while (i < pos && curr) {',
          moveCurr: 'curr = curr->next;',
          incI: 'i++;',
          ifCurrNull: 'if (!curr) return head;',
          setPrevNext: 'if (curr->prev) curr->prev->next = curr->next;',
          setNextPrev: 'if (curr->next) curr->next->prev = curr->prev;',
          retHead: 'return head;'
        },
        traverse: {
          forLine: 'for (Node* curr = head; curr; curr = curr->next)',
          print: 'std::cout << curr->value'
        },
        search: {
          idxInit: 'int idx = 1;',
          currInit: 'Node* curr = head;',
          whileCurr: 'while (curr) {',
          ifEq: 'if (curr->value == key) return idx;',
          move: 'curr = curr->next;',
          incIdx: 'idx++;',
          retNeg: 'return -1;'
        }
      }
    };

    const opTokens = TOKENS[language]?.[op] || {};
    const lineFor = (key) => {
      const token = opTokens[key];
      return token ? findLineIndex(language, op, token) : null;
    };

    if (op === 'insert_begin') {
      const v = Number.parseInt(valueInput.trim(), 10);
      if (!Number.isFinite(v)) { setInputError('Enter a valid value'); setIsRunning(false); return; }
      const steps = [];
      const newId = `n${nextIdRef.current++}`;
      const addStep = (key, mut) => { if (mut) mut(); steps.push(buildStep(lineFor(key), working, hl, out)); };
      addStep('create', () => { working.nodes[newId] = { id: newId, value: v, prevId: null, nextId: null }; hl.newId = newId; });
      addStep('linkNext', () => { const oldHead = working.headId; working.nodes[newId].nextId = oldHead || null; });
      addStep('ifHead');
      if (working.headId) {
        addStep('fixPrev', () => { const oldHead = working.headId; working.nodes[oldHead].prevId = newId; });
      }
      addStep('ret', () => { if (!working.headId) { working.tailId = newId; hl.tailId = newId; } working.headId = newId; hl.headId = newId; working.size = (working.size || 0) + 1; });
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'insert_end') {
      const v = Number.parseInt(valueInput.trim(), 10);
      if (!Number.isFinite(v)) { setInputError('Enter a valid value'); setIsRunning(false); return; }
      const steps = [];
      const newId = `n${nextIdRef.current++}`;
      const addStep = (key, mut) => { if (mut) mut(); steps.push(buildStep(lineFor(key), working, hl, out)); };
      addStep('create', () => { working.nodes[newId] = { id: newId, value: v, prevId: null, nextId: null }; hl.newId = newId; });
      if (!working.headId) {
        addStep('ifEmpty');
        const returnKey = language === 'python' ? 'retNode' : null;
        addStep(returnKey ?? 'ifEmpty', () => { working.headId = newId; working.tailId = newId; hl.headId = newId; hl.tailId = newId; working.size = (working.size || 0) + 1; });
      } else {
        addStep('tailInit', () => { hl.currentId = working.headId; });
        let t = working.headId;
        while (working.nodes[t]?.nextId) {
          addStep('whileNext');
          t = working.nodes[t].nextId;
          hl.currentId = t;
          steps.push(buildStep(lineFor('moveTail'), working, hl, out));
        }
        const tailBefore = t;
        addStep('linkTail', () => { working.nodes[tailBefore].nextId = newId; });
        addStep('setPrev', () => { working.nodes[newId].prevId = tailBefore; });
        addStep(language === 'python' ? 'retHead' : 'retHead', () => { working.tailId = newId; hl.tailId = newId; working.size = (working.size || 0) + 1; });
      }
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'insert_pos') {
      const v = Number.parseInt(valueInput.trim(), 10);
      const pos = Number.parseInt(posInput.trim(), 10);
      if (!Number.isFinite(v) || !Number.isFinite(pos)) { setInputError('Enter valid value and position'); setIsRunning(false); return; }
      const steps = [];
      const newId = `n${nextIdRef.current++}`;
      const addStep = (key, mut) => { if (mut) mut(); steps.push(buildStep(lineFor(key), working, hl, out)); };
      addStep('create', () => { working.nodes[newId] = { id: newId, value: v, prevId: null, nextId: null }; hl.newId = newId; });
      if (!working.headId || pos <= 1) {
        addStep('guard');
        addStep('linkNextHead', () => { const oldHead = working.headId; working.nodes[newId].nextId = oldHead || null; });
        addStep('ifHead');
        if (working.headId) {
          addStep('fixHeadPrev', () => { const oldHead = working.headId; working.nodes[oldHead].prevId = newId; });
        }
        addStep('retNode', () => { if (!working.headId) { working.tailId = newId; hl.tailId = newId; } working.headId = newId; hl.headId = newId; working.size = (working.size || 0) + 1; });
      } else {
        addStep('iInit');
        addStep('prevInit', () => { hl.prevId = working.headId; });
        let prev = working.headId; let i = 1;
        while (i < pos - 1 && working.nodes[prev]?.nextId) {
          addStep('whilePrev');
          prev = working.nodes[prev].nextId;
          hl.prevId = prev;
          steps.push(buildStep(lineFor('movePrev'), working, hl, out));
          i += 1;
          steps.push(buildStep(lineFor('incI'), working, hl, out));
        }
        const next = working.nodes[prev]?.nextId ?? null;
        addStep('setNodeNext', () => { working.nodes[newId].nextId = next; });
        addStep('setNodePrev', () => { working.nodes[newId].prevId = prev; });
        if (next) {
          addStep('ifPrevNext');
          addStep('fixNextPrev', () => { working.nodes[next].prevId = newId; });
        }
        addStep('linkPrevNext', () => { working.nodes[prev].nextId = newId; });
        addStep('retHead', () => { working.size = (working.size || 0) + 1; if (!working.nodes[newId].nextId) { working.tailId = newId; hl.tailId = newId; } });
      }
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'delete_begin') {
      const steps = [];
      const addStep = (key, mut) => { if (mut) mut(); steps.push(buildStep(lineFor(key), working, hl, out)); };
      if (!working.headId) {
        out.push('List is empty');
        steps.push(buildStep(lineFor('guard'), working, hl, out));
        await runSteps(steps);
        setIsRunning(false); setCurrentLine(null);
        setListState(working); setHighlights(hl); setOutput(out);
        return;
      }
      addStep('guard');
      const oldHead = working.headId; hl.targetId = oldHead;
      addStep('newHead', () => { const newHead = working.nodes[oldHead]?.nextId ?? null; working.headId = newHead; hl.headId = newHead; });
      if (working.headId) { addStep('setPrevNull', () => { working.nodes[working.headId].prevId = null; }); }
      addStep('retNew', () => {
        if (!working.headId) { working.tailId = null; hl.tailId = null; }
        delete working.nodes[oldHead];
        working.size = Math.max(0, (working.size || 1) - 1);
        hl.targetId = null;
      });
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'delete_end') {
      const steps = [];
      const addStep = (key, mut) => { if (mut) mut(); steps.push(buildStep(lineFor(key), working, hl, out)); };
      if (!working.headId) {
        out.push('List is empty');
        steps.push(buildStep(lineFor('guard'), working, hl, out));
        await runSteps(steps);
        setIsRunning(false); setCurrentLine(null);
        setListState(working); setHighlights(hl); setOutput(out);
        return;
      }
      addStep('guard');
      addStep('tailInit', () => { hl.currentId = working.headId; });
      let t = working.headId;
      while (working.nodes[t]?.nextId) {
        addStep('whileNext');
        t = working.nodes[t].nextId;
        hl.currentId = t;
        steps.push(buildStep(lineFor('moveTail'), working, hl, out));
      }
      const oldTail = t; hl.targetId = oldTail;
      const prev = working.nodes[oldTail]?.prevId ?? null;
      if (prev) {
        addStep('ifPrev');
        addStep('setPrevNextNull', () => { working.nodes[prev].nextId = null; });
        addStep('retHead', () => {
          delete working.nodes[oldTail];
          working.tailId = prev;
          hl.tailId = prev;
          hl.targetId = null;
          working.size = Math.max(0, (working.size || 1) - 1);
        });
      } else {
        if (language === 'python') {
          addStep('elseLine');
          addStep('retNone2', () => {
            delete working.nodes[oldTail];
            working.headId = null; working.tailId = null;
            hl.headId = null; hl.tailId = null; hl.targetId = null;
            working.size = 0;
          });
        } else {
          addStep('retNull', () => {
            delete working.nodes[oldTail];
            working.headId = null; working.tailId = null;
            hl.headId = null; hl.tailId = null; hl.targetId = null;
            working.size = 0;
          });
        }
      }
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'delete_pos') {
      const pos = Number.parseInt(posInput.trim(), 10);
      if (!Number.isFinite(pos)) { setInputError('Enter a valid position'); setIsRunning(false); return; }
      const steps = [];
      const addStep = (key, mut) => { if (mut) mut(); steps.push(buildStep(lineFor(key), working, hl, out)); };

      if (!working.headId) {
        out.push('List is empty');
        steps.push(buildStep(lineFor('guard'), working, hl, out));
        await runSteps(steps);
        setIsRunning(false); setCurrentLine(null);
        setListState(working); setHighlights(hl); setOutput(out);
        return;
      }

      addStep('guard');
      if (pos <= 1) {
        const oldHead = working.headId; hl.targetId = oldHead;
        addStep('ifPos');
        addStep('newHead', () => { const newHead = working.nodes[oldHead]?.nextId ?? null; working.headId = newHead; hl.headId = newHead; });
        if (working.headId) { addStep('setPrevNull', () => { working.nodes[working.headId].prevId = null; }); }
        addStep('retNew', () => { if (!working.headId) { working.tailId = null; hl.tailId = null; } delete working.nodes[oldHead]; working.size = Math.max(0, (working.size || 1) - 1); hl.targetId = null; });
      } else {
        addStep('iInit');
        addStep('currInit', () => { hl.currentId = working.headId; });
        let curr = working.headId; let i = 1;
        while (i < pos && curr) {
          addStep('whileCurr');
          curr = working.nodes[curr]?.nextId ?? null;
          hl.currentId = curr;
          steps.push(buildStep(lineFor('moveCurr'), working, hl, out));
          i += 1;
          steps.push(buildStep(lineFor('incI'), working, hl, out));
        }
        if (!curr) {
          out.push('Position out of range');
          const missingKey = language === 'python' ? 'ifCurrNone' : 'ifCurrNull';
          steps.push(buildStep(lineFor(missingKey), working, hl, out));
          await runSteps(steps);
          setIsRunning(false); setCurrentLine(null);
          setListState(working); setHighlights(hl); setOutput(out);
          return;
        }
        hl.targetId = curr;
        const prev = working.nodes[curr]?.prevId ?? null;
        const next = working.nodes[curr]?.nextId ?? null;
        if (prev) {
          addStep('setPrevNext', () => { working.nodes[prev].nextId = next; });
        } else {
          addStep('retHead', () => { working.headId = next; hl.headId = next; });
        }
        if (next) {
          addStep('setNextPrev', () => { working.nodes[next].prevId = prev; });
        } else {
          addStep('retHead', () => { working.tailId = prev; hl.tailId = prev; });
        }
        addStep(language === 'python' ? 'retHead2' : 'retHead', () => {
          delete working.nodes[curr];
          working.size = Math.max(0, (working.size || 1) - 1);
          hl.targetId = null;
        });
      }
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'traverse') {
      const steps = [];
      if (!working.headId) {
        out.push('List is empty');
        steps.push(buildStep(lineFor(language === 'python' ? 'currInit' : 'forLine'), working, hl, out));
        await runSteps(steps);
        setIsRunning(false); setCurrentLine(null);
        setListState(working); setHighlights(hl); setOutput(out);
        return;
      }

      if (language === 'python') {
        let curr = working.headId;
        hl.currentId = curr;
        steps.push(buildStep(lineFor('currInit'), working, hl, out));
        while (curr) {
          hl.currentId = curr;
          steps.push(buildStep(lineFor('whileCurr'), working, hl, out));
          const visitVal = working.nodes[curr]?.value;
          out.push(`Visited: ${visitVal}`);
          steps.push(buildStep(lineFor('print'), working, hl, out));
          const next = working.nodes[curr]?.nextId ?? null;
          curr = next;
          hl.currentId = curr;
          steps.push(buildStep(lineFor('move'), working, hl, out));
        }
      } else {
        // C/C++ uses a for-loop: highlight the loop line then print line per visit.
        let curr = working.headId;
        while (curr) {
          hl.currentId = curr;
          steps.push(buildStep(lineFor('forLine'), working, hl, out));
          const visitVal = working.nodes[curr]?.value;
          out.push(`Visited: ${visitVal}`);
          steps.push(buildStep(lineFor('print'), working, hl, out));
          curr = working.nodes[curr]?.nextId ?? null;
        }
      }

      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    if (op === 'search') {
      const key = Number.parseInt(searchInput.trim(), 10);
      if (!Number.isFinite(key)) { setInputError('Enter a valid search value'); setIsRunning(false); return; }
      const steps = [];
      if (!working.headId) {
        out.push(`Not found: ${key}`);
        steps.push(buildStep(lineFor(language === 'python' ? 'currInit' : 'currInit'), working, hl, out));
        await runSteps(steps);
        setIsRunning(false); setCurrentLine(null);
        setListState(working); setHighlights(hl); setOutput(out);
        return;
      }

      if (language === 'python') {
        let idx = 1;
        let curr = working.headId;
        hl.currentId = curr;
        steps.push(buildStep(lineFor('idxInit'), working, hl, out));
        steps.push(buildStep(lineFor('currInit'), working, hl, out));
        while (curr) {
          hl.currentId = curr;
          steps.push(buildStep(lineFor('whileCurr'), working, hl, out));
          steps.push(buildStep(lineFor('ifEq'), working, hl, out));
          if (working.nodes[curr]?.value === key) {
            out.push(`Found: ${key} at node n${idx}`);
            steps.push(buildStep(lineFor('retIdx'), working, hl, out));
            await runSteps(steps);
            setIsRunning(false); setCurrentLine(null);
            setListState(working); setHighlights(hl); setOutput(out);
            return;
          }
          curr = working.nodes[curr]?.nextId ?? null;
          hl.currentId = curr;
          steps.push(buildStep(lineFor('move'), working, hl, out));
          idx += 1;
          steps.push(buildStep(lineFor('incIdx'), working, hl, out));
        }
        out.push(`Not found: ${key}`);
        steps.push(buildStep(lineFor('retNeg'), working, hl, out));
      } else {
        let idx = 1;
        let curr = working.headId;
        hl.currentId = curr;
        steps.push(buildStep(lineFor('idxInit'), working, hl, out));
        steps.push(buildStep(lineFor('currInit'), working, hl, out));
        while (curr) {
          hl.currentId = curr;
          steps.push(buildStep(lineFor('whileCurr'), working, hl, out));
          steps.push(buildStep(lineFor('ifEq'), working, hl, out));
          if (working.nodes[curr]?.value === key) {
            out.push(`Found: ${key} at node n${idx}`);
            steps.push(buildStep(lineFor('ifEq'), working, hl, out));
            await runSteps(steps);
            setIsRunning(false); setCurrentLine(null);
            setListState(working); setHighlights(hl); setOutput(out);
            return;
          }
          curr = working.nodes[curr]?.nextId ?? null;
          hl.currentId = curr;
          steps.push(buildStep(lineFor('move'), working, hl, out));
          idx += 1;
          steps.push(buildStep(lineFor('incIdx'), working, hl, out));
        }
        out.push(`Not found: ${key}`);
        steps.push(buildStep(lineFor('retNeg'), working, hl, out));
      }
      await runSteps(steps);
      setIsRunning(false); setCurrentLine(null);
      setListState(working); setHighlights(hl); setOutput(out);
      return;
    }

    setIsRunning(false); setCurrentLine(null);
    setListState(working); setHighlights(hl); setOutput(out);
  };

  const pauseOperation = () => {
    if (!isRunning || isPausedRef.current) return;
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const resumeOperation = () => {
    if (!isRunning || !isPausedRef.current) return;
    setIsPaused(false);
    isPausedRef.current = false;
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
  };

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">Doubly Linked List</h1>
        <p className="algorithm-description">A linear data structure where each node stores data and pointers to both previous and next nodes.</p>
        <div className="complexity-info">
          <div className="complexity-badge">Insert/Delete at Ends: O(1)</div>
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
            {(CODE_SNIPPETS[language][operation] || []).map((line, idx) => (
              <div key={idx} className={`code-line ${currentLine === idx + 1 ? 'highlighted' : ''}`}>
                <span className="line-number">{String(idx + 1).padStart(2, '0')}</span>
                <span className="line-code">{line}</span>
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
                <button onClick={() => { try { const values = listInput.split(',').map(v => v.trim()).filter(Boolean).map(v => { const n = Number.parseInt(v, 10); if (Number.isNaN(n)) throw new Error(); if (n < 1 || n > 999) throw new Error(); return n; }); if (values.length > 12) { setInputError('List must have 0-12 elements'); return; } const next = buildStateFromValues(values); setListState(next); nextIdRef.current = values.length + 1; setInputError(''); } catch { setInputError('Invalid input. Use comma-separated numbers (1-999)'); } }} disabled={isRunning} className="control-btn apply-btn">Set List</button>
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="operation-select">Operation</label>
              <select id="operation-select" className="select-input" value={operation} onChange={e => setOperation(e.target.value)} disabled={isRunning}>
                <option value="insert_begin">Insert at Beginning</option>
                <option value="insert_end">Insert at End</option>
                <option value="insert_pos">Insert at Position</option>
                <option value="delete_begin">Delete from Beginning</option>
                <option value="delete_end">Delete from End</option>
                <option value="delete_pos">Delete at Position</option>
                <option value="traverse">Traverse (forward)</option>
                <option value="search">Search</option>
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
                <linearGradient id="ll-line-grad" x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.9)" />
                </linearGradient>
                <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 L 3 5 Z" className="linkedlist-arrow-marker" />
                </marker>
              </defs>
              {edges.map(edge => {
                const { from, to, key, kind } = edge;
                if (kind === 'null') {
                  const c1x = from.x + 18; const c1y = from.y - 22; const c2x = to.x - 10; const c2y = to.y;
                  const pathD = `M ${from.x} ${from.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${to.x} ${to.y}`;
                  return (
                    <g key={key}>
                      <path d={pathD} className="linkedlist-connector-line" fill="none" stroke="url(#ll-line-grad)" markerEnd="url(#arrowhead)" />
                      <text x={to.x + 12} y={to.y} className="linkedlist-null-label" dominantBaseline="middle" textAnchor="start">NULL</text>
                    </g>
                  );
                }
                if (kind === 'prev') {
                  const dx = Math.max(18, Math.min(36, Math.abs(to.x - from.x) / 4));
                  const pathD = `M ${from.x} ${from.y} C ${from.x - dx} ${from.y} ${to.x + dx} ${to.y} ${to.x} ${to.y}`;
                  return (<path key={key} d={pathD} className="doublylist-prev-line" fill="none" stroke="url(#ll-line-grad)" markerEnd="url(#arrowhead)" />);
                }
                const dx = Math.max(24, Math.min(52, Math.abs(to.x - from.x) / 3));
                const pathD = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y} ${to.x - dx} ${to.y} ${to.x} ${to.y}`;
                return (<path key={key} d={pathD} className="linkedlist-connector-line" fill="none" stroke="url(#ll-line-grad)" markerEnd="url(#arrowhead)" />);
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

export default DoublyLinkedListVisualizer;
