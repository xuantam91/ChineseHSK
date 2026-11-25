'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { speakChinese } from '@/lib/tts';
import './globy-landing.css';

interface GlobyChineseConfig {
  studentUrl?: string;
  plusUrl?: string;
  aiUrl?: string;
}

declare global {
  interface Window {
    GLOBY_CHINESE_CONFIG?: GlobyChineseConfig;
  }
}

interface HskStageInfo {
  tabLabel: string;
  tabSub: string;
  kicker: string;
  title: string;
  desc: string;
  topics: string[];
  hanzi: string;
}

const HSK_STAGES: HskStageInfo[] = [
  {
    tabLabel: 'HSK 1',
    tabSub: 'Nhập môn',
    kicker: 'BẮT ĐẦU TỪ CON SỐ 0',
    title: 'HSK 1 · Chào hỏi & làm quen',
    desc: 'Từng bước làm quen Pinyin, quy tắc thanh điệu, lời chào, giới thiệu bản thân và các mẫu câu thường gặp.',
    topics: ['Lời chào', 'Pinyin', 'Số đếm', 'Giới thiệu'],
    hanzi: '学',
  },
  {
    tabLabel: 'HSK 2',
    tabSub: 'Sơ cấp',
    kicker: 'CỦNG CỐ GIAO TIẾP',
    title: 'HSK 2 · Sinh hoạt hằng ngày',
    desc: 'Mở rộng từ vựng và hội thoại về thời gian, ăn uống, mua sắm và các tình huống quen thuộc.',
    topics: ['Thời gian', 'Ăn uống', 'Mua sắm', 'Hỏi đáp'],
    hanzi: '说',
  },
  {
    tabLabel: 'HSK 3',
    tabSub: 'Đời sống',
    kicker: 'DIỄN ĐẠT ĐA DẠNG',
    title: 'HSK 3 · Đời sống & học tập',
    desc: 'Tiếp cận mẫu câu và chủ đề đa dạng hơn, tăng khả năng diễn đạt những trải nghiệm thường ngày.',
    topics: ['Học tập', 'Du lịch', 'Công việc', 'Trải nghiệm'],
    hanzi: '读',
  },
  {
    tabLabel: 'HSK 4',
    tabSub: 'Củng cố',
    kicker: 'NÂNG CAO KHẢ NĂNG',
    title: 'HSK 4 · Củng cố diễn đạt',
    desc: 'Luyện trình bày suy nghĩ, diễn giải tình huống và đọc hiểu các nội dung dài hơn.',
    topics: ['Quan điểm', 'Trải nghiệm', 'Nghe hiểu', 'Đọc hiểu'],
    hanzi: '懂',
  },
  {
    tabLabel: 'HSK 5',
    tabSub: 'Nâng cao',
    kicker: 'MỞ RỘNG KIẾN THỨC',
    title: 'HSK 5 · Chủ đề nâng cao',
    desc: 'Tập trung vào cấu trúc phong phú, những bài đọc đa chủ đề và luyện diễn đạt ý kiến có chiều sâu.',
    topics: ['Tóm tắt', 'Bài đọc', 'Thảo luận', 'Từ vựng'],
    hanzi: '知',
  },
  {
    tabLabel: 'HSK 6',
    tabSub: 'Chuyên sâu',
    kicker: 'HỌC TẬP CHUYÊN SÂU',
    title: 'HSK 6 · Đọc hiểu & diễn đạt',
    desc: 'Hướng tới sử dụng tiếng Trung linh hoạt hơn trong những ngữ cảnh và chủ đề phức tạp.',
    topics: ['Chủ đề mở rộng', 'Đọc sâu', 'Diễn đạt', 'Tư duy'],
    hanzi: '通',
  },
];

const FLASHCARD_WORDS: Array<[string, string, string]> = [
  ['你好', 'nǐ hǎo', 'Xin chào'],
  ['谢谢', 'xiè xie', 'Cảm ơn'],
  ['学习', 'xué xí', 'Học tập'],
  ['朋友', 'péng you', 'Bạn bè'],
];

const QUIZ_CHOICES = [
  { id: 0, label: 'A. Cảm ơn', isCorrect: false },
  { id: 1, label: 'B. Xin chào', isCorrect: true },
  { id: 2, label: 'C. Tạm biệt', isCorrect: false },
];

