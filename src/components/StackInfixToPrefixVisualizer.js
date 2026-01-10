import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Visualizer.css';

const OPERATORS = new Set(['+', '-', '*', '/', '^']);

function precedence(op) {
  if (op === '^') return 3;
  if (op === '*' || op === '/') return 2;
  if (op === '+' || op === '-') return 1;
  return 0;
}

function isRightAssociative(op) {
  return op === '^';
}

function isOperand(token) {
  if (!token) return false;
  if (token === '(' || token === ')') return false;
  if (OPERATORS.has(token)) return false;
  return true;
}

function tokenizeInfix(input) {
  const s = String(input ?? '');
  const tokens = [];

  let i = 0;
  while (i < s.length) {
    const ch = s[i];

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i += 1;
      continue;
    }

    if (ch === '(' || ch === ')' || OPERATORS.has(ch)) {
      tokens.push({ token: ch, start: i, end: i + 1 });
      i += 1;
      continue;
    }

    const isAlphaNum = /[A-Za-z0-9_]/.test(ch);
    if (!isAlphaNum) {
      return { ok: false, error: `Invalid character: '${ch}'`, tokens: [] };
    }

    let j = i;
    while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) {
      j += 1;
    }

    const word = s.slice(i, j);
    tokens.push({ token: word, start: i, end: j });
    i = j;
  }

  if (tokens.length === 0) {
    return { ok: false, error: 'Expression is empty.', tokens: [] };
  }

  return { ok: true, error: '', tokens };
}

function validateParentheses(tokenObjs) {
  let balance = 0;
  for (let i = 0; i < tokenObjs.length; i += 1) {
    const tok = tokenObjs[i].token;
    if (tok === '(') {
      balance += 1;
      continue;
    }
    if (tok === ')') {
      balance -= 1;
      if (balance < 0) {
        return { ok: false, error: "Mismatched parentheses: missing '('.", index: i };
      }
    }
  }

  if (balance > 0) {
    return { ok: false, error: "Mismatched parentheses: extra '('.", index: tokenObjs.length - 1 };
  }

  return { ok: true, error: '', index: -1 };
}

