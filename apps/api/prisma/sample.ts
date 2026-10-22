// 가상 데이터 넣기: npm run db:sample
// 기존 데이터를 지우고, 이번 주를 기준으로 지난 2주와 앞으로 3주의 수업·회원·회원권·예약을 넣는다.
// 같은 주에 실행하면 누가 실행해도 같은 데이터가 들어간다.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 요일(1=월 ... 6=토)별 [시작 시각, 수업]
const PATTERNS: Record<string, Record<string, [string, string][]>> = {
  "강남점": {
    "1": [
      [
        "10:00",
        "매트"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "리포머 중급"
      ],
      [
        "20:30",
        "리포머 기초"
      ]
    ],
    "2": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "12:00",
        "소도구"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "체어"
      ]
    ],
    "3": [
      [
        "10:00",
        "매트"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "리포머 중급"
      ]
    ],
    "4": [
      [
        "10:00",
        "리포머 중급"
      ],
      [
        "12:00",
        "매트"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "소도구"
      ]
    ],
    "5": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "12:00",
        "체어"
      ],
      [
        "19:00",
        "매트"
      ],
      [
        "20:30",
        "리포머 중급"
      ]
    ],
    "6": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "11:30",
        "매트"
      ]
    ]
  },
  "홍대점": {
    "1": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "12:00",
        "매트"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "소도구"
      ]
    ],
    "2": [
      [
        "10:00",
        "매트"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "리포머 중급"
      ],
      [
        "20:30",
        "리포머 기초"
      ]
    ],
    "3": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "12:00",
        "소도구"
      ],
      [
        "19:00",
        "매트"
      ],
      [
        "20:30",
        "리포머 기초"
      ]
    ],
    "4": [
      [
        "10:00",
        "매트"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "리포머 중급"
      ]
    ],
    "5": [
      [
        "10:00",
        "소도구"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "리포머 중급"
      ],
      [
        "20:30",
        "매트"
      ]
    ],
    "6": [
      [
        "10:00",
        "매트"
      ],
      [
        "11:30",
        "리포머 기초"
      ]
    ]
  },
  "성수점": {
    "1": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "12:00",
        "리포머 중급"
      ],
      [
        "19:00",
        "매트"
      ],
      [
        "20:30",
        "리포머 기초"
      ]
    ],
    "2": [
      [
        "10:00",
        "소도구"
      ],
      [
        "12:00",
        "매트"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "리포머 중급"
      ]
    ],
    "3": [
      [
        "10:00",
        "리포머 중급"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "매트"
      ]
    ],
    "4": [
      [
        "10:00",
        "매트"
      ],
      [
        "12:00",
        "리포머 기초"
      ],
      [
        "19:00",
        "소도구"
      ],
      [
        "20:30",
        "리포머 기초"
      ]
    ],
    "5": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "12:00",
        "매트"
      ],
      [
        "19:00",
        "리포머 기초"
      ],
      [
        "20:30",
        "소도구"
      ]
    ],
    "6": [
      [
        "10:00",
        "리포머 기초"
      ],
      [
        "11:30",
        "소도구"
      ]
    ]
  }
};

const BRANCHES = [
  { name: "강남점", address: "서울 강남구 숨길 12, 3층", instructors: ["한지윤", "오세린", "최다온"] },
  { name: "홍대점", address: "서울 마포구 숨로 34, 2층", instructors: ["박서하", "윤하람", "정이안"] },
  { name: "성수점", address: "서울 성동구 숨숲길 56, 4층", instructors: ["김로아", "서은채", "문해솔"] },
];

const CAPACITY: Record<string, number> = { "리포머 기초": 6, "리포머 중급": 6, "체어": 4, "매트": 10, "소도구": 8 };

function instructorIndex(weekday: number, slot: number, title: string): number {
  if (title === "체어") return 2;
  const mwf = weekday === 1 || weekday === 3 || weekday === 5;
  if (weekday === 6) return slot === 0 ? 1 : 2;
  if (slot === 0) return mwf ? 0 : 1;
  if (slot === 1) return mwf ? 1 : 0;
  if (slot === 2) return 2;
  return mwf ? 2 : 0;
}

