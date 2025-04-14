import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  try {
    // Step 1: 구문 단위로 나누기
    const slicing = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 영어 문장을 자연스러운 구문 단위로 / 슬래시로 구분해주는 도우미입니다.",
        },
        {
          role: "user",
          content: `다음 문장을 구문 단위로 슬래시(/)를 넣어 구분해줘. 문장: ${sentence}`,
        },
      ],
    });

    const slicedText = slicing.choices[0]?.message.content || sentence;
    const splitPhrases = slicedText
      .split("/")
      .map((phrase) => phrase.trim())
      .filter(Boolean);

    // Step 2: 각 구문 번역
    const phraseAnalysis = await Promise.all(
      splitPhrases.map(async (phrase) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "당신은 영어 구문을 한국어로 자연스럽게 번역해주는 도우미입니다.",
            },
            {
              role: "user",
              content: `"${phrase}" 이 구문을 자연스럽게 한국어로 번역해줘.`,
            },
          ],
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
      phrases: phraseAnalysis,
    });
  } catch (error: any) {
    console.error("GPT 호출 실패:", error?.message || error);
    return res.status(500).json({ error: "GPT 호출 중 에러", detail: error?.message || error });
  }
}
