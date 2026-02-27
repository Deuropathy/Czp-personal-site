import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const PORT = process.env.PORT || 8787
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROMPT_FILE = path.join(__dirname, 'system-prompt.txt')
const DIST_DIR = path.join(__dirname, '..', 'dist')
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY

if (!MOONSHOT_API_KEY) {
  console.warn('Missing MOONSHOT_API_KEY in environment')
}

const MODEL = 'kimi-k2-turbo-preview'
const DEFAULT_SYSTEM_PROMPT =
  '你是编程 Prompt 重构器。只把用户口述整理成简洁的工程指令，不要扩展功能，不要虚构 API。输出 3-6 条要点即可。格式固定为：\n- 背景/目标：...\n- 现有输入：...\n- 期望输出：...\n- 关键约束：...\n- 关键步骤：...（如无可省略）。'

const readSystemPrompt = async () => {
  try {
    const content = await fs.readFile(PROMPT_FILE, 'utf8')
    return content.trim() || DEFAULT_SYSTEM_PROMPT
  } catch (error) {
    return DEFAULT_SYSTEM_PROMPT
  }
}

const writeSystemPrompt = async (content) => {
  await fs.writeFile(PROMPT_FILE, content, 'utf8')
}

const client = new OpenAI({
  apiKey: MOONSHOT_API_KEY,
  baseURL: 'https://api.moonshot.cn/v1',
})

app.get('/api/config', (req, res) => {
  return res.json({ model: MODEL })
})

app.get('/api/system-prompt', async (req, res) => {
  const prompt = await readSystemPrompt()
  return res.json({ systemPrompt: prompt })
})

app.post('/api/system-prompt', async (req, res) => {
  const incoming = typeof req.body?.systemPrompt === 'string' ? req.body.systemPrompt.trim() : ''
  if (!incoming) {
    return res.status(400).json({ error: 'systemPrompt is required' })
  }

  try {
    await writeSystemPrompt(incoming)
    return res.json({ systemPrompt: incoming })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save systemPrompt' })
  }
})

app.post('/api/refine', async (req, res) => {
  try {
    const { rawText } = req.body || {}
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'rawText is required' })
    }
    const systemPrompt = await readSystemPrompt()

    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: rawText,
        },
      ],
    })

    const content = completion?.choices?.[0]?.message?.content || ''
    return res.json({ refinedText: content })
  } catch (error) {
    const message = error?.response?.data || error?.message || 'Unknown error'
    return res.status(500).json({ error: message })
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(DIST_DIR))

  app.get(/.*/, (req, res) => {

    return res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
