/**
 * Standardized, pedagogically sound HSK 1 - 3 curriculum dataset (New HSK 3.0 Standard)
 * Designed for intensive Listening (Nghe) & Speaking (Nói) reflexes.
 *
 * Includes:
 * - HSK 1-3 Level Overviews (Vocabulary quotas, phonetics, grammar targets)
 * - Complete Pinyin Fundamentals Module (21 Initials, 36 Finals, 4 Tones & Sandhi Rules)
 * - 14 Full Standard Lessons (HSK 1: 5 lessons, HSK 2: 5 lessons, HSK 3: 4 lessons)
 *   with full dialogues, speech recognition drills, shadow sentences, radical breakdown,
 *   grammar notes, and multimodal quiz questions (listening, ordering, speaking).
 */

export type HSKLevel = 'HSK1' | 'HSK2' | 'HSK3';

export interface DialogueLine {
  id: string;
  speaker: 'A' | 'B';
  speakerName: string;
  avatar?: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  audioUrl?: string;
}

export interface SpeechDrill {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioUrl?: string;
  pronunciationTipVi?: string;
}

export interface ShadowSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  focusToneSandhi?: string;
}

export interface CurriculumVocabItem {
  id: string;
  hanzi: string;
  pinyin: string;
  meaningVi: string;
  radical: string;
  radicalMeaningVi?: string;
  strokeCount: number;
  exampleSentence: string;
  examplePinyin?: string;
  exampleVi?: string;
  hskLevel: HSKLevel;
  audioUrl?: string;
}

export interface GrammarPatternExample {
  hanzi: string;
  pinyin: string;
  vietnamese: string;
}

export interface GrammarNote {
  id: string;
  title: string;
  pattern: string;
  explanationVi: string;
  examples: GrammarPatternExample[];
}

export type QuizQuestionType = 'single_choice' | 'ordering' | 'speaking_response' | 'fill_in';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  pinyin?: string;
  audioUrl?: string;
  options?: string[];
  orderingTokens?: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  targetSpeech?: string;
}

export interface HSKLesson {
  id: string;
  lessonNumber: number;
  level: HSKLevel;
  title: string;
  subtitleVi: string;
  topicIcon: string;
  imageUrl?: string;
  estimatedMinutes: number;
  summaryVi: string;
  dialogue: DialogueLine[];
  speechDrills: SpeechDrill[];
  shadowSentences: ShadowSentence[];
  vocabulary: CurriculumVocabItem[];
  grammarNotes: GrammarNote[];
  quizQuestions: QuizQuestion[];
}

export interface PinyinInitial {
  letter: string;
  ipa: string;
  categoryVi: string;
  vietnameseGuide: string;
  example: { hanzi: string; pinyin: string; meaningVi: string };
}

export interface PinyinFinal {
  pinyin: string;
  type: 'simple' | 'compound' | 'front_nasal' | 'back_nasal' | 'special';
  ipa: string;
  vietnameseGuide: string;
  example: { hanzi: string; pinyin: string; meaningVi: string };
}

export interface ToneRule {
  id: string;
  name: string;
  ruleVi: string;
  formula: string;
  examples: Array<{
    originalPinyin: string;
    sandhiPinyin: string;
    hanzi: string;
    meaningVi: string;
    note?: string;
  }>;
}

export interface PinyinFundamentals {
  initials: PinyinInitial[];
  finals: PinyinFinal[];
  tones: Array<{
    toneNumber: 1 | 2 | 3 | 4 | 5;
    nameVi: string;
    pitchGraph: string;
    descriptionVi: string;
    example: { hanzi: string; pinyin: string; meaningVi: string };
  }>;
  toneRules: ToneRule[];
}

export interface HSKLevelOverview {
  level: HSKLevel;
  title: string;
  standard: string;
  targetCumulativeVocab: number;
  newVocabCount: number;
  charactersCount: number;
  listeningSpeakingGoals: string[];
  grammarPointsCount: number;
  descriptionVi: string;
}

/* ==========================================================================
   1. LEVEL OVERVIEWS (NEW HSK 3.0 STANDARD)
   ========================================================================== */

export const HSK_LEVEL_OVERVIEWS: Record<HSKLevel, HSKLevelOverview> = {
  HSK1: {
    level: 'HSK1',
    title: 'HSK 1 - Nhập môn Phát âm & Giao tiếp Căn bản',
    standard: 'New HSK 3.0 (Cấp độ 1)',
    targetCumulativeVocab: 500,
    newVocabCount: 500,
    charactersCount: 300,
    grammarPointsCount: 48,
    listeningSpeakingGoals: [
      'Nắm vững toàn bộ 21 thanh mẫu, 36 vận mẫu, 4 thanh điệu và quy tắc biến điệu thanh 3, 一 (yī), 不 (bù).',
      'Nghe hiểu các thông điệp chào hỏi, tự giới thiệu tên họ, quốc tịch, các thành viên gia đình với tốc độ chuẩn 100-120 âm tiết/phút.',
      'Phát xạ nói tức thì trong các tình huống mua bán đơn giản, hỏi giá tiền, xem giờ và xác nhận lịch hẹn trong tuần.',
      'Phát âm chuẩn ngữ điệu Bắc Kinh, sửa tật nói đều thanh điệu hoặc nhầm lẫn giữa âm bật hơi (p, t, k, q, ch, c) và không bật hơi.',
    ],
    descriptionVi:
      'Cấp độ HSK 1 theo chuẩn HSK 3.0 mở rộng vốn từ từ 150 từ (chuẩn cũ) lên 500 từ vựng cốt lõi, tập trung hình thành phản xạ nghe nói tự nhiên, chuẩn xác ngay từ những ngày đầu tiếp xúc với Hán ngữ.',
  },
  HSK2: {
    level: 'HSK2',
    title: 'HSK 2 - Phản xạ Giao tiếp Sinh hoạt & Xã hội',
    standard: 'New HSK 3.0 (Cấp độ 2)',
    targetCumulativeVocab: 1272,
    newVocabCount: 772,
    charactersCount: 600,
    grammarPointsCount: 129,
    listeningSpeakingGoals: [
      'Nghe và hiểu các đoạn hội thoại đời sống 3-5 lượt đối đáp: gọi món ăn, chỉ đường, hỏi thời tiết, sở thích cá nhân, tình trạng sức khỏe.',
      'Ứng dụng linh hoạt các phó từ so sánh (比较, 最), động từ năng nguyện (想, 要, 能, 可以), và các kết cấu liên động.',
      'Tự tin giao tiếp và diễn đạt ý kiến trong các tình huống thực tế tại Trung Quốc: bắt taxi, đi tàu điện ngầm, khám bệnh tại phòng khám.',
      'Luyện kỹ năng Shadowing (nhại âm) với câu dài 8-15 chữ, giữ vững cao độ thanh 4 và biến âm thanh nhẹ.',
    ],
    descriptionVi:
      'HSK 2 bồi đắp thêm 772 từ mới (tổng 1.272 từ vựng), giúp người học chuyển biến từ các câu đơn lẻ sang khả năng duy trì hội thoại liên tục trong mọi chủ đề thường nhật.',
  },
  HSK3: {
    level: 'HSK3',
    title: 'HSK 3 - Tự sự, Thuyết trình & Giao tiếp Độc lập',
    standard: 'New HSK 3.0 (Cấp độ 3)',
    targetCumulativeVocab: 2245,
    newVocabCount: 973,
    charactersCount: 900,
    grammarPointsCount: 210,
    listeningSpeakingGoals: [
      'Nghe hiểu và nắm bắt thông tin mấu chốt trong các cuộc đối thoại dài tại sân bay, khách sạn, ga tàu và bài nói chia sẻ trải nghiệm.',
      'Diễn đạt trôi chảy các cấu trúc ngữ pháp phức hợp: câu chữ 把, câu so sánh chữ 比, cấu trúc nhấn mạnh 是...的, liên từ 虽然...但是...',
      'Tự thuật ngắn (1-2 phút) kể về một chuyến đi đáng nhớ, một kế hoạch tương lai hoặc so sánh ưu nhược điểm giữa hai sự lựa chọn.',
      'Làm chủ ngữ điệu biểu cảm (ngạc nhiên, khen ngợi, cảm thán ...极了, tiếc nuối), tăng tốc độ nói phản xạ đạt 140-160 âm tiết/phút.',
    ],
    descriptionVi:
      'HSK 3 là cột mốc hoàn thiện bậc Sơ cấp toàn diện (total 2.245 từ theo New HSK 3.0), trang bị năng lực tự sự, giao tiếp độc lập khi đi du lịch hoặc công tác tại các nước nói tiếng Trung.',
  },
};

/* ==========================================================================
   2. PINYIN FUNDAMENTALS MODULE (21 Initials, 36 Finals, Tones & Sandhi Rules)
   ========================================================================== */

export const HSK1_PINYIN_FUNDAMENTALS: PinyinFundamentals = {
  initials: [
    {
      letter: 'b',
      ipa: '[p]',
      categoryVi: 'Âm hai môi (双唇音 - Không bật hơi)',
      vietnameseGuide: 'Hai môi khép lại rồi mở nhẹ, không phát ra luồng hơi. Tương tự như âm "p" nhẹ hoặc "b" nửa đầu trong tiếng Việt.',
      example: { hanzi: '爸', pinyin: 'bà', meaningVi: 'Bố, ba' },
    },
    {
      letter: 'p',
      ipa: '[pʰ]',
      categoryVi: 'Âm hai môi (双唇音 - Bật hơi mạnh)',
      vietnameseGuide: 'Hai môi khép chặt, sau đó mở nhanh và đẩy luồng hơi mạnh ra ngoài. Đặt tờ giấy trước miệng tờ giấy phải bay lên.',
      example: { hanzi: '朋', pinyin: 'péng', meaningVi: 'Bạn bè (bằng hữu)' },
    },
    {
      letter: 'm',
      ipa: '[m]',
      categoryVi: 'Âm hai môi (双唇音 - Âm mũi)',
      vietnameseGuide: 'Hai môi khép lại, luồng hơi thoát ra qua khoang mũi. Giống hệt âm "m" trong tiếng Việt.',
      example: { hanzi: '妈', pinyin: 'mā', meaningVi: 'Mẹ' },
    },
    {
      letter: 'f',
      ipa: '[f]',
      categoryVi: 'Âm răng môi (唇齿音)',
      vietnameseGuide: 'Răng cửa trên chạm nhẹ vào môi dưới, luồng hơi ma sát thoát ra. Giống âm "ph" tiếng Việt.',
      example: { hanzi: '风', pinyin: 'fēng', meaningVi: 'Gió' },
    },
    {
      letter: 'd',
      ipa: '[t]',
      categoryVi: 'Âm đầu lưỡi (舌尖中音 - Không bật hơi)',
      vietnameseGuide: 'Đầu lưỡi chạm ngạc răng trên rồi buông nhẹ, không bật hơi. Giống chữ "t" trong tiếng Việt (ví dụ: "tôi").',
      example: { hanzi: '大', pinyin: 'dà', meaningVi: 'Lớn, to' },
    },
    {
      letter: 't',
      ipa: '[tʰ]',
      categoryVi: 'Âm đầu lưỡi (舌尖中音 - Bật hơi mạnh)',
      vietnameseGuide: 'Đầu lưỡi chạm ngạc răng trên, buông nhanh và phóng luồng hơi mạnh. Giống âm "th" tiếng Việt nhưng dứt khoát hơn.',
      example: { hanzi: '他', pinyin: 'tā', meaningVi: 'Anh ấy, cậu ấy' },
    },
    {
      letter: 'n',
      ipa: '[n]',
      categoryVi: 'Âm đầu lưỡi (舌尖中音 - Âm mũi)',
      vietnameseGuide: 'Đầu lưỡi chạm lợi trên, hơi thoát ra qua đường mũi. Giống chữ "n" tiếng Việt.',
      example: { hanzi: '你', pinyin: 'nǐ', meaningVi: 'Bạn, anh, chị' },
    },
    {
      letter: 'l',
      ipa: '[l]',
      categoryVi: 'Âm đầu lưỡi (舌尖中音 - Âm bên)',
      vietnameseGuide: 'Đầu lưỡi chạm lợi trên, luồng hơi thoát ra hai bên cạnh lưỡi. Giống chữ "l" tiếng Việt.',
      example: { hanzi: '老', pinyin: 'lǎo', meaningVi: 'Già, cũ' },
    },
    {
      letter: 'g',
      ipa: '[k]',
      categoryVi: 'Âm cuống lưỡi (舌根音 - Không bật hơi)',
      vietnameseGuide: 'Cuống lưỡi nâng lên chạm ngạc mềm rồi nhả ra không bật hơi. Giống âm "c/k" tiếng Việt (ví dụ: "con cá").',
      example: { hanzi: '哥', pinyin: 'gē', meaningVi: 'Anh trai' },
    },
    {
      letter: 'k',
      ipa: '[kʰ]',
      categoryVi: 'Âm cuống lưỡi (舌根音 - Bật hơi mạnh)',
      vietnameseGuide: 'Cuống lưỡi nâng chạm ngạc mềm, hạ xuống phóng luồng hơi mạnh từ cuống họng. Tương tự "kh" nhưng có tiếng bật hơi.',
      example: { hanzi: '看', pinyin: 'kàn', meaningVi: 'Nhìn, xem' },
    },
    {
      letter: 'h',
      ipa: '[x]',
      categoryVi: 'Âm cuống lưỡi (舌根音 - Xát nhẹ)',
      vietnameseGuide: 'Cuống lưỡi tiếp cận ngạc mềm tạo khe hẹp để luồng hơi cọ xát đi ra. Nằm giữa âm "h" và "kh" của tiếng Việt.',
      example: { hanzi: '好', pinyin: 'hǎo', meaningVi: 'Tốt, đẹp' },
    },
    {
      letter: 'j',
      ipa: '[tɕ]',
      categoryVi: 'Âm mặt lưỡi (舌面前音 - Không bật hơi)',
      vietnameseGuide: 'Mặt trước của lưỡi áp sát vào ngạc cứng, buông ra từ tốn. Giống âm "ch" trong tiếng Việt nhưng dẹt miệng sang hai bên.',
      example: { hanzi: '家', pinyin: 'jiā', meaningVi: 'Nhà, gia đình' },
    },
    {
      letter: 'q',
      ipa: '[tɕʰ]',
      categoryVi: 'Âm mặt lưỡi (舌面前音 - Bật hơi mạnh)',
      vietnameseGuide: 'Vị trí như âm "j" nhưng nén hơi và bật luồng hơi cực mạnh qua kẽ lưỡi. Rất đặc trưng trong tiếng Trung.',
      example: { hanzi: '七', pinyin: 'qī', meaningVi: 'Số bảy' },
    },
    {
      letter: 'x',
      ipa: '[ɕ]',
      categoryVi: 'Âm mặt lưỡi (舌面前音 - Xát nhẹ)',
      vietnameseGuide: 'Mặt lưỡi tiếp cận ngạc cứng, mở khóe môi mỉm cười, để hơi ma sát thoát ra. Giống âm "x" tiếng Việt nhưng mảnh hơn.',
      example: { hanzi: '谢', pinyin: 'xiè', meaningVi: 'Cảm ơn' },
    },
    {
      letter: 'zh',
      ipa: '[ʈʂ]',
      categoryVi: 'Âm uốn lưỡi (舌尖后音 - Không bật hơi)',
      vietnameseGuide: 'Đầu lưỡi cong lên chạm vào ngạc cứng trên, sau đó mở nhẹ không bật hơi. Gần giống âm "tr" miền Nam nhưng chuẩn âm vòm họng.',
      example: { hanzi: '中', pinyin: 'zhōng', meaningVi: 'Trung tâm, ở giữa' },
    },
    {
      letter: 'ch',
      ipa: '[ʈʂʰ]',
      categoryVi: 'Âm uốn lưỡi (舌尖后音 - Bật hơi mạnh)',
      vietnameseGuide: 'Đầu lưỡi cong lên ngạc cứng như "zh", nhưng bật luồng hơi nén ra thật mạnh mẽ.',
      example: { hanzi: '吃', pinyin: 'chī', meaningVi: 'Ăn' },
    },
    {
      letter: 'sh',
      ipa: '[ʂ]',
      categoryVi: 'Âm uốn lưỡi (舌尖后音 - Xát)',
      vietnameseGuide: 'Đầu lưỡi uốn cong lên ngạc cứng tạo khe hẹp để hơi cọ xát đi ra. Giống âm "s" nặng tiếng Việt uốn lưỡi sâu.',
      example: { hanzi: '是', pinyin: 'shì', meaningVi: 'Là, đúng' },
    },
    {
      letter: 'r',
      ipa: '[ʐ]',
      categoryVi: 'Âm uốn lưỡi (舌尖后音 - Hữu thanh)',
      vietnameseGuide: 'Khẩu hình giống hệt "sh" nhưng rung dây thanh quản. Giống âm "r" tiếng Việt hoặc "j" trong tiếng Pháp.',
      example: { hanzi: '人', pinyin: 'rén', meaningVi: 'Người' },
    },
    {
      letter: 'z',
      ipa: '[ts]',
      categoryVi: 'Âm đầu lưỡi trước (舌尖前音 - Không bật hơi)',
      vietnameseGuide: 'Đầu lưỡi đặt thẳng chạm mặt sau răng trên, hạ nhẹ để hơi thoát ra không bật hơi. Nghe như "ch/ts".',
      example: { hanzi: '在', pinyin: 'zài', meaningVi: 'Ở, tại' },
    },
    {
      letter: 'c',
      ipa: '[tsʰ]',
      categoryVi: 'Âm đầu lưỡi trước (舌尖前音 - Bật hơi mạnh)',
      vietnameseGuide: 'Khẩu hình như "z", đầu lưỡi cắn nhẹ sau răng rồi bật luồng hơi cực mạnh qua kẽ răng.',
      example: { hanzi: '菜', pinyin: 'cài', meaningVi: 'Món ăn, rau' },
    },
    {
      letter: 's',
      ipa: '[s]',
      categoryVi: 'Âm đầu lưỡi trước (舌尖前音 - Xát)',
      vietnameseGuide: 'Đầu lưỡi để thẳng gần mặt sau răng dưới/trên, hơi xát ra nhẹ nhàng. Giống chữ "x" nhẹ tiếng Việt.',
      example: { hanzi: '四', pinyin: 'sì', meaningVi: 'Số bốn' },
    },
  ],
  finals: [
    // 6 Simple Finals
    { pinyin: 'a', type: 'simple', ipa: '[a]', vietnameseGuide: 'Há to miệng tự nhiên, lưỡi ở vị trí thấp nhất. Giống "a" tiếng Việt.', example: { hanzi: '八', pinyin: 'bā', meaningVi: 'Số tám' } },
    { pinyin: 'o', type: 'simple', ipa: '[o]', vietnameseGuide: 'Tròn môi, lưỡi lùi về sau. Giống âm "ô" tròn vành rõ chữ.', example: { hanzi: '我', pinyin: 'wǒ', meaningVi: 'Tôi' } },
    { pinyin: 'e', type: 'simple', ipa: '[ɤ]', vietnameseGuide: 'Miệng mở hờ vừa phải, khóe môi dẹt về hai bên. Nằm giữa "ơ" và "ưa" tiếng Việt.', example: { hanzi: '喝', pinyin: 'hē', meaningVi: 'Uống' } },
    { pinyin: 'i', type: 'simple', ipa: '[i]', vietnameseGuide: 'Khóe môi mở rộng sang hai bên như đang cười tươi. Giống âm "i" tiếng Việt.', example: { hanzi: '你', pinyin: 'nǐ', meaningVi: 'Bạn' } },
    { pinyin: 'u', type: 'simple', ipa: '[u]', vietnameseGuide: 'Hai môi chum tròn nhô ra phía trước. Giống âm "u" tiếng Việt.', example: { hanzi: '不', pinyin: 'bù', meaningVi: 'Không' } },
    { pinyin: 'ü', type: 'simple', ipa: '[y]', vietnameseGuide: 'Giữ nguyên vị trí môi chum tròn nhỏ như huýt sáo, bên trong phát âm "i" (đọc uy).', example: { hanzi: '绿', pinyin: 'lǜ', meaningVi: 'Xanh lá cây' } },

    // 13 Compound Finals
    { pinyin: 'ai', type: 'compound', ipa: '[ai]', vietnameseGuide: 'Từ "a" trượt nhanh sang "i". Giống vần "ai" tiếng Việt.', example: { hanzi: '爱', pinyin: 'ài', meaningVi: 'Yêu' } },
    { pinyin: 'ei', type: 'compound', ipa: '[ei]', vietnameseGuide: 'Từ "e" trượt sang "i". Giống vần "ây" tiếng Việt.', example: { hanzi: '杯', pinyin: 'bēi', meaningVi: 'Cốc, ly' } },
    { pinyin: 'ao', type: 'compound', ipa: '[au]', vietnameseGuide: 'Từ "a" trượt sang "o". Giống vần "ao" tiếng Việt.', example: { hanzi: '包', pinyin: 'bāo', meaningVi: 'Túi xách, bánh bao' } },
    { pinyin: 'ou', type: 'compound', ipa: '[ou]', vietnameseGuide: 'Từ "o" trượt sang "u". Giống vần "âu/ôu" tiếng Việt.', example: { hanzi: '狗', pinyin: 'gǒu', meaningVi: 'Con chó' } },
    { pinyin: 'ia', type: 'compound', ipa: '[ia]', vietnameseGuide: 'Từ "i" mở to nhanh sang "a". Giống "ia" tiếng Việt.', example: { hanzi: '家', pinyin: 'jiā', meaningVi: 'Gia đình, nhà' } },
    { pinyin: 'ie', type: 'compound', ipa: '[iɛ]', vietnameseGuide: 'Từ "i" chuyển sang "ê". Giống "i-ê".', example: { hanzi: '姐', pinyin: 'jiě', meaningVi: 'Chị gái' } },
    { pinyin: 'iao', type: 'compound', ipa: '[iau]', vietnameseGuide: 'Từ "i" lướt qua "ao". Giống vần "iêu" hoặc "iao".', example: { hanzi: '小', pinyin: 'xiǎo', meaningVi: 'Nhỏ, bé' } },
    { pinyin: 'iu (iou)', type: 'compound', ipa: '[iou]', vietnameseGuide: 'Từ "i" lướt qua "âu". Viết gọn thành "iu". Giống "yêu".', example: { hanzi: '九', pinyin: 'jiǔ', meaningVi: 'Số chín' } },
    { pinyin: 'ua', type: 'compound', ipa: '[ua]', vietnameseGuide: 'Từ "u" mở to nhanh sang "a". Giống vần "oa" tiếng Việt.', example: { hanzi: '花', pinyin: 'huā', meaningVi: 'Bông hoa' } },
    { pinyin: 'uo', type: 'compound', ipa: '[uo]', vietnameseGuide: 'Từ "u" chuyển sang "ô". Giống vần "uô" tiếng Việt.', example: { hanzi: '多', pinyin: 'duō', meaningVi: 'Nhiều' } },
    { pinyin: 'uai', type: 'compound', ipa: '[uai]', vietnameseGuide: 'Từ "u" lướt sang "ai". Giống vần "oai" tiếng Việt.', example: { hanzi: '快', pinyin: 'kuài', meaningVi: 'Nhanh' } },
    { pinyin: 'ui (uei)', type: 'compound', ipa: '[uei]', vietnameseGuide: 'Từ "u" lướt sang "ây". Viết gọn thành "ui". Giống "uây".', example: { hanzi: '水', pinyin: 'shuǐ', meaningVi: 'Nước' } },
    { pinyin: 'üe', type: 'compound', ipa: '[yɛ]', vietnameseGuide: 'Từ âm "ü" chuyển sang "ê". Giống "uy-ê".', example: { hanzi: '月', pinyin: 'yuè', meaningVi: 'Tháng, mặt trăng' } },
    { pinyin: 'er', type: 'special', ipa: '[aɚ]', vietnameseGuide: 'Vận mẫu uốn lưỡi đặc biệt. Phát âm "ơ" đồng thời uốn cong đầu lưỡi lên.', example: { hanzi: '二', pinyin: 'èr', meaningVi: 'Số hai' } },

    // 16 Nasal Finals (8 Front Nasal -n, 8 Back Nasal -ng)
    { pinyin: 'an', type: 'front_nasal', ipa: '[an]', vietnameseGuide: 'Âm mũi trước, đầu lưỡi chạm lợi trên khi kết thúc. Đọc "an".', example: { hanzi: '三', pinyin: 'sān', meaningVi: 'Số ba' } },
    { pinyin: 'en', type: 'front_nasal', ipa: '[ən]', vietnameseGuide: 'Âm mũi trước, kết thúc chạm đầu lưỡi. Đọc giống "ân".', example: { hanzi: '门', pinyin: 'mén', meaningVi: 'Cánh cửa' } },
    { pinyin: 'in', type: 'front_nasal', ipa: '[in]', vietnameseGuide: 'Đọc âm "i" kéo dài kết thúc ở "n". Giống "in".', example: { hanzi: '您', pinyin: 'nín', meaningVi: 'Ngài, ông (kính ngữ)' } },
    { pinyin: 'ün', type: 'front_nasal', ipa: '[yn]', vietnameseGuide: 'Khẩu hình âm "ü" kết thúc với "n". Giống "uyn".', example: { hanzi: '云', pinyin: 'yún', meaningVi: 'Mây' } },
    { pinyin: 'ian', type: 'front_nasal', ipa: '[iɛn]', vietnameseGuide: 'Từ "i" lướt sang "en" (chú ý a đọc thành e). Giống "i-en".', example: { hanzi: '点', pinyin: 'diǎn', meaningVi: 'Điểm, giờ' } },
    { pinyin: 'uan', type: 'front_nasal', ipa: '[uan]', vietnameseGuide: 'Từ "u" lướt sang "an". Giống "oan" tiếng Việt.', example: { hanzi: '完', pinyin: 'wán', meaningVi: 'Hoàn thành, xong' } },
    { pinyin: 'un (uen)', type: 'front_nasal', ipa: '[uən]', vietnameseGuide: 'Từ "u" lướt sang "ân". Viết gọn là "un". Giống "uân".', example: { hanzi: '问', pinyin: 'wèn', meaningVi: 'Hỏi' } },
    { pinyin: 'üan', type: 'front_nasal', ipa: '[yɛn]', vietnameseGuide: 'Từ "ü" lướt sang "en". Giống vần "uy-en".', example: { hanzi: '元', pinyin: 'yuán', meaningVi: 'Đồng Nhân dân tệ' } },

    { pinyin: 'ang', type: 'back_nasal', ipa: '[aŋ]', vietnameseGuide: 'Âm mũi sau, cuống lưỡi nâng lên chạm ngạc mềm. Đọc "ang".', example: { hanzi: '帮', pinyin: 'bāng', meaningVi: 'Giúp đỡ' } },
    { pinyin: 'eng', type: 'back_nasal', ipa: '[əŋ]', vietnameseGuide: 'Âm mũi sau, cuống lưỡi chạm ngạc mềm. Đọc giống "âng".', example: { hanzi: '冷', pinyin: 'lěng', meaningVi: 'Lạnh' } },
    { pinyin: 'ing', type: 'back_nasal', ipa: '[iŋ]', vietnameseGuide: 'Từ "i" ngân qua đường mũi sau. Đọc "inh".', example: { hanzi: '明', pinyin: 'míng', meaningVi: 'Sáng tỏ, rõ ràng' } },
    { pinyin: 'ong', type: 'back_nasal', ipa: '[uŋ]', vietnameseGuide: 'Môi hơi tròn, hơi qua mũi sau. Đọc giống "ung".', example: { hanzi: '红', pinyin: 'hóng', meaningVi: 'Màu đỏ' } },
    { pinyin: 'iang', type: 'back_nasal', ipa: '[iaŋ]', vietnameseGuide: 'Từ "i" lướt sang "ang". Giống vần "i-ang".', example: { hanzi: '想', pinyin: 'xiǎng', meaningVi: 'Muốn, nghĩ' } },
    { pinyin: 'iong', type: 'back_nasal', ipa: '[iuŋ]', vietnameseGuide: 'Từ "i" lướt sang "ong". Giống vần "i-ung".', example: { hanzi: '穷', pinyin: 'qióng', meaningVi: 'Nghèo' } },
    { pinyin: 'uang', type: 'back_nasal', ipa: '[uaŋ]', vietnameseGuide: 'Từ "u" lướt sang "ang". Giống vần "oang".', example: { hanzi: '黄', pinyin: 'huáng', meaningVi: 'Màu vàng' } },
    { pinyin: 'ueng', type: 'back_nasal', ipa: '[uəŋ]', vietnameseGuide: 'Từ "u" lướt sang "eng". Thường đứng độc lập viết là "weng".', example: { hanzi: '翁', pinyin: 'wēng', meaningVi: 'Ông lão' } },
  ],
  tones: [
    {
      toneNumber: 1,
      nameVi: 'Thanh 1 (Âm Bình - 阴平)',
      pitchGraph: '55 (Cao bằng)',
      descriptionVi: 'Phát âm ở cao độ tối đa 55, ngân dài phẳng lặng, giữ nguyên làn hơi ổn định không lên xuống.',
      example: { hanzi: '妈', pinyin: 'mā', meaningVi: 'Mẹ' },
    },
    {
      toneNumber: 2,
      nameVi: 'Thanh 2 (Dương Bình - 阳平)',
      pitchGraph: '35 (Vút lên cao)',
      descriptionVi: 'Bắt đầu từ độ cao trung bình 3, vút thẳng lên 5 như dấu sắc tiếng Việt nhưng vang và cao hơn.',
      example: { hanzi: '麻', pinyin: 'má', meaningVi: 'Cây gai, mè' },
    },
    {
      toneNumber: 3,
      nameVi: 'Thanh 3 (Thượng Thanh - 上声)',
      pitchGraph: '214 (Xuống trầm rồi lượn lên)',
      descriptionVi: 'Hạ giọng thật sâu xuống đáy 1 (trầm nhất), sau đó lượn bổng lên độ cao 4. Khi đọc rời nghe uốn lượn.',
      example: { hanzi: '马', pinyin: 'mǎ', meaningVi: 'Con ngựa' },
    },
    {
      toneNumber: 4,
      nameVi: 'Thanh 4 (Khứ Thanh - 去声)',
      pitchGraph: '51 (Giáng dứt khoát)',
      descriptionVi: 'Rơi thẳng từ đỉnh cao 5 xuống đáy vực 1 một cách sắc lạnh, dứt khoát như tiếng hạ mệnh lệnh.',
      example: { hanzi: '骂', pinyin: 'mà', meaningVi: 'Mắng mỏ' },
    },
    {
      toneNumber: 5,
      nameVi: 'Thanh nhẹ (Khinh thanh - 轻声)',
      pitchGraph: 'Ngắn & nhẹ',
      descriptionVi: 'Không đánh dấu thanh, phát âm ngắn, nhẹ, rơi tự nhiên dựa theo thanh đứng trước nó.',
      example: { hanzi: '吗', pinyin: 'ma', meaningVi: 'Trợ từ nghi vấn (không?)' },
    },
  ],
  toneRules: [
    {
      id: 'sandhi-tone3',
      name: 'Quy tắc Biến điệu Thanh 3 (3 + 3 -> 2 + 3)',
      ruleVi:
        'Khi hai âm tiết cùng mang thanh 3 đi liền kề nhau, âm tiết thứ nhất bắt buộc biến âm thành thanh 2 (dấu sắc). Trong văn bản Pinyin thông thường vẫn giữ nguyên dấu thanh 3 gốc, nhưng khi đọc phải phát âm thanh 2. Khi gặp 3 thanh 3 đi liền (3+3+3): ngắt theo cụm ngữ nghĩa 1+(2+3) hoặc (1+2)+3.',
      formula: 'Thanh 3 + Thanh 3 => Thanh 2 + Thanh 3',
      examples: [
        { originalPinyin: 'nǐ hǎo', sandhiPinyin: 'ní hǎo', hanzi: '你好', meaningVi: 'Xin chào', note: 'Từ chào hỏi phổ biến nhất' },
        { originalPinyin: 'hěn hǎo', sandhiPinyin: 'hén hǎo', hanzi: '很好', meaningVi: 'Rất tốt / Rất khỏe' },
        { originalPinyin: 'kě yǐ', sandhiPinyin: 'ké yǐ', hanzi: '可以', meaningVi: 'Có thể' },
        { originalPinyin: 'shǒu biǎo', sandhiPinyin: 'shóu biǎo', hanzi: '手表', meaningVi: 'Đồng hồ đeo tay' },
        { originalPinyin: 'wǒ hěn hǎo', sandhiPinyin: 'wǒ hén hǎo', hanzi: '我很好', meaningVi: 'Tôi rất khỏe (cấu trúc 1 + [2+3])' },
      ],
    },
    {
      id: 'sandhi-yi',
      name: 'Quy tắc Biến điệu của chữ "一" (yī)',
      ruleVi:
        'Chữ "一" vốn mang thanh 1 (yī) khi đếm số hoặc đứng độc lập. Khi đi trước âm tiết mang thanh 4, nó biến thành thanh 2 (yí). Khi đi trước âm tiết mang thanh 1, thanh 2 hoặc thanh 3, nó biến thành thanh 4 (yì).',
      formula: '一 + Thanh 4 => yí; 一 + Thanh 1/2/3 => yì; Độc lập / số đếm => yī',
      examples: [
        { originalPinyin: 'yī dìng', sandhiPinyin: 'yí dìng', hanzi: '一定', meaningVi: 'Nhất định (trước thanh 4)' },
        { originalPinyin: 'yī gòng', sandhiPinyin: 'yí gòng', hanzi: '一共', meaningVi: 'Tổng cộng (trước thanh 4)' },
        { originalPinyin: 'yī yàng', sandhiPinyin: 'yí yàng', hanzi: '一样', meaningVi: 'Giống nhau (trước thanh 4)' },
        { originalPinyin: 'yī tiān', sandhiPinyin: 'yì tiān', hanzi: '一天', meaningVi: 'Một ngày (trước thanh 1)' },
        { originalPinyin: 'yī nián', sandhiPinyin: 'yì nián', hanzi: '一年', meaningVi: 'Một năm (trước thanh 2)' },
        { originalPinyin: 'yī qǐ', sandhiPinyin: 'yì qǐ', hanzi: '一起', meaningVi: 'Cùng nhau (trước thanh 3)' },
      ],
    },
    {
      id: 'sandhi-bu',
      name: 'Quy tắc Biến điệu của chữ "不" (bù)',
      ruleVi:
        'Chữ "不" vốn mang thanh 4 (bù) khi đứng một mình hoặc đứng trước các âm tiết mang thanh 1, thanh 2, thanh 3. Khi đứng trước một âm tiết mang thanh 4, nó bắt buộc biến thành thanh 2 (bú) để tránh việc phát âm liên tiếp hai âm giáng mạnh mệt mỏi.',
      formula: '不 + Thanh 4 => bú; Không đứng trước thanh 4 => bù',
      examples: [
        { originalPinyin: 'bù shì', sandhiPinyin: 'bú shì', hanzi: '不是', meaningVi: 'Không phải (trước thanh 4)' },
        { originalPinyin: 'bù yào', sandhiPinyin: 'bú yào', hanzi: '不要', meaningVi: 'Không muốn / Đừng (trước thanh 4)' },
        { originalPinyin: 'bù qù', sandhiPinyin: 'bú qù', hanzi: '不去', meaningVi: 'Không đi (trước thanh 4)' },
        { originalPinyin: 'bù kàn', sandhiPinyin: 'bú kàn', hanzi: '不看', meaningVi: 'Không xem (trước thanh 4)' },
        { originalPinyin: 'bù chī', sandhiPinyin: 'bù chī', hanzi: '不吃', meaningVi: 'Không ăn (trước thanh 1 - giữ nguyên bù)' },
        { originalPinyin: 'bù lái', sandhiPinyin: 'bù lái', hanzi: '不来', meaningVi: 'Không đến (trước thanh 2 - giữ nguyên bù)' },
        { originalPinyin: 'bù hǎo', sandhiPinyin: 'bù hǎo', hanzi: '不好', meaningVi: 'Không tốt (trước thanh 3 - giữ nguyên bù)' },
      ],
    },
  ],
};