const codeByLang = {
  python: [
    { line: 1, code: 'def infix_to_prefix(s):' },
    { line: 2, code: '    def prec(op):' },
    { line: 3, code: '        if op == "^":' },
    { line: 4, code: '            return 3' },
    { line: 5, code: '        if op == "*" or op == "/":' },
    { line: 6, code: '            return 2' },
    { line: 7, code: '        if op == "+" or op == "-":' },
    { line: 8, code: '            return 1' },
    { line: 9, code: '        return 0' },
    { line: 10, code: '    def right_assoc(op):' },
    { line: 11, code: '        return op == "^"' },
    { line: 12, code: '    out = []' },
    { line: 13, code: '    st = []' },
    { line: 14, code: '    for tok in reversed(tokenize(s)):' },
    { line: 15, code: '        if is_operand(tok):' },
    { line: 16, code: '            out.append(tok)' },
    { line: 17, code: '        elif tok == ")":' },
    { line: 18, code: '            st.append(tok)' },
    { line: 19, code: '        elif tok == "(":' },
    { line: 20, code: '            while st and st[-1] != ")":' },
    { line: 21, code: '                out.append(st.pop())' },
    { line: 22, code: '            st.pop()' },
    { line: 23, code: '        else:' },
    { line: 24, code: '            while st and st[-1] != ")":' },
    { line: 25, code: '                top = st[-1]' },
    { line: 26, code: '                if prec(top) > prec(tok):' },
    { line: 27, code: '                    out.append(st.pop())' },
    { line: 28, code: '                elif prec(top) == prec(tok) and right_assoc(tok):' },
    { line: 29, code: '                    out.append(st.pop())' },
    { line: 30, code: '                else:' },
    { line: 31, code: '                    break' },
    { line: 32, code: '            st.append(tok)' },
    { line: 33, code: '    while st:' },
    { line: 34, code: '        out.append(st.pop())' },
    { line: 35, code: '    out.reverse()' },
    { line: 36, code: '    return " ".join(out)' }
  ],
  c: [
    { line: 1, code: 'void infixToPrefix(const char* s, char* out)' },
    { line: 2, code: '{' },
    { line: 3, code: '    char st[1024];' },
    { line: 4, code: '    int top = -1;' },
    { line: 5, code: '    Token toks[1024];' },
    { line: 6, code: '    int n = tokenize(s, toks);' },
    { line: 7, code: '    Token res[1024];' },
    { line: 8, code: '    int resLen = 0;' },
    { line: 9, code: '    for (int i = n - 1; i >= 0; --i)' },
    { line: 10, code: '    {' },
    { line: 11, code: '        Token tok = toks[i];' },
    { line: 12, code: '        if (isOperand(tok))' },
    { line: 13, code: '        {' },
    { line: 14, code: '            res[resLen++] = tok;' },
    { line: 15, code: '        }' },
    { line: 16, code: "        else if (tok.ch == ')')" },
    { line: 17, code: '        {' },
    { line: 18, code: '            st[++top] = tok.ch;' },
    { line: 19, code: '        }' },
    { line: 20, code: "        else if (tok.ch == '(')" },
    { line: 21, code: '        {' },
    { line: 22, code: "            while (top >= 0 && st[top] != ')')" },
    { line: 23, code: '            {' },
    { line: 24, code: '                popToRes(st, &top, res, &resLen);' },
    { line: 25, code: '            }' },
    { line: 26, code: '            top--;' },
    { line: 27, code: '        }' },
    { line: 28, code: '        else' },
    { line: 29, code: '        {' },
    { line: 30, code: "            while (top >= 0 && st[top] != ')')" },
    { line: 31, code: '            {' },
    { line: 32, code: '                char opTop = st[top];' },
    { line: 33, code: '                if (prec(opTop) > prec(tok.ch))' },
    { line: 34, code: '                {' },
    { line: 35, code: '                    popToRes(st, &top, res, &resLen);' },
    { line: 36, code: '                }' },
    { line: 37, code: '                else if (prec(opTop) == prec(tok.ch) && rightAssoc(tok.ch))' },
    { line: 38, code: '                {' },
    { line: 39, code: '                    popToRes(st, &top, res, &resLen);' },
    { line: 40, code: '                }' },
    { line: 41, code: '                else' },
    { line: 42, code: '                {' },
    { line: 43, code: '                    break;' },
    { line: 44, code: '                }' },
    { line: 45, code: '            }' },
    { line: 46, code: '            st[++top] = tok.ch;' },
    { line: 47, code: '        }' },
    { line: 48, code: '    }' },
    { line: 49, code: '    while (top >= 0)' },
    { line: 50, code: '    {' },
    { line: 51, code: '        popToRes(st, &top, res, &resLen);' },
    { line: 52, code: '    }' },
    { line: 53, code: '    reverseTokens(res, resLen);' },
    { line: 54, code: '    joinTokens(out, res, resLen);' },
    { line: 55, code: '}' }
  ],
  cpp: [
    { line: 1, code: 'std::string infixToPrefix(const std::string& s)' },
    { line: 2, code: '{' },
    { line: 3, code: '    auto toks = tokenize(s);' },
    { line: 4, code: '    std::vector<std::string> out;' },
    { line: 5, code: '    std::vector<std::string> st;' },
    { line: 6, code: '    for (int i = (int)toks.size() - 1; i >= 0; --i)' },
    { line: 7, code: '    {' },
    { line: 8, code: '        auto tok = toks[i];' },
    { line: 9, code: '        if (isOperand(tok))' },
    { line: 10, code: '        {' },
    { line: 11, code: '            out.push_back(tok);' },
    { line: 12, code: '        }' },
    { line: 13, code: '        else if (tok == ")")' },
    { line: 14, code: '        {' },
    { line: 15, code: '            st.push_back(tok);' },
    { line: 16, code: '        }' },
    { line: 17, code: '        else if (tok == "(")' },
    { line: 18, code: '        {' },
    { line: 19, code: '            while (!st.empty() && st.back() != ")")' },
    { line: 20, code: '            {' },
    { line: 21, code: '                out.push_back(st.back());' },
    { line: 22, code: '                st.pop_back();' },
    { line: 23, code: '            }' },
    { line: 24, code: '            st.pop_back();' },
    { line: 25, code: '        }' },
    { line: 26, code: '        else' },
    { line: 27, code: '        {' },
    { line: 28, code: '            while (!st.empty() && st.back() != ")")' },
    { line: 29, code: '            {' },
    { line: 30, code: '                auto top = st.back();' },
    { line: 31, code: '                if (prec(top) > prec(tok))' },
    { line: 32, code: '                {' },
    { line: 33, code: '                    out.push_back(top);' },
    { line: 34, code: '                    st.pop_back();' },
    { line: 35, code: '                }' },
    { line: 36, code: '                else if (prec(top) == prec(tok) && rightAssoc(tok))' },
    { line: 37, code: '                {' },
    { line: 38, code: '                    out.push_back(top);' },
    { line: 39, code: '                    st.pop_back();' },
    { line: 40, code: '                }' },
    { line: 41, code: '                else' },
    { line: 42, code: '                {' },
    { line: 43, code: '                    break;' },
    { line: 44, code: '                }' },
    { line: 45, code: '            }' },
    { line: 46, code: '            st.push_back(tok);' },
    { line: 47, code: '        }' },
    { line: 48, code: '    }' },
    { line: 49, code: '    while (!st.empty())' },
    { line: 50, code: '    {' },
    { line: 51, code: '        out.push_back(st.back());' },
    { line: 52, code: '        st.pop_back();' },
    { line: 53, code: '    }' },
    { line: 54, code: '    std::reverse(out.begin(), out.end());' },
    { line: 55, code: '    return joinWithSpaces(out);' },
    { line: 56, code: '}' }
  ]
};

