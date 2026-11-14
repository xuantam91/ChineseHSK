/**
 * Chinese Self-Study Methodology & Age-Tiered Curriculum Guide
 * Extracted and systematized from the official Notion Curriculum Roadmap:
 * "LỘ TRÌNH HỌC TIẾNG TRUNG CHO NGƯỜI MỚI BẮT ĐẦU"
 */

export interface EquipmentItem {
  id: string;
  name: string;
  icon: string;
  importance: 'bắt buộc' | 'quan trọng' | 'nên có' | 'tùy chọn';
  purpose: string;
  practicalTip: string;
  tutorialUrl?: string;
}

export interface LearningStep {
  stepNumber: number;
  name: string;
  shortDesc: string;
  fullGuide: string;
  recommendedDuration: string;
  actionChecklist: string[];
}

export interface CriticalMistake {
  id: string;
  mistakeTitle: string;
  impactWhyBad: string;
  solutionHowToFix: string;
}

export interface AgeTierGuide {
  ageRange: string;
  title: string;
  cognitiveCharacteristics: string;
  coreMethodology: string;
  dailyRoutine: string;
  recommendedTextbooks: string[];
  recommendedChannels: { name: string; url: string }[];
  pinyinGuidance: string;
}

export interface TextbookRecommendation {
  targetStage: string;
  recommendedBook: string;
  strengths: string;
  learningPathOrder: string;
  driveFolderUrl?: string;
}

export const EQUIPMENT_CHECKLIST: EquipmentItem[] = [
  {
    id: 'eq-craven-speaker',
    name: 'Bộ Loa Craven & Thẻ nhớ MP3',
    icon: 'Radio',
    importance: 'bắt buộc',
    purpose: 'Nạp âm thanh thụ động (Input âm thanh liên tục) mọi lúc mọi nơi mà không gây hại mắt.',
    practicalTip: 'Bật loa khi con chơi đùa, đi dạo, ăn sáng; trẻ nghe và bắt chước lặp lại theo loa tự nhiên. Tránh bật khi ngủ say.',
    tutorialUrl: 'https://youtu.be/ktOfkyIrB68',
  },
  {
    id: 'eq-pc',
    name: 'Máy tính / Laptop',
    icon: 'Monitor',
    importance: 'quan trọng',
    purpose: 'Tải và sắp xếp tài liệu, file nghe MP3, video giáo trình và in thẻ Flashcard song ngữ.',
    practicalTip: 'Phụ huynh tạo thư mục phân loại theo từng tuần/tháng học để tiện chép vào thẻ nhớ loa Craven.',
  },
  {
    id: 'eq-tv',
    name: 'Màn hình Tivi kết nối Wifi',
    icon: 'Tv',
    importance: 'nên có',
    purpose: 'Cho trẻ xem video hoạt hình bối cảnh với màn hình lớn ở khoảng cách an toàn, tránh hại thị lực.',
    practicalTip: 'Mỗi lần xem từ 15 - 20 phút, tổng thời gian màn hình không quá 30 phút/ngày.',
  },
  {
    id: 'eq-card-reader',
    name: 'Đầu đọc thẻ nhớ / USB',
    icon: 'Usb',
    importance: 'nên có',
    purpose: 'Kết nối máy tính với thẻ nhớ loa Craven để cập nhật các bài hát và mẩu hội thoại mới định kỳ.',
    practicalTip: 'Đánh số thứ tự file (001, 002...) để dễ dàng bấm chọn bài trên bàn phím số của loa.',
  },
];

