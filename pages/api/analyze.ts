import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  const splitPhrases = sentence
    .split("/")
    .map((phrase) => phrase.trim())
    .filter(Boolean);

  const phraseAnalysis = await Promise.all(
    splitPhrases.map(async (phrase) => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "당신은 영어 문장을 한국어로 자연스럽게 번역해주는 번역 도우미입니다. 구문을 자연스럽고 간결하게 번역해주세요."
          },
          {
            role: "user",
            content: `"${phrase}" 이 구문을 자연스럽게 한국어로 번역해줘`
          }
        ]
      });

      const meaning = completion.choices[0]?.message.content?.trim() || "(번역 실패)";
      return { text: phrase, meaning };
    })
  );

  const translation = phraseAnalysis.map((p) => p.meaning).join(" ");

  return res.status(200).json({
    original: sentence,
    sliced: splitPhrases.join(" / "),
    translation,
    phrases: phraseAnalysis
  });
}
