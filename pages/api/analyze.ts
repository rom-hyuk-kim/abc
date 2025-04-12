import { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { sentence } = req.body

  try {
    const gptPrompt = `
You are an English-Korean grammar analyzer for high school students.
Given the English sentence below, break it into meaningful phrase-level chunks (5 to 7 parts), and for each chunk, write a natural Korean translation.
Also provide the full sentence Korean translation at the top.

Sentence: "${sentence}"

Return in JSON format like this:
{
  "original": "...",
  "translation": "...",
  "phrases": [
    { "text": "...", "meaning": "..." },
    ...
  ]
}
`
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: gptPrompt }],
      temperature: 0.5,
    })

    const jsonText = chat.choices[0].message.content?.trim()
    const parsed = JSON.parse(jsonText || '{}')
    res.status(200).json(parsed)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: '문장 분석에 실패했습니다.' })
  }
}