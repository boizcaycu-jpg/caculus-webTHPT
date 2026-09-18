'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CloudUpload, ExternalLink, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

// Danh mục 9 Chuyên đề chuẩn GDPT 2018 (Không còn số phức)
const TOPIC_PRESETS = [
  { id: 'chuyen-de-01', code: 'CD-01', title: 'Chuyên đề 01: Ứng dụng Đạo hàm khảo sát & vẽ đồ thị hàm số 12' },
  { id: 'chuyen-de-02', code: 'CD-02', title: 'Chuyên đề 02: Hàm số Mũ, Hàm số Lôgarit & Phương trình Mũ - Logarit' },
  { id: 'chuyen-de-03', code: 'CD-03', title: 'Chuyên đề 03: Nguyên hàm, Tích phân & Ứng dụng thực tế' },
  { id: 'chuyen-de-04', code: 'CD-04', title: 'Chuyên đề 04: Phương pháp Tọa độ trong không gian Oxyz 12' },
  { id: 'chuyen-de-05', code: 'CD-05', title: 'Chuyên đề 05: Hình học Không gian Cổ điển & Khối tròn xoay (Nón - Trụ - Cầu)' },
  { id: 'chuyen-de-06', code: 'CD-06', title: 'Chuyên đề 06: Xác suất có điều kiện & Công thức Bayes' },
  { id: 'chuyen-de-07', code: 'CD-07', title: 'Chuyên đề 07: Các số đặc trưng đo độ phân tán mẫu số liệu ghép nhóm 12' },
  { id: 'chuyen-de-08', code: 'CD-08', title: 'Chuyên đề 08: Dãy số, Cấp số cộng & Cấp số nhân' },
  { id: 'chuyen-de-09', code: 'CD-09', title: 'Chuyên đề 09: Thống kê & Đại số Tổ hợp Ứng dụng' },
];

// Danh mục 36 Đề Thực Chiến chuẩn 2026
const FULL_EXAM_PRESETS = Array.from({ length: 36 }).map((_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: `de-thuc-chien-${num}`,
    code: `TC-${num}`,
    title: `Đề Thi Thử Thực Chiến TN THPTQG 2026 - Đề Số ${num}`,
  };
});

function AdminExamEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || 'de-thuc-chien-01';

  const [selectedExamId, setSelectedExamId] = useState(initialId);
  const [examTitle, setExamTitle] = useState('');
  const [isLoadingExam, setIsLoadingExam] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 12 Câu Phần I
  const [part1Questions, setPart1Questions] = useState(
    Array.from({ length: 12 }).map((_, i) => ({
      number: i + 1,
      imageUrl: '',
      correctOption: 'A',
      explanationImageUrl: '',
    }))
  );

  // 4 Câu Phần II
  const [part2Questions, setPart2Questions] = useState(
    Array.from({ length: 4 }).map((_, i) => ({
      number: 13 + i,
      imageUrl: '',
      correctTF: { a: true, b: false, c: true, d: false },
      explanationImageUrl: '',
    }))
  );

  // 6 Câu Phần III
  const [part3Questions, setPart3Questions] = useState(
    Array.from({ length: 6 }).map((_, i) => ({
      number: 17 + i,
      imageUrl: '',
      correctValue: '',
      explanationImageUrl: '',
    }))
  );

  // Khi chọn một mã file đề khác, tự động load dữ liệu của đề đó
  useEffect(() => {
    loadExamData(selectedExamId);
  }, [selectedExamId]);

  const loadExamData = async (examId: string) => {
    setIsLoadingExam(true);
    try {
      const res = await fetch(`/api/admin/exams/${examId}`);
      if (res.ok) {
        const data = await res.json();
        const exam = data.exam;
        const questions: any[] = data.questions || [];

        setExamTitle(exam?.title || getDefaultTitle(examId));

        if (questions.length > 0) {
          // Điền câu hỏi Phần I
          const p1 = Array.from({ length: 12 }).map((_, i) => {
            const num = i + 1;
            const found = questions.find(q => q.number === num || q.partType === 'part1' && q.number === num);
            const letter = found?.correctOptionId ? found.correctOptionId.replace('opt-', '').toUpperCase() : 'A';
            return {
              number: num,
              imageUrl: found?.imageUrl || '',
              correctOption: letter,
              explanationImageUrl: found?.explanationImageUrl || '',
            };
          });
          setPart1Questions(p1);

          // Điền câu hỏi Phần II
          const p2 = Array.from({ length: 4 }).map((_, i) => {
            const num = 13 + i;
            const found = questions.find(q => q.number === num);
            const tfItems = found?.trueFalseItems || [];
            return {
              number: num,
              imageUrl: found?.imageUrl || '',
              correctTF: {
                a: tfItems.find((t: any) => t.id === 'a')?.isTrue ?? true,
                b: tfItems.find((t: any) => t.id === 'b')?.isTrue ?? false,
                c: tfItems.find((t: any) => t.id === 'c')?.isTrue ?? true,
                d: tfItems.find((t: any) => t.id === 'd')?.isTrue ?? false,
              },
              explanationImageUrl: found?.explanationImageUrl || '',
            };
          });
          setPart2Questions(p2);

          // Điền câu hỏi Phần III
          const p3 = Array.from({ length: 6 }).map((_, i) => {
            const num = 17 + i;
            const found = questions.find(q => q.number === num);
            return {
              number: num,
              imageUrl: found?.imageUrl || '',
              correctValue: (found?.fillBlankAnswers?.[0] || ''),
              explanationImageUrl: found?.explanationImageUrl || '',
            };
          });
          setPart3Questions(p3);
        } else {
          // Nếu đề chưa có câu hỏi thì reset mẫu trống
          resetEmptyQuestions();
        }
      } else {
        setExamTitle(getDefaultTitle(examId));
        resetEmptyQuestions();
      }
    } catch (e) {
      setExamTitle(getDefaultTitle(examId));
      resetEmptyQuestions();
    } finally {
      setIsLoadingExam(false);
    }
  };

  const getDefaultTitle = (id: string) => {
    const topic = TOPIC_PRESETS.find(t => t.id === id);
    if (topic) return topic.title;
    const full = FULL_EXAM_PRESETS.find(f => f.id === id);
    if (full) return full.title;
    return `Đề Thi THPTQG Môn Toán - ${id}`;
  };

  const resetEmptyQuestions = () => {
    setPart1Questions(Array.from({ length: 12 }).map((_, i) => ({
      number: i + 1,
      imageUrl: '',
      correctOption: 'A',
      explanationImageUrl: '',
    })));
    setPart2Questions(Array.from({ length: 4 }).map((_, i) => ({
      number: 13 + i,
      imageUrl: '',
      correctTF: { a: true, b: false, c: true, d: false },
      explanationImageUrl: '',
    })));
    setPart3Questions(Array.from({ length: 6 }).map((_, i) => ({
      number: 17 + i,
      imageUrl: '',
      correctValue: '',
      explanationImageUrl: '',
    })));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Tự động nhận diện phân loại qua Mã ID
  const isTopic = selectedExamId.startsWith('chuyen-de-');
  const autoCategory = isTopic ? 'LUYỆN TẬP' : 'THỰC CHIẾN';
  const autoDuration = isTopic ? 45 : 90;

  const handleSaveExam = async () => {
    if (!examTitle.trim()) {
      alert('Vui lòng nhập Tên Đề Thi!');
      return;
    }

    setIsSaving(true);
    const moduleId = `mod-${selectedExamId}`;

    const questionsPayload = [
      ...part1Questions.map((q) => ({
        id: `q-${moduleId}-${q.number}`,
        moduleId,
        number: q.number,
        partType: 'part1',
        type: 'single_choice',
        text: `Câu ${q.number}`,
        imageUrl: q.imageUrl,
        options: [
          { id: 'opt-a', text: 'Phương án A' },
          { id: 'opt-b', text: 'Phương án B' },
          { id: 'opt-c', text: 'Phương án C' },
          { id: 'opt-d', text: 'Phương án D' },
        ],
        correctOptionId: `opt-${q.correctOption.toLowerCase()}`,
        explanationImageUrl: q.explanationImageUrl,
      })),
      ...part2Questions.map((q) => ({
        id: `q-${moduleId}-${q.number}`,
        moduleId,
        number: q.number,
        partType: 'part2',
        type: 'true_false',
        text: `Câu ${q.number}`,
        imageUrl: q.imageUrl,
        trueFalseItems: [
          { id: 'a', statement: 'a)', isTrue: q.correctTF.a },
          { id: 'b', statement: 'b)', isTrue: q.correctTF.b },
          { id: 'c', statement: 'c)', isTrue: q.correctTF.c },
          { id: 'd', statement: 'd)', isTrue: q.correctTF.d },
        ],
        explanationImageUrl: q.explanationImageUrl,
      })),
      ...part3Questions.map((q) => ({
        id: `q-${moduleId}-${q.number}`,
        moduleId,
        number: q.number,
        partType: 'part3',
        type: 'fill_blank',
        text: `Câu ${q.number}`,
        imageUrl: q.imageUrl,
        fillBlankAnswers: [q.correctValue.trim().replace(',', '.')],
        explanationImageUrl: q.explanationImageUrl,
      })),
    ];

    const examPayload = {
      id: selectedExamId,
      title: examTitle,
      description: isTopic
        ? `Chuyên đề luyện tập Toán THPTQG 2026`
        : `Bộ đề thi thử thực chiến môn Toán THPTQG 2026 (22 câu - 90 phút)`,
      category: autoCategory,
      subCategory: 'math',
      isFree: true,
      isPublished: true,
      status: 'ĐÃ UPDATE',
      modules: [
        {
          id: moduleId,
          examId: selectedExamId,
          title: examTitle,
          category: 'math',
          durationMinutes: autoDuration,
          totalQuestions: 22,
        },
      ],
      questions: questionsPayload,
    };

    try {
      const res = await fetch(`/api/admin/exams/${selectedExamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`🎉 ĐÃ LƯU & ĐỒNG BỘ ĐỀ [${selectedExamId}] LÊN GITHUB / VERCEL THÀNH CÔNG!\n\nĐề thi mới sẽ xuất hiện chính xác tại đường dẫn /exams/${selectedExamId} trên web sau 30 giây.`);
      } else {
        alert(data.error || 'Lỗi khi lưu đề thi');
      }
    } catch (e) {
      alert('Lỗi kết nối khi lưu đề thi');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Dedicated Clean Local Workspace Header (Không Navbar, Không Login) */}
      <header className="bg-[#002b66] text-white px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <Image
              src="/logo_thptqg.png"
              alt="CACULUS"
              width={140}
              height={36}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-wide uppercase">
              TRÌNH SOẠN ĐỀ THI TOÁN THPTQG (MÃ HÓA THEO ID FILE)
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
              ● LOCAL WORKSPACE • AUTO GIT PUSH & VERCEL SYNC
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/exams/${selectedExamId}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition border border-white/20"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Xem Thử Đề Này
          </Link>
          <button
            onClick={handleSaveExam}
            disabled={isSaving}
            className="bg-[#0052cc] hover:bg-blue-600 disabled:opacity-50 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-lg transition shadow-md flex items-center gap-2"
          >
            <CloudUpload className="w-4 h-4" /> {isSaving ? 'Đang lưu & Đẩy lên GitHub...' : `LƯU & ĐỒNG BỘ [${selectedExamId}]`}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* KHUNG CHỌN MÃ FILE ĐỀ & METADATA ĐỘC LẬP */}
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-300 shadow-md space-y-5">
          <div>
            <label className="block text-xs font-black text-[#002b66] uppercase mb-1.5 flex items-center justify-between">
              <span>📁 CHỌN FILE ĐỀ CẦN SOẠN / CHỈNH SỬA TRONG HỆ THỐNG:</span>
              <span className="text-slate-400 font-normal">Tự động nhận diện ID & Vị trí</span>
            </label>
            
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full text-sm font-bold px-4 py-3 bg-blue-50/50 border-2 border-blue-200 rounded-xl outline-none focus:border-[#0052cc] text-slate-900 shadow-2xs"
            >
              <optgroup label="🔵 9 CHUYÊN ĐỀ TRỌNG TÂM GDPT 2018 (KHÔNG SỐ PHỨC)">
                {TOPIC_PRESETS.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.code}] {t.id} — {t.title}
                  </option>
                ))}
              </optgroup>

              <optgroup label="🔥 36 ĐỀ THI THỬ THỰC CHIẾN 2026 (CẬP NHẬT LIÊN TỤC)">
                {FULL_EXAM_PRESETS.map((f) => (
                  <option key={f.id} value={f.id}>
                    [{f.code}] {f.id} — {f.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Card Thông tin Metadata tự động của Đề */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold block">MÃ ID HỆ THỐNG:</span>
              <span className="font-mono font-black text-[#0052cc] text-sm">{selectedExamId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block">ĐƯỜNG DẪN WEB:</span>
              <span className="font-mono text-slate-700 font-semibold">/exams/{selectedExamId}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block">TỰ ĐỘNG PHÂN VÀO:</span>
              <span className={`inline-block font-extrabold px-2.5 py-0.5 rounded-md mt-0.5 ${
                isTopic ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isTopic ? '🔵 CHUYÊN ĐỀ LUYỆN TẬP' : '🔥 BỘ ĐỀ THỰC CHIẾN (90P)'}
              </span>
            </div>
          </div>

          {/* Ô Sửa Tên Bài Thi */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase mb-1">
              Tên Hiển Thị Của Bài Thi:
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Nhập tên bài thi..."
              className="w-full text-base font-bold px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#0052cc]"
            />
          </div>
        </div>

        {/* 1. PHẦN I: 12 CÂU TRẮC NGHIỆM */}
        <div className="space-y-4">
          <div className="bg-[#002b66] text-white p-4 rounded-xl font-black text-sm uppercase flex justify-between items-center">
            <span>PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (12 CÂU - CÂU 1 ĐẾN 12)</span>
            <span className="text-xs text-blue-200 font-normal">Mỗi câu 0.25 điểm = 3.0 điểm</span>
          </div>

          {part1Questions.map((q, idx) => (
            <div key={q.number} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="font-bold text-sm text-slate-900">Câu {q.number}:</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ảnh Đề Bài (Hỗ trợ JPG/PNG/WebP):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) => {
                        const updated = [...part1Questions];
                        updated[idx].imageUrl = base64;
                        setPart1Questions(updated);
                      })
                    }
                    className="text-xs"
                  />
                  {q.imageUrl && <img src={q.imageUrl} alt="" className="mt-2 max-h-36 rounded border" />}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ảnh Lời Giải / Đáp Án Chi Tiết:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) => {
                        const updated = [...part1Questions];
                        updated[idx].explanationImageUrl = base64;
                        setPart1Questions(updated);
                      })
                    }
                    className="text-xs"
                  />
                  {q.explanationImageUrl && <img src={q.explanationImageUrl} alt="" className="mt-2 max-h-36 rounded border" />}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-black text-slate-700">Đáp án đúng:</span>
                {['A', 'B', 'C', 'D'].map((letter) => (
                  <label key={letter} className="flex items-center gap-1.5 cursor-pointer font-bold text-sm">
                    <input
                      type="radio"
                      name={`p1-ans-${q.number}`}
                      checked={q.correctOption === letter}
                      onChange={() => {
                        const updated = [...part1Questions];
                        updated[idx].correctOption = letter;
                        setPart1Questions(updated);
                      }}
                    />
                    {letter}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 2. PHẦN II: 4 CÂU ĐÚNG / SAI */}
        <div className="space-y-4">
          <div className="bg-[#002b66] text-white p-4 rounded-xl font-black text-sm uppercase flex justify-between items-center">
            <span>PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 CÂU - CÂU 13 ĐẾN 16)</span>
            <span className="text-xs text-blue-200 font-normal">Mỗi câu 1.0 điểm = 4.0 điểm</span>
          </div>

          {part2Questions.map((q, idx) => (
            <div key={q.number} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="font-bold text-sm text-slate-900">Câu {q.number}:</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ảnh Đề Bài:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) => {
                        const updated = [...part2Questions];
                        updated[idx].imageUrl = base64;
                        setPart2Questions(updated);
                      })
                    }
                    className="text-xs"
                  />
                  {q.imageUrl && <img src={q.imageUrl} alt="" className="mt-2 max-h-36 rounded border" />}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ảnh Lời Giải Chi Tiết:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) => {
                        const updated = [...part2Questions];
                        updated[idx].explanationImageUrl = base64;
                        setPart2Questions(updated);
                      })
                    }
                    className="text-xs"
                  />
                  {q.explanationImageUrl && <img src={q.explanationImageUrl} alt="" className="mt-2 max-h-36 rounded border" />}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <span className="text-xs font-black text-slate-700">Đáp án 4 ý a, b, c, d:</span>
                {(['a', 'b', 'c', 'd'] as const).map((k) => (
                  <div key={k} className="flex items-center gap-6 text-sm font-bold bg-slate-50 p-2 rounded-lg">
                    <span className="w-8">Ý {k})</span>
                    <label className="flex items-center gap-1 text-emerald-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`tf-${q.number}-${k}`}
                        checked={q.correctTF[k] === true}
                        onChange={() => {
                          const updated = [...part2Questions];
                          updated[idx].correctTF[k] = true;
                          setPart2Questions(updated);
                        }}
                      />
                      ĐÚNG
                    </label>
                    <label className="flex items-center gap-1 text-rose-700 cursor-pointer">
                      <input
                        type="radio"
                        name={`tf-${q.number}-${k}`}
                        checked={q.correctTF[k] === false}
                        onChange={() => {
                          const updated = [...part2Questions];
                          updated[idx].correctTF[k] = false;
                          setPart2Questions(updated);
                        }}
                      />
                      SAI
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 3. PHẦN III: 6 CÂU TRẢ LỜI NGẮN */}
        <div className="space-y-4">
          <div className="bg-[#002b66] text-white p-4 rounded-xl font-black text-sm uppercase flex justify-between items-center">
            <span>PHẦN III: TRẢ LỜI NGẮN / ĐIỀN SỐ (6 CÂU - CÂU 17 ĐẾN 22)</span>
            <span className="text-xs text-blue-200 font-normal">Mỗi câu 0.5 điểm = 3.0 điểm</span>
          </div>

          {part3Questions.map((q, idx) => (
            <div key={q.number} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="font-bold text-sm text-slate-900">Câu {q.number}:</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ảnh Đề Bài:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) => {
                        const updated = [...part3Questions];
                        updated[idx].imageUrl = base64;
                        setPart3Questions(updated);
                      })
                    }
                    className="text-xs"
                  />
                  {q.imageUrl && <img src={q.imageUrl} alt="" className="mt-2 max-h-36 rounded border" />}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ảnh Lời Giải Chi Tiết:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (base64) => {
                        const updated = [...part3Questions];
                        updated[idx].explanationImageUrl = base64;
                        setPart3Questions(updated);
                      })
                    }
                    className="text-xs"
                  />
                  {q.explanationImageUrl && <img src={q.explanationImageUrl} alt="" className="mt-2 max-h-36 rounded border" />}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-black text-slate-700 block mb-1">
                  Đáp án số đúng (Dạng XY.Z hoặc số nguyên):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 6.8 hoặc -12"
                  value={q.correctValue}
                  onChange={(e) => {
                    const updated = [...part3Questions];
                    updated[idx].correctValue = e.target.value;
                    setPart3Questions(updated);
                  }}
                  className="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Nút lưu đề ở cuối */}
        <div className="flex justify-end pt-4 pb-16">
          <button
            onClick={handleSaveExam}
            disabled={isSaving}
            className="bg-[#0052cc] hover:bg-blue-700 disabled:opacity-50 text-white font-black text-base px-8 py-3.5 rounded-xl transition shadow-lg flex items-center gap-2"
          >
            <CloudUpload className="w-5 h-5" /> {isSaving ? 'Đang lưu & Đẩy lên GitHub...' : `LƯU & ĐỒNG BỘ [${selectedExamId}] LÊN GITHUB / VERCEL`}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AdminAdvancedExamEditor() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052cc]"></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Đang tải trình soạn đề local...</p>
      </div>
    }>
      <AdminExamEditorInner />
    </Suspense>
  );
}