function CheckSvg() {
  return (
    <svg
      className="ui-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHskIdx, setActiveHskIdx] = useState(0);
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [routes, setRoutes] = useState({
    studentUrl: '/dashboard',
    plusUrl: '/register',
    aiUrl: '/register',
  });

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Preserve Supabase auth confirmation code redirect & runtime GLOBY_CHINESE_CONFIG support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      router.replace(`/auth/callback?code=${encodeURIComponent(code)}`);
      return;
    }

    if (window.GLOBY_CHINESE_CONFIG) {
      setRoutes((prev) => ({
        studentUrl: window.GLOBY_CHINESE_CONFIG?.studentUrl || prev.studentUrl,
        plusUrl: window.GLOBY_CHINESE_CONFIG?.plusUrl || prev.plusUrl,
        aiUrl: window.GLOBY_CHINESE_CONFIG?.aiUrl || prev.aiUrl,
      }));
    }
  }, [router]);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let target: number | null = null;
    if (e.key === 'ArrowRight') target = (idx + 1) % HSK_STAGES.length;
    else if (e.key === 'ArrowLeft') target = (idx + HSK_STAGES.length - 1) % HSK_STAGES.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = HSK_STAGES.length - 1;
    if (target === null) return;
    e.preventDefault();
    setActiveHskIdx(target);
    tabRefs.current[target]?.focus();
  };

  const handlePlayFlashcardAudio = () => {
    const currentHanzi = FLASHCARD_WORDS[flashIdx][0];
    speakChinese(currentHanzi);
  };

  const activeStage = HSK_STAGES[activeHskIdx];
  const currentCard = FLASHCARD_WORDS[flashIdx];
  const currentYear = new Date().getFullYear();

  const quizFeedback =
    selectedChoice === null
      ? ''
      : QUIZ_CHOICES[selectedChoice]?.isCorrect
      ? 'Chính xác! 你好 nghĩa là Xin chào.'
      : 'Chưa đúng. Đáp án chính xác là B. Xin chào.';

  return (
    <div className="globy-v3">
      <a className="skip-link" href="#noi-dung">
        Chuyển đến nội dung
      </a>

      <header className="site-header">
        <div className="wrap navrow">
          <a className="brand" href="#dau" aria-label="GLOBY Chinese – Trang chủ">
            <picture>
              <source media="(max-width:600px)" srcSet="/assets/globy-chinese-logo-compact.svg" />
              <img
                src="/assets/globy-chinese-logo.svg"
                alt="GLOBY Chinese – Học tiếng Trung thông minh"
                width={350}
                height={56}
                fetchPriority="high"
              />
            </picture>
          </a>

          <nav
            className={`nav-menu${menuOpen ? ' open' : ''}`}
            id="nav-menu"
            aria-label="Điều hướng chính"
          >
            <a href="#ky-nang" onClick={() => setMenuOpen(false)}>
              Kỹ năng
            </a>
            <a href="#lo-trinh" onClick={() => setMenuOpen(false)}>
              Lộ trình HSK
            </a>
            <a href="#phuong-phap" onClick={() => setMenuOpen(false)}>
              Cách học
            </a>
            <a href="#hoc-thu" onClick={() => setMenuOpen(false)}>
              Học thử
            </a>
            <a href="#goi-hoc" onClick={() => setMenuOpen(false)}>
              Gói học
            </a>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Đăng nhập
            </Link>
            <Link
              className="btn btn-green nav-mobile-cta"
              href={routes.studentUrl}
              onClick={() => setMenuOpen(false)}
            >
              Vào học ngay
            </Link>
          </nav>

          <Link className="btn btn-green nav-cta" href={routes.studentUrl} data-student-link="">
            Vào học ngay
          </Link>

          <button
            ref={menuBtnRef}
            type="button"
            className="nav-toggle"
            id="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg
              className="ui-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <main id="noi-dung">
        {/* HERO SECTION */}
        <section className="hero" id="dau">
          <div className="wrap hero-inner">
            <div>
              <span className="pill">
                <svg
                  className="ui-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
                </svg>{' '}
                Hành trình học tiếng Trung cùng GLOBY
              </span>
              <h1>
                Học tiếng Trung
                <br />
                <span className="hero-grad">tự tin từ nền tảng.</span>
              </h1>
              <p className="hero-lead">
                Bắt đầu với Hán tự, Pinyin và những lời chào đầu tiên. Từng bài học đưa bạn tiến xa
                hơn qua lộ trình HSK, luyện tập đủ bốn kỹ năng và tự theo dõi tiến bộ mỗi ngày.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-yellow" href={routes.studentUrl} data-student-link="">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 5 10 7-10 7V5Z" />
                  </svg>{' '}
                  Vào học ngay
                </Link>
                <a className="btn btn-white" href="#lo-trinh">
                  Khám phá lộ trình
                </a>
              </div>
              <div className="hero-checks">
                <span>
                  <b>
                    <CheckSvg />
                  </b>{' '}
                  Học theo HSK
                </span>
                <span>
                  <b>
                    <CheckSvg />
                  </b>{' '}
                  Hán tự &amp; Pinyin
                </span>
                <span>
                  <b>
                    <CheckSvg />
                  </b>{' '}
                  Nghe – Nói – Đọc – Viết
                </span>
              </div>
            </div>

            <div className="dashboard-visual" aria-label="Mô phỏng bảng học tiếng Trung GLOBY">
              <div className="float-chip two">
                <span className="float-icon">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M7 3v4M17 3v4M3 10h18m-14 5 3 3 5-5" />
                  </svg>
                </span>{' '}
                Học đều mỗi ngày
              </div>

              <div className="dashboard-frame">
                <div className="app-brand">
                  <img src="/assets/app-icon.svg" alt="" width={38} height={38} />
                  <span>
                    <strong>GLOBY Chinese</strong>
                    <small>Góc học tập của bạn</small>
                  </span>
                  <span className="app-brand-level">HSK 1</span>
                </div>

                <div className="dash-head">
                  <div className="dash-head-top">
                    <span className="tiny">HỌC TIẾNG TRUNG THÔNG MINH</span>
                  </div>
                  <h3>你好! Sẵn sàng học hôm nay?</h3>
                  <p>Làm quen tiếng Trung từng bước, không áp lực.</p>
                </div>

                <div className="dash-content">
                  <div className="dash-topline">
                    <span>Tiến độ HSK 1</span>
                    <span>0 / 20 bài</span>
                  </div>
                  <div className="progress">
                    <span style={{ width: '0%' }} />
                  </div>

                  <div className="lesson-preview">
                    <div className="lesson-art">
                      <strong>你好</strong>
                      <small>nǐ hǎo</small>
                    </div>
                    <div>
                      <div className="headline">Bài 1: Chào hỏi &amp; Làm quen</div>
                      <p>
                        Học lời chào, cách giới thiệu và luyện thanh điệu từ những câu cơ bản.
                      </p>
                      <div className="vocab-row">
                        <span>
                          <b>你</b> nǐ
                        </span>
                        <span>
                          <b>好</b> hǎo
                        </span>
                        <span>
                          <b>谢谢</b> xièxie
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="app-foot">
                    <span>
                      <svg
                        className="ui-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v15M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z" />
                      </svg>{' '}
                      Từ vựng · Pinyin · Luyện tập
                    </span>
                    <Link href={routes.studentUrl} data-student-link="">
                      Bắt đầu bài học
                    </Link>
                  </div>
                </div>
              </div>

              <div className="float-chip one">
                <span className="float-icon">
                  <CheckSvg />
                </span>{' '}
                Bài học ngắn, rõ từng bước
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="stats">
          <div className="wrap stats-grid">
            <div className="stat">
              <strong>6</strong>
              <span>
                chặng HSK
                <br />
                tham chiếu
              </span>
            </div>
            <div className="stat">
              <strong>4</strong>
              <span>
                kỹ năng
                <br />
                kết hợp
              </span>
            </div>
            <div className="stat">
              <strong>20</strong>
              <span>
                bài ở chặng
                <br />
                HSK 1
              </span>
            </div>
            <div className="stat">
              <strong>
                <CheckSvg />
              </strong>
              <span>
                tự học theo
                <br />
                nhịp độ riêng
              </span>
            </div>
          </div>
        </div>

        {/* 4 SKILLS */}
        <section className="section" id="ky-nang">
          <div className="wrap">
            <div className="section-title">
              <div className="eyebrow">HỌC ĐỂ SỬ DỤNG</div>
              <h2>
                Phát triển <span className="green">đầy đủ 4 kỹ năng</span>
              </h2>
              <p>
                Học từ âm thanh, chữ viết đến giao tiếp thực tế. Các hoạt động ngắn, rõ mục tiêu
                giúp người mới bắt đầu dễ duy trì thói quen.
              </p>
            </div>
            <div className="skill-grid">
              <article className="skill">
                <div className="em">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
                    <rect x="3" y="12" width="4" height="8" rx="2" />
                    <rect x="17" y="12" width="4" height="8" rx="2" />
                  </svg>
                </div>
                <h3>Nghe</h3>
                <p>
                  Làm quen ngữ điệu và thanh điệu, nghe từ mới, mẫu câu và hội thoại theo chủ đề.
                </p>
              </article>

              <article className="skill">
                <div className="em">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="3" width="6" height="12" rx="3" />
                    <path d="M5 11v1a7 7 0 0 0 14 0v-1M12 19v3M8 22h8" />
                  </svg>
                </div>
                <h3>Nói</h3>
                <p>
                  Luyện đọc Pinyin, nói từ vựng và tự ghi âm để nghe lại, điều chỉnh phát âm.
                </p>
              </article>

              <article className="skill">
                <div className="em">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v15M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z" />
                  </svg>
                </div>
                <h3>Đọc</h3>
                <p>
                  Nhận diện Hán tự, hiểu mẫu câu và tăng độ dài bài đọc theo tiến trình học.
                </p>
              </article>

              <article className="skill">
                <div className="em">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m14 5 5 5M4 20l5-1 11-11a2.8 2.8 0 0 0-4-4L5 15l-1 5Z" />
                  </svg>
                </div>
                <h3>Viết</h3>
                <p>
                  Làm quen cấu tạo chữ Hán, trật tự câu và thực hành diễn đạt ngắn gọn.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* HSK 1-6 ROADMAP TABS */}
        <section className="section soft" id="lo-trinh">
          <div className="wrap">
            <div className="section-title">
              <div className="eyebrow">HỌC ĐÚNG CẤP ĐỘ</div>
              <h2>
                Lộ trình rõ ràng <span className="green">từ HSK 1 đến HSK 6</span>
              </h2>
              <p>
                Bắt đầu ở cấp độ phù hợp và theo dõi nội dung của từng chặng. Chạm vào một cấp độ
                để khám phá chủ đề học.
              </p>
            </div>
            <div className="roadmap">
              <div
                className="level-tabs"
                role="tablist"
                aria-label="Chọn cấp độ HSK"
                aria-orientation="horizontal"
              >
                {HSK_STAGES.map((stage, idx) => (
                  <button
                    key={stage.tabLabel}
                    ref={(el) => {
                      tabRefs.current[idx] = el;
                    }}
                    className="tab"
                    type="button"
                    role="tab"
                    id={`hsk-tab-${idx}`}
                    aria-controls="level-panel"
                    tabIndex={activeHskIdx === idx ? 0 : -1}
                    aria-selected={activeHskIdx === idx}
                    onClick={() => setActiveHskIdx(idx)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  >
                    {stage.tabLabel}
                    <small>{stage.tabSub}</small>
                  </button>
                ))}
              </div>

              <div
                className="level-content"
                id="level-panel"
                role="tabpanel"
                aria-labelledby={`hsk-tab-${activeHskIdx}`}
                tabIndex={0}
              >
                <div>
                  <span className="pill" id="hsk-kicker">
                    {activeStage.kicker}
                  </span>
                  <h3 id="hsk-title">{activeStage.title}</h3>
                  <p id="hsk-desc">{activeStage.desc}</p>
                  <div className="topics" id="hsk-topics">
                    {activeStage.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>
                </div>
                <div className="path-illustration">
                  <div className="orbit" id="hsk-hanzi">
                    {activeStage.hanzi}
                  </div>
                  <span className="path-step" id="hsk-step">
                    Chặng {activeHskIdx + 1}/6
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METHOD */}
        <section className="section" id="phuong-phap">
          <div className="wrap">
            <div className="section-title">
              <div className="eyebrow">MỖI NGÀY MỘT BƯỚC TIẾN</div>
              <h2>
                Học đơn giản, <span className="green">nhớ lâu hơn</span>
              </h2>
              <p>
                Từ học từ mới đến thực hành và ôn tập, mỗi bước đều có mục tiêu rõ ràng để bạn biết
                hôm nay mình cần làm gì.
              </p>
            </div>
            <div className="method">
              <article className="method-card">
                <span className="step">1</span>
                <h3>Khám phá bài học</h3>
                <p>
                  Làm quen chủ đề, nghe phát âm, xem Hán tự và Pinyin. Học qua từ và mẫu câu gần
                  gũi.
                </p>
              </article>
              <article className="method-card">
                <span className="step">2</span>
                <h3>Luyện tập tương tác</h3>
                <p>
                  Lật flashcards, chọn đáp án, nghe lại và luyện nói để biến kiến thức thành phản
                  xạ.
                </p>
              </article>
              <article className="method-card">
                <span className="step">3</span>
                <h3>Theo dõi &amp; ôn tập</h3>
                <p>
                  Nhìn lại những bài đã học, tiếp tục chặng kế tiếp và duy trì thói quen học đều
                  đặn.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section soft" id="tinh-nang">
          <div className="wrap feature-wrap">
            <div className="feature-preview">
              <div className="feature-top">
                <strong>GÓC HỌC TẬP</strong>
                <span className="pill gold">
                  <svg
                    className="ui-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M7 3v4M17 3v4M3 10h18m-14 5 3 3 5-5" />
                  </svg>{' '}
                  Chuỗi học
                </span>
              </div>
              <div className="feature-banner">
                <small>HSK 1 · Bài 1</small>
                <h3>你好! Xin chào</h3>
                <p>Bắt đầu từ một mẫu câu quen thuộc.</p>
              </div>
              <div className="feature-small-row">
                <div className="feature-mini">
                  <span>HÁN TỰ</span>
                  <strong>学 · 你 · 好</strong>
                </div>
                <div className="feature-mini">
                  <span>PINYIN</span>
                  <strong>xué · nǐ · hǎo</strong>
                </div>
              </div>
            </div>

            <div>
              <div className="eyebrow">CÁC CÔNG CỤ BẠN SẼ DÙNG</div>
              <h2>
                Học tiện lợi trên <span className="green">một nền tảng</span>
              </h2>
              <div className="feature-list">
                <article>
                  <span className="round-icon">汉</span>
                  <div>
                    <h3>Hán tự &amp; Pinyin song hành</h3>
                    <p>
                      Hiển thị âm đọc, thanh điệu và nghĩa tiếng Việt để ghi nhớ đúng từ đầu.
                    </p>
                  </div>
                </article>
                <article>
                  <span className="round-icon">
                    <svg
                      className="ui-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m11 5-6 4H2v6h3l6 4V5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
                    </svg>
                  </span>
                  <div>
                    <h3>Nghe lại từ vựng ngay trên bài học</h3>
                    <p>Chạm vào từ để luyện nghe, kết hợp lựa chọn giọng đọc trong webapp.</p>
                  </div>
                </article>
                <article>
                  <span className="round-icon">
                    <svg
                      className="ui-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="4" width="5" height="16" rx="1.5" />
                      <path d="M8 4h5v16H8M16 4l5 15-4.7 1.5-5-15Z" />
                    </svg>
                  </span>
                  <div>
                    <h3>Thư viện &amp; lộ trình theo cấp</h3>
                    <p>
                      Tiếp cận các bài học và tài liệu theo chủ đề, cấp độ và mục tiêu học tập.
                    </p>
                  </div>
                </article>
                <article>
                  <span className="round-icon">
                    <svg
                      className="ui-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 3v17h17M8 15V9M13 15V5M18 15v-4" />
                    </svg>
                  </span>
                  <div>
                    <h3>Tiến độ và chuỗi học</h3>
                    <p>
                      Biết mình đã học đến đâu, duy trì sự đều đặn và từng bước chinh phục mục tiêu.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRACTICE: FLASHCARDS + MINI QUIZ */}
        <section className="section" id="hoc-thu">
          <div className="wrap">
            <div className="section-title">
              <div className="eyebrow">THỬ NGAY TRÊN TRANG GIỚI THIỆU</div>
              <h2>
                Học một chút <span className="green">ngay bây giờ</span>
              </h2>
              <p>
                Thử lật thẻ Hán tự và trả lời câu hỏi ngắn để trải nghiệm cách học tương tác.
              </p>
            </div>

            <div className="practice-grid">
              <div className="practice-card">
                <div className="practice-head">
                  <h3>
                    <svg
                      className="ui-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="7" y="4" width="13" height="16" rx="2" />
                      <path d="M4 7H3v13a2 2 0 0 0 2 2h12M11 9h5M11 13h3" />
                    </svg>{' '}
                    Flashcards Hán tự
                  </h3>
                  <span className="pill">TỪ MỚI</span>
                </div>
                <div className="practice-body">
                  <div
                    className="hanzi-block"
                    aria-live="polite"
                    onClick={() => setFlashFlipped((prev) => !prev)}
                  >
                    <strong id="flash-hanzi">{currentCard[0]}</strong>
                    <span id="flash-pinyin" className="roman">
                      {currentCard[1]}
                    </span>
                    <span id="flash-meaning" className="meaning">
                      {flashFlipped ? currentCard[2] : 'Chạm “Lật thẻ” để xem nghĩa'}
                    </span>
                  </div>
                  <div className="flash-actions">
                    <button
                      type="button"
                      className="flash-ctrl"
                      id="flash-prev"
                      onClick={() => {
                        setFlashIdx(
                          (prev) => (prev + FLASHCARD_WORDS.length - 1) % FLASHCARD_WORDS.length
                        );
                        setFlashFlipped(false);
                      }}
                    >
                      Từ trước
                    </button>
                    <button
                      type="button"
                      className="flash-ctrl"
                      id="flash-flip"
                      onClick={() => setFlashFlipped((prev) => !prev)}
                    >
                      {flashFlipped ? 'Ẩn nghĩa' : 'Lật thẻ'}
                    </button>
                    <button
                      type="button"
                      className="flash-ctrl"
                      id="flash-sound"
                      onClick={handlePlayFlashcardAudio}
                    >
                      <svg
                        className="ui-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m11 5-6 4H2v6h3l6 4V5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
                      </svg>{' '}
                      Nghe từ
                    </button>
                    <button
                      type="button"
                      className="flash-ctrl"
                      id="flash-next"
                      onClick={() => {
                        setFlashIdx((prev) => (prev + 1) % FLASHCARD_WORDS.length);
                        setFlashFlipped(false);
                      }}
                    >
                      Từ tiếp
                    </button>
                  </div>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-head">
                  <h3>
                    <svg
                      className="ui-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9 4h6M9 4a2 2 0 0 0-2 2v1h10V6a2 2 0 0 0-2-2H9ZM7 6H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2M8 15l3 3 5-6" />
                    </svg>{' '}
                    Mini Quiz
                  </h3>
                  <span className="pill gold">1 câu thử</span>
                </div>
                <div className="practice-body">
                  <p className="light">Chọn nghĩa đúng của cụm từ dưới đây:</p>
                  <div className="q-text">“你好” (nǐ hǎo) nghĩa là gì?</div>
                  <div className="choices" id="quiz-choices">
                    {QUIZ_CHOICES.map((choice) => {
                      const isAnswered = selectedChoice !== null;
                      let stateClass = '';
                      if (isAnswered) {
                        if (choice.isCorrect) stateClass = ' correct';
                        else if (selectedChoice === choice.id) stateClass = ' wrong';
                      }
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          className={`choice${stateClass}`}
                          disabled={isAnswered}
                          onClick={() => setSelectedChoice(choice.id)}
                        >
                          {choice.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="feedback" id="quiz-feedback" aria-live="polite">
                    {quizFeedback}
                  </div>
                  <div className="q-footer">
                    <button
                      className="flash-ctrl"
                      id="quiz-reset"
                      type="button"
                      onClick={() => setSelectedChoice(null)}
                    >
                      Thử lại{' '}
                      <svg
                        className="ui-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 11a9 9 0 1 1 2.6 7M3 4v7h7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS OVERVIEW */}
        <section className="section soft" id="tien-do">
          <div className="wrap parent-box">
            <div>
              <div className="eyebrow">NHÌN RÕ TỪNG BƯỚC TIẾN</div>
              <h2>
                Mỗi ngày học một chút, <span className="green">tiến bộ có thể theo dõi</span>
              </h2>
              <p>
                Trang học viên hiển thị cấp HSK hiện tại, số bài đã hoàn thành, chuỗi học và lộ
                trình tiếp theo. Điều này giúp người học chủ động hơn và gia đình dễ đồng hành.
              </p>
              <div className="parent-points">
                <div className="parent-point">
                  <span>
                    <CheckSvg />
                  </span>
                  Biết bài hôm nay và mục tiêu kế tiếp
                </div>
                <div className="parent-point">
                  <span>
                    <CheckSvg />
                  </span>
                  Theo dõi số bài hoàn thành theo cấp HSK
                </div>
                <div className="parent-point">
                  <span>
                    <CheckSvg />
                  </span>
                  Duy trì thói quen học tiếng Trung mỗi ngày
                </div>
              </div>
            </div>

            <div className="progress-ui">
              <h3>
                <svg
                  className="ui-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 3v17h17M8 15V9M13 15V5M18 15v-4" />
                </svg>{' '}
                Tiến độ học tập
              </h3>
              <p>Minh họa các loại chỉ số hiển thị trên trang học</p>
              <div className="progress-row">
                <div className="progress-label">
                  <span>Bài học đã hoàn thành</span>
                  <b>8/20 bài</b>
                </div>
                <div className="progress">
                  <span style={{ width: '40%' }} />
                </div>
              </div>
              <div className="progress-row">
                <div className="progress-label">
                  <span>Ôn tập từ vựng</span>
                  <b>65%</b>
                </div>
                <div className="progress">
                  <span style={{ width: '65%' }} />
                </div>
              </div>
              <div className="progress-row">
                <div className="progress-label">
                  <span>Thử thách học đều</span>
                  <b>5 ngày</b>
                </div>
                <div className="progress">
                  <span style={{ width: '72%' }} />
                </div>
              </div>
              <small>Chỉ số minh họa giao diện, không phải dữ liệu học viên thực tế.</small>
            </div>
          </div>
        </section>

        {/* PLANS: FREE / PLUS / AI */}
        <section className="section" id="goi-hoc">
          <div className="wrap">
            <div className="section-title">
              <div className="eyebrow">HỌC THEO NHU CẦU</div>
              <h2>
                Chọn trải nghiệm <span className="green">phù hợp với bạn</span>
              </h2>
              <p>
                Bắt đầu khám phá miễn phí và lựa chọn các quyền lợi học tập phù hợp khi đăng ký
                trong ứng dụng.
              </p>
            </div>

            <div className="plans">
              <article className="plan">
                <div className="plan-top">
                  <h3>
                    <span className="plan-symbol">
                      <svg
                        className="ui-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 4C9 2 3 7 4 14c.7 4 4.7 6 8 4 5-3 6-8 8-14ZM4 21l10-11" />
                      </svg>
                    </span>
                    FREE
                  </h3>
                  <span className="pill">Bắt đầu</span>
                </div>
                <p>Khám phá phương pháp, làm quen Hán tự và trải nghiệm học.</p>
                <ul>
                  <li>
                    <CheckSvg />
                    Làm quen lộ trình học HSK
                  </li>
                  <li>
                    <CheckSvg />
                    Trải nghiệm hoạt động từ vựng và luyện tập
                  </li>
                  <li>
                    <CheckSvg />
                    Tạo thói quen học mỗi ngày
                  </li>
                </ul>
                <Link className="btn btn-outline" href={routes.studentUrl} data-student-link="">
                  Học thử ngay
                </Link>
              </article>

              <article className="plan featured">
                <div className="plan-top">
                  <h3>
                    <span className="plan-symbol">
                      <svg
                        className="ui-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                      </svg>
                    </span>
                    PLUS
                  </h3>
                  <span className="pill gold">Học chuyên sâu</span>
                </div>
                <p>Dành cho người muốn tự học theo lộ trình và luyện tập thường xuyên.</p>
                <ul>
                  <li>
                    <CheckSvg />
                    Học theo chương trình và cấp độ phù hợp
                  </li>
                  <li>
                    <CheckSvg />
                    Luyện tập từ vựng, bài học và bài kiểm tra
                  </li>
                  <li>
                    <CheckSvg />
                    Theo dõi quá trình học tập
                  </li>
                </ul>
                <Link className="btn btn-green" href={routes.plusUrl}>
                  Khám phá PLUS
                </Link>
              </article>

              <article className="plan">
                <div className="plan-top">
                  <h3>
                    <span className="plan-symbol">
                      <svg
                        className="ui-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="6" y="6" width="12" height="12" rx="3" />
                        <path d="M10 10h4v4h-4zM9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
                      </svg>
                    </span>
                    AI
                  </h3>
                  <span className="pill">Học thông minh</span>
                </div>
                <p>
                  Phiên bản nâng cao dành cho nhu cầu luyện tập với các công cụ AI được hỗ trợ.
                </p>
                <ul>
                  <li>
                    <CheckSvg />
                    Thừa hưởng các quyền lợi của PLUS
                  </li>
                  <li>
                    <CheckSvg />
                    Tính năng AI theo phạm vi gói đang cung cấp
                  </li>
                  <li>
                    <CheckSvg />
                    Hạn mức và điều kiện thể hiện khi chọn gói
                  </li>
                </ul>
                <Link className="btn btn-outline" href={routes.aiUrl}>
                  Khám phá AI
                </Link>
              </article>
            </div>

            <p className="plan-note">
              Thông tin quyền lợi, giá, thời hạn và tính năng AI áp dụng theo gói được hiển thị
              trong ứng dụng khi đăng ký.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="section soft" id="faq">
          <div className="wrap">
            <div className="section-title">
              <div className="eyebrow">GIẢI ĐÁP NHANH</div>
              <h2>Câu hỏi thường gặp</h2>
            </div>
            <div className="faq">
              <details>
                <summary>Người chưa biết tiếng Trung có bắt đầu được không?</summary>
                <p>
                  Có. Bạn có thể bắt đầu từ HSK 1, học Pinyin, thanh điệu, cách chào hỏi và những
                  mẫu câu cơ bản.
                </p>
              </details>
              <details>
                <summary>Lộ trình được tổ chức thế nào?</summary>
                <p>
                  Webapp chia thành các cấp độ HSK 1–6, với danh sách bài học và tiến độ tương ứng.
                  Bạn có thể chọn cấp đang học ở màn hình dashboard.
                </p>
              </details>
              <details>
                <summary>Có thể nghe phát âm và xem Pinyin không?</summary>
                <p>
                  Giao diện học viên có công cụ Pinyin, lựa chọn giọng đọc và chức năng phát âm từ
                  vựng để luyện nghe.
                </p>
              </details>
              <details>
                <summary>Có xem lại bài đã học không?</summary>
                <p>
                  Bạn có thể sử dụng lộ trình, thư viện và các công cụ trong webapp để tìm lại nội
                  dung học. Quyền truy cập cụ thể phụ thuộc gói đăng ký.
                </p>
              </details>
              <details>
                <summary>Các cấp HSK trong app có phải chứng chỉ chính thức không?</summary>
                <p>
                  Đây là lộ trình học tham chiếu cấp độ HSK, không phải chứng chỉ thi chính thức.
                  Để được cấp chứng chỉ, bạn cần đăng ký kỳ thi tại đơn vị tổ chức được công nhận.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section" style={{ paddingTop: '45px' }}>
          <div className="wrap">
            <div className="final">
              <div>
                <h2>Bắt đầu hành trình tiếng Trung hôm nay</h2>
                <p>Từ lời chào đầu tiên đến thói quen học vững vàng mỗi ngày.</p>
              </div>
              <Link className="btn btn-yellow" href={routes.studentUrl} data-student-link="">
                Vào học cùng GLOBY
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-inner">
            <a href="#dau" aria-label="GLOBY Chinese – Về đầu trang">
              <img
                src="/assets/globy-chinese-logo.svg"
                alt="GLOBY Chinese – Học tiếng Trung thông minh"
                width={350}
                height={56}
                loading="lazy"
              />
            </a>
            <div className="footer-links">
              <a href="#ky-nang">Kỹ năng</a>
              <a href="#lo-trinh">Lộ trình</a>
              <a href="#goi-hoc">Gói học</a>
              <Link href="/roadmap">Bảng 120 bài</Link>
              <Link href="/library">Thư viện</Link>
              <Link href="/login">Đăng nhập</Link>
              <a href="https://globy.tech/" target="_blank" rel="noopener noreferrer">
                Hệ sinh thái GLOBY
              </a>
            </div>
          </div>
          <div className="legal">
            © <span id="year">{currentYear}</span> GLOBY Chinese · Một sản phẩm trong hệ sinh thái
            GLOBY.
          </div>
        </div>
      </footer>
    </div>
  );
}
