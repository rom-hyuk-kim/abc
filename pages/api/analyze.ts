import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  // 더미: 특정 문장일 때만 구체적인 분석 결과 반환
  if (
    sentence ===
    "The Net differs / from most of the mass media / it replaces / in an obvious and very important way"
  ) {
    return res.status(200).json({
      original: sentence,
      translation:
        "인터넷은 그것이 대체하는 대부분의 대중 매체와 분명하고 매우 중요한 방식에서 다르다",
      phrases: [
        {
          text: "The Net differs",
          meaning: "인터넷은 다르다"
        },
        {
          text: "from most of the mass media",
          meaning: "대부분의 대중 매체와"
        },
        {
          text: "it replaces",
          meaning: "그것이 대체하는"
        },
        {
          text: "in an obvious and very important way",
          meaning: "분명하고 매우 중요한 방식으로"
        }
      ]
    });
  }

  // 기본 응답 (다른 문장은 자동 생성된 해석 제공)
  const phrases = sentence
    .split("/")
    .map((part: string) => part.trim())
    .filter(Boolean);

  return res.status(200).json({
    original: sentence,
    translation: "이 문장은 자동으로 해석되었습니다.",
    phrases: phrases.map((text) => ({
      text,
      meaning: `"${text}" 구문에 대한 해석입니다.`
    }))
  });
}