/* ==========================================================================
   3. HSK 1 - 5 LESSONS
   ========================================================================== */

export const HSK1_LESSONS: HSKLesson[] = [
  {
    id: 'hsk1-lesson-01',
    lessonNumber: 1,
    level: 'HSK1',
    title: 'Bài 1: Chào hỏi & Làm quen',
    subtitleVi: '你好, 你好吗, 我很好, 谢谢, 再见',
    topicIcon: 'MessageCircle',
    imageUrl: '/images/lessons/hsk1_lesson01_greeting.jpg',
    estimatedMinutes: 25,
    summaryVi: 'Làm quen với khẩu hình chào hỏi căn bản nhất, thực hành thanh điệu và ứng dụng quy tắc biến âm 3+3.',
    dialogue: [
      {
        id: 'hsk1-01-d1',
        speaker: 'A',
        speakerName: '王丽 (Wang Li - Cô giáo)',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        vietnamese: 'Xin chào bạn!',
      },
      {
        id: 'hsk1-01-d2',
        speaker: 'B',
        speakerName: '大卫 (David - Học viên)',
        hanzi: '你好！老师好！',
        pinyin: 'Nǐ hǎo! Lǎoshī hǎo!',
        vietnamese: 'Chào cô! Chúc cô tốt lành!',
      },
      {
        id: 'hsk1-01-d3',
        speaker: 'A',
        speakerName: '王丽 (Wang Li)',
        hanzi: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        vietnamese: 'Hôm nay em có khỏe không?',
      },
      {
        id: 'hsk1-01-d4',
        speaker: 'B',
        speakerName: '大卫 (David)',
        hanzi: '我很好，谢谢！你呢？',
        pinyin: 'Wǒ hěn hǎo, xièxie! Nǐ ne?',
        vietnamese: 'Em rất khỏe, cảm ơn cô! Còn cô thì sao ạ?',
      },
      {
        id: 'hsk1-01-d5',
        speaker: 'A',
        speakerName: '王丽 (Wang Li)',
        hanzi: '我也很好。明天见！',
        pinyin: 'Wǒ yě hěn hǎo. Míngtiān jiàn!',
        vietnamese: 'Cô cũng rất khỏe. Hẹn ngày mai gặp lại nhé!',
      },
      {
        id: 'hsk1-01-d6',
        speaker: 'B',
        speakerName: '大卫 (David)',
        hanzi: '老师再见！',
        pinyin: 'Lǎoshī zàijiàn!',
        vietnamese: 'Tạm biệt cô giáo ạ!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk1-01-sd1',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        vietnamese: 'Xin chào!',
        difficulty: 'easy',
        pronunciationTipVi: 'Đọc biến điệu thành "Ní hǎo", mở nhẹ khẩu hình.',
      },
      {
        id: 'hsk1-01-sd2',
        hanzi: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        vietnamese: 'Bạn có khỏe không?',
        difficulty: 'easy',
        pronunciationTipVi: 'Từ "ma" là thanh nhẹ, đọc dứt khoát và ngắn.',
      },
      {
        id: 'hsk1-01-sd3',
        hanzi: '我很好，谢谢！',
        pinyin: 'Wǒ hěn hǎo, xièxie!',
        vietnamese: 'Tôi rất khỏe, cảm ơn!',
        difficulty: 'medium',
        pronunciationTipVi: '"hěn hǎo" đọc thành "hén hǎo", "xièxie" âm thứ hai là thanh nhẹ.',
      },
      {
        id: 'hsk1-01-sd4',
        hanzi: '再见！',
        pinyin: 'Zàijiàn!',
        vietnamese: 'Tạm biệt / Hẹn gặp lại!',
        difficulty: 'easy',
        pronunciationTipVi: 'Cả hai chữ đều mang thanh 4 giáng mạnh dứt khoát: Zài-jiàn.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk1-01-ss1',
        hanzi: '你好！我很好，谢谢！',
        pinyin: 'Nǐ hǎo! Wǒ hěn hǎo, xièxie!',
        vietnamese: 'Xin chào! Tôi rất khỏe, cảm ơn!',
        focusToneSandhi: 'Biến điệu thanh 3 trong "nǐ hǎo" và "hěn hǎo"',
      },
      {
        id: 'hsk1-01-ss2',
        hanzi: '我也很好，明天见，再见！',
        pinyin: 'Wǒ yě hěn hǎo, míngtiān jiàn, zàijiàn!',
        vietnamese: 'Tôi cũng rất khỏe, ngày mai gặp lại, tạm biệt!',
        focusToneSandhi: 'Nối thanh nhẹ và nhịp điệu ngắt nghỉ tự nhiên',
      },
    ],
    vocabulary: [
      {
        id: 'hsk1-01-v1',
        hanzi: '你',
        pinyin: 'nǐ',
        meaningVi: 'Bạn, cậu, anh, chị (ngôi thứ hai số ít)',
        radical: '亻 (Nhân đứng - biểu thị con người)',
        radicalMeaningVi: 'Bộ nhân đứng liên quan đến con người',
        strokeCount: 7,
        exampleSentence: '你好，很高兴认识你！',
        examplePinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ!',
        exampleVi: 'Chào bạn, rất vui được quen bạn!',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-01-v2',
        hanzi: '好',
        pinyin: 'hǎo',
        meaningVi: 'Tốt, đẹp, khỏe, lành',
        radical: '女 (Nữ - phụ nữ)',
        radicalMeaningVi: 'Bộ Nữ ghép với bộ Tử (con) thành chữ Tốt lành',
        strokeCount: 6,
        exampleSentence: '今天天气很好。',
        examplePinyin: 'Jīntiān tiānqì hěn hǎo.',
        exampleVi: 'Hôm nay thời tiết rất tốt.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-01-v3',
        hanzi: '我',
        pinyin: 'wǒ',
        meaningVi: 'Tôi, mình, tao (ngôi thứ nhất số ít)',
        radical: '戈 (Qua - ngọn giáo)',
        radicalMeaningVi: 'Bộ Qua là vũ khí bảo vệ bản thân',
        strokeCount: 7,
        exampleSentence: '我是越南人。',
        examplePinyin: 'Wǒ shì Yuènán rén.',
        exampleVi: 'Tôi là người Việt Nam.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-01-v4',
        hanzi: '很',
        pinyin: 'hěn',
        meaningVi: 'Rất (phó từ chỉ mức độ)',
        radical: '彳 (Xích - bước chân trái)',
        radicalMeaningVi: 'Bộ Xích liên quan đến hành động đi lại',
        strokeCount: 9,
        exampleSentence: '他很高兴。',
        examplePinyin: 'Tā hěn gāoxìng.',
        exampleVi: 'Anh ấy rất vui mừng.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-01-v5',
        hanzi: '吗',
        pinyin: 'ma',
        meaningVi: 'Không? Phải không? (trợ từ nghi vấn)',
        radical: '口 (Khẩu - cái miệng)',
        radicalMeaningVi: 'Bộ Khẩu dùng cho các từ phát âm bằng miệng',
        strokeCount: 6,
        exampleSentence: '你好吗？',
        examplePinyin: 'Nǐ hǎo ma?',
        exampleVi: 'Bạn khỏe không?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-01-v6',
        hanzi: '谢谢',
        pinyin: 'xièxie',
        meaningVi: 'Cảm ơn',
        radical: '讠 (Ngôn - lời nói)',
        radicalMeaningVi: 'Bộ Ngôn biểu thị lời nói tạ ơn',
        strokeCount: 12,
        exampleSentence: '谢谢你的帮助！',
        examplePinyin: 'Xièxie nǐ de bāngzhù!',
        exampleVi: 'Cảm ơn sự giúp đỡ của bạn!',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-01-v7',
        hanzi: '再见',
        pinyin: 'zàijiàn',
        meaningVi: 'Tạm biệt, hẹn gặp lại',
        radical: '见 (Kiến - trông thấy, gặp gỡ)',
        radicalMeaningVi: 'Bộ Kiến biểu thị hành động gặp gỡ',
        strokeCount: 6,
        exampleSentence: '朋友们，再见！',
        examplePinyin: 'Péngyoumen, zàijiàn!',
        exampleVi: 'Các bạn ơi, tạm biệt nhé!',
        hskLevel: 'HSK1',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk1-01-g1',
        title: 'Câu hỏi Yes/No với trợ từ nghi vấn "吗" (ma)',
        pattern: 'Câu khẳng định + 吗？',
        explanationVi:
          'Để chuyển một câu trần thuật thành câu hỏi có - không, ta chỉ việc thêm trợ từ thanh nhẹ "吗" vào cuối câu mà không cần đảo trật tự từ.',
        examples: [
          { hanzi: '你好。 -> 你好吗？', pinyin: 'Nǐ hǎo. -> Nǐ hǎo ma?', vietnamese: 'Bạn tốt. -> Bạn có khỏe không?' },
          { hanzi: '他是老师吗？', pinyin: 'Tā shì lǎoshī ma?', vietnamese: 'Anh ấy có phải là giáo viên không?' },
        ],
      },
      {
        id: 'hsk1-01-g2',
        title: 'Câu vị ngữ tính từ đi kèm phó từ "很" (hěn)',
        pattern: 'Chủ ngữ + 很 + Tính từ',
        explanationVi:
          'Trong tiếng Trung, tính từ có thể trực tiếp làm vị ngữ mà không cần động từ "是". Phó từ "很" thường được đệm vào giữa để cân bằng ngữ điệu.',
        examples: [
          { hanzi: '我很好。', pinyin: 'Wǒ hěn hǎo.', vietnamese: 'Tôi (rất) khỏe.' },
          { hanzi: '今天很热。', pinyin: 'Jīntiān hěn rè.', vietnamese: 'Hôm nay trời rất nóng.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk1-01-q1',
        type: 'single_choice',
        prompt: 'Khi nghe câu: "我很好，谢谢！你呢？", người nói đang diễn đạt điều gì?',
        options: [
          'Tôi không khỏe, cảm ơn bạn!',
          'Tôi rất khỏe, cảm ơn! Còn bạn thì sao?',
          'Tạm biệt, hẹn ngày mai gặp lại nhé!',
          'Bạn tên là gì?',
        ],
        correctAnswer: 1,
        explanation: '"我很好" nghĩa là Tôi rất khỏe, "谢谢" là cảm ơn, "你呢？" là Còn bạn thì sao.',
      },
      {
        id: 'hsk1-01-q2',
        type: 'ordering',
        prompt: 'Sắp xếp các từ ngữ sau thành câu chào hỏi hoàn chỉnh:',
        orderingTokens: ['谢谢', '我', '，', '很好', '！'],
        correctAnswer: ['我', '很好', '，', '谢谢', '！'],
        explanation: 'Trật tự câu: Chủ ngữ (我) + Vị ngữ (很好) + Lời cảm ơn (谢谢).',
      },
      {
        id: 'hsk1-01-q3',
        type: 'speaking_response',
        prompt: 'Khi người bạn Trung Quốc hỏi bạn "你好吗？", hãy phát âm phản xạ trả lời: "Tôi rất khỏe" bằng tiếng Hán.',
        targetSpeech: '我很好',
        pinyin: 'Wǒ hěn hǎo',
        explanation: 'Phát âm chuẩn: Wǒ hén hǎo (chú ý biến điệu 3+3 thành 2+3 ở từ 很好).',
        correctAnswer: '我很好',
      },
    ],
  },

  {
    id: 'hsk1-lesson-02',
    lessonNumber: 2,
    level: 'HSK1',
    title: 'Bài 2: Tên & Quốc tịch',
    subtitleVi: '你叫什么名字, 我是中国人/我是越南人',
    topicIcon: 'Globe',
    imageUrl: '/images/lessons/hsk1_lesson02_nationality.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Hỏi tên, giới thiệu danh xưng và trao đổi quốc tịch bằng mẫu câu chữ 是 và đại từ nghi vấn 什么, 哪.',
    dialogue: [
      {
        id: 'hsk1-02-d1',
        speaker: 'A',
        speakerName: '李明 (Li Ming - Người Trung Quốc)',
        hanzi: '你好！请问你叫什么名字？',
        pinyin: 'Nǐ hǎo! Qǐngwèn nǐ jiào shénme míngzi?',
        vietnamese: 'Xin chào! Xin hỏi bạn tên là gì?',
      },
      {
        id: 'hsk1-02-d2',
        speaker: 'B',
        speakerName: '阮梅 (Nguyen Mai - Người Việt Nam)',
        hanzi: '你好！我叫阮梅。你叫什么名字？',
        pinyin: 'Nǐ hǎo! Wǒ jiào Ruǎn Méi. Nǐ jiào shénme míngzi?',
        vietnamese: 'Chào bạn! Tôi tên là Nguyễn Mai. Còn bạn tên gì?',
      },
      {
        id: 'hsk1-02-d3',
        speaker: 'A',
        speakerName: '李明 (Li Ming)',
        hanzi: '我叫李明。你是哪国人？',
        pinyin: 'Wǒ jiào Lǐ Míng. Nǐ shì nǎ guó rén?',
        vietnamese: 'Tôi tên Lý Minh. Bạn là người nước nào?',
      },
      {
        id: 'hsk1-02-d4',
        speaker: 'B',
        speakerName: '阮梅 (Nguyen Mai)',
        hanzi: '我是越南人。你是中国人吗？',
        pinyin: 'Wǒ shì Yuènán rén. Nǐ shì Zhōngguó rén ma?',
        vietnamese: 'Tôi là người Việt Nam. Bạn có phải là người Trung Quốc không?',
      },
      {
        id: 'hsk1-02-d5',
        speaker: 'A',
        speakerName: '李明 (Li Ming)',
        hanzi: '是的，我是中国人。很高兴认识你！',
        pinyin: 'Shì de, wǒ shì Zhōngguó rén. Hěn gāoxìng rènshi nǐ!',
        vietnamese: 'Đúng vậy, tôi là người Trung Quốc. Rất vui mừng được quen biết bạn!',
      },
      {
        id: 'hsk1-02-d6',
        speaker: 'B',
        speakerName: '阮梅 (Nguyen Mai)',
        hanzi: '认识你我也很高兴！',
        pinyin: 'Rènshi nǐ wǒ yě hěn gāoxìng!',
        vietnamese: 'Quen biết bạn tôi cũng vô cùng vui!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk1-02-sd1',
        hanzi: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzi?',
        vietnamese: 'Bạn tên là gì?',
        difficulty: 'medium',
        pronunciationTipVi: '"shénme" thanh 2 + thanh nhẹ, "míngzi" kết thúc bằng thanh nhẹ zi.',
      },
      {
        id: 'hsk1-02-sd2',
        hanzi: '我是越南人。',
        pinyin: 'Wǒ shì Yuènán rén.',
        vietnamese: 'Tôi là người Việt Nam.',
        difficulty: 'easy',
        pronunciationTipVi: '"shì" thanh 4 giáng mạnh, "Yuènán" thanh 4 + thanh 2.',
      },
      {
        id: 'hsk1-02-sd3',
        hanzi: '你是哪国人？',
        pinyin: 'Nǐ shì nǎ guó rén?',
        vietnamese: 'Bạn là người nước nào?',
        difficulty: 'medium',
        pronunciationTipVi: '"nǎ" thanh 3 sâu lắng, "guó rén" hai thanh 2 đi liền vút lên.',
      },
      {
        id: 'hsk1-02-sd4',
        hanzi: '很高兴认识你！',
        pinyin: 'Hěn gāoxìng rènshi nǐ!',
        vietnamese: 'Rất vui được quen biết bạn!',
        difficulty: 'hard',
        pronunciationTipVi: '"rènshi" có "shi" đọc nhẹ thanh khinh âm.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk1-02-ss1',
        hanzi: '我叫阮梅，我是越南人。',
        pinyin: 'Wǒ jiào Ruǎn Méi, wǒ shì Yuènán rén.',
        vietnamese: 'Tôi tên là Nguyễn Mai, tôi là người Việt Nam.',
        focusToneSandhi: 'Trọng âm thanh 4 của "jiào" và "shì"',
      },
      {
        id: 'hsk1-02-ss2',
        hanzi: '很高兴认识你！认识你我也很高兴！',
        pinyin: 'Hěn gāoxìng rènshi nǐ! Rènshi nǐ wǒ yě hěn gāoxìng!',
        vietnamese: 'Rất vui được quen bạn! Quen bạn tôi cũng rất vui mừng!',
        focusToneSandhi: 'Phản xạ đảo ngữ đáp lễ đối kháng',
      },
    ],
    vocabulary: [
      {
        id: 'hsk1-02-v1',
        hanzi: '叫',
        pinyin: 'jiào',
        meaningVi: 'Tên là, gọi là',
        radical: '口 (Khẩu - cái miệng)',
        radicalMeaningVi: 'Dùng miệng để cất tiếng gọi',
        strokeCount: 5,
        exampleSentence: '你叫什么名字？',
        examplePinyin: 'Nǐ jiào shénme míngzi?',
        exampleVi: 'Bạn tên là gì?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-02-v2',
        hanzi: '什么',
        pinyin: 'shénme',
        meaningVi: 'Cái gì, gì',
        radical: '亻 (Nhân đứng)',
        radicalMeaningVi: 'Đại từ nghi vấn phổ biến',
        strokeCount: 4,
        exampleSentence: '这是什么？',
        examplePinyin: 'Zhè shì shénme?',
        exampleVi: 'Đây là cái gì?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-02-v3',
        hanzi: '名字',
        pinyin: 'míngzi',
        meaningVi: 'Tên, danh xưng',
        radical: '夕 (Tịch - buổi chiều)',
        radicalMeaningVi: 'Chữ Danh gồm bộ Tịch và Khẩu',
        strokeCount: 6,
        exampleSentence: '他的名字很好听。',
        examplePinyin: 'Tā de míngzi hěn hǎotīng.',
        exampleVi: 'Tên của anh ấy nghe rất hay.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-02-v4',
        hanzi: '是',
        pinyin: 'shì',
        meaningVi: 'Là, đúng, phải',
        radical: '日 (Nhật - mặt trời)',
        radicalMeaningVi: 'Bộ Nhật tượng trưng cho sự chân lý ngay thẳng',
        strokeCount: 9,
        exampleSentence: '我是学生。',
        examplePinyin: 'Wǒ shì xuésheng.',
        exampleVi: 'Tôi là học sinh.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-02-v5',
        hanzi: '哪',
        pinyin: 'nǎ',
        meaningVi: 'Nào, đâu (đại từ nghi vấn)',
        radical: '口 (Khẩu - cái miệng)',
        radicalMeaningVi: 'Bộ Khẩu biểu thị ý tra vấn',
        strokeCount: 9,
        exampleSentence: '哪本书是你的？',
        examplePinyin: 'Nǎ běn shū shì nǐ de?',
        exampleVi: 'Quyển sách nào là của bạn?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-02-v6',
        hanzi: '国',
        pinyin: 'guó',
        meaningVi: 'Quốc gia, đất nước',
        radical: '囗 (Vi - bao quanh)',
        radicalMeaningVi: 'Bộ Vi bao bọc lấy ngọc ngà lãnh thổ',
        strokeCount: 8,
        exampleSentence: '中国很大。',
        examplePinyin: 'Zhōngguó hěn dà.',
        exampleVi: 'Trung Quốc rất lớn.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-02-v7',
        hanzi: '人',
        pinyin: 'rén',
        meaningVi: 'Người, con người',
        radical: '人 (Nhân - người)',
        radicalMeaningVi: 'Hình tượng con người đứng sải chân',
        strokeCount: 2,
        exampleSentence: '这里有很多外国人。',
        examplePinyin: 'Zhèlǐ yǒu hěn duō wàiguó rén.',
        exampleVi: 'Ở đây có rất nhiều người nước ngoài.',
        hskLevel: 'HSK1',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk1-02-g1',
        title: 'Câu khẳng định và phủ định với chữ "是" (shì)',
        pattern: 'Khẳng định: A + 是 + B | Phủ định: A + 不是 + B',
        explanationVi:
          'Động từ phán đoán "是" tương đương với "là" trong tiếng Việt. Phủ định dùng "不是" (chú ý chữ "不" biến điệu thành bú trước shì).',
        examples: [
          { hanzi: '我是越南人。', pinyin: 'Wǒ shì Yuènán rén.', vietnamese: 'Tôi là người Việt Nam.' },
          { hanzi: '他不是中国人。', pinyin: 'Tā bú shì Zhōngguó rén.', vietnamese: 'Anh ấy không phải người Trung Quốc.' },
        ],
      },
      {
        id: 'hsk1-02-g2',
        title: 'Hỏi quốc tịch với cấu trúc "哪国人" (nǎ guó rén)',
        pattern: 'Chủ ngữ + 是 + 哪国人？',
        explanationVi:
          'Để hỏi ai đó đến từ quốc gia nào, ta dùng cấu trúc "哪" (nào) + danh từ "国" (nước) + "人" (người). Trả lời: Thay "哪国" bằng tên quốc gia.',
        examples: [
          { hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', vietnamese: 'Bạn là người nước nào?' },
          { hanzi: '我是中国人。', pinyin: 'Wǒ shì Zhōngguó rén.', vietnamese: 'Tôi là người Trung Quốc.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk1-02-q1',
        type: 'single_choice',
        prompt: 'Nếu muốn hỏi một người bạn mới gặp tên là gì, bạn chọn câu nào?',
        options: [
          '你是哪国人？',
          '你叫什么名字？',
          '你吃了吗？',
          '你家有几口人？',
        ],
        correctAnswer: 1,
        explanation: '"你叫什么名字？" là câu hỏi chuẩn xác để hỏi họ tên của đối phương.',
      },
      {
        id: 'hsk1-02-q2',
        type: 'ordering',
        prompt: 'Sắp xếp các từ sau thành câu hoàn chỉnh:',
        orderingTokens: ['中国人', '是', '他', '不'],
        correctAnswer: ['他', '不', '是', '中国人'],
        explanation: 'Trật tự câu phủ định chữ 是: Chủ ngữ (他) + 不是 + Tân ngữ (中国人).',
      },
      {
        id: 'hsk1-02-q3',
        type: 'speaking_response',
        prompt: 'Hãy dùng micro nói câu: "Tôi là người Việt Nam" bằng tiếng Trung.',
        targetSpeech: '我是越南人',
        pinyin: 'Wǒ shì Yuènán rén',
        explanation: 'Phát âm chuẩn: Wǒ shì Yuènán rén.',
        correctAnswer: '我是越南人',
      },
    ],
  },

  {
    id: 'hsk1-lesson-03',
    lessonNumber: 3,
    level: 'HSK1',
    title: 'Bài 3: Gia đình & Đại từ nhân xưng',
    subtitleVi: '爸爸, 妈妈, 哥哥, 姐姐, 几口人',
    topicIcon: 'Users',
    imageUrl: '/images/lessons/hsk1_lesson03_family.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Học cách xưng hô các thành viên gia đình, lượng từ 口 và động từ sở hữu 有 / 没有.',
    dialogue: [
      {
        id: 'hsk1-03-d1',
        speaker: 'A',
        speakerName: '小明 (Xiao Ming)',
        hanzi: '安娜，你家有几口人？',
        pinyin: 'Ānnà, nǐ jiā yǒu jǐ kǒu rén?',
        vietnamese: 'Anna ơi, nhà bạn có mấy người vậy?',
      },
      {
        id: 'hsk1-03-d2',
        speaker: 'B',
        speakerName: '安娜 (Anna)',
        hanzi: '我家有四口人：爸爸、妈妈、一个哥哥和我。你家呢？',
        pinyin: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, yí gè gēge hé wǒ. Nǐ jiā ne?',
        vietnamese: 'Nhà tôi có bốn người: bố, mẹ, một anh trai và tôi. Nhà bạn thì sao?',
      },
      {
        id: 'hsk1-03-d3',
        speaker: 'A',
        speakerName: '小明 (Xiao Ming)',
        hanzi: '我家有五口人：爸爸、妈妈、姐姐、妹妹和我。',
        pinyin: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, jiějie, mèimei hé wǒ.',
        vietnamese: 'Nhà mình có năm người: bố, mẹ, chị gái, em gái và mình.',
      },
      {
        id: 'hsk1-03-d4',
        speaker: 'B',
        speakerName: '安娜 (Anna)',
        hanzi: '你有弟弟吗？',
        pinyin: 'Nǐ yǒu dìdi ma?',
        vietnamese: 'Bạn có em trai không?',
      },
      {
        id: 'hsk1-03-d5',
        speaker: 'A',
        speakerName: '小明 (Xiao Ming)',
        hanzi: '我没有弟弟。',
        pinyin: 'Wǒ méiyǒu dìdi.',
        vietnamese: 'Tôi không có em trai.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk1-03-sd1',
        hanzi: '你家有几口人？',
        pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?',
        vietnamese: 'Nhà bạn có mấy người?',
        difficulty: 'medium',
        pronunciationTipVi: '"jǐ kǒu" biến điệu thanh 3 thành "jí kǒu".',
      },
      {
        id: 'hsk1-03-sd2',
        hanzi: '爸爸、妈妈、哥哥和我。',
        pinyin: 'Bàba, māma, gēge hé wǒ.',
        vietnamese: 'Bố, mẹ, anh trai và tôi.',
        difficulty: 'easy',
        pronunciationTipVi: 'Âm tiết thứ 2 trong tên gọi thân nhân đều đọc khinh âm: bàba, māma, gēge.',
      },
      {
        id: 'hsk1-03-sd3',
        hanzi: '我没有弟弟。',
        pinyin: 'Wǒ méiyǒu dìdi.',
        vietnamese: 'Tôi không có em trai.',
        difficulty: 'easy',
        pronunciationTipVi: 'Phủ định của "yǒu" bắt buộc là "méi", không dùng "bù".',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk1-03-ss1',
        hanzi: '我家有四口人，一个哥哥和我。',
        pinyin: 'Wǒ jiā yǒu sì kǒu rén, yí gè gēge hé wǒ.',
        vietnamese: 'Nhà tôi có bốn người, một anh trai và tôi.',
        focusToneSandhi: 'Biến điệu "yí gè" (chữ 一 đọc yí trước thanh 4 gè)',
      },
    ],
    vocabulary: [
      {
        id: 'hsk1-03-v1',
        hanzi: '家',
        pinyin: 'jiā',
        meaningVi: 'Nhà, gia đình',
        radical: '宀 (Miên - mái nhà)',
        radicalMeaningVi: 'Mái nhà che chở',
        strokeCount: 10,
        exampleSentence: '我想家。',
        examplePinyin: 'Wǒ xiǎng jiā.',
        exampleVi: 'Tôi nhớ nhà.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-03-v2',
        hanzi: '有',
        pinyin: 'yǒu',
        meaningVi: 'Có (sở hữu hoặc tồn tại)',
        radical: '月 (Nguyệt - mặt trăng/thịt)',
        radicalMeaningVi: 'Nắm giữ nguồn thức ăn',
        strokeCount: 6,
        exampleSentence: '我有一个姐姐。',
        examplePinyin: 'Wǒ yǒu yí gè jiějie.',
        exampleVi: 'Tôi có một người chị gái.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-03-v3',
        hanzi: '几',
        pinyin: 'jǐ',
        meaningVi: 'Mấy (dưới 10)',
        radical: '几 (Kỷ - cái bàn nhỏ)',
        radicalMeaningVi: 'Đại từ nghi vấn hỏi số lượng nhỏ',
        strokeCount: 2,
        exampleSentence: '你有几个苹果？',
        examplePinyin: 'Nǐ yǒu jǐ gè píngguǒ?',
        exampleVi: 'Bạn có mấy quả táo?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-03-v4',
        hanzi: '口',
        pinyin: 'kǒu',
        meaningVi: 'Lượng từ nhân khẩu gia đình / miệng',
        radical: '口 (Khẩu - miệng)',
        radicalMeaningVi: 'Biểu thị miệng ăn trong gia đình',
        strokeCount: 3,
        exampleSentence: '三口人。',
        examplePinyin: 'Sān kǒu rén.',
        exampleVi: 'Ba nhân khẩu.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-03-v5',
        hanzi: '爸爸',
        pinyin: 'bàba',
        meaningVi: 'Bố, ba',
        radical: '父 (Phụ - người cha)',
        radicalMeaningVi: 'Hình tượng người cha cầm roi gia quy',
        strokeCount: 8,
        exampleSentence: '我爸爸是医生。',
        examplePinyin: 'Wǒ bàba shì yīshēng.',
        exampleVi: 'Bố tôi là bác sĩ.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-03-v6',
        hanzi: '妈妈',
        pinyin: 'māma',
        meaningVi: 'Mẹ, má',
        radical: '女 (Nữ - phụ nữ)',
        radicalMeaningVi: 'Người phụ nữ sinh thành',
        strokeCount: 6,
        exampleSentence: '我爱妈妈。',
        examplePinyin: 'Wǒ ài māma.',
        exampleVi: 'Tôi yêu mẹ.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-03-v7',
        hanzi: '没有',
        pinyin: 'méiyǒu',
        meaningVi: 'Không có',
        radical: '氵 (Ba chấm thủy)',
        radicalMeaningVi: 'Từ phủ định duy nhất đi cùng hữu (有)',
        strokeCount: 7,
        exampleSentence: '我没有钱。',
        examplePinyin: 'Wǒ méiyǒu qián.',
        exampleVi: 'Tôi không có tiền.',
        hskLevel: 'HSK1',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk1-03-g1',
        title: 'Động từ "有" và dạng phủ định "没有"',
        pattern: 'Chủ ngữ + 有 / 没有 + Tân ngữ',
        explanationVi:
          'Trong tiếng Trung, động từ "有" biểu thị sở hữu hoặc tồn tại. Phủ định của nó tuyệt đối KHÔNG dùng "不" mà bắt buộc dùng "没有" (hoặc nói tắt là "没").',
        examples: [
          { hanzi: '我有哥哥。', pinyin: 'Wǒ yǒu gēge.', vietnamese: 'Tôi có anh trai.' },
          { hanzi: '我没有弟弟。', pinyin: 'Wǒ méiyǒu dìdi.', vietnamese: 'Tôi không có em trai (SAI: 我不有弟弟).' },
        ],
      },
      {
        id: 'hsk1-03-g2',
        title: 'Lượng từ "口" (kǒu) vs "个" (gè)',
        pattern: 'Số từ + 口 / 个 + Danh từ',
        explanationVi:
          '"口" là lượng từ chuyên biệt dùng để đếm nhân khẩu trong gia đình (几口人, 四口人). Khi đếm số lượng người ngoài đời xã hội, ta dùng lượng từ thông dụng "个" (一个人, 两个朋友).',
        examples: [
          { hanzi: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?', vietnamese: 'Nhà bạn có mấy người?' },
          { hanzi: '我有三个朋友。', pinyin: 'Wǒ yǒu sān gè péngyou.', vietnamese: 'Tôi có ba người bạn.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk1-03-q1',
        type: 'single_choice',
        prompt: 'Lượng từ nào dùng để đếm số lượng thành viên trong gia đình?',
        options: ['个 (gè)', '口 (kǒu)', '张 (zhāng)', '本 (běn)'],
        correctAnswer: 1,
        explanation: '"口" (kǒu) là lượng từ chuyên dụng đếm nhân khẩu trong nhà (ví dụ: 四口人).',
      },
      {
        id: 'hsk1-03-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu diễn đạt: "Nhà tôi có bốn người"',
        orderingTokens: ['四口人', '家', '有', '我'],
        correctAnswer: ['我', '家', '有', '四口人'],
        explanation: 'Trật tự câu: Chủ ngữ (我家) + Động từ (有) + Lượng từ danh từ (四口人).',
      },
      {
        id: 'hsk1-03-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Tôi không có em trai" bằng tiếng Trung:',
        targetSpeech: '我没有弟弟',
        pinyin: 'Wǒ méiyǒu dìdi',
        explanation: 'Phát âm chuẩn: Wǒ méiyǒu dìdi (chú ý méi không dùng bù).',
        correctAnswer: '我没有弟弟',
      },
    ],
  },

  {
    id: 'hsk1-lesson-04',
    lessonNumber: 4,
    level: 'HSK1',
    title: 'Bài 4: Số đếm, Thời gian & Ngày tháng',
    subtitleVi: '一到十, 几点, 星期几, 今天/明天',
    topicIcon: 'Calendar',
    imageUrl: '/images/lessons/hsk1_lesson04_time_calendar.jpg',
    estimatedMinutes: 35,
    summaryVi: 'Làm chủ số đếm tiếng Hán từ 1 đến 100, quy tắc đọc giờ, phút, thứ ngày tháng theo thứ tự từ lớn đến bé.',
    dialogue: [
      {
        id: 'hsk1-04-d1',
        speaker: 'A',
        speakerName: '张伟 (Zhang Wei)',
        hanzi: '请问，现在几点了？',
        pinyin: 'Qǐngwèn, xiànzài jǐ diǎn le?',
        vietnamese: 'Xin hỏi, bây giờ là mấy giờ rồi?',
      },
      {
        id: 'hsk1-04-d2',
        speaker: 'B',
        speakerName: '黎明 (Li Ming)',
        hanzi: '现在上午九点三十分。',
        pinyin: 'Xiànzài shàngwǔ jiǔ diǎn sānshí fēn.',
        vietnamese: 'Bây giờ là 9 giờ 30 phút sáng.',
      },
      {
        id: 'hsk1-04-d3',
        speaker: 'A',
        speakerName: '张伟 (Zhang Wei)',
        hanzi: '今天是几月几号？',
        pinyin: 'Jīntiān shì jǐ yuè jǐ hào?',
        vietnamese: 'Hôm nay là ngày mấy tháng mấy?',
      },
      {
        id: 'hsk1-04-d4',
        speaker: 'B',
        speakerName: '黎明 (Li Ming)',
        hanzi: '今天是十月十五号，星期五。',
        pinyin: 'Jīntiān shì shí yuè shíwǔ hào, xīngqīwǔ.',
        vietnamese: 'Hôm nay là ngày 15 tháng 10, thứ Sáu.',
      },
      {
        id: 'hsk1-04-d5',
        speaker: 'A',
        speakerName: '张伟 (Zhang Wei)',
        hanzi: '明天星期六，你有时间吗？',
        pinyin: 'Míngtiān xīngqīliù, nǐ yǒu shíjiān ma?',
        vietnamese: 'Ngày mai thứ Bảy, bạn có thời gian rảnh không?',
      },
      {
        id: 'hsk1-04-d6',
        speaker: 'B',
        speakerName: '黎明 (Li Ming)',
        hanzi: '明天我有时间，我们一起喝咖啡吧！',
        pinyin: 'Míngtiān wǒ yǒu shíjiān, wǒmen yìqǐ hē kāfēi ba!',
        vietnamese: 'Ngày mai mình rảnh, tụi mình cùng đi uống cà phê nhé!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk1-04-sd1',
        hanzi: '现在九点半。',
        pinyin: 'Xiànzài jiǔ diǎn bàn.',
        vietnamese: 'Bây giờ là 9 giờ rưỡi.',
        difficulty: 'easy',
        pronunciationTipVi: '"jiǔ diǎn" đọc thành "jiú diǎn" (biến âm 3+3).',
      },
      {
        id: 'hsk1-04-sd2',
        hanzi: '今天星期五。',
        pinyin: 'Jīntiān xīngqīwǔ.',
        vietnamese: 'Hôm nay là thứ Sáu.',
        difficulty: 'easy',
        pronunciationTipVi: '"xīngqī" đều mang thanh 1 cao bằng.',
      },
      {
        id: 'hsk1-04-sd3',
        hanzi: '十月十五号。',
        pinyin: 'Shí yuè shíwǔ hào.',
        vietnamese: 'Ngày 15 tháng 10.',
        difficulty: 'medium',
        pronunciationTipVi: 'Thứ tự tiếng Hán là Tháng (月) trước, Ngày (号) sau.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk1-04-ss1',
        hanzi: '现在上午九点三十分，今天是十月十五号。',
        pinyin: 'Xiànzài shàngwǔ jiǔ diǎn sānshí fēn, jīntiān shì shí yuè shíwǔ hào.',
        vietnamese: 'Bây giờ là 9 giờ 30 phút sáng, hôm nay là ngày 15 tháng 10.',
        focusToneSandhi: 'Trật tự thời gian từ lớn đến nhỏ',
      },
    ],
    vocabulary: [
      {
        id: 'hsk1-04-v1',
        hanzi: '现在',
        pinyin: 'xiànzài',
        meaningVi: 'Bây giờ, hiện tại',
        radical: '王 (Vương/Ngọc - viên ngọc quý)',
        radicalMeaningVi: 'Thời gian quý như ngọc',
        strokeCount: 8,
        exampleSentence: '现在几点？',
        examplePinyin: 'Xiànzài jǐ diǎn?',
        exampleVi: 'Bây giờ là mấy giờ?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v2',
        hanzi: '点',
        pinyin: 'diǎn',
        meaningVi: 'Giờ (thời gian điểm)',
        radical: '灬 (Hỏa - ngọn lửa)',
        radicalMeaningVi: 'Chỉ chấm giọt điểm',
        strokeCount: 9,
        exampleSentence: '上午八点。',
        examplePinyin: 'Shàngwǔ bā diǎn.',
        exampleVi: '8 giờ sáng.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v3',
        hanzi: '分',
        pinyin: 'fēn',
        meaningVi: 'Phút / chia nhỏ',
        radical: '刀 (Đao - con dao chia nhỏ)',
        radicalMeaningVi: 'Phân chia từng khắc thời gian',
        strokeCount: 4,
        exampleSentence: '十分钟。',
        examplePinyin: 'Shí fēnzhōng.',
        exampleVi: 'Mười phút.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v4',
        hanzi: '今天',
        pinyin: 'jīntiān',
        meaningVi: 'Hôm nay',
        radical: '人 (Nhân - người)',
        radicalMeaningVi: 'Chữ Kim chỉ hiện tại',
        strokeCount: 4,
        exampleSentence: '今天星期几？',
        examplePinyin: 'Jīntiān xīngqī jǐ?',
        exampleVi: 'Hôm nay là thứ mấy?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v5',
        hanzi: '明天',
        pinyin: 'míngtiān',
        meaningVi: 'Ngày mai',
        radical: '日 (Nhật - mặt trời ghép với nguyệt thành Minh)',
        radicalMeaningVi: 'Bình minh ngày mai tươi sáng',
        strokeCount: 8,
        exampleSentence: '明天见！',
        examplePinyin: 'Míngtiān jiàn!',
        exampleVi: 'Ngày mai gặp lại nhé!',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v6',
        hanzi: '月',
        pinyin: 'yuè',
        meaningVi: 'Tháng, mặt trăng',
        radical: '月 (Nguyệt)',
        radicalMeaningVi: 'Chu kỳ mặt trăng tròn khuyết',
        strokeCount: 4,
        exampleSentence: '一月是一年的开始。',
        examplePinyin: 'Yī yuè shì yì nián de kāishǐ.',
        exampleVi: 'Tháng một là khởi đầu một năm.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v7',
        hanzi: '号',
        pinyin: 'hào',
        meaningVi: 'Ngày (khẩu ngữ), số hiệu',
        radical: '口 (Khẩu - miệng)',
        radicalMeaningVi: 'Được gọi tên bằng số',
        strokeCount: 5,
        exampleSentence: '今天是五号。',
        examplePinyin: 'Jīntiān shì wǔ hào.',
        exampleVi: 'Hôm nay là mùng 5.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-04-v8',
        hanzi: '星期',
        pinyin: 'xīngqī',
        meaningVi: 'Tuần lễ, thứ trong tuần',
        radical: '日 (Nhật - kỳ hạn theo nhật nguyệt)',
        radicalMeaningVi: 'Chu kỳ 7 ngày tuần lễ',
        strokeCount: 9,
        exampleSentence: '星期天我不上班。',
        examplePinyin: 'Xīngqītiān wǒ bù shàngbān.',
        exampleVi: 'Chủ nhật tôi không đi làm.',
        hskLevel: 'HSK1',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk1-04-g1',
        title: 'Quy tắc diễn đạt thời gian trong tiếng Trung: Lớn trước, Nhỏ sau',
        pattern: 'Năm (年) -> Tháng (月) -> Ngày (号/日) -> Thứ (星期) -> Buổi (上午/下午) -> Giờ (点) -> Phút (分)',
        explanationVi:
          'Khác hoàn toàn với tiếng Việt (ngày trước tháng sau), tư duy tiếng Trung luôn đặt đơn vị thời gian lớn lên đầu và thu hẹp dần.',
        examples: [
          {
            hanzi: '2026年10月15号上午9点30分',
            pinyin: 'Èr líng èr liù nián shí yuè shíwǔ hào shàngwǔ jiǔ diǎn sānshí fēn',
            vietnamese: '9 giờ 30 phút sáng ngày 15 tháng 10 năm 2026',
          },
        ],
      },
      {
        id: 'hsk1-04-g2',
        title: 'Cách gọi các thứ trong tuần',
        pattern: '星期 + Số (1-6) | Chủ nhật: 星期天 / 星期日',
        explanationVi:
          'Thứ Hai là 星期一 (xīngqīyī), Thứ Ba là 星期二 (xīngqī\'èr)... Thứ Bảy là 星期六 (xīngqīliù). Riêng Chủ Nhật là 星期日 (văn viết) hoặc 星期天 (văn nói). Chú ý lùi 1 số so với tiếng Việt!',
        examples: [
          { hanzi: '星期一', pinyin: 'xīngqīyī', vietnamese: 'Thứ Hai (không phải thứ Nhất)' },
          { hanzi: '星期五', pinyin: 'xīngqīwǔ', vietnamese: 'Thứ Sáu' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk1-04-q1',
        type: 'single_choice',
        prompt: 'Trong tiếng Trung, ngày "Thứ Sáu" được gọi là gì?',
        options: ['星期四', '星期五', '星期六', '星期天'],
        correctAnswer: 1,
        explanation: 'Thứ Sáu trong tiếng Trung lấy 6 trừ 1 thành 星期五 (xīngqīwǔ).',
      },
      {
        id: 'hsk1-04-q2',
        type: 'ordering',
        prompt: 'Sắp xếp cụm từ thời gian theo đúng quy tắc tiếng Trung: "Buổi sáng 8 giờ ngày mai"',
        orderingTokens: ['八点', '明天', '上午'],
        correctAnswer: ['明天', '上午', '八点'],
        explanation: 'Quy tắc lớn trước nhỏ sau: Ngày (明天) -> Buổi (上午) -> Giờ (八点).',
      },
      {
        id: 'hsk1-04-q3',
        type: 'speaking_response',
        prompt: 'Hãy nói: "Bây giờ là mấy giờ rồi?" bằng tiếng Hán:',
        targetSpeech: '现在几点了',
        pinyin: 'Xiànzài jǐ diǎn le',
        explanation: 'Phát âm chuẩn: Xiànzài jǐ diǎn le?',
        correctAnswer: '现在几点了',
      },
    ],
  },

  {
    id: 'hsk1-lesson-05',
    lessonNumber: 5,
    level: 'HSK1',
    title: 'Bài 5: Mua sắm cơ bản & Tiền tệ',
    subtitleVi: '多少钱, 太贵了, 这个/那个',
    topicIcon: 'ShoppingBag',
    imageUrl: '/images/lessons/hsk1_lesson05_shopping_market.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Hỏi giá cả, chỉ định đồ vật bằng 这个 / 那个, diễn đạt đắt rẻ và cấu trúc cảm thán 太...了.',
    dialogue: [
      {
        id: 'hsk1-05-d1',
        speaker: 'A',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '老板，这个苹果多少钱一斤？',
        pinyin: 'Lǎobǎn, zhège píngguǒ duōshao qián yì jīn?',
        vietnamese: 'Ông chủ ơi, táo này bao nhiêu tiền một cân (500g)?',
      },
      {
        id: 'hsk1-05-d2',
        speaker: 'B',
        speakerName: '老板 (Chủ sạp)',
        hanzi: '五块钱一斤。很甜的！',
        pinyin: 'Wǔ kuài qián yì jīn. Hěn tián de!',
        vietnamese: 'Năm tệ một cân. Ngọt lắm đó!',
      },
      {
        id: 'hsk1-05-d3',
        speaker: 'A',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '太贵了！四块钱可以吗？',
        pinyin: 'Tài guì le! Sì kuài qián kěyǐ ma?',
        vietnamese: 'Đắt quá! Bốn tệ được không ạ?',
      },
      {
        id: 'hsk1-05-d4',
        speaker: 'B',
        speakerName: '老板 (Chủ sạp)',
        hanzi: '行，你要买几个？',
        pinyin: 'Xíng, nǐ yào mǎi jǐ gè?',
        vietnamese: 'Được rồi, bạn muốn mua mấy quả?',
      },
      {
        id: 'hsk1-05-d5',
        speaker: 'A',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '我要三个，那个西瓜也买一个。一共多少钱？',
        pinyin: 'Wǒ yào sān gè, nàge xīguā yě mǎi yí gè. Yígòng duōshao qián?',
        vietnamese: 'Tôi lấy ba quả, quả dưa hấu đằng kia cũng mua một quả. Tổng cộng bao nhiêu tiền?',
      },
      {
        id: 'hsk1-05-d6',
        speaker: 'B',
        speakerName: '老板 (Chủ sạp)',
        hanzi: '一共二十块钱。',
        pinyin: 'Yígòng èrshí kuài qián.',
        vietnamese: 'Tổng cộng hai mươi tệ.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk1-05-sd1',
        hanzi: '这个多少钱？',
        pinyin: 'Zhège duōshao qián?',
        vietnamese: 'Cái này bao nhiêu tiền?',
        difficulty: 'easy',
        pronunciationTipVi: '"duōshao" chữ shao đọc thanh nhẹ.',
      },
      {
        id: 'hsk1-05-sd2',
        hanzi: '太贵了！',
        pinyin: 'Tài guì le!',
        vietnamese: 'Đắt quá đi mất!',
        difficulty: 'easy',
        pronunciationTipVi: '"Tài" và "guì" đều là thanh 4, nhấn mạnh biểu cảm dứt khoát.',
      },
      {
        id: 'hsk1-05-sd3',
        hanzi: '便宜一点儿可以吗？',
        pinyin: 'Piányi yìdiǎnr kěyǐ ma?',
        vietnamese: 'Rẻ hơn một chút được không?',
        difficulty: 'medium',
        pronunciationTipVi: '"Piányi" đọc thanh nhẹ ở âm yi, uốn lưỡi "diǎnr".',
      },
      {
        id: 'hsk1-05-sd4',
        hanzi: '一共多少钱？',
        pinyin: 'Yígòng duōshao qián?',
        vietnamese: 'Tổng cộng hết bao nhiêu tiền?',
        difficulty: 'medium',
        pronunciationTipVi: '"Yígòng" có chữ 一 biến điệu thành yí trước thanh 4 gòng.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk1-05-ss1',
        hanzi: '老板，这个苹果太贵了，便宜一点儿吧！',
        pinyin: 'Lǎobǎn, zhège píngguǒ tài guì le, piányi yìdiǎnr ba!',
        vietnamese: 'Ông chủ ơi, táo này đắt quá, rẻ một chút đi mà!',
        focusToneSandhi: 'Ngữ điệu mặc cả và cảm thán tự nhiên',
      },
    ],
    vocabulary: [
      {
        id: 'hsk1-05-v1',
        hanzi: '买',
        pinyin: 'mǎi',
        meaningVi: 'Mua (thanh 3)',
        radical: '乙 (Ất)',
        radicalMeaningVi: 'Đầu móc đem về (phân biệt với 卖 mài - bán thanh 4)',
        strokeCount: 6,
        exampleSentence: '我想买衣服。',
        examplePinyin: 'Wǒ xiǎng mǎi yīfu.',
        exampleVi: 'Tôi muốn mua quần áo.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-05-v2',
        hanzi: '钱',
        pinyin: 'qián',
        meaningVi: 'Tiền, tiền tệ',
        radical: '钅 (Kim - kim loại)',
        radicalMeaningVi: 'Kim loại đúc thành tiền xu xưa',
        strokeCount: 10,
        exampleSentence: '你有多少钱？',
        examplePinyin: 'Nǐ yǒu duōshao qián?',
        exampleVi: 'Bạn có bao nhiêu tiền?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-05-v3',
        hanzi: '多少',
        pinyin: 'duōshao',
        meaningVi: 'Bao nhiêu (dùng hỏi số lượng bất kỳ)',
        radical: '夕 (Tịch)',
        radicalMeaningVi: 'Gồm chữ Đa (nhiều) ghép Thiểu (ít)',
        strokeCount: 6,
        exampleSentence: '这件衣服多少钱？',
        examplePinyin: 'Zhè jiàn yīfu duōshao qián?',
        exampleVi: 'Bộ quần áo này bao nhiêu tiền?',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-05-v4',
        hanzi: '块',
        pinyin: 'kuài',
        meaningVi: 'Đồng, tệ (khẩu ngữ = 元 yuán)',
        radical: '土 (Thổ - đất đá)',
        radicalMeaningVi: 'Chỉ khối, miếng, đồng tiền',
        strokeCount: 7,
        exampleSentence: '五块钱。',
        examplePinyin: 'Wǔ kuài qián.',
        exampleVi: 'Năm tệ.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-05-v5',
        hanzi: '太...了',
        pinyin: 'tài...le',
        meaningVi: 'Quá... rồi (cấu trúc cảm thán)',
        radical: '大 (Đại - to lớn)',
        radicalMeaningVi: 'Vượt quá mức bình thường',
        strokeCount: 4,
        exampleSentence: '太好了！',
        examplePinyin: 'Tài hǎo le!',
        exampleVi: 'Tốt quá rồi!',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-05-v6',
        hanzi: '贵',
        pinyin: 'guì',
        meaningVi: 'Đắt, quý báu',
        radical: '贝 (Bối - vỏ sò tiền xưa)',
        radicalMeaningVi: 'Bộ Bối đại diện cho của cải tài lộc',
        strokeCount: 9,
        exampleSentence: '这个太贵，那个便宜。',
        examplePinyin: 'Zhège tài guì, nàge piányi.',
        exampleVi: 'Cái này đắt quá, cái kia rẻ.',
        hskLevel: 'HSK1',
      },
      {
        id: 'hsk1-05-v7',
        hanzi: '一共',
        pinyin: 'yígòng',
        meaningVi: 'Tổng cộng',
        radical: '八 (Bát)',
        radicalMeaningVi: 'Cùng chung lại thành tổng',
        strokeCount: 6,
        exampleSentence: '一共五十块。',
        examplePinyin: 'Yígòng wǔshí kuài.',
        exampleVi: 'Tổng cộng năm mươi tệ.',
        hskLevel: 'HSK1',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk1-05-g1',
        title: 'Cấu trúc hỏi giá tiền với "多少钱" (duōshao qián)',
        pattern: 'Vật phẩm / Đơn vị + 多少钱？',
        explanationVi:
          'Để hỏi giá cả, đặt tên đồ vật ở trước rồi thêm "多少钱". Có thể thêm lượng từ chỉ khối lượng như "一斤多少钱" (Bao nhiêu tiền một cân).',
        examples: [
          { hanzi: '这个多少钱？', pinyin: 'Zhège duōshao qián?', vietnamese: 'Cái này bao nhiêu tiền?' },
          { hanzi: '苹果多少钱一斤？', pinyin: 'Píngguǒ duōshao qián yì jīn?', vietnamese: 'Táo bao nhiêu tiền một cân?' },
        ],
      },
      {
        id: 'hsk1-05-g2',
        title: 'Cấu trúc cảm thán "太 + Tính từ + 了"',
        pattern: '太 + Adj + 了',
        explanationVi:
          'Diễn đạt mức độ cao hoặc cảm xúc trầm trồ, chê bai, hài lòng.',
        examples: [
          { hanzi: '太贵了！', pinyin: 'Tài guì le!', vietnamese: 'Đắt quá đi mất!' },
          { hanzi: '太好吃了！', pinyin: 'Tài hǎochī le!', vietnamese: 'Ngon quá đi thôi!' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk1-05-q1',
        type: 'single_choice',
        prompt: 'Khi muốn kêu món đồ này quá đắt, bạn dùng cụm từ nào?',
        options: ['太贵了！', '太便宜了！', '多少钱？', '很好！'],
        correctAnswer: 0,
        explanation: '"太贵了！" (Tài guì le!) biểu thị đắt quá.',
      },
      {
        id: 'hsk1-05-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu hỏi: "Cái này tổng cộng bao nhiêu tiền?"',
        orderingTokens: ['多少钱', '这个', '一共', '？'],
        correctAnswer: ['这个', '一共', '多少钱', '？'],
        explanation: 'Trật tự câu: Chủ ngữ (这个) + Phó từ (一共) + Cụm hỏi (多少钱).',
      },
      {
        id: 'hsk1-05-q3',
        type: 'speaking_response',
        prompt: 'Hãy hỏi người bán hàng câu: "Bao nhiêu tiền một cân?" bằng tiếng Trung:',
        targetSpeech: '多少钱一斤',
        pinyin: 'Duōshao qián yì jīn',
        explanation: 'Phát âm chuẩn: Duōshao qián yì jīn (chú ý yì biến âm trước thanh 1 jīn).',
        correctAnswer: '多少钱一斤',
      },
    ],
  },
];

/* ==========================================================================
   4. HSK 2 - 5 LESSONS
   ========================================================================== */

export const HSK2_LESSONS: HSKLesson[] = [
  {
    id: 'hsk2-lesson-01',
    lessonNumber: 1,
    level: 'HSK2',
    title: 'Bài 1: Gọi món tại quán ăn',
    subtitleVi: '想吃什么, 菜单, 米饭, 炒菜, 结账',
    topicIcon: 'UtensilsCrossed',
    imageUrl: '/images/lessons/hsk2_lesson01_restaurant_menu.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Giao tiếp thực tế tại nhà hàng: xem thực đơn, gọi món xào, gọi đồ uống, thanh toán và dùng trợ từ ngữ khí 吧.',
    dialogue: [
      {
        id: 'hsk2-01-d1',
        speaker: 'A',
        speakerName: '服务员 (Nhân viên phục vụ)',
        hanzi: '欢迎光临！请问两位想吃点儿什么？',
        pinyin: 'Huānyíng guānglín! Qǐngwèn liǎng wèi xiǎng chī diǎnr shénme?',
        vietnamese: 'Chào mừng quý khách! Xin hỏi hai vị muốn dùng món gì ạ?',
      },
      {
        id: 'hsk2-01-d2',
        speaker: 'B',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '服务员，请给我们看一下菜单。这里有什么特色菜？',
        pinyin: 'Fúwùyuán, qǐng gěi wǒmen kàn yíxià càidān. Zhèlǐ yǒu shénme tèsè cài?',
        vietnamese: 'Phục vụ ơi, cho chúng tôi xem thực đơn một chút. Ở đây có món đặc sản gì thế?',
      },
      {
        id: 'hsk2-01-d3',
        speaker: 'A',
        speakerName: '服务员 (Phục vụ)',
        hanzi: '我们店的宫保鸡丁和炒青菜很受欢迎。',
        pinyin: 'Wǒmen diàn de gōngbǎo jīdīng hé chǎo qīngcài hěn shòu huānyíng.',
        vietnamese: 'Quán em có món gà xào Cung Bảo và rau xào thanh đạm được rất nhiều khách ưa chuộng.',
      },
      {
        id: 'hsk2-01-d4',
        speaker: 'B',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '好，我们要一份炒菜、两碗米饭，再来一壶热茶吧。',
        pinyin: 'Hǎo, wǒmen yào yí fèn chǎocài, liǎng wǎn mǐfàn, zài lái yì hú rè chá ba.',
        vietnamese: 'Được, chúng tôi gọi một đĩa rau xào, hai bát cơm trắng, và thêm một ấm trà nóng nhé.',
      },
      {
        id: 'hsk2-01-d5',
        speaker: 'B',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '服务员，我们吃好了，结账！',
        pinyin: 'Fúwùyuán, wǒmen chī hǎo le, jiézhàng!',
        vietnamese: 'Phục vụ ơi, chúng tôi dùng bữa xong rồi, tính tiền!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk2-01-sd1',
        hanzi: '请给我们看菜单。',
        pinyin: 'Qǐng gěi wǒmen kàn càidān.',
        vietnamese: 'Làm ơn cho chúng tôi xem thực đơn.',
        difficulty: 'easy',
        pronunciationTipVi: '"càidān" đều là các thanh trắc rõ ràng.',
      },
      {
        id: 'hsk2-01-sd2',
        hanzi: '你想吃什么？',
        pinyin: 'Nǐ xiǎng chī shénme?',
        vietnamese: 'Bạn muốn ăn gì?',
        difficulty: 'easy',
        pronunciationTipVi: '"Nǐ xiǎng" biến điệu 3+3 thành "Ní xiǎng", "chī" uốn lưỡi.',
      },
      {
        id: 'hsk2-01-sd3',
        hanzi: '服务员，买单 / 结账！',
        pinyin: 'Fúwùyuán, mǎidān / jiézhàng!',
        vietnamese: 'Phục vụ ơi, thanh toán hóa đơn!',
        difficulty: 'medium',
        pronunciationTipVi: '"jiézhàng" có âm zhàng giáng dứt khoát.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk2-01-ss1',
        hanzi: '我们要一份炒菜、两碗米饭，再来一壶热茶吧。',
        pinyin: 'Wǒmen yào yí fèn chǎocài, liǎng wǎn mǐfàn, zài lái yì hú rè chá ba.',
        vietnamese: 'Chúng tôi muốn một phần món xào, hai bát cơm trắng, thêm ấm trà nóng nhé.',
        focusToneSandhi: 'Luyện nối từ lượng từ danh từ: yí fèn, liǎng wǎn, yì hú',
      },
    ],
    vocabulary: [
      {
        id: 'hsk2-01-v1',
        hanzi: '菜单',
        pinyin: 'càidān',
        meaningVi: 'Thực đơn, menu',
        radical: '艹 (Thảo - cây cỏ)',
        radicalMeaningVi: 'Bộ Thảo liên quan đến thức ăn thực vật',
        strokeCount: 11,
        exampleSentence: '看菜单点菜。',
        examplePinyin: 'Kàn càidān diǎncài.',
        exampleVi: 'Xem thực đơn để gọi món.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-01-v2',
        hanzi: '米饭',
        pinyin: 'mǐfàn',
        meaningVi: 'Cơm trắng',
        radical: '米 (Mễ - hạt gạo)',
        radicalMeaningVi: 'Hạt gạo nấu chín thành cơm',
        strokeCount: 6,
        exampleSentence: '中国人喜欢吃米饭。',
        examplePinyin: 'Zhōngguó rén xǐhuan chī mǐfàn.',
        exampleVi: 'Người Trung Quốc thích ăn cơm trắng.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-01-v3',
        hanzi: '结账',
        pinyin: 'jiézhàng',
        meaningVi: 'Tính tiền, thanh toán hóa đơn',
        radical: '纟 (Mịch - sợi tơ buộc)',
        radicalMeaningVi: 'Kết sổ, đóng tài khoản tiền nong',
        strokeCount: 9,
        exampleSentence: '我们在前台结账。',
        examplePinyin: 'Wǒmen zài qiántái jiézhàng.',
        exampleVi: 'Chúng tôi thanh toán tại quầy thu ngân.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-01-v4',
        hanzi: '服务员',
        pinyin: 'fúwùyuán',
        meaningVi: 'Nhân viên phục vụ',
        radical: '亻 (Nhân đứng)',
        radicalMeaningVi: 'Người làm việc chăm sóc phục vụ',
        strokeCount: 7,
        exampleSentence: '请叫一下服务员。',
        examplePinyin: 'Qǐng jiào yíxià fúwùyuán.',
        exampleVi: 'Làm ơn gọi nhân viên phục vụ một chút.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-01-v5',
        hanzi: '炒',
        pinyin: 'chǎo',
        meaningVi: 'Xào, rang (chế biến nhiệt)',
        radical: '火 (Hỏa - ngọn lửa)',
        radicalMeaningVi: 'Dùng lửa để xào nấu',
        strokeCount: 8,
        exampleSentence: '炒饭很好吃。',
        examplePinyin: 'Chǎofàn hěn hǎochī.',
        exampleVi: 'Cơm rang rất ngon.',
        hskLevel: 'HSK2',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk2-01-g1',
        title: 'Động từ năng nguyện "想" (xiǎng) vs "要" (yào)',
        pattern: 'Chủ ngữ + 想 / 要 + Động từ',
        explanationVi:
          '"想" diễn đạt mong muốn, nguyện vọng trong tâm trí ("muốn / dự định"). "要" diễn đạt ý muốn kiên quyết hơn hoặc nhu cầu cấp thiết ("cần / muốn lấy"). Trong quán ăn, "想吃" là hỏi ý thích, "我们要" là chốt đặt món.',
        examples: [
          { hanzi: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', vietnamese: 'Bạn muốn ăn gì nào?' },
          { hanzi: '我们要两碗米饭。', pinyin: 'Wǒmen yào liǎng wǎn mǐfàn.', vietnamese: 'Cho chúng tôi lấy hai bát cơm.' },
        ],
      },
      {
        id: 'hsk2-01-g2',
        title: 'Trợ từ ngữ khí "吧" (ba) biểu thị đề xuất, thương lượng',
        pattern: 'Câu đề xuất + 吧。',
        explanationVi:
          'Đứng ở cuối câu để tạo sắc thái nhẹ nhàng, gợi ý hoặc rủ rê làm một việc gì đó một cách hòa nhã.',
        examples: [
          { hanzi: '来一壶热茶吧。', pinyin: 'Lái yì hú rè chá ba.', vietnamese: 'Lấy một ấm trà nóng nhé.' },
          { hanzi: '我们走吧！', pinyin: 'Wǒmen zǒu ba!', vietnamese: 'Tụi mình đi thôi nào!' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk2-01-q1',
        type: 'single_choice',
        prompt: 'Khi muốn gọi người phục vụ đến tính tiền, câu nào là tự nhiên nhất?',
        options: ['服务员，结账！', '服务员，看菜单！', '服务员，你是哪国人？', '服务员，今天星期几？'],
        correctAnswer: 0,
        explanation: '"服务员，结账！" là cách gọi thanh toán phổ biến nhất.',
      },
      {
        id: 'hsk2-01-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Cho chúng tôi xem thực đơn một chút"',
        orderingTokens: ['看菜单', '请', '给我们', '一下'],
        correctAnswer: ['请', '给我们', '看', '一下', '菜单'],
        explanation: 'Cấu trúc: Xin ai đó làm gì cho mình (请给我们看一下菜单).',
      },
      {
        id: 'hsk2-01-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Bạn muốn ăn món gì?" vào micro:',
        targetSpeech: '你想吃什么',
        pinyin: 'Nǐ xiǎng chī shénme',
        explanation: 'Phát âm chuẩn: Ní xiǎng chī shénme?',
        correctAnswer: '你想吃什么',
      },
    ],
  },

  {
    id: 'hsk2-lesson-02',
    lessonNumber: 2,
    level: 'HSK2',
    title: 'Bài 2: Hỏi đường & Phương tiện',
    subtitleVi: '去哪儿, 往右拐, 坐出租车, 地铁',
    topicIcon: 'Compass',
    imageUrl: '/images/lessons/hsk2_lesson02_transport_directions.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Hỏi đường, diễn đạt phương hướng (往 + hướng + rẽ/đi), lựa chọn phương tiện giao thông công cộng (tàu điện ngầm, taxi) và cấu trúc khoảng cách 离.',
    dialogue: [
      {
        id: 'hsk2-02-d1',
        speaker: 'A',
        speakerName: '游客 (Khách du lịch)',
        hanzi: '请问，去地铁站怎么走？',
        pinyin: 'Qǐngwèn, qù dìtiězhàn zěnme zǒu?',
        vietnamese: 'Xin hỏi, đi đến trạm tàu điện ngầm đi đường nào thế ạ?',
      },
      {
        id: 'hsk2-02-d2',
        speaker: 'B',
        speakerName: '路人 (Người qua đường)',
        hanzi: '一直往前走，到了十字路口往右拐就到了。',
        pinyin: 'Yìzhí wǎng qián zǒu, dào le shízì lùkǒu wǎng yòu guǎi jiù dào le.',
        vietnamese: 'Bạn cứ đi thẳng về phía trước, đến ngã tư thì rẽ phải là tới nơi.',
      },
      {
        id: 'hsk2-02-d3',
        speaker: 'A',
        speakerName: '游客 (Du khách)',
        hanzi: '这里离地铁站远不远？需要坐出租车吗？',
        pinyin: 'Zhèlǐ lí dìtiězhàn yuǎn bù yuǎn? Xūyào zuò chūzūchē ma?',
        vietnamese: 'Ở đây cách ga tàu điện ngầm có xa không? Có cần phải bắt taxi không ạ?',
      },
      {
        id: 'hsk2-02-d4',
        speaker: 'B',
        speakerName: '路人 (Người qua đường)',
        hanzi: '不远，走路只要五分钟，不用坐出租车。',
        pinyin: 'Bù yuǎn, zǒulù zhǐ yào wǔ fēnzhōng, bú yòng zuò chūzūchē.',
        vietnamese: 'Không xa đâu, đi bộ chỉ mất 5 phút thôi, không cần đi taxi đâu.',
      },
      {
        id: 'hsk2-02-d5',
        speaker: 'A',
        speakerName: '游客 (Du khách)',
        hanzi: '太谢谢您了！',
        pinyin: 'Tài xièxie nín le!',
        vietnamese: 'Cháu cảm ơn bác nhiều lắm ạ!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk2-02-sd1',
        hanzi: '去地铁站怎么走？',
        pinyin: 'Qù dìtiězhàn zěnme zǒu?',
        vietnamese: 'Đi đến ga tàu điện ngầm đi thế nào?',
        difficulty: 'medium',
        pronunciationTipVi: '"zěnme zǒu" cả hai chữ đều có phát âm đầu lưỡi.',
      },
      {
        id: 'hsk2-02-sd2',
        hanzi: '往右拐。',
        pinyin: 'Wǎng yòu guǎi.',
        vietnamese: 'Rẽ về phía tay phải.',
        difficulty: 'easy',
        pronunciationTipVi: '"guǎi" thanh 3 uốn lượn rõ ràng.',
      },
      {
        id: 'hsk2-02-sd3',
        hanzi: '坐出租车。',
        pinyin: 'Zuò chūzūchē.',
        vietnamese: 'Ngồi xe taxi.',
        difficulty: 'medium',
        pronunciationTipVi: '"chūzūchē" chữ zū đọc thẳng lưỡi z, chū và chē đọc uốn lưỡi ch.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk2-02-ss1',
        hanzi: '一直往前走，到了十字路口往右拐。',
        pinyin: 'Yìzhí wǎng qián zǒu, dào le shízì lùkǒu wǎng yòu guǎi.',
        vietnamese: 'Cứ đi thẳng về phía trước, đến ngã tư rẽ phải.',
        focusToneSandhi: 'Chỉ dẫn lộ trình liên tục không vấp váp',
      },
    ],
    vocabulary: [
      {
        id: 'hsk2-02-v1',
        hanzi: '地铁',
        pinyin: 'dìtiě',
        meaningVi: 'Tàu điện ngầm',
        radical: '土 (Thổ - đất)',
        radicalMeaningVi: 'Đường sắt chạy ngầm dưới lòng đất',
        strokeCount: 6,
        exampleSentence: '我坐地铁去上班。',
        examplePinyin: 'Wǒ zuò dìtiě qù shàngbān.',
        exampleVi: 'Tôi đi tàu điện ngầm đi làm.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-02-v2',
        hanzi: '出租车',
        pinyin: 'chūzūchē',
        meaningVi: 'Xe taxi',
        radical: '车 (Xa - xe cộ)',
        radicalMeaningVi: 'Xe cho thuê phục vụ chở khách',
        strokeCount: 4,
        exampleSentence: '打出租车很方便。',
        examplePinyin: 'Dǎ chūzūchē hěn fāngbiàn.',
        exampleVi: 'Bắt xe taxi rất tiện lợi.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-02-v3',
        hanzi: '往',
        pinyin: 'wǎng',
        meaningVi: 'Hướng về, đi về phía (giới từ)',
        radical: '彳 (Xích - bước đi)',
        radicalMeaningVi: 'Chỉ hướng di chuyển',
        strokeCount: 8,
        exampleSentence: '往前走。',
        examplePinyin: 'Wǎng qián zǒu.',
        exampleVi: 'Đi về phía trước.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-02-v4',
        hanzi: '拐',
        pinyin: 'guǎi',
        meaningVi: 'Rẽ, quẹo',
        radical: '扌 (Thủ - bàn tay)',
        radicalMeaningVi: 'Đổi hướng bẻ lái',
        strokeCount: 8,
        exampleSentence: '往左拐还是往右拐？',
        examplePinyin: 'Wǎng zuǒ guǎi háishi wǎng yòu guǎi?',
        exampleVi: 'Rẽ trái hay là rẽ phải?',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-02-v5',
        hanzi: '离',
        pinyin: 'lí',
        meaningVi: 'Cách, rời xa (giới từ đo khoảng cách)',
        radical: '亠 (Đầu)',
        radicalMeaningVi: 'Biểu thị khoảng cách hai địa điểm',
        strokeCount: 10,
        exampleSentence: '学校离我家很近。',
        examplePinyin: 'Xuéxiào lí wǒ jiā hěn jìn.',
        exampleVi: 'Trường học cách nhà tôi rất gần.',
        hskLevel: 'HSK2',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk2-02-g1',
        title: 'Chỉ phương hướng với giới từ "往" (wǎng)',
        pattern: '往 + Hướng (前 / 左 / 右) + Động từ (走 / 拐)',
        explanationVi:
          'Giới từ "往" chỉ hướng vận động. "往前走" (đi thẳng), "往右拐" (rẽ phải), "往左拐" (rẽ trái).',
        examples: [
          { hanzi: '一直往前走。', pinyin: 'Yìzhí wǎng qián zǒu.', vietnamese: 'Cứ đi thẳng mãi về phía trước.' },
          { hanzi: '到路口往左拐。', pinyin: 'Dào lùkǒu wǎng zuǒ guǎi.', vietnamese: 'Đến ngã rẽ hãy quẹo trái.' },
        ],
      },
      {
        id: 'hsk2-02-g2',
        title: 'Cấu trúc khoảng cách "A 离 B 很远 / 很近"',
        pattern: 'Địa điểm A + 离 + Địa điểm B + 很远 / 很近',
        explanationVi:
          'Dùng giới từ "离" để so sánh khoảng cách giữa hai địa danh hoặc mốc thời gian.',
        examples: [
          { hanzi: '这里离机场很远。', pinyin: 'Zhèlǐ lí jīchǎng hěn yuǎn.', vietnamese: 'Ở đây cách sân bay rất xa.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk2-02-q1',
        type: 'single_choice',
        prompt: 'Cụm từ "往右拐" (wǎng yòu guǎi) có nghĩa là gì?',
        options: ['Rẽ sang phải', 'Rẽ sang trái', 'Đi thẳng', 'Đi lùi lại'],
        correctAnswer: 0,
        explanation: '"右" là bên phải, "拐" là rẽ -> Rẽ phải.',
      },
      {
        id: 'hsk2-02-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Trường học cách nhà tôi rất gần"',
        orderingTokens: ['很近', '离我家', '学校'],
        correctAnswer: ['学校', '离我家', '很近'],
        explanation: 'Trật tự: Địa điểm A (学校) + 离 B (离我家) + Tính từ (很近).',
      },
      {
        id: 'hsk2-02-q3',
        type: 'speaking_response',
        prompt: 'Hãy nói câu: "Đi thẳng về phía trước" bằng tiếng Trung:',
        targetSpeech: '往前走',
        pinyin: 'Wǎng qián zǒu',
        explanation: 'Phát âm chuẩn: Wǎng qián zǒu.',
        correctAnswer: '往前走',
      },
    ],
  },

  {
    id: 'hsk2-lesson-03',
    lessonNumber: 3,
    level: 'HSK2',
    title: 'Bài 3: Thời tiết & Bốn mùa',
    subtitleVi: '今天天气怎么样, 下雨, 暖和, 比较冷',
    topicIcon: 'CloudRain',
    imageUrl: '/images/lessons/hsk2_lesson03_seasons_weather.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Hỏi han tình hình thời tiết, nhiệt độ các mùa trong năm, phó từ mức độ 比较 và trợ từ biến đổi 了.',
    dialogue: [
      {
        id: 'hsk2-03-d1',
        speaker: 'A',
        speakerName: '小华 (Xiao Hua)',
        hanzi: '大明，今天外面天气怎么样？',
        pinyin: 'Dàmíng, jīntiān wàimiàn tiānqì zěnmeyàng?',
        vietnamese: 'Đại Minh ơi, hôm nay thời tiết bên ngoài thế nào rồi?',
      },
      {
        id: 'hsk2-03-d2',
        speaker: 'B',
        speakerName: '大明 (Da Ming)',
        hanzi: '今天阴天，外面比较冷，而且快要下雨了。',
        pinyin: 'Jīntiān yīntiān, wàimiàn bǐjiào lěng, érqiě kuàiyào xiàyǔ le.',
        vietnamese: 'Hôm nay trời âm u, bên ngoài khá lạnh, mà hình như sắp mưa rồi đấy.',
      },
      {
        id: 'hsk2-03-d3',
        speaker: 'A',
        speakerName: '小华 (Xiao Hua)',
        hanzi: '那出门一定要带雨伞。明天天气会好点儿吗？',
        pinyin: 'Nà chūmén yídìng yào dài yǔsǎn. Míngtiān tiānqì huì hǎo diǎnr ma?',
        vietnamese: 'Thế thì ra ngoài nhất định phải đem theo ô che mưa nhé. Ngày mai thời tiết có tốt hơn chút nào không?',
      },
      {
        id: 'hsk2-03-d4',
        speaker: 'B',
        speakerName: '大明 (Da Ming)',
        hanzi: '天气预报说，明天是晴天，最高气温二十五度，非常暖和。',
        pinyin: 'Tiānqì yùbào shuō, míngtiān shì qíngtiān, zuìgāo qìwēn èrshíwǔ dù, fēicháng nuǎnhuo.',
        vietnamese: 'Dự báo thời tiết nói ngày mai trời nắng ráo, nhiệt độ cao nhất 25 độ C, rất ấm áp.',
      },
      {
        id: 'hsk2-03-d5',
        speaker: 'A',
        speakerName: '小华 (Xiao Hua)',
        hanzi: '太好了，我最喜欢暖和的春天！',
        pinyin: 'Tài hǎo le, wǒ zuì xǐhuan nuǎnhuo de chūntiān!',
        vietnamese: 'Tuyệt vời quá, mình thích nhất là mùa xuân ấm áp!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk2-03-sd1',
        hanzi: '今天天气怎么样？',
        pinyin: 'Jīntiān tiānqì zěnmeyàng?',
        vietnamese: 'Thời tiết hôm nay như thế nào?',
        difficulty: 'easy',
        pronunciationTipVi: '"zěnmeyàng" phát âm dứt khoát thanh 4 yàng.',
      },
      {
        id: 'hsk2-03-sd2',
        hanzi: '快要下雨了。',
        pinyin: 'Kuàiyào xiàyǔ le.',
        vietnamese: 'Trời sắp sửa mưa rồi.',
        difficulty: 'medium',
        pronunciationTipVi: '"xiàyǔ" thanh 4 giáng mạnh rồi đến thanh 3 uốn sâu.',
      },
      {
        id: 'hsk2-03-sd3',
        hanzi: '今天比较冷。',
        pinyin: 'Jīntiān bǐjiào lěng.',
        vietnamese: 'Hôm nay tương đối lạnh.',
        difficulty: 'easy',
        pronunciationTipVi: '"bǐjiào" chú ý âm j không bật hơi.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk2-03-ss1',
        hanzi: '明天是晴天，非常暖和，我最喜欢春天。',
        pinyin: 'Míngtiān shì qíngtiān, fēicháng nuǎnhuo, wǒ zuì xǐhuan chūntiān.',
        vietnamese: 'Ngày mai trời nắng ráo, rất ấm áp, tôi thích nhất là mùa xuân.',
        focusToneSandhi: 'Ngữ điệu vui tươi, chuyển đổi mượt mà giữa các thanh điệu',
      },
    ],
    vocabulary: [
      {
        id: 'hsk2-03-v1',
        hanzi: '天气',
        pinyin: 'tiānqì',
        meaningVi: 'Thời tiết',
        radical: '气 (Khí - hơi nước, không khí)',
        radicalMeaningVi: 'Khí quyển đất trời',
        strokeCount: 4,
        exampleSentence: '明天天气很好。',
        examplePinyin: 'Míngtiān tiānqì hěn hǎo.',
        exampleVi: 'Ngày mai thời tiết rất đẹp.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-03-v2',
        hanzi: '冷',
        pinyin: 'lěng',
        meaningVi: 'Lạnh giá',
        radical: '冫 (Băng - băng tuyết hai chấm)',
        radicalMeaningVi: 'Băng giá lạnh buốt',
        strokeCount: 7,
        exampleSentence: '冬天很冷。',
        examplePinyin: 'Dōngtiān hěn lěng.',
        exampleVi: 'Mùa đông rất lạnh.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-03-v3',
        hanzi: '下雨',
        pinyin: 'xiàyǔ',
        meaningVi: 'Mưa, đổ mưa',
        radical: '雨 (Vũ - mưa)',
        radicalMeaningVi: 'Những giọt nước từ mây rơi xuống',
        strokeCount: 8,
        exampleSentence: '外面正在下雨。',
        examplePinyin: 'Wàimiàn zhèngzài xiàyǔ.',
        exampleVi: 'Bên ngoài đang đổ mưa.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-03-v4',
        hanzi: '暖和',
        pinyin: 'nuǎnhuo',
        meaningVi: 'Ấm áp',
        radical: '日 (Nhật - ánh mặt trời)',
        radicalMeaningVi: 'Mặt trời chiếu sáng sưởi ấm',
        strokeCount: 13,
        exampleSentence: '春天很暖和。',
        examplePinyin: 'Chūntiān hěn nuǎnhuo.',
        exampleVi: 'Mùa xuân rất ấm áp.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-03-v5',
        hanzi: '比较',
        pinyin: 'bǐjiào',
        meaningVi: 'Khá là, tương đối, so sánh',
        radical: '比 (Tỉ - so đọ)',
        radicalMeaningVi: 'Phó từ chỉ mức độ vừa phải',
        strokeCount: 4,
        exampleSentence: '这件衣服比较贵。',
        examplePinyin: 'Zhè jiàn yīfu bǐjiào guì.',
        exampleVi: 'Bộ quần áo này khá đắt.',
        hskLevel: 'HSK2',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk2-03-g1',
        title: 'Phó từ chỉ mức độ "比较" (bǐjiào)',
        pattern: 'Chủ ngữ + 比较 + Tính từ',
        explanationVi:
          '"比较" có nghĩa là "tương đối", "khá là", biểu thị mức độ nhẹ hơn "很" và "非常", có hàm ý so sánh ngầm với hoàn cảnh khác.',
        examples: [
          { hanzi: '今天比较冷。', pinyin: 'Jīntiān bǐjiào lěng.', vietnamese: 'Hôm nay trời khá lạnh (so với mọi hôm).' },
        ],
      },
      {
        id: 'hsk2-03-g2',
        title: 'Cấu trúc sắp sửa diễn ra "快要...了" (kuàiyào...le)',
        pattern: '快要 + Động từ + 了',
        explanationVi:
          'Biểu thị một hành động hoặc sự biến đổi chuẩn bị xảy ra trong tương lai rất gần.',
        examples: [
          { hanzi: '快要下雨了。', pinyin: 'Kuàiyào xiàyǔ le.', vietnamese: 'Trời sắp sửa mưa rồi.' },
          { hanzi: '火车快要开了。', pinyin: 'Huǒchē kuàiyào kāi le.', vietnamese: 'Tàu hỏa sắp chạy rồi.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk2-03-q1',
        type: 'single_choice',
        prompt: 'Câu "外面快要下雨了" có nghĩa là gì?',
        options: ['Bên ngoài trời tạnh mưa rồi', 'Bên ngoài trời sắp sửa mưa rồi', 'Bên ngoài đang có tuyết rơi', 'Bên ngoài rất nắng ráo'],
        correctAnswer: 1,
        explanation: 'Cấu trúc "快要...了" chỉ hành động sắp xảy ra: sắp mưa rồi.',
      },
      {
        id: 'hsk2-03-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Thời tiết hôm nay tương đối lạnh"',
        orderingTokens: ['比较冷', '今天', '天气'],
        correctAnswer: ['今天', '天气', '比较冷'],
        explanation: 'Trật tự: Thời gian (今天) + Chủ ngữ (天气) + Vị ngữ (比较冷).',
      },
      {
        id: 'hsk2-03-q3',
        type: 'speaking_response',
        prompt: 'Nói câu hỏi: "Thời tiết hôm nay thế nào?" bằng tiếng Trung:',
        targetSpeech: '今天天气怎么样',
        pinyin: 'Jīntiān tiānqì zěnmeyàng',
        explanation: 'Phát âm chuẩn: Jīntiān tiānqì zěnmeyàng?',
        correctAnswer: '今天天气怎么样',
      },
    ],
  },

  {
    id: 'hsk2-lesson-04',
    lessonNumber: 4,
    level: 'HSK2',
    title: 'Bài 4: Sở thích & Thời gian rảnh',
    subtitleVi: '喜欢听音乐, 踢足球, 跑步',
    topicIcon: 'Activity',
    imageUrl: '/images/lessons/hsk2_lesson04_hobbies_sports.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Nói về đam mê, hoạt động thể thao cuối tuần (đá bóng, chạy bộ, nghe nhạc), phó từ tần suất 常常 và câu liên động.',
    dialogue: [
      {
        id: 'hsk2-04-d1',
        speaker: 'A',
        speakerName: '王鹏 (Wang Peng)',
        hanzi: '李友，你周末常常做什么？',
        pinyin: 'Lǐ Yǒu, nǐ zhōumò chángcháng zuò shénme?',
        vietnamese: 'Lý Hữu này, cuối tuần bạn thường hay làm gì thế?',
      },
      {
        id: 'hsk2-04-d2',
        speaker: 'B',
        speakerName: '李友 (Li You)',
        hanzi: '我喜欢在家听音乐和看电影。你有什么爱好？',
        pinyin: 'Wǒ xǐhuan zài jiā tīng yīnyuè hé kàn diànyǐng. Nǐ yǒu shénme àihào?',
        vietnamese: 'Mình thích ở nhà nghe nhạc và xem phim. Bạn có sở thích gì nào?',
      },
      {
        id: 'hsk2-04-d3',
        speaker: 'A',
        speakerName: '王鹏 (Wang Peng)',
        hanzi: '我特别喜欢运动，比如踢足球和跑步。',
        pinyin: 'Wǒ tèbié xǐhuan yùndòng, bǐrú tī zúqiú hé pǎobù.',
        vietnamese: 'Mình thì đặc biệt mê thể thao, ví dụ như đá bóng và chạy bộ.',
      },
      {
        id: 'hsk2-04-d4',
        speaker: 'B',
        speakerName: '李友 (Li You)',
        hanzi: '这个周六下午我们要去操场踢足球，你想去吗？',
        pinyin: 'Zhège zhōuliù xiàwǔ wǒmen yào qù cāochǎng tī zúqiú, nǐ xiǎng qù ma?',
        vietnamese: 'Chiều thứ Bảy tuần này tụi mình định đến sân vận động đá bóng, bạn có muốn đi cùng không?',
      },
      {
        id: 'hsk2-04-d5',
        speaker: 'A',
        speakerName: '王鹏 (Wang Peng)',
        hanzi: '太棒了！我一定去。',
        pinyin: 'Tài bàng le! Wǒ yídìng qù.',
        vietnamese: 'Tuyệt cú mèo! Mình nhất định sẽ tham gia.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk2-04-sd1',
        hanzi: '你有什么爱好？',
        pinyin: 'Nǐ yǒu shénme àihào?',
        vietnamese: 'Bạn có sở thích gì?',
        difficulty: 'easy',
        pronunciationTipVi: '"àihào" mang thanh 4 dứt khoát.',
      },
      {
        id: 'hsk2-04-sd2',
        hanzi: '我喜欢踢足球。',
        pinyin: 'Wǒ xǐhuan tī zúqiú.',
        vietnamese: 'Tôi thích đá bóng.',
        difficulty: 'medium',
        pronunciationTipVi: '"tī" thanh 1 bật nhẹ, "zúqiú" chữ zú đầu lưỡi trước.',
      },
      {
        id: 'hsk2-04-sd3',
        hanzi: '去操场跑步。',
        pinyin: 'Qù cāochǎng pǎobù.',
        vietnamese: 'Đến sân tập để chạy bộ.',
        difficulty: 'medium',
        pronunciationTipVi: '"cāochǎng" có âm c bật hơi và ch uốn lưỡi.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk2-04-ss1',
        hanzi: '我周末常常在家听音乐，或者跟朋友去踢足球。',
        pinyin: 'Wǒ zhōumò chángcháng zài jiā tīng yīnyuè, huòzhě gēn péngyou qù tī zúqiú.',
        vietnamese: 'Cuối tuần tôi thường ở nhà nghe nhạc, hoặc cùng bạn bè đi đá bóng.',
        focusToneSandhi: 'Nối câu liên tục với liên từ 或者 và giới từ 跟',
      },
    ],
    vocabulary: [
      {
        id: 'hsk2-04-v1',
        hanzi: '喜欢',
        pinyin: 'xǐhuan',
        meaningVi: 'Thích, yêu thích',
        radical: '士 (Sĩ)',
        radicalMeaningVi: 'Niềm hoan hỷ trong lòng',
        strokeCount: 12,
        exampleSentence: '我很喜欢学中文。',
        examplePinyin: 'Wǒ hěn xǐhuan xué Zhōngwén.',
        exampleVi: 'Tôi rất thích học tiếng Trung.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-04-v2',
        hanzi: '运动',
        pinyin: 'yùndòng',
        meaningVi: 'Vận động, thể thao',
        radical: '辶 (Xước - di chuyển bước đi)',
        radicalMeaningVi: 'Di chuyển thân thể',
        strokeCount: 7,
        exampleSentence: '多做运动对身体好。',
        examplePinyin: 'Duō zuò yùndòng duì shēntǐ hǎo.',
        exampleVi: 'Tập thể dục nhiều tốt cho cơ thể.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-04-v3',
        hanzi: '足球',
        pinyin: 'zúqiú',
        meaningVi: 'Bóng đá',
        radical: '足 (Túc - bàn chân)',
        radicalMeaningVi: 'Bộ Túc chỉ bàn chân đá bóng',
        strokeCount: 7,
        exampleSentence: '他们正在踢足球。',
        examplePinyin: 'Tāmen zhèngzài tī zúqiú.',
        exampleVi: 'Họ đang đá bóng.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-04-v4',
        hanzi: '跑步',
        pinyin: 'pǎobù',
        meaningVi: 'Chạy bộ',
        radical: '足 (Túc - bàn chân)',
        radicalMeaningVi: 'Cất bước chân chạy nhanh',
        strokeCount: 12,
        exampleSentence: '每天早上我都在公园跑步。',
        examplePinyin: 'Měitiān zǎoshang wǒ dōu zài gōngyuán pǎobù.',
        exampleVi: 'Mỗi buổi sáng tôi đều chạy bộ ở công viên.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-04-v5',
        hanzi: '常常',
        pinyin: 'chángcháng',
        meaningVi: 'Thường thường, hay',
        radical: '巾 (Cân - khăn vải)',
        radicalMeaningVi: 'Phó từ chỉ tần suất thường xuyên',
        strokeCount: 11,
        exampleSentence: '他常常去图书馆看书。',
        examplePinyin: 'Tā chángcháng qù túshūguǎn kànshū.',
        exampleVi: 'Anh ấy thường đến thư viện đọc sách.',
        hskLevel: 'HSK2',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk2-04-g1',
        title: 'Động từ chỉ hoạt động thể thao: 踢 (tī) vs 打 (dǎ)',
        pattern: '踢 + Môn dùng chân (足球) | 打 + Môn dùng tay (篮球, 羽毛球, 网球)',
        explanationVi:
          'Trong tiếng Trung, môn thể thao dùng chân đá thì kết hợp động từ "踢" (tī zúqiú). Các môn dùng tay đập/đánh thì dùng "打" (dǎ lánqiú - bóng rổ, dǎ wǎngqiú - tennis).',
        examples: [
          { hanzi: '踢足球', pinyin: 'tī zúqiú', vietnamese: 'Đá bóng (dùng chân)' },
          { hanzi: '打篮球', pinyin: 'dǎ lánqiú', vietnamese: 'Chơi bóng rổ (dùng tay)' },
        ],
      },
      {
        id: 'hsk2-04-g2',
        title: 'Câu liên động biểu thị mục đích: 去 + Nơi chốn + Hành động',
        pattern: 'Chủ ngữ + 去 + Địa điểm + Động từ',
        explanationVi:
          'Dùng để diễn đạt việc đi tới một địa điểm nào đó nhằm thực hiện một mục đích cụ thể.',
        examples: [
          { hanzi: '去操场踢足球', pinyin: 'qù cāochǎng tī zúqiú', vietnamese: 'Đến sân bóng để đá bóng' },
          { hanzi: '去商店买水', pinyin: 'qù shāngdiàn mǎi shuǐ', vietnamese: 'Đến cửa hàng mua nước' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk2-04-q1',
        type: 'single_choice',
        prompt: 'Động từ nào đi kèm chính xác với danh từ "足球" (bóng đá)?',
        options: ['踢 (tī)', '打 (dǎ)', '看 (kàn)', '喝 (hē)'],
        correctAnswer: 0,
        explanation: 'Đá bóng dùng chân nên dùng động từ "踢" (tī zúqiú).',
      },
      {
        id: 'hsk2-04-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Tôi thường hay nghe nhạc ở nhà"',
        orderingTokens: ['听音乐', '在家', '我', '常常'],
        correctAnswer: ['我', '常常', '在家', '听音乐'],
        explanation: 'Trật tự: Chủ ngữ (我) + Tần suất (常常) + Nơi chốn (在家) + Hành động (听音乐).',
      },
      {
        id: 'hsk2-04-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Tôi thích chạy bộ" bằng tiếng Trung:',
        targetSpeech: '我喜欢跑步',
        pinyin: 'Wǒ xǐhuan pǎobù',
        explanation: 'Phát âm chuẩn: Wǒ xǐhuan pǎobù.',
        correctAnswer: '我喜欢跑步',
      },
    ],
  },

  {
    id: 'hsk2-lesson-05',
    lessonNumber: 5,
    level: 'HSK2',
    title: 'Bài 5: Khám bệnh & Sức khỏe',
    subtitleVi: '身体不舒服, 感冒, 发烧, 多喝水',
    topicIcon: 'Stethoscope',
    imageUrl: '/images/lessons/hsk2_lesson05_hospital_doctor.jpg',
    estimatedMinutes: 30,
    summaryVi: 'Miêu tả triệu chứng ốm (sốt, đau đầu, cảm cúm), lắng nghe lời khuyên của bác sĩ với cấu trúc 多/少 + V và trợ từ 了.',
    dialogue: [
      {
        id: 'hsk2-05-d1',
        speaker: 'A',
        speakerName: '医生 (Bác sĩ)',
        hanzi: '你怎么了？哪里不舒服？',
        pinyin: 'Nǐ zěnme le? Nǎlǐ bù shūfu?',
        vietnamese: 'Cháu bị làm sao thế? Trong người thấy khó chịu ở đâu?',
      },
      {
        id: 'hsk2-05-d2',
        speaker: 'B',
        speakerName: '病人 (Bệnh nhân)',
        hanzi: '医生，我从昨天晚上开始头疼、发烧，浑身没力气。',
        pinyin: 'Yīshēng, wǒ cóng zuótiān wǎnshang kāishǐ tóuténg, fāshāo, húnshēn méi lìqi.',
        vietnamese: 'Thưa bác sĩ, cháu bị đau đầu, sốt và toàn thân không có sức lực từ tối hôm qua.',
      },
      {
        id: 'hsk2-05-d3',
        speaker: 'A',
        speakerName: '医生 (Bác sĩ)',
        hanzi: '让我给你量一下体温。三十八度五，你感冒了。',
        pinyin: 'Ràng wǒ gěi nǐ liáng yíxià tǐwēn. Sānshíbā dù wǔ, nǐ gǎnmào le.',
        vietnamese: 'Để bác cặp nhiệt độ cho cháu xem. 38 độ 5, cháu bị cảm sốt rồi đấy.',
      },
      {
        id: 'hsk2-05-d4',
        speaker: 'B',
        speakerName: '病人 (Bệnh nhân)',
        hanzi: '情况严重吗？需要打针吗？',
        pinyin: 'Qíngkuàng yánzhòng ma? Xūyào dǎzhēn ma?',
        vietnamese: 'Tình trạng có nghiêm trọng không ạ? Có cần phải tiêm thuốc không bác sĩ?',
      },
      {
        id: 'hsk2-05-d5',
        speaker: 'A',
        speakerName: '医生 (Bác sĩ)',
        hanzi: '不用打针。吃这两种药，每天三次，记得多喝水、多休息。',
        pinyin: 'Búyòng dǎzhēn. Chī zhè liǎng zhǒng yào, měitiān sān cì, jìde duō hē shuǐ, duō xiūxi.',
        vietnamese: 'Không cần tiêm đâu. Cháu uống hai loại thuốc này, mỗi ngày 3 lần, nhớ uống nhiều nước và nghỉ ngơi nhiều nhé.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk2-05-sd1',
        hanzi: '我身体不舒服。',
        pinyin: 'Wǒ shēntǐ bù shūfu.',
        vietnamese: 'Trong người tôi thấy không được khỏe.',
        difficulty: 'medium',
        pronunciationTipVi: '"shēntǐ" thanh 1 + thanh 3, "shūfu" thanh 1 + thanh nhẹ.',
      },
      {
        id: 'hsk2-05-sd2',
        hanzi: '我感冒发烧了。',
        pinyin: 'Wǒ gǎnmào fāshāo le.',
        vietnamese: 'Tôi bị cảm sốt rồi.',
        difficulty: 'easy',
        pronunciationTipVi: '"fāshāo" cả hai âm đều mang thanh 1 ngang bằng.',
      },
      {
        id: 'hsk2-05-sd3',
        hanzi: '多喝水，多休息。',
        pinyin: 'Duō hē shuǐ, duō xiūxi.',
        vietnamese: 'Uống nhiều nước, nghỉ ngơi nhiều vào.',
        difficulty: 'easy',
        pronunciationTipVi: 'Cấu trúc khuyên nhủ ân cần: duō + động từ.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk2-05-ss1',
        hanzi: '医生说我感冒了，让我每天按时吃药，多喝热水。',
        pinyin: 'Yīshēng shuō wǒ gǎnmào le, ràng wǒ měitiān ànshí chī yào, duō hē rè shuǐ.',
        vietnamese: 'Bác sĩ bảo tôi bị cảm rồi, bảo tôi mỗi ngày uống thuốc đúng giờ và uống nhiều nước nóng.',
        focusToneSandhi: 'Câu cầu khiến chữ 让 (ràng) và lời khuyên y tế',
      },
    ],
    vocabulary: [
      {
        id: 'hsk2-05-v1',
        hanzi: '身体',
        pinyin: 'shēntǐ',
        meaningVi: 'Thân thể, sức khỏe',
        radical: '身 (Thân - cơ thể người)',
        radicalMeaningVi: 'Thân hình vóc dáng',
        strokeCount: 7,
        exampleSentence: '祝你身体健康！',
        examplePinyin: 'Zhù nǐ shēntǐ jiànkāng!',
        exampleVi: 'Chúc bạn dồi dào sức khỏe!',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-05-v2',
        hanzi: '生病',
        pinyin: 'shēngbìng',
        meaningVi: 'Bị ốm, bị bệnh',
        radical: '疒 (Nạch - bệnh tật)',
        radicalMeaningVi: 'Bộ Nạch biểu thị ốm đau bệnh hoạn',
        strokeCount: 10,
        exampleSentence: '他生病住院了。',
        examplePinyin: 'Tā shēngbìng zhùyuàn le.',
        exampleVi: 'Cậu ấy bị bệnh phải nằm viện rồi.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-05-v3',
        hanzi: '感冒',
        pinyin: 'gǎnmào',
        meaningVi: 'Cảm cúm, sổ mũi',
        radical: '心 (Tâm)',
        radicalMeaningVi: 'Nhiễm lạnh trúng gió',
        strokeCount: 13,
        exampleSentence: '最近天气变冷，容易感冒。',
        examplePinyin: 'Zuìjìn tiānqì biàn lěng, róngyì gǎnmào.',
        exampleVi: 'Dạo này trời trở lạnh, rất dễ bị cảm cúm.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-05-v4',
        hanzi: '发烧',
        pinyin: 'fāshāo',
        meaningVi: 'Phát sốt, sốt cao',
        radical: '火 (Hỏa - lửa nóng)',
        radicalMeaningVi: 'Thân nhiệt tăng nóng bừng như lửa',
        strokeCount: 10,
        exampleSentence: '孩子发烧三十九度。',
        examplePinyin: 'Háizi fāshāo sānshíjiǔ dù.',
        exampleVi: 'Đứa bé bị sốt tới 39 độ.',
        hskLevel: 'HSK2',
      },
      {
        id: 'hsk2-05-v5',
        hanzi: '吃药',
        pinyin: 'chī yào',
        meaningVi: 'Uống thuốc (tiếng Trung dùng động từ ăn)',
        radical: '艹 (Thảo - cây cỏ thuốc nam)',
        radicalMeaningVi: 'Các loại thảo dược chữa bệnh',
        strokeCount: 9,
        exampleSentence: '记得饭后吃药。',
        examplePinyin: 'Jìde fànhòu chī yào.',
        exampleVi: 'Nhớ uống thuốc sau bữa ăn nhé.',
        hskLevel: 'HSK2',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk2-05-g1',
        title: 'Lời khuyên y tế với cấu trúc "多 / 少 + Động từ"',
        pattern: '多 / 少 + Động từ + Tân ngữ',
        explanationVi:
          'Để khuyên ai nên làm việc gì nhiều hơn hoặc ít đi, ta đặt "多" (nhiều) hoặc "少" (ít) ngay trước động từ. Chú ý: Tiếng Việt nói "uống thuốc", nhưng tiếng Trung luôn dùng động từ "吃药" (ăn thuốc).',
        examples: [
          { hanzi: '多喝水。', pinyin: 'Duō hē shuǐ.', vietnamese: 'Uống nhiều nước.' },
          { hanzi: '少玩手机，多睡觉。', pinyin: 'Shǎo wán shǒujī, duō shuìjiào.', vietnamese: 'Bớt nghịch điện thoại lại, ngủ nhiều lên.' },
        ],
      },
      {
        id: 'hsk2-05-g2',
        title: 'Trợ từ "了" biểu thị sự thay đổi trạng thái',
        pattern: 'Hiện trạng mới + 了',
        explanationVi:
          'Khi một trạng thái sức khỏe hay tình huống trước đây chưa có mà nay xuất hiện (trước đây khỏe mạnh, nay bị cảm), ta dùng "了" ở cuối câu.',
        examples: [
          { hanzi: '我感冒了。', pinyin: 'Wǒ gǎnmào le.', vietnamese: 'Tôi bị cảm mất rồi (trạng thái thay đổi).' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk2-05-q1',
        type: 'single_choice',
        prompt: 'Trong tiếng Trung, hành động "uống thuốc" được nói như thế nào?',
        options: ['喝药 (hē yào)', '吃药 (chī yào)', '看药 (kàn yào)', '买药 (mǎi yào)'],
        correctAnswer: 1,
        explanation: 'Người Trung Quốc nói "吃药" (chī yào) thay vì dùng động từ 喝.',
      },
      {
        id: 'hsk2-05-q2',
        type: 'ordering',
        prompt: 'Sắp xếp lời dặn của bác sĩ: "Bạn nên uống nhiều nước ấm"',
        orderingTokens: ['多喝', '你', '温水', '应该'],
        correctAnswer: ['你', '应该', '多喝', '温水'],
        explanation: 'Trật tự: Chủ ngữ (你) + Năng nguyện (应该) + Khuyên nhủ (多喝) + Tân ngữ (温水).',
      },
      {
        id: 'hsk2-05-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Trong người tôi không được khỏe" vào mic:',
        targetSpeech: '我身体不舒服',
        pinyin: 'Wǒ shēntǐ bù shūfu',
        explanation: 'Phát âm chuẩn: Wǒ shēntǐ bù shūfu.',
        correctAnswer: '我身体不舒服',
      },
    ],
  },
];

/* ==========================================================================
   5. HSK 3 - 4 LESSONS
   ========================================================================== */

export const HSK3_LESSONS: HSKLesson[] = [
  {
    id: 'hsk3-lesson-01',
    lessonNumber: 1,
    level: 'HSK3',
    title: 'Bài 1: Thuê phòng & Khách sạn',
    subtitleVi: '预订房间, 单人房, 押金, 服务员',
    topicIcon: 'Hotel',
    imageUrl: '/images/lessons/hsk3_lesson01_hotel_room.jpg',
    estimatedMinutes: 35,
    summaryVi: 'Làm thủ tục nhận/trả phòng khách sạn, giao tiếp về tiền đặt cọc (押金), các tiện ích phòng ốc và câu chữ 把.',
    dialogue: [
      {
        id: 'hsk3-01-d1',
        speaker: 'A',
        speakerName: '前台接待 (Lễ tân khách sạn)',
        hanzi: '您好，欢迎光临北京饭店！请问有什么可以帮您？',
        pinyin: 'Nín hǎo, huānyíng guānglín Běijīng Fàndiàn! Qǐngwèn yǒu shénme kěyǐ bāng nín?',
        vietnamese: 'Kính chào quý khách, chào mừng đến khách sạn Bắc Kinh! Xin hỏi em có thể giúp gì cho anh ạ?',
      },
      {
        id: 'hsk3-01-d2',
        speaker: 'B',
        speakerName: '房客 (Khách thuê phòng)',
        hanzi: '您好！我在网上预订了一间单人房，打算住三个晚上。',
        pinyin: 'Nín hǎo! Wǒ zài wǎngshàng yùdìng le yì jiān dānrén fáng, dǎsuan zhù sān gè wǎnshang.',
        vietnamese: 'Chào cô! Tôi đã đặt trước một phòng đơn qua mạng, dự định ở lại ba đêm.',
      },
      {
        id: 'hsk3-01-d3',
        speaker: 'A',
        speakerName: '前台接待 (Lễ tân)',
        hanzi: '好的，查到了。请把您的护照给我登记一下。',
        pinyin: 'Hǎo de, chá dào le. Qǐng bǎ nín de hùzhào gěi wǒ dēngjì yíxià.',
        vietnamese: 'Dạ được rồi, em tìm thấy đơn đặt của anh rồi. Xin anh đưa hộ chiếu cho em làm thủ tục đăng ký một chút.',
      },
      {
        id: 'hsk3-01-d4',
        speaker: 'B',
        speakerName: '房客 (Khách)',
        hanzi: '护照给您。请问房费一共多少钱？需要交押金吗？',
        pinyin: 'Hùzhào gěi nín. Qǐngwèn fángfèi yígòng duōshao qián? Xūyào jiāo yājīn ma?',
        vietnamese: 'Gửi cô hộ chiếu. Xin hỏi tiền phòng tổng cộng bao nhiêu? Có cần phải nộp tiền đặt cọc không?',
      },
      {
        id: 'hsk3-01-d5',
        speaker: 'A',
        speakerName: '前台接待 (Lễ tân)',
        hanzi: '一共一千两百元，另外需要交两百元押金，退房时只要房间设施完好，押金会全部退还给您。',
        pinyin: 'Yígòng yìqiān liǎngbǎi yuán, lìngwài xūyào jiāo liǎngbǎi yuán yājīn, tuìfáng shí zhǐyào fángjiān shèshī wánhǎo, yājīn huì quánbù tuìhuán gěi nín.',
        vietnamese: 'Tổng cộng 1.200 tệ, ngoài ra cần đặt cọc 200 tệ, khi trả phòng chỉ cần trang thiết bị nguyên vẹn thì tiền cọc sẽ được hoàn lại đầy đủ cho anh.',
      },
      {
        id: 'hsk3-01-d6',
        speaker: 'A',
        speakerName: '前台接待 (Lễ tân)',
        hanzi: '这是您的房卡，在8楼808号房。电梯在右边，祝您入住愉快！',
        pinyin: 'Zhè shì nín de fángkǎ, zài bā lóu bābā líng hào fáng. Diàntī zài yòubiān, zhù nín rùzhù yúkuài!',
        vietnamese: 'Đây là thẻ phòng của anh, phòng 808 ở tầng 8. Thang máy ở bên tay phải, chúc anh lưu trú vui vẻ!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk3-01-sd1',
        hanzi: '我在网上预订了房间。',
        pinyin: 'Wǒ zài wǎngshàng yùdìng le fángjiān.',
        vietnamese: 'Tôi đã đặt phòng trước qua mạng.',
        difficulty: 'medium',
        pronunciationTipVi: '"yùdìng" cả hai chữ đều mang thanh 4 giáng mạnh.',
      },
      {
        id: 'hsk3-01-sd2',
        hanzi: '请把护照给我。',
        pinyin: 'Qǐng bǎ hùzhào gěi wǒ.',
        vietnamese: 'Làm ơn đưa hộ chiếu cho tôi.',
        difficulty: 'easy',
        pronunciationTipVi: 'Câu chữ 把: "Qǐng bǎ hùzhào gěi wǒ".',
      },
      {
        id: 'hsk3-01-sd3',
        hanzi: '需要交多少押金？',
        pinyin: 'Xūyào jiāo duōshao yājīn?',
        vietnamese: 'Cần phải nộp bao nhiêu tiền đặt cọc?',
        difficulty: 'medium',
        pronunciationTipVi: '"yājīn" chữ yā thanh 1, jīn thanh 1 cao đều.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk3-01-ss1',
        hanzi: '退房时只要房间设施完好，押金会全部退还给您。',
        pinyin: 'Tuìfáng shí zhǐyào fángjiān shèshī wánhǎo, yājīn huì quánbù tuìhuán gěi nín.',
        vietnamese: 'Lúc trả phòng chỉ cần thiết bị trong phòng nguyên vẹn, tiền cọc sẽ được hoàn trả toàn bộ cho quý khách.',
        focusToneSandhi: 'Cặp liên từ điều kiện 只要...就/会... và tốc độ nói tự nhiên',
      },
    ],
    vocabulary: [
      {
        id: 'hsk3-01-v1',
        hanzi: '预订',
        pinyin: 'yùdìng',
        meaningVi: 'Đặt trước (phòng, vé, bàn tiệc)',
        radical: '页 (Hiệt - trang giấy)',
        radicalMeaningVi: 'Được ghi tên vào sổ đặt trước',
        strokeCount: 4,
        exampleSentence: '请提前预订机票。',
        examplePinyin: 'Qǐng tíqián yùdìng jīpiào.',
        exampleVi: 'Xin vui lòng đặt vé máy bay trước.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-01-v2',
        hanzi: '护照',
        pinyin: 'hùzhào',
        meaningVi: 'Hộ chiếu',
        radical: '扌 (Thủ - bàn tay cầm giấy tờ bảo vệ)',
        radicalMeaningVi: 'Giấy tờ bảo hộ chứng minh thân phận khi xuất ngoại',
        strokeCount: 9,
        exampleSentence: '出国一定要带护照。',
        examplePinyin: 'Chūguó yídìng yào dài hùzhào.',
        exampleVi: 'Đi ra nước ngoài nhất định phải mang hộ chiếu.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-01-v3',
        hanzi: '押金',
        pinyin: 'yājīn',
        meaningVi: 'Tiền đặt cọc, tiền thế chân',
        radical: '扌 (Thủ)',
        radicalMeaningVi: 'Khoản tiền giữ chân cam kết',
        strokeCount: 8,
        exampleSentence: '租房子要交押金。',
        examplePinyin: 'Zū fángzi yào jiāo yājīn.',
        exampleVi: 'Thuê nhà cần phải nộp tiền đặt cọc.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-01-v4',
        hanzi: '退房',
        pinyin: 'tuìfáng',
        meaningVi: 'Trả phòng (khách sạn)',
        radical: '辶 (Xước - lui bước)',
        radicalMeaningVi: 'Lui lại, rời khỏi căn phòng',
        strokeCount: 9,
        exampleSentence: '酒店规定中午十二点前退房。',
        examplePinyin: 'Jiǔdiàn guīdìng zhōngwǔ shí\'èr diǎn qián tuìfáng.',
        exampleVi: 'Khách sạn quy định trả phòng trước 12 giờ trưa.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-01-v5',
        hanzi: '电梯',
        pinyin: 'diàntī',
        meaningVi: 'Thang máy',
        radical: '木 (Mộc - bậc thang gỗ xưa)',
        radicalMeaningVi: 'Cầu thang vận hành bằng điện',
        strokeCount: 11,
        exampleSentence: '请坐电梯上八楼。',
        examplePinyin: 'Qǐng zuò diàntī shàng bā lóu.',
        exampleVi: 'Mời quý khách đi thang máy lên tầng 8.',
        hskLevel: 'HSK3',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk3-01-g1',
        title: 'Cấu trúc câu chữ "把" (bǎ) căn bản',
        pattern: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Kết quả / Đến nơi',
        explanationVi:
          'Dùng để nhấn mạnh hành động tác động lên tân ngữ và làm thay đổi vị trí, trạng thái của nó. Thay vì nói "Đưa hộ chiếu cho tôi" (给护照我), tiếng Trung chuẩn nói "把护照给我".',
        examples: [
          { hanzi: '请把护照给我。', pinyin: 'Qǐng bǎ hùzhào gěi wǒ.', vietnamese: 'Làm ơn đưa hộ chiếu cho tôi.' },
          { hanzi: '我把房卡放在桌子上了。', pinyin: 'Wǒ bǎ fángkǎ fàng zài zhuōzi shang le.', vietnamese: 'Tôi đã để thẻ phòng trên bàn rồi.' },
        ],
      },
      {
        id: 'hsk3-01-g2',
        title: 'Cặp liên từ điều kiện "只要...就/会..." (zhǐyào...jiù/huì...)',
        pattern: '只要 + Điều kiện + 就 / 会 + Kết quả',
        explanationVi:
          'Biểu thị điều kiện đầy đủ: chỉ cần thỏa mãn vế trước thì lập tức có được kết quả ở vế sau.',
        examples: [
          { hanzi: '只要你努力，就会学好中文。', pinyin: 'Zhǐyào nǐ nǔlì, jiù huì xué hǎo Zhōngwén.', vietnamese: 'Chỉ cần bạn nỗ lực thì sẽ học tốt tiếng Trung.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk3-01-q1',
        type: 'single_choice',
        prompt: 'Thuật ngữ "押金" (yājīn) trong giao tiếp khách sạn có nghĩa là gì?',
        options: ['Tiền boa phục vụ', 'Tiền đặt cọc', 'Tiền vé máy bay', 'Tiền ăn sáng'],
        correctAnswer: 1,
        explanation: '"押金" là tiền bảo chứng thế chân (tiền đặt cọc phòng).',
      },
      {
        id: 'hsk3-01-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu chữ 把: "Làm ơn đưa thẻ phòng cho tôi"',
        orderingTokens: ['给我', '把房卡', '请'],
        correctAnswer: ['请', '把房卡', '给我'],
        explanation: 'Trật tự: Kính ngữ (请) + 把 Tân ngữ (把房卡) + Động từ tiếp nhận (给我).',
      },
      {
        id: 'hsk3-01-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Tôi đã đặt trước phòng đơn" bằng tiếng Hán:',
        targetSpeech: '我预订了单人房',
        pinyin: 'Wǒ yùdìng le dānrén fáng',
        explanation: 'Phát âm chuẩn: Wǒ yùdìng le dānrén fáng.',
        correctAnswer: '我预订了单人房',
      },
    ],
  },

  {
    id: 'hsk3-lesson-02',
    lessonNumber: 2,
    level: 'HSK3',
    title: 'Bài 2: Du lịch & Đặt vé máy bay',
    subtitleVi: '买飞机票, 护照, 行李, 什么时候起飞',
    topicIcon: 'Plane',
    imageUrl: '/images/lessons/hsk3_lesson02_airport_travel.jpg',
    estimatedMinutes: 35,
    summaryVi: 'Các thủ tục làm thủ tục lên máy bay (check-in), kiểm tra hành lý quá cước, cổng lên máy bay và cấu trúc nhấn mạnh 是...的.',
    dialogue: [
      {
        id: 'hsk3-02-d1',
        speaker: 'A',
        speakerName: '机场柜台人员 (Nhân viên quầy sân bay)',
        hanzi: '您好，请出示您的护照和电子客票。',
        pinyin: 'Nín hǎo, qǐng chūshì nín de hùzhào hé diànzǐ kèpiào.',
        vietnamese: 'Xin chào anh, vui lòng xuất trình hộ chiếu và vé máy bay điện tử ạ.',
      },
      {
        id: 'hsk3-02-d2',
        speaker: 'B',
        speakerName: '旅客 (Hành khách)',
        hanzi: '给您。请问飞往上海的航班什么时候起飞？',
        pinyin: 'Gěi nín. Qǐngwèn fēi wǎng Shànghǎi de hángbān shénme shíhou qǐfēi?',
        vietnamese: 'Gửi cô. Cho hỏi chuyến bay đi Thượng Hải khi nào thì cất cánh thế ạ?',
      },
      {
        id: 'hsk3-02-d3',
        speaker: 'A',
        speakerName: '机场人员 (Nhân viên)',
        hanzi: '航班很准时，下午两点十五分起飞，一点四十五分开始登机。',
        pinyin: 'Hángbān hěn zhǔnshí, xiàwǔ liǎng diǎn shíwǔ fēn qǐfēi, yì diǎn sìshíwǔ fēn kāishǐ dēngjī.',
        vietnamese: 'Chuyến bay rất đúng giờ, 2 giờ 15 phút chiều cất cánh, 1 giờ 45 phút bắt đầu mở cửa lên máy bay.',
      },
      {
        id: 'hsk3-02-d4',
        speaker: 'B',
        speakerName: '旅客 (Hành khách)',
        hanzi: '我有两个行李箱要托运，会不会超重？',
        pinyin: 'Wǒ yǒu liǎng gè xínglixiāng yào tuōyùn, huì bú huì chāozhòng?',
        vietnamese: 'Tôi có hai chiếc vali cần ký gửi, liệu có bị quá cước cân nặng không cô?',
      },
      {
        id: 'hsk3-02-d5',
        speaker: 'A',
        speakerName: '机场人员 (Nhân viên)',
        hanzi: '请放在秤上。刚好二十公斤，没有超重。这是您的登机牌，请在18号登机口登机。',
        pinyin: 'Qǐng fàng zài chèng shang. Gānghǎo èrshí gōngjīn, méiyǒu chāozhòng. Zhè shì nín de dēngjīpái, qǐng zài shíbā hào dēngjīkǒu dēngjī.',
        vietnamese: 'Xin anh đặt lên cân. Vừa đúng 20 kg, không bị vượt quá cước. Đây là thẻ lên máy bay của anh, xin mời lên tàu bay tại cửa số 18.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk3-02-sd1',
        hanzi: '航班什么时候起飞？',
        pinyin: 'Hángbān shénme shíhou qǐfēi?',
        vietnamese: 'Chuyến bay khi nào thì cất cánh?',
        difficulty: 'medium',
        pronunciationTipVi: '"qǐfēi" gồm thanh 3 + thanh 1.',
      },
      {
        id: 'hsk3-02-sd2',
        hanzi: '托运行李没有超重。',
        pinyin: 'Tuōyùn xíngli méiyǒu chāozhòng.',
        vietnamese: 'Hành lý ký gửi không bị quá cước.',
        difficulty: 'hard',
        pronunciationTipVi: '"chāozhòng" chữ chāo thanh 1 bật hơi, zhòng thanh 4 giáng nặng.',
      },
      {
        id: 'hsk3-02-sd3',
        hanzi: '这是您的登机牌。',
        pinyin: 'Zhè shì nín de dēngjīpái.',
        vietnamese: 'Đây là thẻ lên máy bay của quý khách.',
        difficulty: 'easy',
        pronunciationTipVi: '"dēngjīpái" thanh 1 + thanh 1 + thanh 2.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk3-02-ss1',
        hanzi: '航班很准时，请提前半小时到18号登机口登机。',
        pinyin: 'Hángbān hěn zhǔnshí, qǐng tíqián bàn xiǎoshí dào shíbā hào dēngjīkǒu dēngjī.',
        vietnamese: 'Chuyến bay rất đúng giờ, xin vui lòng đến cửa số 18 trước nửa tiếng để lên máy bay.',
        focusToneSandhi: 'Thông báo loa phát thanh sân bay chuẩn âm phổ thông',
      },
    ],
    vocabulary: [
      {
        id: 'hsk3-02-v1',
        hanzi: '起飞',
        pinyin: 'qǐfēi',
        meaningVi: 'Cất cánh (máy bay)',
        radical: '走 (Tẩu - chạy/khởi xướng)',
        radicalMeaningVi: 'Nhấc bổng bay lên trời',
        strokeCount: 10,
        exampleSentence: '飞机马上就要起飞了。',
        examplePinyin: 'Fēijī mǎshàng jiù yào qǐfēi le.',
        exampleVi: 'Máy bay sắp sửa cất cánh rồi.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-02-v2',
        hanzi: '行李',
        pinyin: 'xíngli',
        meaningVi: 'Hành lý, đồ đạc mang theo',
        radical: '行 (Hành - đi lại)',
        radicalMeaningVi: 'Đồ đạc mang theo khi đi xa',
        strokeCount: 6,
        exampleSentence: '这是我的托运行李。',
        examplePinyin: 'Zhè shì wǒ de tuōyùn xíngli.',
        exampleVi: 'Đây là hành lý ký gửi của tôi.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-02-v3',
        hanzi: '登机牌',
        pinyin: 'dēngjīpái',
        meaningVi: 'Thẻ lên máy bay (boarding pass)',
        radical: '片 (Phiến - tấm thẻ mỏng)',
        radicalMeaningVi: 'Thẻ bài cho phép bước lên phi cơ',
        strokeCount: 12,
        exampleSentence: '请拿好您的登机牌。',
        examplePinyin: 'Qǐng ná hǎo nín de dēngjīpái.',
        exampleVi: 'Xin hãy cầm chắc thẻ lên tàu bay.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-02-v4',
        hanzi: '准时',
        pinyin: 'zhǔnshí',
        meaningVi: 'Đúng giờ, chuẩn xác',
        radical: '冫 (Băng)',
        radicalMeaningVi: 'Thời gian chính xác không sai lệch',
        strokeCount: 10,
        exampleSentence: '会议准时开始。',
        examplePinyin: 'Huìyì zhǔnshí kāishǐ.',
        exampleVi: 'Cuộc họp bắt đầu đúng giờ.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-02-v5',
        hanzi: '超重',
        pinyin: 'chāozhòng',
        meaningVi: 'Quá tải, vượt quá trọng lượng',
        radical: '走 (Tẩu - vượt quá)',
        radicalMeaningVi: 'Trọng lượng vượt ngưỡng quy định',
        strokeCount: 12,
        exampleSentence: '箱子超重需要补交费用。',
        examplePinyin: 'Xiāngzi chāozhòng xūyào bǔjiāo fèiyong.',
        exampleVi: 'Vali vượt trọng lượng cần phải nộp thêm phụ phí.',
        hskLevel: 'HSK3',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk3-02-g1',
        title: 'Cấu trúc nhấn mạnh "是...的" (shì...de)',
        pattern: 'Chủ ngữ + 是 + [Thời gian / Địa điểm / Phương thức] + Động từ + 的',
        explanationVi:
          'Dùng để nhấn mạnh thời gian, địa điểm, cách thức của một sự việc ĐÃ XẢY RA trong quá khứ.',
        examples: [
          { hanzi: '我是坐飞机来的。', pinyin: 'Wǒ shì zuò fēijī lái de.', vietnamese: 'Tôi là đi bằng máy bay tới đây đấy (nhấn mạnh phương thức).' },
          { hanzi: '他是昨天买的票。', pinyin: 'Tā shì zuótiān mǎi de piào.', vietnamese: 'Anh ấy mua vé từ ngày hôm qua (nhấn mạnh thời gian).' },
        ],
      },
      {
        id: 'hsk3-02-g2',
        title: 'Phân biệt "什么时候" vs "多长时间"',
        pattern: '什么时候 (Khi nào, mấy giờ) | 多长时间 (Bao lâu, khoảng thời gian dài bao nhiêu)',
        explanationVi:
          '"什么时候" hỏi về một mốc thời gian cụ thể (cất cánh lúc mấy giờ). "多长时间" hỏi về độ dài của một khoảng thời gian (bay mất bao nhiêu tiếng).',
        examples: [
          { hanzi: '飞机什么时候起飞？', pinyin: 'Fēijī shénme shíhou qǐfēi?', vietnamese: 'Máy bay lúc nào cất cánh? (mốc thời gian)' },
          { hanzi: '飞行需要多长时间？', pinyin: 'Fēixíng xūyào duō cháng shíjiān?', vietnamese: 'Chuyến bay mất bao lâu? (khoảng thời gian)' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk3-02-q1',
        type: 'single_choice',
        prompt: 'Từ "登机牌" (dēngjīpái) có nghĩa là gì?',
        options: ['Vé tàu hỏa', 'Thẻ lên máy bay', 'Hộ chiếu xuất nhập cảnh', 'Bảng chỉ dẫn nhà ga'],
        correctAnswer: 1,
        explanation: '"登机牌" chính là thẻ lên máy bay (boarding pass).',
      },
      {
        id: 'hsk3-02-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Chuyến bay mấy giờ thì cất cánh?"',
        orderingTokens: ['什么时候', '起飞', '航班', '？'],
        correctAnswer: ['航班', '什么时候', '起飞', '？'],
        explanation: 'Trật tự: Chủ ngữ (航班) + Trạng ngữ thời gian nghi vấn (什么时候) + Động từ (起飞).',
      },
      {
        id: 'hsk3-02-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Hành lý của tôi không bị quá cân" bằng tiếng Trung:',
        targetSpeech: '我的行李没有超重',
        pinyin: 'Wǒ de xíngli méiyǒu chāozhòng',
        explanation: 'Phát âm chuẩn: Wǒ de xíngli méiyǒu chāozhòng.',
        correctAnswer: '我的行李没有超重',
      },
    ],
  },

  {
    id: 'hsk3-lesson-03',
    lessonNumber: 3,
    level: 'HSK3',
    title: 'Bài 3: So sánh & Lựa chọn',
    subtitleVi: 'A比B更..., 一样, 虽然...但是...',
    topicIcon: 'Scale',
    imageUrl: '/images/lessons/hsk3_lesson03_comparison_shopping.jpg',
    estimatedMinutes: 35,
    summaryVi: 'Sử dụng thuần thục câu chữ 比, cấu trúc so sánh bằng (跟...一样), so sánh kèm phó từ 更 và liên từ đối lập 虽然...但是....',
    dialogue: [
      {
        id: 'hsk3-03-d1',
        speaker: 'A',
        speakerName: '顾客 (Khách mua đồ công nghệ)',
        hanzi: '请问这两款手机哪一款更好用？我想比较一下。',
        pinyin: 'Qǐngwèn zhè liǎng kuǎn shǒujī nǎ yì kuǎn gèng hǎo yòng? Wǒ xiǎng bǐjiào yíxià.',
        vietnamese: 'Cho hỏi hai mẫu điện thoại này mẫu nào dùng tốt hơn? Tôi muốn so sánh một chút.',
      },
      {
        id: 'hsk3-03-d2',
        speaker: 'B',
        speakerName: '售货员 (Nhân viên bán hàng)',
        hanzi: '这款A比那款B更轻，而且屏幕也更大一些。',
        pinyin: 'Zhè kuǎn A bǐ nà kuǎn B gèng qīng, érqiě píngmù yě gèng dà yìxiē.',
        vietnamese: 'Mẫu A này nhẹ hơn mẫu B kia, hơn nữa màn hình cũng lớn hơn đôi chút.',
      },
      {
        id: 'hsk3-03-d3',
        speaker: 'A',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '价格方面呢？两款手机价格一样吗？',
        pinyin: 'Jiàgé fāngmiàn ne? Liǎng kuǎn shǒujī jiàgé yíyàng ma?',
        vietnamese: 'Về mặt giá cả thì sao? Hai mẫu này giá có bằng nhau không?',
      },
      {
        id: 'hsk3-03-d4',
        speaker: 'B',
        speakerName: '售货员 (Nhân viên)',
        hanzi: '虽然A款比B款贵五百块，但是它的电池更耐用，拍照也更清楚。',
        pinyin: 'Suīrán A kuǎn bǐ B kuǎn guì wǔbǎi kuài, dànshì tā de diànchí gèng nàiyòng, pāizhào yě gèng qīngchu.',
        vietnamese: 'Tuy rằng mẫu A đắt hơn mẫu B 500 tệ, nhưng pin của nó bền hơn nhiều, chụp ảnh cũng sắc nét hơn hẳn.',
      },
      {
        id: 'hsk3-03-d5',
        speaker: 'A',
        speakerName: '顾客 (Khách hàng)',
        hanzi: '经过考虑，我决定选择A款！',
        pinyin: 'Jīngguò kǎolǜ, wǒ juédìng xuǎnzé A kuǎn!',
        vietnamese: 'Sau khi cân nhắc, tôi quyết định lựa chọn mẫu A!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk3-03-sd1',
        hanzi: 'A比B更便宜。',
        pinyin: 'A bǐ B gèng piányi.',
        vietnamese: 'A còn rẻ hơn cả B nữa.',
        difficulty: 'easy',
        pronunciationTipVi: '"gèng" thanh 4 giáng mạnh nhấn mạnh mức độ hơn hẳn.',
      },
      {
        id: 'hsk3-03-sd2',
        hanzi: '这两个一样大。',
        pinyin: 'Zhè liǎng gè yíyàng dà.',
        vietnamese: 'Hai cái này lớn bằng nhau.',
        difficulty: 'easy',
        pronunciationTipVi: '"yíyàng" biến âm chữ 一 thành thanh 2 trước yàng.',
      },
      {
        id: 'hsk3-03-sd3',
        hanzi: '虽然很贵，但是很好用。',
        pinyin: 'Suīrán hěn guì, dànshì hěn hǎo yòng.',
        vietnamese: 'Tuy rằng rất đắt, nhưng dùng rất thích.',
        difficulty: 'medium',
        pronunciationTipVi: 'Cặp liên từ chuyển ý: Suīrán... dànshì...',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk3-03-ss1',
        hanzi: '虽然价格比以前贵了一点儿，但是质量更好了。',
        pinyin: 'Suīrán jiàgé bǐ yǐqián guì le yìdiǎnr, dànshì zhìliàng gèng hǎo le.',
        vietnamese: 'Tuy rằng giá cả đắt hơn trước một chút, nhưng chất lượng lại tốt hơn hẳn.',
        focusToneSandhi: 'Ngữ điệu cân bằng tương phản hai vế đối xứng',
      },
    ],
    vocabulary: [
      {
        id: 'hsk3-03-v1',
        hanzi: '比',
        pinyin: 'bǐ',
        meaningVi: 'So với (giới từ so sánh)',
        radical: '比 (Tỉ)',
        radicalMeaningVi: 'Hai người đứng cạnh nhau so đọ',
        strokeCount: 4,
        exampleSentence: '今天比昨天冷。',
        examplePinyin: 'Jīntiān bǐ zuótiān lěng.',
        exampleVi: 'Hôm nay so với hôm qua lạnh hơn.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-03-v2',
        hanzi: '更',
        pinyin: 'gèng',
        meaningVi: 'Càng, hơn nữa (phó từ tăng tiến)',
        radical: '曰 (Viết)',
        radicalMeaningVi: 'Thêm một bậc cao hơn',
        strokeCount: 7,
        exampleSentence: '明天会更好。',
        examplePinyin: 'Míngtiān huì gèng hǎo.',
        exampleVi: 'Ngày mai sẽ càng tốt đẹp hơn.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-03-v3',
        hanzi: '一样',
        pinyin: 'yíyàng',
        meaningVi: 'Như nhau, bằng nhau, giống nhau',
        radical: '木 (Mộc)',
        radicalMeaningVi: 'Cùng một khuôn mẫu tạo ra',
        strokeCount: 9,
        exampleSentence: '我的想法跟他一样。',
        examplePinyin: 'Wǒ de xiǎngfǎ gēn tā yíyàng.',
        exampleVi: 'Ý nghĩ của tôi giống hệt như anh ấy.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-03-v4',
        hanzi: '决定',
        pinyin: 'juédìng',
        meaningVi: 'Quyết định',
        radical: '氵 (Ba chấm thủy)',
        radicalMeaningVi: 'Dứt khoát đưa ra lựa chọn',
        strokeCount: 7,
        exampleSentence: '我已经做出了决定。',
        examplePinyin: 'Wǒ yǐjīng zuò chū le juédìng.',
        exampleVi: 'Tôi đã đưa ra quyết định rồi.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-03-v5',
        hanzi: '虽然',
        pinyin: 'suīrán',
        meaningVi: 'Tuy rằng, mặc dù',
        radical: '虫 (Trùng)',
        radicalMeaningVi: 'Liên từ nhượng bộ đối lập',
        strokeCount: 9,
        exampleSentence: '虽然雨很大，但是他还是来了。',
        examplePinyin: 'Suīrán yǔ hěn dà, dànshì tā háishi lái le.',
        exampleVi: 'Tuy rằng mưa to, nhưng anh ấy vẫn đến.',
        hskLevel: 'HSK3',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk3-03-g1',
        title: 'Câu so sánh hơn với chữ "比" (bǐ)',
        pattern: 'A + 比 + B + [更] + Tính từ / [Tính từ + 一点儿 / 得多]',
        explanationVi:
          'Khác với tiếng Việt ("A tốt hơn B"), tiếng Trung đưa mốc so sánh lên trước: A比B好 (A so với B tốt). Nếu muốn nhấn mạnh "càng... hơn", thêm phó từ "更" trước tính từ.',
        examples: [
          { hanzi: '这件比那件更便宜。', pinyin: 'Zhè jiàn bǐ nà jiàn gèng piányi.', vietnamese: 'Cái này so với cái kia còn rẻ hơn.' },
          { hanzi: '哥哥比我高得多。', pinyin: 'Gēge bǐ wǒ gāo de duō.', vietnamese: 'Anh trai cao hơn tôi rất nhiều.' },
        ],
      },
      {
        id: 'hsk3-03-g2',
        title: 'Cấu trúc so sánh bằng "A 跟 / 和 B 一样 (+ Tính từ)"',
        pattern: 'A + 跟/和 + B + 一样 (+ Adj)',
        explanationVi:
          'Dùng để so sánh sự tương đồng giữa hai đối tượng. Phủ định: "A 跟 B 不一样".',
        examples: [
          { hanzi: '他跟我一样高。', pinyin: 'Tā gēn wǒ yíyàng gāo.', vietnamese: 'Anh ấy cao bằng tôi.' },
          { hanzi: '汉语和英语不一样。', pinyin: 'Hànyǔ hé Yīngyǔ bù yíyàng.', vietnamese: 'Tiếng Hán và tiếng Anh không giống nhau.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk3-03-q1',
        type: 'single_choice',
        prompt: 'Câu nào diễn đạt chính xác ý: "Anh ấy cao hơn tôi"?',
        options: ['他比我高。', '他高比我。', '他和我一样高。', '他比我更不高。'],
        correctAnswer: 0,
        explanation: 'Trật tự câu so sánh chuẩn: A + 比 + B + Tính từ (他比我高).',
      },
      {
        id: 'hsk3-03-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Tuy trời mưa nhưng chúng tôi vẫn đi"',
        orderingTokens: ['下雨', '虽然', '但是', '我们还是去了'],
        correctAnswer: ['虽然', '下雨', '但是', '我们还是去了'],
        explanation: 'Trật tự: 虽然 vế 1, 但是 vế 2.',
      },
      {
        id: 'hsk3-03-q3',
        type: 'speaking_response',
        prompt: 'Nói câu so sánh: "Cái này rẻ hơn cái kia" vào mic:',
        targetSpeech: '这个比那个便宜',
        pinyin: 'Zhège bǐ nàge piányi',
        explanation: 'Phát âm chuẩn: Zhège bǐ nàge piányi.',
        correctAnswer: '这个比那个便宜',
      },
    ],
  },

  {
    id: 'hsk3-lesson-04',
    lessonNumber: 4,
    level: 'HSK3',
    title: 'Bài 4: Kể về một chuyến đi đáng nhớ',
    subtitleVi: '短文, 叙述经历, 拍照, 难忘',
    topicIcon: 'Camera',
    imageUrl: '/images/lessons/hsk3_lesson04_great_wall_trip.jpg',
    estimatedMinutes: 40,
    summaryVi: 'Năng lực tự sự ngắn gọn, kể lại kỷ niệm du lịch (Vạn Lý Trường Thành, Cố Cung), chụp ảnh phong cảnh, trợ từ động thái 过 và cấu trúc 一边...一边....',
    dialogue: [
      {
        id: 'hsk3-04-d1',
        speaker: 'A',
        speakerName: '朋友 (Bạn học)',
        hanzi: '大卫，你去过北京吗？对那里的印象怎么样？',
        pinyin: 'Dàwèi, nǐ qù guo Běijīng ma? Duì nàlǐ de yìnxiàng zěnmeyàng?',
        vietnamese: 'David ơi, cậu đã từng đến Bắc Kinh chưa? Ấn tượng của cậu về nơi đó thế nào?',
      },
      {
        id: 'hsk3-04-d2',
        speaker: 'B',
        speakerName: '大卫 (David - Tự sự kể chuyện)',
        hanzi: '我去过一次。去年暑假，我和朋友去北京旅游，那是一次非常难忘的经历。',
        pinyin: 'Wǒ qù guo yí cì. Qùnián shǔjià, wǒ hé péngyou qù Běijīng lǚyóu, nà shì yí cì fēicháng nánwàng de jīnglì.',
        vietnamese: 'Mình từng đi một lần rồi. Kỳ nghỉ hè năm ngoái, mình cùng bạn đi du lịch Bắc Kinh, đó thực sự là một trải nghiệm vô cùng khó quên.',
      },
      {
        id: 'hsk3-04-d3',
        speaker: 'A',
        speakerName: '朋友 (Bạn học)',
        hanzi: '你们都去参观了哪些地方？',
        pinyin: 'Nǐmen dōu qù cānguān le nǎxiē dìfang?',
        vietnamese: 'Các cậu đã đi tham quan những địa danh nào vậy?',
      },
      {
        id: 'hsk3-04-d4',
        speaker: 'B',
        speakerName: '大卫 (David)',
        hanzi: '我们参观了故宫和长城。长城上的风景美丽极了！我们一边爬长城，一边拍了很多照片。',
        pinyin: 'Wǒmen cānguān le Gùgōng hé Chángchéng. Chángchéng shang de fēngjǐng měilì jí le! Wǒmen yìbiān pá Chángchéng, yìbiān pāi le hěn duō zhàopiàn.',
        vietnamese: 'Tụi mình đã tham quan Cố Cung và Vạn Lý Trường Thành. Phong cảnh trên Vạn Lý Trường Thành đẹp tuyệt vời! Tụi mình vừa leo Trường Thành vừa chụp rất nhiều bức ảnh đẹp.',
      },
      {
        id: 'hsk3-04-d5',
        speaker: 'A',
        speakerName: '朋友 (Bạn học)',
        hanzi: '听起来真棒！以后有机会我也想亲自去看看。',
        pinyin: 'Tīng qǐlái zhēn bàng! Yǐhòu yǒu jīhuì wǒ yě xiǎng qīnzì qù kànkan.',
        vietnamese: 'Nghe tuyệt thật đấy! Sau này có cơ hội mình cũng muốn đích thân đến đó ngắm nhìn.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk3-04-sd1',
        hanzi: '你去过中国吗？',
        pinyin: 'Nǐ qù guo Zhōngguó ma?',
        vietnamese: 'Bạn đã từng đến Trung Quốc chưa?',
        difficulty: 'easy',
        pronunciationTipVi: '"guo" là trợ từ động thái thanh nhẹ đọc dứt khoát.',
      },
      {
        id: 'hsk3-04-sd2',
        hanzi: '风景美丽极了！',
        pinyin: 'Fēngjǐng měilì jí le!',
        vietnamese: 'Phong cảnh đẹp khôn xiết / đẹp tuyệt đỉnh!',
        difficulty: 'medium',
        pronunciationTipVi: '"jí le" nhấn mạnh cảm thán cực điểm.',
      },
      {
        id: 'hsk3-04-sd3',
        hanzi: '一边走一边拍照。',
        pinyin: 'Yìbiān zǒu yìbiān pāizhào.',
        vietnamese: 'Vừa đi vừa chụp ảnh.',
        difficulty: 'medium',
        pronunciationTipVi: '"Yìbiān" chữ 一 biến âm thành thanh 4 yì trước biān.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk3-04-ss1',
        hanzi: '我们在长城上一边爬山，一边欣赏美景，拍了很多好看的照片。',
        pinyin: 'Wǒmen zài Chángchéng shang yìbiān páshān, yìbiān xīnshǎng měijǐng, pāi le hěn duō hǎokàn de zhàopiàn.',
        vietnamese: 'Chúng tôi vừa leo núi trên Trường Thành, vừa thưởng ngoạn cảnh đẹp và chụp rất nhiều bức ảnh xinh đẹp.',
        focusToneSandhi: 'Duy trì làn hơi ổn định cho đoạn tự sự 20 âm tiết',
      },
    ],
    vocabulary: [
      {
        id: 'hsk3-04-v1',
        hanzi: '经历',
        pinyin: 'jīnglì',
        meaningVi: 'Trải nghiệm, kinh qua (danh từ / động từ)',
        radical: '纟 (Mịch)',
        radicalMeaningVi: 'Những chặng đường đã từng trải qua',
        strokeCount: 8,
        exampleSentence: '这是一次难忘的经历。',
        examplePinyin: 'Zhè shì yí cì nánwàng de jīnglì.',
        exampleVi: 'Đây là một trải nghiệm khó phai.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-04-v2',
        hanzi: '难忘',
        pinyin: 'nánwàng',
        meaningVi: 'Khó quên, đáng nhớ',
        radical: '又 (Hựu)',
        radicalMeaningVi: 'Khắc ghi không thể lãng quên',
        strokeCount: 9,
        exampleSentence: '那段时光令人难忘。',
        examplePinyin: 'Nà duàn shíguāng lìng rén nánwàng.',
        exampleVi: 'Khoảng thời gian đó khiến lòng người khó quên.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-04-v3',
        hanzi: '拍照',
        pinyin: 'pāizhào',
        meaningVi: 'Chụp ảnh, chụp hình',
        radical: '扌 (Thủ - bàn tay bấm máy)',
        radicalMeaningVi: 'Dùng máy chiếu chụp lại hình ảnh',
        strokeCount: 8,
        exampleSentence: '我们可以拍照吗？',
        examplePinyin: 'Wǒmen kěyǐ pāizhào ma?',
        exampleVi: 'Chúng tôi có thể chụp ảnh ở đây không?',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-04-v4',
        hanzi: '风景',
        pinyin: 'fēngjǐng',
        meaningVi: 'Phong cảnh, cảnh sắc thiên nhiên',
        radical: '风 (Phong - gió trời)',
        radicalMeaningVi: 'Cảnh sắc mây trời gió mát',
        strokeCount: 4,
        exampleSentence: '这里的风景很优美。',
        examplePinyin: 'Zhèlǐ de fēngjǐng hěn yōuměi.',
        exampleVi: 'Phong cảnh nơi đây rất thanh nhã và tươi đẹp.',
        hskLevel: 'HSK3',
      },
      {
        id: 'hsk3-04-v5',
        hanzi: '极了',
        pinyin: 'jí le',
        meaningVi: 'Cực kỳ, vô cùng (bổ ngữ chỉ mức độ)',
        radical: '木 (Mộc)',
        radicalMeaningVi: 'Đạt tới nóc nhà, tột đỉnh',
        strokeCount: 7,
        exampleSentence: '这道菜好吃极了！',
        examplePinyin: 'Zhè dào cài hǎochī jí le!',
        exampleVi: 'Món ăn này ngon cực kỳ luôn!',
        hskLevel: 'HSK3',
      },
    ],
    grammarNotes: [
      {
        id: 'hsk3-04-g1',
        title: 'Trợ từ động thái "过" (guo) biểu thị trải nghiệm trong quá khứ',
        pattern: 'Chủ ngữ + Động từ + 过 + Tân ngữ',
        explanationVi:
          'Dùng để diễn tả một hành động, sự việc mà chủ ngữ "đã từng" nếm trải trong quá khứ (nay đã kết thúc). Phủ định bắt buộc dùng "没 / 没有 + V + 过".',
        examples: [
          { hanzi: '我去过北京。', pinyin: 'Wǒ qù guo Běijīng.', vietnamese: 'Tôi đã từng đi Bắc Kinh rồi.' },
          { hanzi: '我没吃过烤鸭。', pinyin: 'Wǒ méi chī guo kǎoyā.', vietnamese: 'Tôi chưa từng ăn vịt quay.' },
        ],
      },
      {
        id: 'hsk3-04-g2',
        title: 'Cấu trúc đồng thời "一边...一边..." (yìbiān...yìbiān...)',
        pattern: 'Chủ ngữ + 一边 + Động từ 1 + 一边 + Động từ 2',
        explanationVi:
          'Diễn tả hai hành động diễn ra song song cùng một thời điểm ("vừa làm việc này vừa làm việc kia").',
        examples: [
          { hanzi: '我们一边走一边聊天。', pinyin: 'Wǒmen yìbiān zǒu yìbiān liáotiān.', vietnamese: 'Chúng tôi vừa đi bộ vừa trò chuyện.' },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk3-04-q1',
        type: 'single_choice',
        prompt: 'Để diễn tả ý: "Tôi chưa từng đi Trung Quốc", câu nào là chuẩn xác?',
        options: [
          '我没有去过中国。',
          '我不去中国。',
          '我去了中国。',
          '我不去过中国。',
        ],
        correctAnswer: 0,
        explanation: 'Phủ định của trải nghiệm "V + 过" bắt buộc dùng "没/没有" -> 我没有去过中国.',
      },
      {
        id: 'hsk3-04-q2',
        type: 'ordering',
        prompt: 'Sắp xếp câu: "Bọn họ vừa ăn cơm vừa xem tivi"',
        orderingTokens: ['一边看电视', '一边吃饭', '他们'],
        correctAnswer: ['他们', '一边吃饭', '一边看电视'],
        explanation: 'Trật tự: Chủ ngữ (他们) + 一边 V1 + 一边 V2.',
      },
      {
        id: 'hsk3-04-q3',
        type: 'speaking_response',
        prompt: 'Nói câu: "Phong cảnh đẹp tuyệt vời!" bằng tiếng Trung:',
        targetSpeech: '风景美丽极了',
        pinyin: 'Fēngjǐng měilì jí le',
        explanation: 'Phát âm chuẩn: Fēngjǐng měilì jí le!',
        correctAnswer: '风景美丽极了',
      },
    ],
  },
];

/* ==========================================================================
   6. COMBINED DATASET & EXPORT HELPER FUNCTIONS
   ========================================================================== */

export const ALL_HSK_LESSONS: HSKLesson[] = [
  ...HSK1_LESSONS,
  ...HSK2_LESSONS,
  ...HSK3_LESSONS,
];

/**
 * Lấy danh sách toàn bộ bài học thuộc một cấp độ HSK cụ thể.
 * @param level 'HSK1' | 'HSK2' | 'HSK3'
 */
export function getHSKLevelLessons(level: HSKLevel): HSKLesson[] {
  return ALL_HSK_LESSONS.filter((lesson) => lesson.level === level);
}

/**
 * Tìm bài học theo ID duy nhất (ví dụ: 'hsk1-lesson-01')
 * @param id ID của bài học
 */
export function getHSKLessonById(id: string): HSKLesson | undefined {
  return ALL_HSK_LESSONS.find((lesson) => lesson.id === id);
}

/**
 * Lấy danh sách toàn bộ từ vựng đã được chuẩn hóa trong toàn bộ khóa học HSK 1 - 3,
 * được loại bỏ trùng lặp theo chữ Hán (hanzi).
 */
export function getAllHSK1To3Vocabulary(): CurriculumVocabItem[] {
  const seenHanzi = new Set<string>();
  const allVocab: CurriculumVocabItem[] = [];

  for (const lesson of ALL_HSK_LESSONS) {
    for (const item of lesson.vocabulary) {
      if (!seenHanzi.has(item.hanzi)) {
        seenHanzi.add(item.hanzi);
        allVocab.push(item);
      }
    }
  }

  return allVocab;
}

/**
 * Lấy danh sách tất cả các bài luyện phát âm / nhận diện giọng nói (Speech Drills) theo cấp độ.
 */
export function getHSKSpeechDrillsByLevel(level: HSKLevel): SpeechDrill[] {
  const lessons = getHSKLevelLessons(level);
  return lessons.flatMap((l) => l.speechDrills);
}

/**
 * Lấy thông tin tổng quan cấp độ theo chuẩn New HSK 3.0.
 */
export function getHSKLevelOverview(level: HSKLevel): HSKLevelOverview {
  return HSK_LEVEL_OVERVIEWS[level];
}
