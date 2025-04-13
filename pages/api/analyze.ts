import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("💡 API 호출됨");

  if (req.method !== "POST") {
    console.log("❌ 잘못된 요청 메서드:", req.method);
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { sentence } = req.body;
  console.log("✉️ 받은 문장:", sentence);

  if (!sentence || typeof sentence !== "string") {
    console.log("❌ 문장이 유효하지 않음");
    return res.status(400).json({ error: "Invalid sentence" });
  }

  try {
    // GPT에게 문장을 자연스러운 구문 단위로 나눠달라고 요청
    const slicing = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 영어 문장을 자연스러운 구문 단위로 / 슬래시로 구분해주는 도우미입니다."
        },
        {
          role: "user",
          content: `다음 문장을 구문 단위로 슬래시(/)를 넣어 구분해줘. 문장: ${sentence}`
        }
      ]
    });

    const slicedText = slicing.choices[0]?.message.content || sentence;
    const splitPhrases = slicedText
      .split("/")
      .map((phrase) => phrase.trim())
      .filter(Boolean);

    console.log("🔀 자동 분할된 구문:", splitPhrases);

    const phraseAnalysis = await Promise.all(
      splitPhrases.map(async (phrase) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "당신은 영어 문장을 한국어로 자연스럽게 번역해주는 번역 도우미입니다. 구문을 자연스럽고 간결하게 번역해주세요."
            },
            {
              role: "user",
              content: `"${phrase}" 이 구문을 자연스럽게 한국어로 번역해줘`
            }
          ]
        });

        const meaning = completion.choices[0]?.message.content?.trim() || "(번역 실패)";
        console.log("✅ GPT 응답:", phrase, "→", meaning);
        return { text: phrase, meaning };
      })
    );

    const translation = phraseAnalysis.map((p) => p.meaning).join(" ");
    console.log("📘 전체 해석:", translation);

    return res.status(200).json({
      original: sentence,
      sliced: splitPhrases.join(" / "),
      translation,
      phrases: phraseAnalysis
    });
  } catch (error: any) {
    console.error("❌ GPT 호출 중 에러:", error?.message || error);
    return res.status(500).json({ error: "GPT 요청 실패", detail: error?.message || error });
  }
}
