"use client";

import { useEffect, useState } from "react";

// 화면 서버는 이 주소로 처리 서버를 찾는다
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Health = { status: string; db: string };

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data: Health) => setHealth(data))
      .catch(() => setFailed(true));
  }, []);

  return (
    <main className="wrap">
      <h1>숨 스튜디오</h1>
      <p className="sub">필라테스 스튜디오 숨의 예약 웹앱입니다. 화면은 지금부터 하나씩 만들어 갑니다.</p>

      <section className="card">
        <h2>처리 서버 상태</h2>
        {failed && <p className="bad">처리 서버에 연결할 수 없습니다. 처리 서버가 켜져 있는지 확인하세요.</p>}
        {!failed && !health && <p>확인하는 중...</p>}
        {health && (
          <p className={health.db === "connected" ? "good" : "bad"}>
            처리 서버: 켜져 있음 · DB: {health.db === "connected" ? "연결됨" : "연결 안 됨"}
          </p>
        )}
        <p className="hint">처리 서버 주소: {API_URL}</p>
      </section>
    </main>
  );
}
