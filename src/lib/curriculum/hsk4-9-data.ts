/**
 * Standardized, pedagogically sound HSK 4 - 9 curriculum dataset (New HSK 3.0 Standard)
 * Designed for advanced Listening (Nghe), Speaking (Nói), and professional communication.
 *
 * Covers:
 * - HSK 4: Workplace communication, Job interviews, Online commerce, "把" (bǎ) sentences, Resultative complements.
 * - HSK 5: News & Economy, Chinese culinary & tea culture, "被" (bèi) passive sentences, Environmental speech.
 * - HSK 6: Business negotiation, Chengyu (idioms), Social psychology & interpersonal communications.
 * - HSK 7-9 Framework: Academic research, Debate & logic, Diplomacy & translation.
 */

import type {
  HSKLevel,
  DialogueLine,
  SpeechDrill,
  ShadowSentence,
  CurriculumVocabItem,
  GrammarNote,
  QuizQuestion,
  HSKLesson,
} from './hsk1-3-data';

export type HSKAdvancedLevel = 'HSK4' | 'HSK5' | 'HSK6' | 'HSK7-9';

export interface HSKAdvancedOverview {
  level: HSKAdvancedLevel;
  titleVi: string;
  wordCountTotal: number;
  wordCountNew: number;
  targetSkillsVi: string;
  cefrEquivalent: string;
}

export const HSK4_TO_9_OVERVIEWS: Record<HSKAdvancedLevel, HSKAdvancedOverview> = {
  HSK4: {
    level: 'HSK4',
    titleVi: 'HSK Cấp 4 — Giao tiếp Công sở & Đời sống Xã hội',
    wordCountTotal: 3245,
    wordCountNew: 1000,
    targetSkillsVi: 'Thảo luận công việc, phỏng vấn xin việc, đàm thoại tự tin, câu chữ 把 và bổ ngữ phức hợp.',
    cefrEquivalent: 'B2',
  },
  HSK5: {
    level: 'HSK5',
    titleVi: 'HSK Cấp 5 — Thuyết trình, Tin tức & Chuyên đề Xã hội',
    wordCountTotal: 4316,
    wordCountNew: 1071,
    targetSkillsVi: 'Nghe hiểu tin tức, bình luận văn hóa, thuyết trình 2-3 phút, câu chữ 被 và liên từ phức.',
    cefrEquivalent: 'C1-',
  },
  HSK6: {
    level: 'HSK6',
    titleVi: 'HSK Cấp 6 — Đàm thoại Tự nhiên, Đàm phán & Thành ngữ',
    wordCountTotal: 5456,
    wordCountNew: 1140,
    targetSkillsVi: 'Giao tiếp tinh tế như người bản xứ, đàm phán thương mại, thành ngữ cổ và sắc thái tâm lý.',
    cefrEquivalent: 'C1',
  },
  'HSK7-9': {
    level: 'HSK7-9',
    titleVi: 'HSK Cấp 7-9 — Học thuật, Tranh biện & Ngoại giao Thương mại',
    wordCountTotal: 11092,
    wordCountNew: 5636,
    targetSkillsVi: 'Báo cáo khoa học, tranh biện phản biện sắc sảo, phiên dịch ngoại giao và đàm phán cấp cao.',
    cefrEquivalent: 'C2',
  },
};

// ============================================================================
// HSK 4 LESSONS (Workplace, Interview, E-commerce, "把" Grammar)
// ============================================================================

