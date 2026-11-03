import { NextResponse } from 'next/server';
import { getUsers, getSubmissions } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SEED_HONOR_ROLL = [
  {
    id: 'seed-01',
    name: 'Nguyễn Văn An',
    studentId: 'PARABOL_VIP_001',
    totalExams: 26,
    completedExams: 26,
    highestScore: 9.8,
    avgScore: 9.4,
  },
  {
    id: 'seed-02',
    name: 'Trần Mai Phương',
    studentId: 'PARABOL_VIP_002',
    totalExams: 24,
    completedExams: 24,
    highestScore: 9.6,
    avgScore: 9.2,
  },
  {
    id: 'seed-03',
    name: 'Lê Hoàng Nam',
    studentId: 'PARABOL_VIP_003',
    totalExams: 25,
    completedExams: 25,
    highestScore: 9.4,
    avgScore: 9.0,
  },
  {
    id: 'seed-04',
    name: 'Phạm Minh Đức',
    studentId: 'PARABOL_VIP_004',
    totalExams: 22,
    completedExams: 22,
    highestScore: 9.2,
    avgScore: 8.8,
  },
  {
    id: 'seed-05',
    name: 'Vũ Thùy Linh',
    studentId: 'PARABOL_VIP_005',
    totalExams: 21,
    completedExams: 21,
    highestScore: 9.0,
    avgScore: 8.6,
  },
  {
    id: 'seed-06',
    name: 'Đặng Quang Huy',
    studentId: 'PARABOL_VIP_006',
    totalExams: 20,
    completedExams: 20,
    highestScore: 8.8,
    avgScore: 8.5,
  },
  {
    id: 'seed-07',
    name: 'Hoàng Bảo Ngọc',
    studentId: 'PARABOL_VIP_007',
    totalExams: 19,
    completedExams: 19,
    highestScore: 8.8,
    avgScore: 8.4,
  },
  {
    id: 'seed-08',
    name: 'Ngô Gia Bách',
    studentId: 'PARABOL_VIP_008',
    totalExams: 18,
    completedExams: 18,
    highestScore: 8.6,
    avgScore: 8.2,
  },
  {
    id: 'seed-09',
    name: 'Bùi Khánh Linh',
    studentId: 'PARABOL_VIP_009',
    totalExams: 17,
    completedExams: 17,
    highestScore: 8.4,
    avgScore: 8.1,
  },
  {
    id: 'seed-10',
    name: 'Đỗ Tuấn Kiệt',
    studentId: 'PARABOL_VIP_010',
    totalExams: 16,
    completedExams: 16,
    highestScore: 8.2,
    avgScore: 8.0,
  },
];

export async function GET() {
  const users = getUsers().filter((u) => u.role === 'student');
  const submissions = getSubmissions();

  // Find real students who have submissions with score > 0
  const realLeaderboardItems: any[] = [];

  users.forEach((student) => {
    const studentSubmissions = submissions.filter((s) => s.userId === student.id && s.score > 0);
    if (studentSubmissions.length > 0) {
      const totalExams = studentSubmissions.length;
      const highestScore = Number(studentSubmissions.reduce((max, s) => Math.max(max, s.score), 0).toFixed(2));
      const avgScore = Number((studentSubmissions.reduce((sum, s) => sum + s.score, 0) / totalExams).toFixed(1));
      const displayName = student.realName || student.name || 'Thí sinh';
      const cleanSbd = (student.studentId || '')
        .replace(/^CACULUS_/i, 'PARABOL_')
        .replace(/^THPTQG_/i, 'PARABOL_');

      realLeaderboardItems.push({
        id: student.id,
        name: displayName,
        studentId: cleanSbd,
        totalExams,
        completedExams: totalExams,
        highestScore,
        avgScore,
      });
    }
  });

  // Combine real submissions with seed honor roll (excluding any duplicates by name or id)
  const combined = [...realLeaderboardItems];
  SEED_HONOR_ROLL.forEach((seed) => {
    if (!combined.some((c) => c.name.toLowerCase() === seed.name.toLowerCase())) {
      combined.push(seed);
    }
  });

  // Sort descending by highest score, then by totalExams
  combined.sort((a, b) => b.highestScore - a.highestScore || b.totalExams - a.totalExams);

  // Assign ranks
  const leaderboard = combined.slice(0, 20).map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return NextResponse.json({ leaderboard });
}
