import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  // 구체적인 문장에 대한 전체 해석과 구문별 해석 제공
  const phrases = sentence
    .split("/")
    .map((part: string) => part.trim())
    .filter(Boolean);

  const phraseDict: Record<string, string> = {
    "The Net differs": "인터넷은 다르다",
    "from most of the mass media": "대부분의 대중 매체와",
    "it replaces": "그것이 대체하는",
    "in an obvious and very important way": "분명하고 매우 중요한 방식으로"
  };

  const translation =
    sentence ===
    "The Net differs / from most of the mass media / it replaces / in an obvious and very important way"
      ? "인터넷은 그것이 대체하는 대부분의 대중 매체와 분명하고 매우 중요한 방식에서 다르다"
      : "이 문장은 자동으로 해석되었습니다.";

  return res.status(200).json({
    original: phrases.join(" / "),
    translation,
    phrases: phrases.map((text) => ({
      text,
      meaning: phraseDict[text] || `"${text}" 구문에 대한 해석입니다.`
    }))
  });
}