export const FIVE_STEP_LEARNING_PROCESS: LearningStep[] = [
  {
    stepNumber: 1,
    name: 'Xem Video Bối Cảnh (Video Immersion)',
    shortDesc: 'Xem hình ảnh động để hiểu ngữ cảnh, sắc thái cảm xúc và cốt truyện.',
    fullGuide: 'Cho người học xem video 1 - 2 lần để hiểu bối cảnh câu chuyện, nhân vật đang nói gì trong tình huống cụ thể.',
    recommendedDuration: '10 - 15 phút',
    actionChecklist: [
      'Chọn video ngắn 3 - 5 phút phù hợp trình độ',
      'Quan sát cử chỉ, khẩu hình và bối cảnh giao tiếp',
      'Không bắt ép dịch từng từ sang tiếng Việt ngay',
    ],
  },
  {
    stepNumber: 2,
    name: 'Bật Loa Nghe Thụ Động Lặp Lại (Audio Repetition)',
    shortDesc: 'Tách âm thanh của video đã xem để nghe lặp đi lặp lại qua loa Craven.',
    fullGuide: 'Sau khi đã hiểu bối cảnh ở bước 1, bật file âm thanh MP3 để người học nghe lại nhiều lần. Não bộ sẽ tự liên kết âm thanh với hình ảnh đã xem mà không cần nhìn màn hình.',
    recommendedDuration: '20 - 40 phút / ngày',
    actionChecklist: [
      'Bật âm lượng vừa phải trong lúc vui chơi, thư giãn',
      'Tập trung lắng nghe ngữ điệu và phát âm chuẩn',
      'Khuyến khích nhại lại (Shadowing) các từ quen thuộc',
    ],
  },
  {
    stepNumber: 3,
    name: 'Tương Tác Hai Chiều (Interactive Drills)',
    shortDesc: 'Sử dụng thẻ Flashcard hoặc sách tranh để hỏi đáp phản xạ.',
    fullGuide: 'Phụ huynh hoặc bạn học cầm thẻ Flashcard, giơ tranh ảnh hoặc chỉ vào đồ vật thực tế xung quanh để đố và tạo cơ hội cho người học bật ra từ vựng tiếng Trung.',
    recommendedDuration: '10 - 15 phút',
    actionChecklist: [
      'Chơi trò lật thẻ ghi nhớ, tìm chữ Hán',
      'Hỏi mẫu câu đơn giản: 这是什么？(Đây là cái gì?)',
      'Tạo không khí vui vẻ, khen ngợi ngay khi phát âm đúng',
    ],
  },
  {
    stepNumber: 4,
    name: 'Kiểm Tra Phản Xạ Nhanh (Reflex Recall Check)',
    shortDesc: 'Nhìn tranh/thẻ tự nói lại từ vựng hoặc chỉ đúng thẻ khi nghe âm.',
    fullGuide: 'Đánh giá khả năng ghi nhớ tự nhiên: Với trẻ nhỏ dưới 3 tuổi, chỉ cần chỉ đúng thẻ khi nghe thấy từ; với người học từ 4 tuổi trở lên, nhìn tranh và tự giác nói lại chuẩn xác.',
    recommendedDuration: '5 - 10 phút',
    actionChecklist: [
      'Nếu chưa nhớ: Chuyển tiếp nhẹ nhàng, ôn lại bài cũ vào hôm sau',
      'Tuyệt đối không la mắng hay tạo áp lực tâm lý sợ sai',
      'Ghi nhận mức độ tiến bộ theo từng tuần',
    ],
  },
  {
    stepNumber: 5,
    name: 'Lồng Tiếng Video & Kể Chuyện (Dubbing & Speech Output)',
    shortDesc: 'Tắt tiếng video và tự lồng tiếng lại theo nhân vật trong phim hoạt hình.',
    fullGuide: 'Áp dụng cho các video truyện hoặc mẩu phim ngắn khi người học đã nắm vững khoảng 80% lời thoại. Đây là bước đột phá giúp rèn luyện ngữ điệu, ngữ khí và sự tự tin giao tiếp đỉnh cao.',
    recommendedDuration: '10 - 15 phút',
    actionChecklist: [
      'Tắt âm lượng video gốc, bật phụ đề chữ Hán/Pinyin',
      'Học viên nhập vai nhân vật nói đuổi theo khẩu hình',
      'Ghi âm lại để đối chiếu và tự sửa lỗi phát âm',
    ],
  },
];

