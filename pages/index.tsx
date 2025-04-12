import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

const handleAnalyze = async () => {
  console.log("🔍 분석 요청 시작");
  setLoading(true);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence: input })
    });

    console.log("📨 응답 상태:", response.status);

    const data = await response.json();
    console.log("📦 응답 데이터:", data);

    setResult(data);
  } catch (error) {
    console.error("❌ 오류 발생:", error);
  } finally {
    setLoading(false);
  }
};

    const data = await response.json();
console.log("✅ API 응답 데이터", data);
setResult(data);

    // ✅ 응답 확인 로그
    console.log("✅ API 응답 결과:", data);

    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-center py-4">
        <img src="/로고.png" alt="영어본부 로고" className="h-16" />
      </div>
      <h1 className="text-3xl font-bold text-center">영어본부 구문해석기</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="영어 문장을 입력하세요."
        className="w-full border rounded p-2 min-h-[120px]"
      />
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "분석 중..." : "분석하기"}
      </button>

      {result?.phrases && Array.isArray(result.phrases) && (
        <div className="mt-6 space-y-2 border-t pt-4">
          <h2 className="text-xl font-semibold">1. 원문</h2>
          <p>{result.original}</p>
          <h2 className="text-xl font-semibold">2. 전체 해석</h2>
          <p>{result.translation}</p>
          <h2 className="text-xl font-semibold">3. 구문별 해석</h2>
          <ul className="list-disc list-inside space-y-1">
            {result.phrases.map((phrase: any, idx: number) => (
              <li key={idx}>
                {phrase.text} ({phrase.meaning})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