function mondayOf(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

const FAMILY = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍"];
const GIVEN = ["하나", "두리", "세나", "지우", "서연", "민지", "예린", "수아", "다은", "채원", "유진", "소윤", "하린", "지민", "가은", "나래", "보람", "시은", "아린", "도희"];

async function main() {
  const now = new Date();
  const monday = mondayOf(now);
  const rand = mulberry32(monday.getFullYear() * 10000 + (monday.getMonth() + 1) * 100 + monday.getDate());

  console.log("기존 데이터를 지우는 중...");
  await prisma.booking.deleteMany();
  await prisma.pass.deleteMany();
  await prisma.member.deleteMany();
  await prisma.classSession.deleteMany();
  await prisma.instructor.deleteMany();
  await prisma.branch.deleteMany();

  // 지점과 강사
  const branchRows: { id: number; name: string; instructorIds: number[] }[] = [];
  for (const b of BRANCHES) {
    const branch = await prisma.branch.create({ data: { name: b.name, address: b.address } });
    const instructorIds: number[] = [];
    for (const name of b.instructors) {
      const ins = await prisma.instructor.create({ data: { name, branchId: branch.id } });
      instructorIds.push(ins.id);
    }
    branchRows.push({ id: branch.id, name: b.name, instructorIds });
  }

  // 수업: 지난 2주 ~ 앞으로 3주 (일요일 휴무)
  const first = new Date(monday);
  first.setDate(first.getDate() - 14);
  const sessionData: any[] = [];
  for (let i = 0; i < 35; i++) {
    const day = new Date(first);
    day.setDate(first.getDate() + i);
    const weekday = day.getDay();
    if (weekday === 0) continue;
    for (const br of branchRows) {
      const slots = PATTERNS[br.name][String(weekday)];
      slots.forEach(([time, title], slot) => {
        const [h, m] = time.split(":").map(Number);
        const startsAt = new Date(day);
        startsAt.setHours(h, m, 0, 0);
        const endsAt = new Date(startsAt.getTime() + 50 * 60 * 1000);
        sessionData.push({
          title,
          branchId: br.id,
          instructorId: br.instructorIds[instructorIndex(weekday, slot, title)],
          startsAt,
          endsAt,
          capacity: CAPACITY[title],
        });
      });
    }
  }
  await prisma.classSession.createMany({ data: sessionData });
  const sessions = await prisma.classSession.findMany({ orderBy: { startsAt: "asc" } });

  // 회원 (지점마다 40명) — 전화번호는 가짜 번호
  let seq = 1;
  const memberData: any[] = [];
  for (const br of branchRows) {
    for (let k = 0; k < 40; k++) {
      const joinedAt = new Date(monday);
      joinedAt.setDate(joinedAt.getDate() - 20 - Math.floor(rand() * 300));
      memberData.push({
        name: FAMILY[Math.floor(rand() * FAMILY.length)] + GIVEN[Math.floor(rand() * GIVEN.length)],
        phone: `010-0000-${String(seq++).padStart(4, "0")}`,
        branchId: br.id,
        joinedAt,
      });
    }
  }
  await prisma.member.createMany({ data: memberData });
  const members = await prisma.member.findMany({ orderBy: { id: "asc" } });

  // 회원권 (회원마다 하나)
  const passData: any[] = [];
  for (const mem of members) {
    const is30 = rand() < 0.7;
    const total = is30 ? 30 : 10;
    const startsAt = new Date(monday);
    startsAt.setDate(startsAt.getDate() - 14 - Math.floor(rand() * (is30 ? 60 : 30)));
    const expiresAt = new Date(startsAt);
    expiresAt.setMonth(expiresAt.getMonth() + (is30 ? 3 : 2));
    const usedBefore = Math.floor(rand() * (is30 ? 12 : 4));
    passData.push({
      memberId: mem.id,
      kind: is30 ? "30회권" : "10회권",
      totalCount: total,
      remaining: total - usedBefore,
      price: is30 ? 528000 : 220000,
      startsAt,
      expiresAt,
    });
  }
  await prisma.pass.createMany({ data: passData });
  const passes = await prisma.pass.findMany();
  const passByMember = new Map(passes.map((p) => [p.memberId, { ...p }]));

  // 예약
  const bookingData: any[] = [];
  for (const s of sessions) {
    const hour = s.startsAt.getHours();
    const saturday = s.startsAt.getDay() === 6;
    let rate = saturday ? 0.8 : hour >= 19 ? 0.85 : hour >= 12 ? 0.5 : 0.6;
    const past = s.startsAt < now;
    if (!past) {
      const daysAhead = (s.startsAt.getTime() - now.getTime()) / 86400000;
      rate *= Math.max(0.25, 1 - daysAhead / 25);
    }
    const target = Math.max(0, Math.min(s.capacity, Math.round(s.capacity * rate + (rand() - 0.5) * 2)));
    const sameBranch = members.filter((m) => m.branchId === s.branchId);
    const chosen = new Set<number>();
    let tries = 0;
    while (chosen.size < target && tries < 300) {
      tries++;
      const pool = rand() < 0.75 ? sameBranch : members;
      const m = pool[Math.floor(rand() * pool.length)];
      if (chosen.has(m.id)) continue;
      const pass = passByMember.get(m.id)!;
      if (pass.remaining <= 0 || s.startsAt < pass.startsAt || s.startsAt > pass.expiresAt) continue;
      chosen.add(m.id);
      let status = "CONFIRMED";
      const r = rand();
      if (past) status = r < 0.08 ? "CANCELED" : r < 0.12 ? "NO_SHOW" : "CONFIRMED";
      else if (r < 0.05) status = "CANCELED";
      if (status !== "CANCELED") pass.remaining -= 1;
      const createdAt = new Date(Math.min(now.getTime(), s.startsAt.getTime() - (1 + Math.floor(rand() * 6)) * 86400000));
      bookingData.push({ memberId: m.id, sessionId: s.id, passId: pass.id, status, createdAt });
    }
  }
  await prisma.booking.createMany({ data: bookingData });
  for (const p of passByMember.values()) {
    await prisma.pass.update({ where: { id: p.id }, data: { remaining: p.remaining } });
  }

  console.log(`가상 데이터를 넣었습니다: 지점 ${branchRows.length}, 수업 ${sessions.length}, 회원 ${members.length}, 회원권 ${passes.length}, 예약 ${bookingData.length}`);
}

main()
  .catch((e) => {
    console.error("가상 데이터를 넣지 못했습니다:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