export const CRITICAL_MISTAKES_TO_AVOID: CriticalMistake[] = [
  {
    id: 'mis-1',
    mistakeTitle: 'Học tiếng Trung "bồi" (dùng chữ cái tiếng Việt ghi âm)',
    impactWhyBad: 'Ghi âm bồi làm hỏng khẩu hình, lệch thanh điệu và biến âm sai. Về sau cực kỳ khó sửa và gây điếc ngôn ngữ (không nghe hiểu được người bản ngữ nói gì).',
    solutionHowToFix: 'Học chuẩn bảng chữ cái phiên âm quốc tế Pinyin (21 thanh mẫu, 36 vận mẫu, 4 thanh điệu) qua khẩu hình chuẩn và nghe giọng đọc bản xứ từ đầu.',
  },
  {
    id: 'mis-2',
    mistakeTitle: 'Nạp từ vựng rời rạc, khó nhớ không theo ngữ cảnh',
    impactWhyBad: 'Học danh sách từ ngẫu nhiên sẽ nhanh quên, không biết cách ghép câu và gây cảm giác chán nản, quá tải não bộ.',
    solutionHowToFix: 'Học từ vựng theo chủ đề đời sống thiết thực (quần áo, đồ ăn, gia đình, thời gian, hỏi đường) kết hợp ngay vào câu ví dụ sinh hoạt.',
  },
  {
    id: 'mis-3',
    mistakeTitle: 'Học lệch chỉ nghe thụ động mà ngại mở miệng nói',
    impactWhyBad: 'Tạo nên phản xạ ngôn ngữ "câm" — hiểu nhưng không nói được, sợ phát âm sai, thiếu tự tin khi giao tiếp thực tế.',
    solutionHowToFix: 'Khuyến khích nói to ngay từ những từ đầu tiên; áp dụng kỹ thuật Shadowing (nhại giọng theo loa) và lồng tiếng video.',
  },
  {
    id: 'mis-4',
    mistakeTitle: 'Học lan man từ quá nhiều giáo trình cùng một lúc',
    impactWhyBad: 'Mỗi giáo trình có hệ thống từ vựng và thứ tự bài khác nhau. Học cùng lúc nhiều sách dẫn đến phân tán, bài nào cũng dở dang.',
    solutionHowToFix: 'Giai đoạn đầu tập trung tuyệt đối vào 1 - 2 bộ cốt lõi (ví dụ: Little Fox + Easy Steps/HSK Chuẩn), cày sâu đến khi thành thạo mới mở rộng.',
  },
  {
    id: 'mis-5',
    mistakeTitle: 'Đi ngược quy luật tiếp nhận ngôn ngữ tự nhiên',
    impactWhyBad: 'Bắt ép trẻ nhỏ viết chữ Hán và học ngữ pháp phức tạp trước khi biết nghe nói sẽ bóp nghẹt hứng thú học tập.',
    solutionHowToFix: 'Tuân thủ nghiêm ngặt trình tự tự nhiên của loài người: NGHE ➔ NÓI ➔ ĐỌC ➔ VIẾT.',
  },
  {
    id: 'mis-6',
    mistakeTitle: 'Lạm dụng các ứng dụng (App) trên điện thoại quá sớm',
    impactWhyBad: 'Trẻ dễ bị cuốn vào hoạt họa chơi game trên màn hình, hại mắt và giảm khả năng tương tác ngôn ngữ trực tiếp ngoài đời.',
    solutionHowToFix: 'Chỉ xem app như công cụ bổ trợ thêm từ vựng, ưu tiên loa Craven và tương tác trực tiếp với giáo viên/bố mẹ.',
  },
  {
    id: 'mis-7',
    mistakeTitle: 'Dạy Pinyin quá sớm cho trẻ dưới 6 tuổi',
    impactWhyBad: 'Độ tuổi mầm non là thời kỳ vàng não phải chụp nguyên khối mặt chữ Hán qua hình ảnh. Học Pinyin sớm làm trẻ lười nhớ mặt chữ Hán và mất trực giác tượng hình.',
    solutionHowToFix: 'Với trẻ dưới 6 tuổi, chỉ cho chụp mặt chữ Hán qua thẻ Flashcard; sau 6 tuổi hoặc sau khi đã giao tiếp lưu loát mới dạy Pinyin.',
  },
];