const lineMap = {
  python: {
    initOut: 12,
    initSt: 13,
    forTok: 14,
    operand: 15,
    outAppend: 16,
    rparen: 17,
    stPush: 18,
    lparen: 19,
    popUntil: 20,
    popOne: 21,
    popRParen: 22,
    opElse: 23,
    opWhile: 24,
    readTop: 25,
    higher: 26,
    popHigher: 27,
    equalRight: 28,
    popEqual: 29,
    break: 31,
    pushOp: 32,
    drain: 33,
    drainPop: 34,
    reverse: 35,
    ret: 36
  },
  c: {
    initSt: 3,
    initTok: 6,
    initOut: 8,
    forTok: 11,
    operand: 12,
    outAppend: 14,
    rparen: 16,
    stPush: 18,
    lparen: 20,
    popUntil: 22,
    popOne: 24,
    popRParen: 26,
    opElse: 28,
    opWhile: 30,
    readTop: 32,
    higher: 33,
    popHigher: 35,
    equalRight: 37,
    popEqual: 39,
    break: 43,
    pushOp: 46,
    drain: 49,
    drainPop: 51,
    reverse: 53,
    ret: 54
  },
  cpp: {
    initTok: 3,
    initOut: 4,
    initSt: 5,
    forTok: 8,
    operand: 9,
    outAppend: 11,
    rparen: 13,
    stPush: 15,
    lparen: 17,
    popUntil: 19,
    popOne: 21,
    popRParen: 24,
    opElse: 26,
    opWhile: 28,
    readTop: 30,
    higher: 31,
    popHigher: 33,
    equalRight: 36,
    popEqual: 38,
    break: 43,
    pushOp: 46,
    drain: 49,
    drainPop: 51,
    reverse: 54,
    ret: 55
  }
};