export const HSK4_LESSONS: HSKLesson[] = [
  {
    id: 'hsk4-01',
    lessonNumber: 1,
    level: 'HSK4' as HSKLevel,
    title: '面试与求职 — Phỏng vấn xin việc & Giới thiệu bản thân chuyên nghiệp',
    subtitleVi: 'Kỹ năng trả lời phỏng vấn lưu loát, trình bày kinh nghiệm làm việc và mục tiêu nghề nghiệp.',
    topicIcon: 'Briefcase',
    estimatedMinutes: 35,
    summaryVi: 'Học cách sử dụng từ vựng công sở chuyên nghiệp khi phỏng vấn, giới thiệu kinh nghiệm và giải quyết câu hỏi tình huống.',
    dialogue: [
      {
        id: 'hsk4-01-d1',
        speaker: 'A',
        speakerName: '王经理 (Giám đốc Vương)',
        avatar: '👔',
        hanzi: '请你先简单做个自我介绍，好吗？',
        pinyin: 'Qǐng nǐ xiān jiǎndān zuò gè zìwǒ jièshào, hǎo ma?',
        vietnamese: 'Xin mời bạn giới thiệu ngắn gọn về bản thân trước nhé?',
      },
      {
        id: 'hsk4-01-d2',
        speaker: 'B',
        speakerName: '李明 (Lý Minh)',
        avatar: '💼',
        hanzi: '王经理好！我毕业于北京语言大学，专业是国际贸易。',
        pinyin: 'Wáng jīnglǐ hǎo! Wǒ bìyè yú Běijīng Yǔyán Dàxué, zhuānyè shì guójì màoyì.',
        vietnamese: 'Chào Giám đốc Vương! Tôi tốt nghiệp Đại học Ngôn ngữ Bắc Kinh, chuyên ngành Thương mại Quốc tế.',
      },
      {
        id: 'hsk4-01-d3',
        speaker: 'A',
        speakerName: '王经理',
        avatar: '👔',
        hanzi: '你以前有哪些相关的工作经验？',
        pinyin: 'Nǐ yǐqián yǒu nǎxiē xiāngguān de gōngzuò jīngyàn?',
        vietnamese: 'Trước đây bạn đã có những kinh nghiệm làm việc liên quan nào?',
      },
      {
        id: 'hsk4-01-d4',
        speaker: 'B',
        speakerName: '李明',
        avatar: '💼',
        hanzi: '我曾经在外贸公司工作了两年，主要负责市场调研和客户沟通。',
        pinyin: 'Wǒ céngjīng zài wàimào gōngsī gōngzuò le liǎng nián, zhǔyào fùzé shìchǎng diàoyán hé kèhù gōutōng.',
        vietnamese: 'Tôi từng làm việc 2 năm tại công ty ngoại thương, chủ yếu phụ trách nghiên cứu thị trường và giao tiếp với khách hàng.',
      },
      {
        id: 'hsk4-01-d5',
        speaker: 'A',
        speakerName: '王经理',
        avatar: '👔',
        hanzi: '很好！如果被录用，你最快什么时候能入职？',
        pinyin: 'Hěn hǎo! Rúguǒ bèi lùyòng, nǐ zuì kuài shénme shíhou néng rùzhí?',
        vietnamese: 'Rất tốt! Nếu được tuyển dụng, bạn có thể nhận việc sớm nhất vào lúc nào?',
      },
      {
        id: 'hsk4-01-d6',
        speaker: 'B',
        speakerName: '李明',
        avatar: '💼',
        hanzi: '下周一我就可以准时入职，非常感谢贵公司给我这次机会！',
        pinyin: 'Xià zhōu yī wǒ jiù kěyǐ zhǔnshí rùzhí, fēicháng gǎnxiè guì gōngsī gěi wǒ zhè cì jīhuì!',
        vietnamese: 'Thứ Hai tuần sau tôi đã có thể nhận việc đúng giờ, vô cùng cảm ơn quý công ty đã trao cho tôi cơ hội lần này!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk4-01-sd1',
        hanzi: '我毕业于国际贸易专业。',
        pinyin: 'Wǒ bìyè yú guójì màoyì zhuānyè.',
        vietnamese: 'Tôi tốt nghiệp chuyên ngành Thương mại Quốc tế.',
        difficulty: 'medium',
        pronunciationTipVi: '"bìyè yú" (毕业于) là mẫu câu trang trọng chỉ trường/ngành tốt nghiệp.',
      },
      {
        id: 'hsk4-01-sd2',
        hanzi: '我曾经负责客户沟通与市场调研。',
        pinyin: 'Wǒ céngjīng fùzé kèhù gōutōng yǔ shìchǎng diàoyán.',
        vietnamese: 'Tôi từng phụ trách giao tiếp khách hàng và nghiên cứu thị trường.',
        difficulty: 'hard',
        pronunciationTipVi: '"céngjīng" (曾经 - thanh 2 + thanh 1), "fùzé" (负责 - thanh 4 + thanh 2).',
      },
      {
        id: 'hsk4-01-sd3',
        hanzi: '希望有机会加入贵公司团队。',
        pinyin: 'Xīwàng yǒu jīhuì jiārù guì gōngsī tuánduì.',
        vietnamese: 'Hy vọng có cơ hội gia nhập đội ngũ quý công ty.',
        difficulty: 'medium',
        pronunciationTipVi: '"guì gōngsī" (贵公司) thể hiện sự tôn trọng lịch thiệp trong giao tiếp công sở.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk4-01-ss1',
        hanzi: '在两年的外贸工作中，我积累了丰富的客户沟通经验。',
        pinyin: 'Zài liǎng nián de wàimào gōngzuò zhōng, wǒ jīlěi le fēngfù de kèhù gōutōng jīngyàn.',
        vietnamese: 'Trong 2 năm làm ngoại thương, tôi đã tích lũy được nhiều kinh nghiệm giao tiếp với khách hàng.',
        focusToneSandhi: 'Nhịp điệu ngắt hơi tự nhiên ở cụm giới từ "Zài...gōngzuò zhōng".',
      },
    ],
    vocabulary: [
      {
        id: 'hsk4-01-v1',
        hanzi: '面试',
        pinyin: 'miànshì',
        meaningVi: 'Phỏng vấn (xin việc)',
        radical: '面 (Diện - khuôn mặt)',
        strokeCount: 9,
        exampleSentence: '明天上午我有一个重要的工作面试。',
        examplePinyin: 'Míngtiān shàngwǔ wǒ yǒu yí gè zhòngyào de gōngzuò miànshì.',
        exampleVi: 'Sáng mai tôi có một buổi phỏng vấn công việc quan trọng.',
        hskLevel: 'HSK4' as HSKLevel,
      },
      {
        id: 'hsk4-01-v2',
        hanzi: '简历',
        pinyin: 'jiǎnlì',
        meaningVi: 'Hồ sơ lý lịch, CV',
        radical: '竹 (Trúc - tre, sách thẻ tre xưa)',
        strokeCount: 17,
        exampleSentence: '请把你的中文简历发到我的电子邮箱。',
        examplePinyin: 'Qǐng bǎ nǐ de zhōngwén jiǎnlì fā dào wǒ de diànzǐ yóuxiāng.',
        exampleVi: 'Xin vui lòng gửi CV tiếng Trung của bạn vào email của tôi.',
        hskLevel: 'HSK4' as HSKLevel,
      },
      {
        id: 'hsk4-01-v3',
        hanzi: '负责',
        pinyin: 'fùzé',
        meaningVi: 'Phụ trách, có trách nhiệm',
        radical: '贝 (Bối - tiền của)',
        strokeCount: 9,
        exampleSentence: '他是负责这个项目的经理。',
        examplePinyin: 'Tā shì fùzé zhè ge xiàngmù de jīnglǐ.',
        exampleVi: 'Anh ấy là người quản lý phụ trách dự án này.',
        hskLevel: 'HSK4' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk4-01-gn1',
        title: 'Giới từ "于" (yú) trong văn phong trang trọng',
        pattern: 'Động từ + 于 + Danh từ (Thời gian / Địa điểm / Lĩnh vực)',
        explanationVi: '"于" tương đương với "在" (ở, tại, từ) nhưng dùng nhiều trong văn viết và giao tiếp trang trọng.',
        examples: [
          {
            hanzi: '我毕业于北京大学。',
            pinyin: 'Wǒ bìyè yú Běijīng Dàxué.',
            vietnamese: 'Tôi tốt nghiệp tại Đại học Bắc Kinh.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk4-01-q1',
        type: 'single_choice',
        prompt: '李明在以前的公司主要负责什么工作？ (Lý Minh ở công ty cũ phụ trách việc gì?)',
        options: [
          'A. 软件开发 (Phát triển phần mềm)',
          'B. 市场调研和客户沟通 (Nghiên cứu thị trường và giao tiếp khách hàng)',
          'C. 财务管理 (Quản lý tài chính)',
          'D. 人事招聘 (Tuyển dụng nhân sự)',
        ],
        correctAnswer: 'B. 市场调研和客户沟通 (Nghiên cứu thị trường và giao tiếp khách hàng)',
        explanation: 'Trong bài hội thoại, Lý Minh nói: "主要负责市场调研和客户沟通。"',
      },
    ],
  },
  {
    id: 'hsk4-02',
    lessonNumber: 2,
    level: 'HSK4' as HSKLevel,
    title: '职场与会议 — Đàm thoại công sở & Họp giao ban dự án',
    subtitleVi: 'Báo cáo tiến độ công việc, sắp xếp lịch họp và đề xuất giải pháp nhóm.',
    topicIcon: 'Users',
    estimatedMinutes: 35,
    summaryVi: 'Luyện nghe hiểu diễn tiến cuộc họp công sở, cách đưa ra ý kiến phản hồi và phân công nhiệm vụ.',
    dialogue: [
      {
        id: 'hsk4-02-d1',
        speaker: 'A',
        speakerName: '陈组长 (Trưởng nhóm Trần)',
        avatar: '👩‍💼',
        hanzi: '大家上午好！今天的例会主要讨论下季度的宣传计划。',
        pinyin: 'Dàjiā shàngwǔ hǎo! Jīntiān de lìhuì zhǔyào tǎolùn xià jìdù de xuānchuán jìhuà.',
        vietnamese: 'Chào buổi sáng mọi người! Cuộc họp định kỳ hôm nay chủ yếu thảo luận về kế hoạch truyền thông quý tới.',
      },
      {
        id: 'hsk4-02-d2',
        speaker: 'B',
        speakerName: '小张 (Tiểu Trương)',
        avatar: '👨‍💼',
        hanzi: '陈组长，我已经把策划方案准备好了，请大家过目。',
        pinyin: 'Chén zǔzhǎng, wǒ yǐjīng bǎ cèhuà fāng\'àn zhǔnbèi hǎo le, qǐng dàjiā guòmù.',
        vietnamese: 'Thưa Trưởng nhóm Trần, tôi đã chuẩn bị xong bản kế hoạch rồi, xin mời mọi người xem qua.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk4-02-sd1',
        hanzi: '我已经把报告准备好了。',
        pinyin: 'Wǒ yǐjīng bǎ bàogào zhǔnbèi hǎo le.',
        vietnamese: 'Tôi đã chuẩn bị xong bản báo cáo rồi.',
        difficulty: 'medium',
        pronunciationTipVi: 'Chú ý cấu trúc câu chữ 把: bǎ + tân ngữ + động từ + kết quả.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk4-02-ss1',
        hanzi: '为了保证项目按时完成，我们需要合理安排每个人的工作。',
        pinyin: 'Wèile bǎozhèng xiàngmù ànshí wánchéng, wǒmen xūyào hélǐ ānpái měi gè rén de gōngzuò.',
        vietnamese: 'Để đảm bảo dự án hoàn thành đúng hạn, chúng ta cần sắp xếp công việc của từng người một cách hợp lý.',
        focusToneSandhi: 'Nhịp điệu ngắt hơi ở cụm mục đích "Wèile...wánchéng".',
      },
    ],
    vocabulary: [
      {
        id: 'hsk4-02-v1',
        hanzi: '安排',
        pinyin: 'ānpái',
        meaningVi: 'Sắp xếp, bố trí',
        radical: '扌 (Thủ - bàn tay)',
        strokeCount: 11,
        exampleSentence: '组长把明天的日程安排得很满。',
        examplePinyin: 'Zǔzhǎng bǎ míngtiān de rìchéng ānpái de hěn mǎn.',
        exampleVi: 'Trưởng nhóm đã sắp xếp lịch trình ngày mai rất kín.',
        hskLevel: 'HSK4' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk4-02-gn1',
        title: 'Cấu trúc câu chữ "把" (bǎ) căn bản',
        pattern: 'Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần khác (好/完/到/在...)',
        explanationVi: 'Dùng khi muốn nhấn mạnh sự xử lý, tác động làm biến đổi hoặc chuyển dời tân ngữ.',
        examples: [
          {
            hanzi: '请你把这份文件打印出来。',
            pinyin: 'Qǐng nǐ bǎ zhè fèn wénjiàn dǎyìn chūlái.',
            vietnamese: 'Xin bạn hãy in tài liệu này ra.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk4-02-q1',
        type: 'single_choice',
        prompt: '今天例会的主要议题是什么？ (Chủ đề chính của cuộc họp hôm nay là gì?)',
        options: [
          'A. 讨论下季度的宣传计划 (Thảo luận kế hoạch truyền thông quý tới)',
          'B. 欢迎新入职员工 (Chào đón nhân viên mới)',
          'C. 结算上月财务 (Quyết toán tài chính tháng trước)',
        ],
        correctAnswer: 'A. 讨论下季度的宣传计划 (Thảo luận kế hoạch truyền thông quý tới)',
        explanation: 'Trần tổ trưởng nói: "今天的例会主要讨论下季度的宣传计划。"',
      },
    ],
  },
];

// ============================================================================
// HSK 5 LESSONS (News, Cultural Speeches, "被" Passive, Presentations)
// ============================================================================

export const HSK5_LESSONS: HSKLesson[] = [
  {
    id: 'hsk5-01',
    lessonNumber: 1,
    level: 'HSK5' as HSKLevel,
    title: '新闻报道与经济趋势 — Nghe hiểu bản tin thời sự & Kinh tế',
    subtitleVi: 'Nắm bắt từ vựng báo chí, chỉ số tăng trưởng kinh tế và xu hướng thị trường.',
    topicIcon: 'TrendingUp',
    estimatedMinutes: 40,
    summaryVi: 'Rèn luyện phản xạ nghe tin tức thời sự tốc độ chuẩn của phát thanh viên, các cụm từ kinh tế - tài chính then chốt.',
    dialogue: [
      {
        id: 'hsk5-01-d1',
        speaker: 'A',
        speakerName: '播音员 (Phát thanh viên)',
        avatar: '🎙️',
        hanzi: '各位观众晚上好，欢迎收看财经新闻。据国家统计局公布的数据显示，今年前三季度国内生产总值持续稳定增长。',
        pinyin: 'Gèwèi guānzhòng wǎnshang hǎo, huānyíng shōukàn cáijīng xīnwén. Jù guójiā tǒngjìjú gōngbù de shùjù xiǎnshì, jīnnián qián sān jìdù guónèi shēngchǎn zǒngzhí chíxù wěndìng zēngzhǎng.',
        vietnamese: 'Chào buổi tối quý khán giả, hoan nghênh đón xem bản tin tài chính kinh tế. Theo số liệu công bố từ Cục Thống kê Quốc gia, tổng sản phẩm quốc nội 3 quý đầu năm tiếp tục tăng trưởng ổn định.',
      },
      {
        id: 'hsk5-01-d2',
        speaker: 'B',
        speakerName: '特约评论员 (Bình luận viên đặc biệt)',
        avatar: '📊',
        hanzi: '特别是在数字经济和绿色低碳产业方面，投资规模明显扩大，为未来经济注入了新的活力。',
        pinyin: 'Tèbié shì zài shùzì jīngjì hé lǜsè dītàn chǎnyè fāngmiàn, tóuzī guīmó míngxiǎn kuòdà, wèi wèilái jīngjì zhùrù le xīn de huólì.',
        vietnamese: 'Đặc biệt ở phương diện kinh tế số và ngành công nghiệp phát thải carbon thấp, quy mô đầu tư mở rộng rõ rệt, tiếp thêm sức sống mới cho nền kinh tế tương lai.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk5-01-sd1',
        hanzi: '据统计数据显示，国内生产总值持续增长。',
        pinyin: 'Jù tǒngjì shùjù xiǎnshì, guónèi shēngchǎn zǒngzhí chíxù zēngzhǎng.',
        vietnamese: 'Theo số liệu thống kê cho thấy, tổng sản phẩm quốc nội tăng trưởng liên tục.',
        difficulty: 'hard',
        pronunciationTipVi: '"chíxù zēngzhǎng" (持续增长) là cụm từ thời sự đặc trưng mang thanh 2 và thanh 1.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk5-01-ss1',
        hanzi: '科技创新已成为推动产业转型升级的重要动力。',
        pinyin: 'Kējì chuàngxīn yǐ chéngwéi tuīdòng chǎnyè zhuǎnxíng shēngjí de zhòngyào dònglì.',
        vietnamese: 'Đổi mới khoa học công nghệ đã trở thành động lực quan trọng thúc đẩy chuyển đổi và nâng cấp ngành nghề.',
        focusToneSandhi: 'Chú ý ngữ điệu dứt khoát của câu báo chí trang trọng.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk5-01-v1',
        hanzi: '趋势',
        pinyin: 'qūshì',
        meaningVi: 'Xu hướng, chiều hướng',
        radical: '走 (Tẩu - đi)',
        strokeCount: 15,
        exampleSentence: '绿色环保是未来产业发展的必然趋势。',
        examplePinyin: 'Lǜsè huánbǎo shì wèilái chǎnyè fāzhǎn de bìrán qūshì.',
        exampleVi: 'Bảo vệ môi trường xanh là xu thế tất yếu của phát triển công nghiệp tương lai.',
        hskLevel: 'HSK5' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk5-01-gn1',
        title: 'Cấu trúc "据...显示/报道" (Theo...cho thấy/đưa tin)',
        pattern: '据 + Nguồn tin + 显示 / 报道 / 统计, Mệnh đề kết quả',
        explanationVi: 'Dùng mở đầu câu tin tức hoặc phát biểu trang trọng để trích dẫn nguồn căn cứ khách quan.',
        examples: [
          {
            hanzi: '据专家分析，该产品具有广阔的市场前景。',
            pinyin: 'Jù zhuānjiā fēnxī, gāi chǎnpǐn jùyǒu guǎngkuò de shìchǎng qiánjǐng.',
            vietnamese: 'Theo các chuyên gia phân tích, sản phẩm này có triển vọng thị trường rất rộng mở.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk5-01-q1',
        type: 'single_choice',
        prompt: '新闻中提到哪些产业的投资规模明显扩大？ (Bản tin đề cập quy mô đầu tư ngành nào mở rộng rõ rệt?)',
        options: [
          'A. 房地产与传统制造业 (Bất động sản và chế tạo truyền thống)',
          'B. 数字经济与绿色低碳产业 (Kinh tế số và công nghiệp phát thải carbon thấp)',
          'C. 采矿与重工业 (Khai khoáng và công nghiệp nặng)',
        ],
        correctAnswer: 'B. 数字经济与绿色低碳产业 (Kinh tế số và công nghiệp phát thải carbon thấp)',
        explanation: 'Bình luận viên nêu rõ: "特别是在数字经济和绿色低碳产业方面，投资规模明显扩大。"',
      },
    ],
  },
];

// ============================================================================
// HSK 6 LESSONS (Negotiation, Idioms, Nuances)
// ============================================================================

export const HSK6_LESSONS: HSKLesson[] = [
  {
    id: 'hsk6-01',
    lessonNumber: 1,
    level: 'HSK6' as HSKLevel,
    title: '商务谈判与合作共赢 — Nghệ thuật đàm phán thương mại quốc tế',
    subtitleVi: 'Biểu đạt chiến lược, nhượng bộ có điều kiện và thỏa thuận hợp tác đôi bên cùng có lợi.',
    topicIcon: 'Handshake',
    estimatedMinutes: 45,
    summaryVi: 'Học cách sử dụng ngôn từ đàm phán sắc bén, hòa nhã nhưng giữ vững lập trường chiến lược kinh doanh.',
    dialogue: [
      {
        id: 'hsk6-01-d1',
        speaker: 'A',
        speakerName: '李总 (Tổng giám đốc Lý)',
        avatar: '👨‍💼',
        hanzi: '关于双方签署的战略合作协议，我们始终本着互利共赢的原则推进。',
        pinyin: 'Guānyú shuāngfāng qiānshǔ de zhànlüè hézuò xiéyì, wǒmen shǐzhōng běnzhe hùlì gòngyíng de yuánzé tuījìn.',
        vietnamese: 'Về thỏa thuận hợp tác chiến lược hai bên ký kết, chúng tôi luôn xúc tiến trên nguyên tắc đôi bên cùng có lợi.',
      },
      {
        id: 'hsk6-01-d2',
        speaker: 'B',
        speakerName: '陈代表 (Đại diện Trần)',
        avatar: '🤝',
        hanzi: '李总的高瞻远瞩令人钦佩。只要双方坦诚相待，必定能达成令人满意的成果。',
        pinyin: 'Lǐ zǒng de gāozhānyuǎnzhǔ lìng rén qīnpèi. Zhǐyào shuāngfāng tǎnchéng xiāngdài, bìdìng néng dáchéng lìng rén mǎnyì de chéngguǒ.',
        vietnamese: 'Tầm nhìn xa trông rộng của Tổng giám đốc Lý thật đáng khâm phục. Chỉ cần hai bên chân thành đối đãi, ắt sẽ đạt được thành quả thỏa đáng.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk6-01-sd1',
        hanzi: '我们始终本着互利共赢的原则开展合作。',
        pinyin: 'Wǒmen shǐzhōng běnzhe hùlì gòngyíng de yuánzé kāizhǎn hézuò.',
        vietnamese: 'Chúng tôi luôn triển khai hợp tác trên nguyên tắc đôi bên cùng có lợi.',
        difficulty: 'hard',
        pronunciationTipVi: '"hùlì gòngyíng" (互利共赢) là thành ngữ thương mại kinh điển.',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk6-01-ss1',
        hanzi: '面对复杂多变的市场环境，唯有精诚合作方能立于不败之地。',
        pinyin: 'Miànduì fùzá duōbiàn de shìchǎng huánjìng, wéiyǒu jīngchéng hézuò fāng néng lì yú búbài zhī dì.',
        vietnamese: 'Đối mặt với môi trường thị trường biến ảo khôn lường, chỉ có hợp tác chân thành mới có thể đứng vững ở thế bất bại.',
        focusToneSandhi: 'Khí chất trang trọng, nhịp ngắt uyển chuyển.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk6-01-v1',
        hanzi: '互利共赢',
        pinyin: 'hùlì gòngyíng',
        meaningVi: 'Đôi bên cùng có lợi (thành ngữ)',
        radical: '皿 (Mãnh - đồ đựng)',
        strokeCount: 22,
        exampleSentence: '真正的伙伴关系建立在互利共赢的基础之上。',
        examplePinyin: 'Zhēnzhèng de huǒbàn guānxì jiànlì zài hùlì gòngyíng de jīchǔ zhī shàng.',
        exampleVi: 'Mối quan hệ đối tác thực sự được xây dựng trên nền tảng đôi bên cùng thắng.',
        hskLevel: 'HSK6' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk6-01-gn1',
        title: 'Cấu trúc "本着...的原则" (Dựa trên/xuất phát từ nguyên tắc...)',
        pattern: '本着 + Danh từ/Nguyên tắc + 的原则 / 精神',
        explanationVi: 'Thành ngữ văn thư cao cấp chỉ căn cứ và kim chỉ nam hành động.',
        examples: [
          {
            hanzi: '我们本着实事求是的态度解决问题。',
            pinyin: 'Wǒmen běnzhe shíshìqiúshì de tàidù jiějué wèntí.',
            vietnamese: 'Chúng tôi giải quyết vấn đề trên tinh thần tôn trọng sự thật khách quan.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk6-01-q1',
        type: 'single_choice',
        prompt: '"互利共赢" 的核心含义是什么？ (Ý nghĩa cốt lõi của thành ngữ "hùlì gòngyíng" là gì?)',
        options: [
          'A. 合作双方共同获益 (Hai bên hợp tác cùng hưởng lợi)',
          'B. 一方利益最大化 (Tối đa hóa lợi ích của một bên)',
          'C. 放弃竞争 (Từ bỏ cạnh tranh)',
        ],
        correctAnswer: 'A. 合作双方共同获益 (Hai bên hợp tác cùng hưởng lợi)',
        explanation: '互利共赢 có nghĩa là cả hai bên đối tác cùng chia sẻ lợi ích và phát triển.',
      },
    ],
  },
];

// ============================================================================
// HSK 7-9 FRAMEWORK (Academic, Debate, Diplomacy)
// ============================================================================

export interface HSK7To9Module {
  id: string;
  code: string;
  titleVi: string;
  titleZh: string;
  objectiveVi: string;
  keyTopics: string[];
}

export const HSK7_TO_9_FRAMEWORK: HSK7To9Module[] = [
  {
    id: 'hsk79-m1',
    code: 'ACADEMIC_RESEARCH',
    titleZh: '学术研究与论文答辩',
    titleVi: 'Học thuật chuyên sâu & Bảo vệ luận án nghiên cứu',
    objectiveVi: 'Phân tích tài liệu khoa học, viết báo cáo nghiên cứu và bảo vệ luận điểm học thuật bằng tiếng Trung cao cấp.',
    keyTopics: ['Phương pháp nghiên cứu định tính/định lượng', 'Trích dẫn nguồn học thuật', 'Bảo vệ luận án trước hội đồng'],
  },
  {
    id: 'hsk79-m2',
    code: 'DEBATE_AND_LOGIC',
    titleZh: '深度辩论与逻辑批判',
    titleVi: 'Tranh biện phản biện & Tư duy logic chuyên sâu',
    objectiveVi: 'Phân tích các hiện tượng xã hội đa chiều, sử dụng lý lẽ phản biện sắc bén và bảo vệ lập luận trong tranh luận.',
    keyTopics: ['Lập luận phản bác ngụy biện', 'Thuyết phục đa phương diện', 'Bình luận các vấn đề toàn cầu'],
  },
  {
    id: 'hsk79-m3',
    code: 'DIPLOMACY_TRANSLATION',
    titleZh: '同声传译与国际外交',
    titleVi: 'Dịch thuật cabin, Ngoại giao & Đàm phán đa phương',
    objectiveVi: 'Nắm vững kỹ năng dịch hội nghị, hiểu biết sâu sắc văn hóa và nghi thức ngoại giao chuẩn mực quốc tế.',
    keyTopics: ['Dịch thuật song song cabin', 'Nghi thức hội nghị quốc tế', 'Thuật ngữ chính trị - bang giao'],
  },
];

// ============================================================================
// EXPORT HELPER FUNCTIONS
// ============================================================================

export function getHSK4To9Lessons(level: HSKAdvancedLevel): HSKLesson[] {
  switch (level) {
    case 'HSK4':
      return HSK4_LESSONS;
    case 'HSK5':
      return HSK5_LESSONS;
    case 'HSK6':
      return HSK6_LESSONS;
    case 'HSK7-9':
      return [];
    default:
      return [];
  }
}

export function getHSK4To9LessonById(id: string): HSKLesson | undefined {
  const all = [...HSK4_LESSONS, ...HSK5_LESSONS, ...HSK6_LESSONS];
  return all.find((l) => l.id === id);
}

export function getHSK7To9Framework(): HSK7To9Module[] {
  return HSK7_TO_9_FRAMEWORK;
}

export function getAllHSK4To9Vocabulary(): CurriculumVocabItem[] {
  const vocab: CurriculumVocabItem[] = [];
  [...HSK4_LESSONS, ...HSK5_LESSONS, ...HSK6_LESSONS].forEach((lesson) => {
    vocab.push(...lesson.vocabulary);
  });
  return vocab;
}