export const AGE_TIER_ROADMAPS: AgeTierGuide[] = [
  {
    ageRange: '0 - 3 tuổi',
    title: 'Giai đoạn Thẩm âm & Tắm ngôn ngữ thụ động',
    cognitiveCharacteristics: 'Não bộ nhạy cảm đặc biệt với âm thanh, tiếp thu ngôn ngữ qua trực giác thính giác.',
    coreMethodology: 'Chủ yếu nghe qua loa Craven các bài hát và mẩu hội thoại ngắn; hạn chế tối đa màn hình điện tử.',
    dailyRoutine: 'Bật loa 20 - 30 phút/lần khi trẻ chơi đùa, tắm rửa, ăn nhẹ.',
    recommendedTextbooks: ['Sing your way to Chinese (Tập 1)', 'Flashcard chủ đề đồ vật'],
    recommendedChannels: [
      { name: 'Super JoJo Trung Văn', url: 'https://www.youtube.com/@SuperJoJoCN' },
      { name: 'CoComelon Trung Văn', url: 'https://www.youtube.com/@CoComelonMandarin' },
      { name: 'Pinkfong 碰碰狐', url: 'https://www.youtube.com/watch?v=nAemaOYwynM&list=PLoH5Hm_9zTv2vPjCVQb_CfbwqVLipkF-L' },
    ],
    pinyinGuidance: 'Tuyệt đối KHÔNG học Pinyin. Chỉ nạp âm qua bài hát thiếu nhi.',
  },
  {
    ageRange: '3 - 6 tuổi',
    title: 'Thời kỳ Vàng Bắt chước & Chụp mặt chữ Hán',
    cognitiveCharacteristics: 'Bắt chước ngữ điệu cực nhanh, tư duy hình tượng não phải phát triển mạnh mẽ.',
    coreMethodology: 'Học qua các câu chuyện ngắn của Chinese Little Fox kết hợp bộ thẻ Flashcard chủ đề. Chụp mặt chữ Hán không kèm Pinyin.',
    dailyRoutine: '15 phút xem video bối cảnh + 30 phút nghe loa Craven + 15 phút chơi đố thẻ Flashcard.',
    recommendedTextbooks: [
      'Sing your way to Chinese (Trọn bộ 4 quyển)',
      'Easy Steps to Chinese for Kids (Tập 1a - 2b, không có Pinyin)',
      'Bộ Flashcard 500 chữ Hán tượng hình',
    ],
    recommendedChannels: [
      { name: 'Chinese Little Fox', url: 'https://www.youtube.com/@LittleFoxChinese' },
      { name: 'BabyBus 寶寶巴士', url: 'https://www.youtube.com/@BabyBusTC' },
      { name: 'Béva Songs (貝瓦兒歌)', url: 'https://www.youtube.com/@bevasongs' },
      { name: 'Galaxy Kids Chinese', url: 'https://www.youtube.com/@galaxykidschinese-kidsstor2139' },
    ],
    pinyinGuidance: 'Chưa học Pinyin. Tập trung chụp mặt chữ Hán tượng hình và bật phản xạ nói.',
  },
  {
    ageRange: '6 - 11 tuổi',
    title: 'Phát triển Toàn diện 4 Kỹ năng & Chuẩn hóa Phát âm',
    cognitiveCharacteristics: 'Tư duy logic hình thành, có khả năng tập trung học bài bản và ghi nhớ quy tắc ngữ pháp.',
    coreMethodology: 'Học Pinyin bài bản sau 1 tháng làm quen tiếng Trung. Đẩy mạnh lồng tiếng video hoạt hình, học giáo trình 4 kỹ năng và luyện thi YCT.',
    dailyRoutine: '30 - 45 phút học giáo trình + 15 phút lồng tiếng Little Fox / Peppa Pig.',
    recommendedTextbooks: [
      'Giáo trình YCT 1 - 6 (Youth Chinese Test - Nghe Nói Đọc nhanh nhất)',
      'Easy Steps to Chinese for Kids (Tập 3a - 4b, có Pinyin)',
      'Chinese Made Easy for Kids',
    ],
    recommendedChannels: [
      { name: 'Peppa Pig Tiếng Trung', url: 'https://www.youtube.com/@PeppaPigChineseOfficial' },
      { name: 'Boonie Bears (熊出没之探险日记)', url: 'https://www.youtube.com/playlist?list=PLxrS3n2SvsMpxK88eKMjqG450aXgwxyc9' },
      { name: 'Chinese Little Fox Single Stories Lv 1-2', url: 'https://www.youtube.com/@LittleFoxChinese' },
      { name: 'DinoMomChinese (恐龙妈妈学中文)', url: 'https://www.youtube.com/@dinomomchinese/playlists' },
    ],
    pinyinGuidance: 'Bắt đầu học Pinyin bài bản để chuẩn hóa phát âm, tự sửa lỗi và tra từ điển.',
  },
  {
    ageRange: '12 - 18+ tuổi',
    title: 'Giao tiếp Thực chiến & Chinh phục Chứng chỉ HSK',
    cognitiveCharacteristics: 'Khả năng tư duy trừu tượng, phân tích ngữ pháp, tổng hợp và tự học độc lập cao.',
    coreMethodology: 'Nắm vững Pinyin ngay từ ngày đầu. Học giáo trình HSK chuẩn kết hợp xem phim thực tế (Happy Chinese), đọc báo chí và Shadowing.',
    dailyRoutine: '45 - 60 phút: Từ vựng chuyên sâu + Ngữ pháp thực chiến + Luyện đề HSK + Shadowing.',
    recommendedTextbooks: [
      'Giáo trình Chuẩn HSK 1 - 6 (BLCUP)',
      'Easy Steps to Chinese (Bản Đại Lĩnh)',
      'Kuaile Hanyu (快乐汉语 - Tiếng Trung Vui Vẻ)',
    ],
    recommendedChannels: [
      { name: 'Happy Chinese (Phim tình huống thực tế)', url: 'https://youtube.com/playlist?list=PLdT5MUO4gYEdQBMFtkF5g803FJZOss-ip' },
      { name: 'Everyday Chinese (Khẩu ngữ hàng ngày)', url: 'https://www.youtube.com/@EverydayChinese' },
      { name: 'ChineseFor.Us (Khóa Pinyin & Ngữ pháp chuyên sâu)', url: 'https://www.youtube.com/@ChineseForUs' },
      { name: 'Xiaomin Chinese Reading & Listening', url: 'https://www.youtube.com/watch?v=x3kIquP9I6E&list=PL9ES2MCH3ulh8M34lhbg3zOrOKEhegP2g' },
    ],
    pinyinGuidance: 'Học ngay tuần đầu tiên. Làm chủ biến điệu, nửa thanh 3, khinh thanh và uốn lưỡi âm 儿化.',
  },
];

