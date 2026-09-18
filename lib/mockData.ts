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
  }
];

// Seed 500 VIP Students
const vipStudents: User[] = Array.from({ length: 500 }).map((_, i) => {
  const num = String(i + 1).padStart(3, '0');
  return {
    id: `user-hs-${num}`,
    email: `hs${num}@caculus.edu.vn`,
    passwordHash,
    name: `Học sinh ${num}`,
    studentId: `THPTQG_${num}`,
    role: 'student',
    isVip: true,
    createdAt: new Date().toISOString(),
  };
});

export const INITIAL_USERS: User[] = [...baseUsers, ...vipStudents];

// 9 CHUYÊN ĐỀ TOÁN THPTQG CHUẨN GDPT 2018 (LOẠI BỎ SỐ PHỨC, BỔ SUNG XÁC SUẤT ĐIỀU KIỆN & THỐNG KÊ GHÉP NHÓM)
export const PRACTICE_TOPIC_EXAMS: Exam[] = [
  {
    id: 'chuyen-de-01',
    title: 'Chuyên đề 01: Ứng dụng Đạo hàm khảo sát & vẽ đồ thị hàm số 12',
    description: 'Tính đơn điệu, Cực trị, Giá trị lớn nhất - nhỏ nhất, Tiệm cận, Nhận dạng đồ thị & Bài toán tối ưu thực tế 12',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Hàm số 12',
    modules: [{
      id: 'mod-chuyen-de-01',
      examId: 'chuyen-de-01',
      title: 'Chuyên đề Đạo hàm & Khảo sát Đồ thị Hàm số',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-02',
    title: 'Chuyên đề 02: Hàm số Mũ, Hàm số Lôgarit & Phương trình Mũ - Logarit',
    description: 'Lũy thừa, Lôgarit, Tập xác định, Đạo hàm, Phương trình và Bất phương trình Mũ - Logarit thực tế',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Mũ & Logarit',
    modules: [{
      id: 'mod-chuyen-de-02',
      examId: 'chuyen-de-02',
      title: 'Chuyên đề Hàm số Mũ & Lôgarit',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-03',
    title: 'Chuyên đề 03: Nguyên hàm, Tích phân & Ứng dụng Hình học - Thực tế',
    description: 'Bảng nguyên hàm cơ bản & mở rộng, Đổi biến số, Từng phần, Diện tích hình phẳng và Thể tích khối tròn xoay',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Tích phân',
    modules: [{
      id: 'mod-chuyen-de-03',
      examId: 'chuyen-de-03',
      title: 'Chuyên đề Nguyên hàm & Tích phân',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-04',
    title: 'Chuyên đề 04: Phương pháp Tọa độ trong không gian Oxyz 12',
    description: 'Vectơ trong không gian, Tọa độ điểm, Phương trình Mặt phẳng, Đường thẳng, Mặt cầu & Mô hình không gian 3D thực tế',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Tọa độ Oxyz',
    modules: [{
      id: 'mod-chuyen-de-04',
      examId: 'chuyen-de-04',
      title: 'Chuyên đề Phương pháp Tọa độ Oxyz',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-05',
    title: 'Chuyên đề 05: Hình học Không gian Cổ điển & Khối tròn xoay (Nón - Trụ - Cầu)',
    description: 'Góc giữa đường và mặt, Góc nhị diện, Khoảng cách điểm đến mặt phẳng, Thể tích khối chóp, lăng trụ, Khối Nón - Trụ - Cầu',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Hình học Không gian',
    modules: [{
      id: 'mod-chuyen-de-05',
      examId: 'chuyen-de-05',
      title: 'Chuyên đề Hình học Không gian Cổ điển',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-06',
    title: 'Chuyên đề 06: Xác suất có điều kiện & Công thức Bayes',
    description: 'Nội dung mới trọng tâm GDPT 2018: Xác suất có điều kiện, Quy tắc nhân xác suất, Công thức Bayes và Ứng dụng thực tế',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Xác suất có điều kiện',
    modules: [{
      id: 'mod-chuyen-de-06',
      examId: 'chuyen-de-06',
      title: 'Chuyên đề Xác suất có điều kiện & Bayes',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-07',
    title: 'Chuyên đề 07: Các số đặc trưng đo độ phân tán mẫu số liệu ghép nhóm 12',
    description: 'Nội dung mới lớp 12: Khoảng biến thiên, Khoảng tứ phân vị, Phương sai, Độ lệch chuẩn của mẫu số liệu ghép nhóm',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Thống kê Ghép nhóm',
    modules: [{
      id: 'mod-chuyen-de-07',
      examId: 'chuyen-de-07',
      title: 'Chuyên đề Số đặc trưng mẫu số liệu ghép nhóm',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-08',
    title: 'Chuyên đề 08: Dãy số, Cấp số cộng & Cấp số nhân',
    description: 'Công thức số hạng tổng quát, Tổng n số hạng đầu tiên, Bài toán tăng trưởng kinh tế & lãi suất',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Dãy số & Cấp số',
    modules: [{
      id: 'mod-chuyen-de-08',
      examId: 'chuyen-de-08',
      title: 'Chuyên đề Cấp số cộng & Cấp số nhân',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chuyen-de-09',
    title: 'Chuyên đề 09: Thống kê & Đại số Tổ hợp Ứng dụng',
    description: 'Quy tắc cộng, Quy tắc nhân, Hoán vị, Chỉnh hợp, Tổ hợp, Nhị thức Newton & Bài toán xác suất cổ điển',
    isFree: true,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'LUYỆN TẬP',
    subCategory: 'math',
    topic: 'Tổ hợp & Xác suất',
    modules: [{
      id: 'mod-chuyen-de-09',
      examId: 'chuyen-de-09',
      title: 'Chuyên đề Đại số Tổ hợp & Thống kê',
      category: 'math',
      durationMinutes: 45,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  },
];

// BỘ 36 ĐỀ THI THỬ THỰC CHIẾN TN THPTQG 2026 (CẬP NHẬT LIÊN TỤC)
export const MOCK_FULL_EXAMS: Exam[] = Array.from({ length: 36 }).map((_, i) => {
  const num = String(i + 1).padStart(2, '0');
  const isFree = i === 0;
  return {
    id: `de-thuc-chien-${num}`,
    title: `Đề Thi Thử Thực Chiến TN THPTQG 2026 - Đề Số ${num}`,
    description: `Bộ đề chuẩn cấu trúc Bộ GD&ĐT 2026 môn Toán (22 câu - 90 phút - 3 phần)`,
    isFree,
    isDemoExam: isFree,
    isPublished: true,
    status: 'ĐÃ UPDATE',
    category: 'THỰC CHIẾN',
    subCategory: 'math',
    modules: [{
      id: `mod-de-thuc-chien-${num}`,
      examId: `de-thuc-chien-${num}`,
      title: `Bài Thi Môn Toán THPTQG - Đề Số ${num}`,
      category: 'math',
      durationMinutes: 90,
      openTime: '00:00 01/01/2026',
      closeTime: '23:59 31/12/2027',
      totalQuestions: 22
    }],
    createdAt: new Date().toISOString()
  };
});

// TỔNG HỢP TOÀN BỘ ĐỀ THI TRONG HỆ THỐNG
export const INITIAL_EXAMS: Exam[] = [...PRACTICE_TOPIC_EXAMS, ...MOCK_FULL_EXAMS];

// MẪU 22 CÂU HỎI CHUẨN BỘ GD&ĐT 2026 CHO ĐỀ SỐ 01
export const INITIAL_QUESTIONS: Question[] = [
  // PHẦN I: 12 CÂU TRẮC NGHIỆM ĐƠN (0.25đ / câu)
  {
    id: 'q-p1-1',
    moduleId: 'mod-de-thuc-chien-01',
    number: 1,
    partType: 'part1',
    type: 'single_choice',
    text: 'Cho hàm số $y = f(x)$ có bảng biến thiên trên $\\mathbb{R}$. Hàm số đã cho đồng biến trên khoảng nào dưới đây?',
    options: [
      { id: 'opt-a', text: '$(-\\infty; -1)$' },
      { id: 'opt-b', text: '$(-1; 1)$' },
      { id: 'opt-c', text: '$(1; +\\infty)$' },
      { id: 'opt-d', text: '$(0; 2)$' },
    ],
    correctOptionId: 'opt-b',
  },
  {
    id: 'q-p1-2',
    moduleId: 'mod-de-thuc-chien-01',
    number: 2,
    partType: 'part1',
    type: 'single_choice',
    text: 'Nghiệm của phương trình $\\log_2(x - 1) = 3$ là:',
    options: [
      { id: 'opt-a', text: '$x = 7$' },
      { id: 'opt-b', text: '$x = 8$' },
      { id: 'opt-c', text: '$x = 9$' },
      { id: 'opt-d', text: '$x = 10$' },
    ],
    correctOptionId: 'opt-c',
  },
  {
    id: 'q-p1-3',
    moduleId: 'mod-de-thuc-chien-01',
    number: 3,
    partType: 'part1',
    type: 'single_choice',
    text: 'Họ nguyên hàm của hàm số $f(x) = 3x^2 + 2x$ là:',
    options: [
      { id: 'opt-a', text: '$x^3 + x^2 + C$' },
      { id: 'opt-b', text: '$6x + 2 + C$' },
      { id: 'opt-c', text: '$3x^3 + 2x^2 + C$' },
      { id: 'opt-d', text: '$x^3 + 2x^2 + C$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-4',
    moduleId: 'mod-de-thuc-chien-01',
    number: 4,
    partType: 'part1',
    type: 'single_choice',
    text: 'Trong không gian $Oxyz$, cho mặt phẳng $(P): 2x - y + 3z - 4 = 0$. Một vectơ pháp tuyến của $(P)$ là:',
    options: [
      { id: 'opt-a', text: '$\\vec{n}_1 = (2; -1; 3)$' },
      { id: 'opt-b', text: '$\\vec{n}_2 = (2; 1; 3)$' },
      { id: 'opt-c', text: '$\\vec{n}_3 = (2; -1; -4)$' },
      { id: 'opt-d', text: '$\\vec{n}_4 = (-2; -1; 3)$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-5',
    moduleId: 'mod-de-thuc-chien-01',
    number: 5,
    partType: 'part1',
    type: 'single_choice',
    text: 'Thể tích của khối chóp có diện tích đáy $B = 6$ và chiều cao $h = 4$ bằng:',
    options: [
      { id: 'opt-a', text: '$24$' },
      { id: 'opt-b', text: '$8$' },
      { id: 'opt-c', text: '$12$' },
      { id: 'opt-d', text: '$72$' },
    ],
    correctOptionId: 'opt-b',
  },
  {
    id: 'q-p1-6',
    moduleId: 'mod-de-thuc-chien-01',
    number: 6,
    partType: 'part1',
    type: 'single_choice',
    text: 'Cho cấp số cộng $(u_n)$ có $u_1 = 3$ và công sai $d = 2$. Giá trị của $u_4$ bằng:',
    options: [
      { id: 'opt-a', text: '$9$' },
      { id: 'opt-b', text: '$11$' },
      { id: 'opt-c', text: '$7$' },
      { id: 'opt-d', text: '$8$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-7',
    moduleId: 'mod-de-thuc-chien-01',
    number: 7,
    partType: 'part1',
    type: 'single_choice',
    text: 'Tập nghiệm của bất phương trình $3^{x} > 9$ là:',
    options: [
      { id: 'opt-a', text: '$(2; +\\infty)$' },
      { id: 'opt-b', text: '$(-\\infty; 2)$' },
      { id: 'opt-c', text: '$(3; +\\infty)$' },
      { id: 'opt-d', text: '$(0; 2)$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-8',
    moduleId: 'mod-de-thuc-chien-01',
    number: 8,
    partType: 'part1',
    type: 'single_choice',
    text: 'Trong không gian $Oxyz$, mặt cầu $(S): (x-1)^2 + (y+2)^2 + (z-3)^2 = 16$ có bán kính bằng:',
    options: [
      { id: 'opt-a', text: '$16$' },
      { id: 'opt-b', text: '$4$' },
      { id: 'opt-c', text: '$8$' },
      { id: 'opt-d', text: '$2$' },
    ],
    correctOptionId: 'opt-b',
  },
  {
    id: 'q-p1-9',
    moduleId: 'mod-de-thuc-chien-01',
    number: 9,
    partType: 'part1',
    type: 'single_choice',
    text: 'Biết $\\int_1^3 f(x)dx = 4$ và $\\int_1^3 g(x)dx = -2$. Khi đó $\\int_1^3 [f(x) + g(x)]dx$ bằng:',
    options: [
      { id: 'opt-a', text: '$2$' },
      { id: 'opt-b', text: '$6$' },
      { id: 'opt-c', text: '$-2$' },
      { id: 'opt-d', text: '$-8$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-10',
    moduleId: 'mod-de-thuc-chien-01',
    number: 10,
    partType: 'part1',
    type: 'single_choice',
    text: 'Đồ thị hàm số $y = \\frac{2x - 1}{x + 1}$ có đường tiệm cận đứng là:',
    options: [
      { id: 'opt-a', text: '$x = -1$' },
      { id: 'opt-b', text: '$x = 2$' },
      { id: 'opt-c', text: '$y = 2$' },
      { id: 'opt-d', text: '$y = -1$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-11',
    moduleId: 'mod-de-thuc-chien-01',
    number: 11,
    partType: 'part1',
    type: 'single_choice',
    text: 'Số cách chọn 3 học sinh từ một nhóm 10 học sinh là:',
    options: [
      { id: 'opt-a', text: '$C_{10}^3 = 120$' },
      { id: 'opt-b', text: '$A_{10}^3 = 720$' },
      { id: 'opt-c', text: '$30$' },
      { id: 'opt-d', text: '$10^3 = 1000$' },
    ],
    correctOptionId: 'opt-a',
  },
  {
    id: 'q-p1-12',
    moduleId: 'mod-de-thuc-chien-01',
    number: 12,
    partType: 'part1',
    type: 'single_choice',
    text: 'Cho hai biến cố $A$ và $B$ độc lập có $P(A) = 0.5$ và $P(B) = 0.4$. Xác suất $P(AB)$ bằng:',
    options: [
      { id: 'opt-a', text: '$0.2$' },
      { id: 'opt-b', text: '$0.9$' },
      { id: 'opt-c', text: '$0.1$' },
      { id: 'opt-d', text: '$0.5$' },
    ],
    correctOptionId: 'opt-a',
  },

  // PHẦN II: 4 CÂU ĐÚNG / SAI (4 ý a, b, c, d)
  {
    id: 'q-p2-13',
    moduleId: 'mod-de-thuc-chien-01',
    number: 13,
    partType: 'part2',
    type: 'true_false',
    text: 'Cho hàm số $f(x) = x^3 - 3x^2 + 2$. Xét tính đúng/sai của các mệnh đề sau:',
    trueFalseItems: [
      { id: 'a', statement: 'a) Hàm số đồng biến trên khoảng $(2; +\\infty)$.', isTrue: true },
      { id: 'b', statement: 'b) Điểm cực đại của đồ thị hàm số là $(0; 2)$.', isTrue: true },
      { id: 'c', statement: 'c) Giá trị nhỏ nhất của hàm số trên đoạn $[-1; 3]$ bằng $-2$.', isTrue: true },
      { id: 'd', statement: 'd) Phương trình $f(x) = m$ có đúng 3 nghiệm thực phân biệt khi $-2 < m < 2$.', isTrue: true },
    ]
  },
  {
    id: 'q-p2-14',
    moduleId: 'mod-de-thuc-chien-01',
    number: 14,
    partType: 'part2',
    type: 'true_false',
    text: 'Trong không gian $Oxyz$, cho $A(1; 0; 2)$, $B(2; -1; 3)$ và $(P): x + y + z - 1 = 0$. Xét tính đúng/sai của các mệnh đề sau:',
    trueFalseItems: [
      { id: 'a', statement: 'a) Vectơ $\\vec{AB} = (1; -1; 1)$.', isTrue: true },
      { id: 'b', statement: 'b) Đường thẳng $AB$ vuông góc với mặt phẳng $(P)$.', isTrue: false },
      { id: 'c', statement: 'c) Khoảng cách từ điểm $A$ đến mặt phẳng $(P)$ bằng $\\frac{2}{\\sqrt{3}}$.', isTrue: true },
      { id: 'd', statement: 'd) Mặt cầu tâm $A$ tiếp xúc $(P)$ có phương trình $(x-1)^2 + y^2 + (z-2)^2 = \\frac{4}{3}$.', isTrue: true },
    ]
  },
  {
    id: 'q-p2-15',
    moduleId: 'mod-de-thuc-chien-01',
    number: 15,
    partType: 'part2',
    type: 'true_false',
    text: 'Một công ty sản xuất sản phẩm với chi phí $C(x) = 2x^2 + 50x + 1800$ (nghìn đồng) khi sản xuất $x$ sản phẩm ($x > 0$). Giá bán mỗi sản phẩm là $150$ nghìn đồng. Xét tính đúng/sai của các khẳng định sau:',
    trueFalseItems: [
      { id: 'a', statement: 'a) Hàm số doanh thu khi bán $x$ sản phẩm là $R(x) = 150x$.', isTrue: true },
      { id: 'b', statement: 'b) Hàm số lợi nhuận là $P(x) = -2x^2 + 100x - 1800$.', isTrue: true },
      { id: 'c', statement: 'c) Lợi nhuận lớn nhất công ty đạt được là $550$ nghìn đồng khi sản xuất $25$ sản phẩm.', isTrue: false },
      { id: 'd', statement: 'd) Chi phí trung bình cho mỗi sản phẩm đạt giá trị nhỏ nhất khi sản xuất $30$ sản phẩm.', isTrue: true },
    ]
  },
  {
    id: 'q-p2-16',
    moduleId: 'mod-de-thuc-chien-01',
    number: 16,
    partType: 'part2',
    type: 'true_false',
    text: 'Thực hiện khảo sát về thời gian tự học (giờ/ngày) của một nhóm 40 học sinh lớp 12 thu được mẫu số liệu ghép nhóm. Xét tính đúng/sai của các khẳng định sau:',
    trueFalseItems: [
      { id: 'a', statement: 'a) Khoảng biến thiên của mẫu số liệu là hiệu giữa đầu mút phải của nhóm lớn nhất và đầu mút trái của nhóm nhỏ nhất.', isTrue: true },
      { id: 'b', statement: 'b) Số trung bình của mẫu số liệu ghép nhóm xấp xỉ bằng $3.2$ giờ.', isTrue: true },
      { id: 'c', statement: 'c) Phương sai của mẫu số liệu đo mức độ phân tán của thời gian học quanh giá trị trung bình.', isTrue: true },
      { id: 'd', statement: 'd) Độ lệch chuẩn bằng bình phương của phương sai.', isTrue: false },
    ]
  },

  // PHẦN III: 6 CÂU TRẢ LỜI NGẮN / ĐIỀN SỐ (0.5đ / câu)
  {
    id: 'q-p3-17',
    moduleId: 'mod-de-thuc-chien-01',
    number: 17,
    partType: 'part3',
    type: 'fill_blank',
    text: 'Biết $\\int_0^2 (2x + 1) e^x dx = a \\cdot e^2 + b$ với $a, b \\in \\mathbb{Z}$. Tính giá trị của biểu thức $T = a + 2b$.',
    fillBlankAnswers: ['5', '5.0'],
  },
  {
    id: 'q-p3-18',
    moduleId: 'mod-de-thuc-chien-01',
    number: 18,
    partType: 'part3',
    type: 'fill_blank',
    text: 'Trong không gian $Oxyz$, cho mặt cầu $(S): x^2 + y^2 + z^2 - 2x + 4y - 6z - 11 = 0$. Bán kính $R$ của mặt cầu $(S)$ bằng bao nhiêu?',
    fillBlankAnswers: ['5', '5.0'],
  },
  {
    id: 'q-p3-19',
    moduleId: 'mod-de-thuc-chien-01',
    number: 19,
    partType: 'part3',
    type: 'fill_blank',
    text: 'Một xưởng sản xuất thùng phi hình trụ có thể tích $V = 2\\pi \\text{ m}^3$. Để tiết kiệm vật liệu nhất (diện tích toàn phần nhỏ nhất), bán kính đáy $r$ (đơn vị: mét) phải bằng bao nhiêu?',
    fillBlankAnswers: ['1', '1.0'],
  },
  {
    id: 'q-p3-20',
    moduleId: 'mod-de-thuc-chien-01',
    number: 20,
    partType: 'part3',
    type: 'fill_blank',
    text: 'Tỉ lệ người mắc một bệnh hiếm trong cộng đồng là $0.01$. Một xét nghiệm y tế cho kết quả dương tính chính xác $95\\%$ ở người có bệnh, nhưng có $2\\%$ dương tính giả ở người không có bệnh. Khi một người nhận kết quả dương tính, xác suất người đó thực sự mắc bệnh là bao nhiêu? (Làm tròn đến 2 chữ số thập phân dạng 0.XY)',
    fillBlankAnswers: ['0.32', '0.324'],
  },
  {
    id: 'q-p3-21',
    moduleId: 'mod-de-thuc-chien-01',
    number: 21,
    partType: 'part3',
    type: 'fill_blank',
    text: 'Tìm giá trị lớn nhất $M$ của hàm số $y = -x^4 + 4x^2 + 5$ trên đoạn $[0; 3]$.',
    fillBlankAnswers: ['9', '9.0'],
  },
  {
    id: 'q-p3-22',
    moduleId: 'mod-de-thuc-chien-01',
    number: 22,
    partType: 'part3',
    type: 'fill_blank',
    text: 'Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B$, $AB = 3, BC = 4$. Cạnh bên $SA \\perp (ABC)$ và $SA = 6$. Thể tích $V$ của khối chóp $S.ABC$ bằng bao nhiêu?',
    fillBlankAnswers: ['12', '12.0'],
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [];
export const INITIAL_ANTICHEAT_LOGS: AntiCheatLog[] = [];
