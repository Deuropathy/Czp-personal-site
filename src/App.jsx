import { useEffect, useRef, useState } from 'react'
import './App.css'

const STATUS = {
  idle: 'Idle',
  recording: 'Recording',
  processing: 'Processing',
  unsupported: 'Unsupported',
}

const DEFAULT_SYSTEM_PROMPT =
  '你是编程 Prompt 重构器。只把用户口述整理成简洁的工程指令，不要扩展功能，不要虚构 API。输出 3-6 条要点即可。格式固定为：\n- 背景/目标：...\n- 现有输入：...\n- 期望输出：...\n- 关键约束：...\n- 关键步骤：...（如无可省略）。'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState(STATUS.idle)
  const [rawText, setRawText] = useState('')
  const [refinedText, setRefinedText] = useState('')
  const [supportsSpeech, setSupportsSpeech] = useState(true)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false)
  const [draftPrompt, setDraftPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [modelName, setModelName] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const recognitionRef = useRef(null)
  const finalTextRef = useRef('')
  const baseTextRef = useRef('')
  const insertIndexRef = useRef(0)
  const isRecordingRef = useRef(false)
  const rawInputRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupportsSpeech(false)
      setStatus(STATUS.unsupported)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-CN'

    recognition.onstart = () => {
      setStatus(STATUS.recording)
    }

    recognition.onend = () => {
      if (!isRecordingRef.current) {
        setStatus(STATUS.idle)
      }
    }

    recognition.onerror = () => {
      setStatus(STATUS.idle)
      setIsRecording(false)
      isRecordingRef.current = false
    }

    recognition.onresult = (event) => {
      let interim = ''
      let finalAccumulated = finalTextRef.current

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        if (result.isFinal) {
          finalAccumulated += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      finalTextRef.current = finalAccumulated
      const baseText = baseTextRef.current
      const insertIndex = insertIndexRef.current ?? baseText.length
      const prefix = baseText.slice(0, insertIndex)
      const suffix = baseText.slice(insertIndex)
      setRawText(`${prefix}${finalAccumulated}${interim}${suffix}`)
    }

    recognitionRef.current = recognition
  }, [])

  useEffect(() => {
    const loadSystemPrompt = async () => {
      try {
        const response = await fetch('/api/system-prompt')
        if (!response.ok) return
        const data = await response.json()
        if (typeof data?.systemPrompt === 'string' && data.systemPrompt.trim()) {
          setSystemPrompt(data.systemPrompt)
          setDraftPrompt(data.systemPrompt)
        }
      } catch (error) {
        return
      }
    }

    loadSystemPrompt()
  }, [])

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        if (!response.ok) return
        const data = await response.json()
        if (typeof data?.model === 'string') {
          setModelName(data.model)
        }
      } catch (error) {
        return
      }
    }

    loadConfig()
  }, [])

  useEffect(() => {
    if (rawInputRef.current) {
      rawInputRef.current.scrollTop = rawInputRef.current.scrollHeight
    }
  }, [rawText])

  const handleRecordToggle = () => {
    if (!supportsSpeech) return

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      isRecordingRef.current = false
      setStatus(STATUS.processing)
      setTimeout(() => setStatus(STATUS.idle), 400)
      return
    }

    const currentText = rawText
    const caretIndex = rawInputRef.current?.selectionStart
    const insertIndex = typeof caretIndex === 'number' ? caretIndex : currentText.length
    insertIndexRef.current = insertIndex
    baseTextRef.current = currentText
    finalTextRef.current = ''
    setRefinedText('')
    recognitionRef.current?.start()
    setIsRecording(true)
    isRecordingRef.current = true
  }

  const handleOptimize = async () => {
    if (!rawText.trim()) return
    setStatus(STATUS.processing)
    setIsOptimizing(true)
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, systemPrompt }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Refine failed')
      }
      setRefinedText(data.refinedText)
    } catch (error) {
      setRefinedText(`优化失败：${error.message}`)
    } finally {
      setStatus(STATUS.idle)
      setIsOptimizing(false)
    }
  }

  const handleCopy = async () => {
    if (!refinedText.trim()) return
    await navigator.clipboard.writeText(refinedText)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <h1>Prompt助手</h1>
          </div>
        </div>
        <div className="controls">
          <button
            className={`record-btn ${isRecording ? 'is-recording' : ''}`}
            onClick={handleRecordToggle}
            disabled={!supportsSpeech}
          >
            {isRecording ? '结束录音' : '开始录音'}
          </button>
          <button className="ghost-btn prompt-btn" onClick={() => setIsPromptEditorOpen(true)}>
            修改 Prompt
          </button>
        </div>
      </header>

      <main className="split">
        <section className="panel">
          <div className="panel-header">
            <h2>语音转文字</h2>
          </div>
          <div className="panel-body raw">
            <textarea
              className="raw-input"
              ref={rawInputRef}
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              onClick={() => {
                const caretIndex = rawInputRef.current?.selectionStart
                if (typeof caretIndex === 'number') {
                  insertIndexRef.current = caretIndex
                }
              }}
              onKeyUp={() => {
                const caretIndex = rawInputRef.current?.selectionStart
                if (typeof caretIndex === 'number') {
                  insertIndexRef.current = caretIndex
                }
              }}
              onSelect={() => {
                const caretIndex = rawInputRef.current?.selectionStart
                if (typeof caretIndex === 'number') {
                  insertIndexRef.current = caretIndex
                }
              }}
              placeholder="点击开始录音，实时转录将显示在这里。也可直接粘贴或编辑文本。"
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2
              className={modelName ? 'with-tooltip' : undefined}
              data-tooltip={modelName || undefined}
            >
              修改后的 Prompt
            </h2>
            <div className="panel-actions">
              <button className="ghost-btn" onClick={handleOptimize}>
                {isOptimizing ? '优化中...' : '一键优化'}
              </button>
              <button className="ghost-btn" onClick={handleCopy}>
                复制到剪贴板
              </button>
            </div>
          </div>
          <div className="panel-body refined">
            <pre>{refinedText || '点击“一键优化”后生成清晰 Prompt。'}</pre>
          </div>
        </section>
      </main>

      {isPromptEditorOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            setDraftPrompt(systemPrompt)
            setIsPromptEditorOpen(false)
          }}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>System Prompt</h3>
              <div className="modal-actions">
                <button
                  className="ghost-btn"
                  onClick={() => {
                    setDraftPrompt(systemPrompt)
                    setIsPromptEditorOpen(false)
                  }}
                >
                  取消
                </button>
                <button
                  className="ghost-btn"
                  onClick={async () => {
                    if (!draftPrompt.trim()) return
                    setSystemPrompt(draftPrompt)
                    setIsPromptEditorOpen(false)
                    try {
                      await fetch('/api/system-prompt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ systemPrompt: draftPrompt }),
                      })
                    } catch (error) {
                      return
                    }
                  }}
                >
                  保存
                </button>
              </div>
            </div>
            <p className="modal-tip">修改后会直接用于下一次“一键优化”。</p>
            <textarea
              className="prompt-input"
              value={draftPrompt}
              onChange={(event) => setDraftPrompt(event.target.value)}
              rows={8}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