export const TEXTBOOK_SELECTION_MATRIX: TextbookRecommendation[] = [
  {
    targetStage: 'Mầm non (3 - 5 tuổi)',
    recommendedBook: 'Sing your way to Chinese ➔ Easy steps to Chinese for kids (1a - 2b)',
    strengths: 'Hoàn toàn không có Pinyin trong tập 1a-2b, tranh vẽ lớn rực rỡ, học thông qua bài hát và vận động cắt dán thủ công.',
    learningPathOrder: 'Học Sing your way trước để nạp âm ➔ Chuyển sang Easy steps for kids.',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1ZxUAmIh3f4O2Jd5AWQJNEd107BSiKynf?usp=sharing',
  },
  {
    targetStage: 'Tiểu học (6 - 11 tuổi) - Mục tiêu Nghe Nói nhanh nhất',
    recommendedBook: 'Giáo trình YCT 1 - 6 (Youth Chinese Test)',
    strengths: 'Bám sát khung bài thi chuẩn quốc tế cho thiếu nhi, câu ngắn, thiết thực, kết hợp đọc truyện Little Fox và Flashcard.',
    learningPathOrder: 'Học theo thứ tự YCT 1 đến YCT 6; thi đỗ YCT 4 tương đương HSK 3.',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1RbrK9FqQEERL2NVNjUMOLYuMU9sJ1QIr?usp=sharing',
  },
  {
    targetStage: 'Tiểu học (6 - 11 tuổi) - Phát triển toàn diện 4 kỹ năng',
    recommendedBook: 'Easy steps to Chinese for kids (Tập 1a - 4b)',
    strengths: 'Thiết kế khoa học, từ tập 3a bắt đầu có Pinyin, rèn luyện đồng đều Nghe - Nói - Đọc - Viết.',
    learningPathOrder: 'Học tuần tự 8 tập (1a, 1b, 2a, 2b, 3a, 3b, 4a, 4b).',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1RbrK9FqQEERL2NVNjUMOLYuMU9sJ1QIr?usp=sharing',
  },
  {
    targetStage: 'Cấp 2 & Thanh thiếu niên (12 - 15 tuổi)',
    recommendedBook: 'Kuaile Hanyu (快乐汉语) & Easy Steps to Chinese (Bản Đại Lĩnh)',
    strengths: 'Có video tình huống đời thực, app bổ trợ, tích lũy khoảng 600 chữ Hán giao tiếp tự nhiên.',
    learningPathOrder: 'Kuaile Hanyu 1 - 3 ➔ Chuyển tiếp lên luyện đề thi HSK.',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1xtKHA7mUF343e9VDwOO_g65BEldbbFec?usp=sharing',
  },
  {
    targetStage: 'Từ lớp 7 & Người lớn (Chinh phục HSK 1 - 6)',
    recommendedBook: 'Giáo trình Chuẩn HSK (Standard Course HSK) - BLCUP',
    strengths: 'Bộ sách chính thống của Đại học Ngôn ngữ Bắc Kinh, từ vựng và ngữ pháp bám sát 100% đề thi HSK thực tế.',
    learningPathOrder: 'HSK 1 (150 từ) ➔ HSK 2 (300 từ) ➔ HSK 3 (600 từ) ➔ HSK 4-6.',
    driveFolderUrl: 'https://drive.google.com/drive/folders/1AlTr1FMUONPdt5znHh5HbB9OJqW7-E_5?usp=sharing',
  },
];
