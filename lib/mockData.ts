import { User, Exam, Question, Submission, AntiCheatLog } from '../types';

const passwordHash = '$2a$10$w6M7q3p/k9Zz9t.g3/6VyeGz3/U9eD2eF3.L/M9X8/1Y1Y1Y1Y1Y1';

// Seed Admin & Core Test Students
const baseUsers: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@caculus.edu.vn',
    passwordHash,
    name: 'Quản trị viên THPTQG',
    studentId: 'ADMIN-001',
    role: 'admin',
    isVip: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-student-1',
    email: 'student@caculus.edu.vn',
    passwordHash,
    name: 'Nguyễn Cường',
    studentId: 'THPTQG_496692',
    role: 'student',
    isVip: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-student-2',
    email: 'tranvanb@caculus.edu.vn',
    passwordHash,
    name: 'Trần Văn B',
    studentId: 'THPTQG_496693',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-student-3',
    email: 'lethic@caculus.edu.vn',
    passwordHash,
    name: 'Lê Thị C',
    studentId: 'THPTQG_496694',
    role: 'student',
    createdAt: new Date().toISOString(),
  }
];

const mockStudentData = [
  { name: 'Nguyễn Minh Triết', idNum: '108291', score: 9.8, exams: 5 },
  { name: 'Trần Hoàng Nam', idNum: '293812', score: 9.6, exams: 4 },
  { name: 'Lê Phương Thảo', idNum: '819230', score: 9.5, exams: 6 },
  { name: 'Đặng Quốc Bảo', idNum: '304918', score: 9.25, exams: 4 },
  { name: 'Vũ Hoàng Yến', idNum: '918234', score: 9.0, exams: 5 },
  { name: 'Phạm Đức Anh', idNum: '129384', score: 8.8, exams: 3 },
  { name: 'Bùi Thị Mai', idNum: '827364', score: 8.6, exams: 4 },
  { name: 'Đỗ Quang Huy', idNum: '394827', score: 8.5, exams: 5 },
  { name: 'Hoàng Ngọc Ánh', idNum: '583920', score: 8.2, exams: 3 },
  { name: 'Nguyễn Thành Long', idNum: '948201', score: 8.0, exams: 4 },
  { name: 'Lương Gia Huy', idNum: '284719', score: 7.8, exams: 2 },
  { name: 'Trịnh Như Quỳnh', idNum: '472910', score: 7.6, exams: 3 },
  { name: 'Phan Nhật Minh', idNum: '739201', score: 7.4, exams: 4 },
  { name: 'Đào Khánh Linh', idNum: '193847', score: 7.2, exams: 2 },
  { name: 'Đinh Tấn Phát', idNum: '582019', score: 7.0, exams: 3 },
];

const mockStudents: User[] = mockStudentData.map((item, idx) => ({
  id: `user-student-mock-${idx + 1}`,
  email: `student_mock${idx + 1}@caculus.edu.vn`,
  passwordHash,
  name: item.name,
  studentId: `THPTQG_${item.idNum}`,
  role: 'student',
  createdAt: new Date().toISOString(),
}));

export const INITIAL_USERS: User[] = [...baseUsers, ...mockStudents];

// 8 Practice Topics as Exams with category = 'LUYỆN TẬP'
export const PRACTICE_TOPIC_EXAMS: Exam[] = [
  {
    id: 'exam-cd-1',
    title: 'Chuyên đề 01: Biến thiên & Đồ thị Hàm số',
    description: 'Tổng ôn Đơn điệu, Cực trị, Giá trị lớn nhất - nhỏ nhất, Tiệm cận & Đồ thị hàm số 12',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Hàm số',
    modules: [{
      id: 'mod-cd-1',
      examId: 'exam-cd-1',
      title: 'Chuyên đề Biến thiên & Đồ thị Hàm số',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 25
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-2',
    title: 'Chuyên đề 02: Phương trình & Bất phương trình Mũ - Logarit',
    description: 'Công thức biến đổi logarit, phương trình, bất phương trình mũ & bài toán thực tế',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Mũ & Logarit',
    modules: [{
      id: 'mod-cd-2',
      examId: 'exam-cd-2',
      title: 'Chuyên đề Mũ & Logarit',
      category: 'math',
      durationMinutes: 40,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 20
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-3',
    title: 'Chuyên đề 03: Nguyên hàm, Tích phân & Ứng dụng Hình phẳng',
    description: 'Các phương pháp tính nguyên hàm, tích phân đổi biến, từng phần & tính diện tích, thể tích',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Tích phân',
    modules: [{
      id: 'mod-cd-3',
      examId: 'exam-cd-3',
      title: 'Chuyên đề Nguyên hàm - Tích phân',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 25
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-4',
    title: 'Chuyên đề 04: Khối đa diện, Góc & Khoảng cách Không gian Cổ điển',
    description: 'Tính thể tích khối chóp, khối lăng trụ, khoảng cách từ điểm đến mặt phẳng & góc giữa 2 mặt phẳng',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Hình học Không gian',
    modules: [{
      id: 'mod-cd-4',
      examId: 'exam-cd-4',
      title: 'Chuyên đề Hình học Không gian',
      category: 'math',
      durationMinutes: 40,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 20
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-5',
    title: 'Chuyên đề 05: Tọa độ Oxyz: Mặt phẳng, Đường thẳng & Mặt cầu',
    description: 'Phương trình mặt phẳng, phương trình đường thẳng, mặt cầu và vị trí tương đối trong Oxyz',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Hình học Oxyz',
    modules: [{
      id: 'mod-cd-5',
      examId: 'exam-cd-5',
      title: 'Chuyên đề Hình học Tọa độ Oxyz',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 25
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-6',
    title: 'Chuyên đề 06: Đại số Số phức & Biểu diễn Tọa độ Mặt phẳng',
    description: 'Các phép toán số phức, môđun, số phức liên hợp, tập hợp điểm biểu diễn & cực trị số phức',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Số phức',
    modules: [{
      id: 'mod-cd-6',
      examId: 'exam-cd-6',
      title: 'Chuyên đề Số phức',
      category: 'math',
      durationMinutes: 35,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 20
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-7',
    title: 'Chuyên đề 07: Xác suất, Tổ hợp & Thống kê Số liệu THPTQG',
    description: 'Quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp, biến cố ngẫu nhiên & phân tích bảng biểu thống kê',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Xác suất',
    modules: [{
      id: 'mod-cd-7',
      examId: 'exam-cd-7',
      title: 'Chuyên đề Xác suất & Thống kê',
      category: 'math',
      durationMinutes: 40,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 20
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'exam-cd-8',
    title: 'Chuyên đề 08: Dãy số, Cấp số cộng & Cấp số nhân',
    description: 'Dãy số tăng giảm, công sai cấp số cộng, công bội cấp số nhân & bài toán tổng quát',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Cấp số cộng',
    modules: [{
      id: 'mod-cd-8',
      examId: 'exam-cd-8',
      title: 'Chuyên đề Dãy số & Cấp số',
      category: 'math',
      durationMinutes: 30,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 15
    }],
    createdAt: new Date().toISOString()
  }
];

// Active Full Mock Exams (THPTQG Math Mock Tests)
const activeExams: Exam[] = [
  {
    id: 'exam-thptqg-1',
    title: 'Đề Thi Thử TN THPT Quốc Gia Môn Toán 2026 - Đề Số 01',
    description: 'Bộ đề thi chuẩn cấu trúc Bộ GD&ĐT 2025/2026 (12 Trắc nghiệm + 4 Đúng/Sai + 6 Trả lời ngắn)',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'THỰC CHIẾN',
    subCategory: 'math',
    modules: [
      {
        id: 'mod-thptqg-math-1',
        examId: 'exam-thptqg-1',
        title: 'Bài Thi Môn Toán TN THPT Quốc Gia',
        category: 'math',
        durationMinutes: 90,
        openTime: '00:00 01/01/2026',
        closeTime: '23:59 31/12/2027',
        totalQuestions: 22,
      }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-thptqg-2',
    title: 'Đề Thi Thử TN THPT Quốc Gia Môn Toán 2026 - Đề Số 02',
    description: 'Đề tổng ôn 9+ chuyên đề Hàm số, Tích phân & Hình học Oxyz vận dụng cao',
    isFree: false,
    isPublished: true,
    price: 150000,
    status: 'ĐÃ UPDATE',
    category: 'THỰC CHIẾN',
    subCategory: 'math',
    modules: [
      {
        id: 'mod-thptqg-math-2',
        examId: 'exam-thptqg-2',
        title: 'Bài Thi Môn Toán TN THPT Quốc Gia',
        category: 'math',
        durationMinutes: 90,
        openTime: '08:00 01/06/2026',
        closeTime: '23:59 30/12/2027',
        totalQuestions: 22,
      }
    ],
    createdAt: new Date().toISOString(),
  }
];

// 36 VIP THPTQG Math Exams
const vipExams: Exam[] = Array.from({ length: 36 }).map((_, idx) => {
  const numStr = String(idx + 1).padStart(3, '0');
  return {
    id: `exam-vip-${numStr}`,
    title: `Đề Thi Thử THPTQG Môn Toán VIP ${numStr}`,
    description: `Đề thi thực chiến luyện đề 9+ môn Toán THPT Quốc Gia (Chuyên đề VIP ${numStr})`,
    isFree: false,
    isPublished: true,
    price: 150000,
    status: 'ĐÃ UPDATE',
    category: 'THỰC CHIẾN',
    subCategory: 'math',
    modules: [
      {
        id: `mod-math-vip-${numStr}`,
        examId: `exam-vip-${numStr}`,
        title: 'Bài Thi Môn Toán TN THPT Quốc Gia',
        category: 'math',
        durationMinutes: 90,
        openTime: '00:00 01/01/2026',
        closeTime: '23:59 31/12/2027',
        totalQuestions: 22,
      }
    ],
    createdAt: new Date().toISOString(),
  };
});

export const INITIAL_EXAMS: Exam[] = [...PRACTICE_TOPIC_EXAMS, ...activeExams, ...vipExams];

// Seed Questions matching 3-part THPTQG Math format
export const INITIAL_QUESTIONS: Question[] = [
  // PART I: Single Choice (12 questions)
  {
    id: 'q-math-p1-1',
    moduleId: 'mod-thptqg-math-1',
    number: 1,
    partType: 'part1',
    type: 'single_choice',
    topic: 'Hàm số',
    text: 'Cho hàm số y = f(x) có bảng biến thiên như sau. Hàm số đã cho đồng biến trên khoảng nào dưới đây?',
    passage: `x   |-∞       -1        1       +∞
f'(x)|    +    0    -   0   +   
f(x) |-∞  ↗  2   ↘  -2  ↗  +∞`,
    options: [
      { id: 'opt-a', text: '(-1; 1)' },
      { id: 'opt-b', text: '(1; +∞)' },
      { id: 'opt-c', text: '(-∞; 1)' },
      { id: 'opt-d', text: '(-2; 2)' }
    ],
    correctOptionId: 'opt-b',
    explanation: 'Quan sát bảng biến thiên, f\'(x) > 0 trên các khoảng (-∞; -1) và (1; +∞). Do đó hàm số đồng biến trên (1; +∞).'
  },
  {
    id: 'q-math-p1-2',
    moduleId: 'mod-thptqg-math-1',
    number: 2,
    partType: 'part1',
    type: 'single_choice',
    topic: 'Mũ & Logarit',
    text: 'Nghiệm của phương trình log2(x - 3) = 3 là:',
    options: [
      { id: 'opt-a', text: 'x = 11' },
      { id: 'opt-b', text: 'x = 9' },
      { id: 'opt-c', text: 'x = 12' },
      { id: 'opt-d', text: 'x = 8' }
    ],
    correctOptionId: 'opt-a',
    explanation: 'Điều kiện x > 3. Ta có: x - 3 = 2^3 = 8 => x = 11 (thỏa mãn).'
  },
  {
    id: 'q-math-[#0052cc]-3',
    moduleId: 'mod-thptqg-math-1',
    number: 3,
    partType: 'part1',
    type: 'single_choice',
    topic: 'Nguyên hàm & Tích phân',
    text: 'Cho hàm số f(x) = e^(2x). Họ tất cả các nguyên hàm của hàm số f(x) là:',
    options: [
      { id: 'opt-a', text: 'F(x) = 2.e^(2x) + C' },
      { id: 'opt-b', text: 'F(x) = (1/2).e^(2x) + C' },
      { id: 'opt-c', text: 'F(x) = e^(2x) + C' },
      { id: 'opt-d', text: 'F(x) = (1/2).e^x + C' }
    ],
    correctOptionId: 'opt-b',
    explanation: '∫ e^(2x) dx = (1/2) e^(2x) + C.'
  },

  // PART II: True / False (4 Questions, each with 4 sub-statements a, b, c, d)
  {
    id: 'q-math-p2-1',
    moduleId: 'mod-thptqg-math-1',
    number: 13,
    partType: 'part2',
    type: 'true_false',
    topic: 'Hàm số & Khảo sát',
    text: 'Xét hàm số y = f(x) = x^3 - 3x^2 + 2 trên đoạn [0; 3]. Các phát biểu sau đây ĐÚNG hay SAI?',
    options: [],
    trueFalseItems: [
      { id: 'a', statement: 'a) Đạo hàm f\'(x) = 3x^2 - 6x.', isTrue: true, explanation: 'f\'(x) = 3x^2 - 6x' },
      { id: 'b', statement: 'b) Hàm số đạt cực đại tại điểm x = 2.', isTrue: false, explanation: 'f\'(x) = 0 <=> x = 0 (cực đại) hoặc x = 2 (cực tiểu)' },
      { id: 'c', statement: 'c) Giá trị lớn nhất của hàm số trên đoạn [0; 3] bằng 2.', isTrue: true, explanation: 'f(0)=2, f(2)=-2, f(3)=2. Max = 2' },
      { id: 'd', statement: 'd) Giá trị nhỏ nhất của hàm số trên đoạn [0; 3] bằng -2.', isTrue: true, explanation: 'Min = f(2) = -2' }
    ],
    explanation: 'a) Đúng. b) Sai (x=2 là điểm cực tiểu). c) Đúng (Max [0;3] = 2). d) Đúng (Min [0;3] = -2).'
  },

  // PART III: Short Answer / Fill-in (6 questions)
  {
    id: 'q-math-p3-1',
    moduleId: 'mod-thptqg-math-1',
    number: 17,
    partType: 'part3',
    type: 'fill_blank',
    topic: 'Hàm số & Ứng dụng thực tế',
    text: 'Một xưởng sản xuất thiết kế thùng chứa hình trụ có thể tích V = 2000 cm³. Bán kính đáy r (cm) để diện tích toàn phần của thùng chứa đạt giá trị nhỏ nhất làm tròn đến hàng phần mười là bao nhiêu?',
    options: [],
    fillBlankAnswers: ['6.8', '6.84', '6,8'],
    explanation: 'Diện tích toàn phần S = 2πr² + 2000/r. Đạo hàm S\' = 4πr - 2000/r² = 0 => r = ∛(500/π) ≈ 6.836 cm => Làm tròn 6.8.'
  }
];

const baseSubmissions: Submission[] = [
  {
    id: 'sub-1',
    examId: 'exam-thptqg-1',
    moduleId: 'mod-thptqg-math-1',
    userId: 'user-student-1',
    userName: 'Nguyễn Cường',
    studentId: 'THPTQG_496692',
    score: 9.25,
    totalQuestions: 22,
    correctCount: 20,
    answers: [],
    submittedAt: '2026-07-24T14:30:00.000Z',
    antiCheatViolationCount: 0,
  }
];

const mockSubmissions: Submission[] = mockStudentData.map((item, idx) => ({
  id: `sub-mock-${idx + 1}`,
  examId: 'exam-thptqg-1',
  moduleId: 'mod-thptqg-math-1',
  userId: `user-student-mock-${idx + 1}`,
  userName: item.name,
  studentId: `THPTQG_${item.idNum}`,
  score: item.score,
  totalQuestions: 22,
  correctCount: Math.round((item.score / 10) * 22),
  answers: [],
  submittedAt: new Date(Date.now() - (idx + 1) * 3600000 * 4).toISOString(),
  antiCheatViolationCount: 0,
}));

export const INITIAL_SUBMISSIONS: Submission[] = [...baseSubmissions, ...mockSubmissions];

export const INITIAL_ANTICHEAT_LOGS: AntiCheatLog[] = [
  {
    id: 'ac-1',
    userId: 'user-student-1',
    userName: 'Nguyễn Cường',
    studentId: 'THPTQG_496692',
    examId: 'exam-thptqg-1',
    moduleId: 'mod-thptqg-math-1',
    eventType: 'tab_switch',
    timestamp: '2026-07-24T15:10:22.000Z',
    details: 'Thí sinh rời màn hình bài thi (Chuyển tab trình duyệt)'
  }
];