function StackInfixToPrefixVisualizer() {
  const [language, setLanguage] = useState('python');
  const [expr, setExpr] = useState('a+b*(c^d-e)');
  const [inputError, setInputError] = useState('');

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const pausedResolve = useRef(null);

  const [speed, setSpeed] = useState(700);
  const speedRef = useRef(700);

  const [currentLine, setCurrentLine] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [tokenIndex, setTokenIndex] = useState(-1);
  const [stack, setStack] = useState([]);
  const [out, setOut] = useState([]);
  const [log, setLog] = useState([]);

  const codeLanguageKey = language === 'c++' ? 'cpp' : language;
  const codeLines = useMemo(() => codeByLang[codeLanguageKey] ?? [], [codeLanguageKey]);

  const sleep = async (ms) => {
    const delay = Number.isFinite(ms) ? ms : 0;
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  const pauseOperation = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const resumeOperation = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    if (pausedResolve.current) {
      pausedResolve.current();
      pausedResolve.current = null;
    }
  };

  const waitIfPaused = async () => {
    if (!isPausedRef.current) return;
    await new Promise(resolve => {
      pausedResolve.current = resolve;
    });
  };

  const reset = () => {
    setCurrentLine(null);
    setTokenIndex(-1);
    setStack([]);
    setOut([]);
    setLog([]);
    setInputError('');
  };

  useEffect(() => {
    const result = tokenizeInfix(expr);
    if (!result.ok) {
      setTokens([]);
      return;
    }
    setTokens(result.tokens);
  }, [expr]);

  const buildSteps = (tokenObjs) => {
    const steps = [];

    const st = [];
    const output = [];

    const pushStep = (lineKey, idx, msg, isError) => {
      steps.push({
        lineKey,
        idx,
        stack: [...st],
        out: [...output],
        msg,
        isError: Boolean(isError)
      });
    };

    pushStep('initOut', -1, 'Initialize output list');
    pushStep('initSt', -1, 'Initialize operator stack');

    for (let idx = tokenObjs.length - 1; idx >= 0; idx -= 1) {
      const tok = tokenObjs[idx].token;

      pushStep('forTok', idx, `Read token '${tok}' (right-to-left)`);

      if (isOperand(tok)) {
        pushStep('operand', idx, `Operand '${tok}' → append to output`);
        output.push(tok);
        pushStep('outAppend', idx, `Output += '${tok}'`);
        continue;
      }

      if (tok === ')') {
        pushStep('rparen', idx, "')' → push to stack");
        st.push(tok);
        pushStep('stPush', idx, "Stack push ')'");
        continue;
      }

      if (tok === '(') {
        pushStep('lparen', idx, "'(' → pop until ')'");
        while (st.length > 0 && st[st.length - 1] !== ')') {
          pushStep('popUntil', idx, `Top '${st[st.length - 1]}' → pop to output`);
          const popped = st.pop();
          output.push(popped);
          pushStep('popOne', idx, `Output += '${popped}'`);
        }

        if (st.length === 0) {
          pushStep('popRParen', idx, "Error: missing ')'.", true);
          return { ok: false, error: "Mismatched parentheses: missing ')'.", steps };
        }

        st.pop();
        pushStep('popRParen', idx, "Pop matching ')'");
        continue;
      }

      if (OPERATORS.has(tok)) {
        pushStep('opElse', idx, `Operator '${tok}'`);
        while (st.length > 0 && st[st.length - 1] !== ')') {
          pushStep('opWhile', idx, `Compare with stack top '${st[st.length - 1]}'`);
          const top = st[st.length - 1];
          pushStep('readTop', idx, `top = '${top}'`);

          const pTop = precedence(top);
          const pTok = precedence(tok);

          if (pTop > pTok) {
            pushStep('higher', idx, `${top} has higher precedence than ${tok} → pop`);
            const popped = st.pop();
            output.push(popped);
            pushStep('popHigher', idx, `Output += '${popped}'`);
            continue;
          }

          if (pTop === pTok && isRightAssociative(tok)) {
            pushStep('equalRight', idx, `${tok} is right-associative and equal precedence → pop`);
            const popped = st.pop();
            output.push(popped);
            pushStep('popEqual', idx, `Output += '${popped}'`);
            continue;
          }

          pushStep('break', idx, 'Stop popping');
          break;
        }

        st.push(tok);
        pushStep('pushOp', idx, `Stack push '${tok}'`);
        continue;
      }

      pushStep('break', idx, `Error: unknown token '${tok}'`, true);
      return { ok: false, error: `Unknown token: '${tok}'`, steps };
    }

    pushStep('drain', -1, 'End of input → pop remaining operators');
    while (st.length > 0) {
      const top = st[st.length - 1];
      if (top === ')') {
        pushStep('drainPop', -1, "Error: mismatched parentheses: extra ')'.", true);
        return { ok: false, error: "Mismatched parentheses: extra ')'.", steps };
      }
      const popped = st.pop();
      output.push(popped);
      pushStep('drainPop', -1, `Output += '${popped}'`);
    }

    pushStep('reverse', -1, 'Reverse output to obtain prefix expression');
    pushStep('ret', -1, `Done → prefix = '${[...output].reverse().join(' ')}'`);
    return { ok: true, error: '', steps };
  };

  const runSteps = async (steps) => {
    for (const step of steps) {
      await waitIfPaused();

      const map = lineMap[codeLanguageKey] ?? {};
      const line = step.lineKey ? map[step.lineKey] : null;
      setCurrentLine(line ?? null);

      setTokenIndex(step.idx);
      setStack(step.stack);
      setOut(step.out);
      setLog(prev => {
        const next = [...prev, step.msg].slice(-12);
        return next;
      });

      if (step.isError) {
        break;
      }

      await sleep(speedRef.current);
    }
  };

  const start = async () => {
    if (isRunning) return;

    reset();

    const result = tokenizeInfix(expr);
    if (!result.ok) {
      setInputError(result.error);
      return;
    }

    setTokens(result.tokens);

    const parenCheck = validateParentheses(result.tokens);
    if (!parenCheck.ok) {
      setTokenIndex(parenCheck.index);
      setInputError(parenCheck.error);
      return;
    }

    const built = buildSteps(result.tokens);
    const finalError = built.ok ? '' : built.error;

    setIsRunning(true);
    setIsPaused(false);
    isPausedRef.current = false;

    try {
      await runSteps(built.steps);
    } finally {
      setIsRunning(false);
      setIsPaused(false);
      isPausedRef.current = false;
      if (finalError) {
        setInputError(finalError);
      }
    }
  };

  const prefix = useMemo(() => [...out].reverse().join(' '), [out]);

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <h1 className="visualizer-title">Infix to Prefix - STACK</h1>
        <p className="algorithm-description">Convert infix expression to prefix using right-to-left scan, operator stack, precedence, and associativity.</p>
        <div className="complexity-info">
          <div className="complexity-badge">Time: O(n)</div>
          <div className="complexity-badge">Space: O(n)</div>
          <div className="complexity-badge">Ops: push / pop / peek</div>
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
              <label className="control-label" htmlFor="expr-input">Infix Expression</label>
              <div className="input-group">
                <input
                  id="expr-input"
                  type="text"
                  className="array-input"
                  value={expr}
                  onChange={e => setExpr(e.target.value)}
                  disabled={isRunning}
                  placeholder="e.g., a+b*(c^d-e)"
                />
                <button onClick={start} disabled={isRunning} className="control-btn primary">Run</button>
              </div>
              {inputError && <div className="error-message">{inputError}</div>}
            </div>

            <div className="control-group">
              <div className="controls-row">
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

            <div className="stackviz-summary">
              <div className="stackviz-row">
                <div className="stackviz-label">Tokens</div>
                <div className="stackviz-value">
                  {tokens.length === 0 ? '—' : tokens.map((t, idx) => (
                    <span
                      key={`${t.start}-${t.end}-${idx}`}
                      className={`stackviz-token ${idx === tokenIndex ? 'active' : ''}`}
                    >
                      {t.token}
                    </span>
                  ))}
                </div>
              </div>
              <div className="stackviz-row">
                <div className="stackviz-label">Prefix</div>
                <div className="stackviz-value stackviz-postfix">{prefix || '—'}</div>
              </div>
            </div>
          </div>

          <div className="stackviz-area">
            <div className="stackviz-col">
              <div className="stackviz-title">Stack</div>
              <div className="stackviz-frame">
                {stack.length === 0 ? (
                  <div className="stackviz-empty">(empty)</div>
                ) : (
                  <div className="stackviz-items">
                    {[...stack].reverse().map((item, idx) => {
                      const isTop = idx === 0;
                      return (
                        <div key={`${item}-${idx}`} className={`stackviz-item ${isTop ? 'top' : ''}`}>
                          {item}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="stackviz-col">
              <div className="stackviz-title">Step Log</div>
              <div className="stackviz-log">
                {log.length === 0 ? (
                  <div className="stackviz-empty">(no steps yet)</div>
                ) : (
                  log.map((line, idx) => (
                    <div key={idx} className="stackviz-log-line">{line}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackInfixToPrefixVisualizer;
