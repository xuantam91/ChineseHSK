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
      {
        id: 'hsk4-02-d3',
        speaker: 'A',
        speakerName: '陈组长',
        avatar: '👩‍💼',
        hanzi: '方案写得非常详细。大家看看还有没有需要补充的地方？',
        pinyin: 'Fāng\'àn xiě de fēicháng xiángxì. Dàjiā kànkan hái yǒu méiyǒu xūyào bǔchōng de dìfang?',
        vietnamese: 'Bản kế hoạch viết rất chi tiết. Mọi người xem còn chỗ nào cần bổ sung không?',
      },
      {
        id: 'hsk4-02-d4',
        speaker: 'B',
        speakerName: '小张',
        avatar: '👨‍💼',
        hanzi: '如果大家没有异议，我们就按照这个进度表执行。',
        pinyin: 'Rúguǒ dàjiā méiyǒu yìyì, wǒmen jiù ànzhào zhè gè jìndùbiǎo zhíxíng.',
        vietnamese: 'Nếu mọi người không có ý kiến khác, chúng ta sẽ thực hiện theo đúng bảng tiến độ này.',
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
      {
        id: 'hsk4-02-sd2',
        hanzi: '请大家按照计划执行任务。',
        pinyin: 'Qǐng dàjiā ànzhào jìhuà zhíxíng rènwu.',
        vietnamese: 'Xin mọi người hãy thực hiện nhiệm vụ theo đúng kế hoạch.',
        difficulty: 'medium',
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
      {
        id: 'hsk4-02-v2',
        hanzi: '方案',
        pinyin: 'fāng\'àn',
        meaningVi: 'Phương án, kế hoạch',
        radical: '木 (Mộc - cây gỗ)',
        strokeCount: 10,
        exampleSentence: '这个解决方案得到了大家的一致赞同。',
        examplePinyin: 'Zhè gè jiějué fāng\'àn dédào le dàjiā de yízhì zàntóng.',
        exampleVi: 'Phương án giải quyết này đã nhận được sự đồng thuận nhất trí của mọi người.',
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
  {
    id: 'hsk4-03',
    lessonNumber: 3,
    level: 'HSK4' as HSKLevel,
    title: '办公室整理与环境 — Sắp xếp nơi làm việc & Câu chữ 把 nâng cao',
    subtitleVi: 'Tổ chức không gian văn phòng, thao tác thiết bị và câu chữ 把 kết hợp bổ ngữ kết quả/phương hướng.',
    topicIcon: 'FolderKanban',
    imageUrl: '/images/lessons/hsk4_lesson03_ba_sentence_office.png',
    estimatedMinutes: 35,
    summaryVi: 'Luyện nói và thực hành chỉ dẫn công việc văn phòng, sử dụng câu chữ 把 để điều phối hồ sơ, vật dụng một cách chính xác.',
    dialogue: [
      {
        id: 'hsk4-03-d1',
        speaker: 'A',
        speakerName: '王秘书 (Thư ký Vương)',
        avatar: '👩‍💼',
        hanzi: '小李，请把上个月的财务报表放到王经理的桌子上。',
        pinyin: 'Xiǎo Lǐ, qǐng bǎ shàng gè yuè de cáiwù bàobiǎo fàng dào Wáng jīnglǐ de zhuōzi shàng.',
        vietnamese: 'Tiểu Lý, phiền bạn đặt bảng báo cáo tài chính tháng trước lên bàn của Giám đốc Vương nhé.',
      },
      {
        id: 'hsk4-03-d2',
        speaker: 'B',
        speakerName: '小李 (Tiểu Lý)',
        avatar: '👨‍💼',
        hanzi: '好的，我已经把它复印好了，这就送过去。',
        pinyin: 'Hǎo de, wǒ yǐjīng bǎ tā fùyìn hǎo le, zhè jiù sòng guòqu.',
        vietnamese: 'Vâng, tôi đã photo xong rồi, giờ tôi mang sang ngay đây.',
      },
      {
        id: 'hsk4-03-d3',
        speaker: 'A',
        speakerName: '王秘书',
        avatar: '👩‍💼',
        hanzi: '顺便把会议室的灯关一下，下班后大家要保持桌面整洁。',
        pinyin: 'Shùnbiàn bǎ huìyìshì de dēng guān yíxià, xiàbān hòu dàjiā yào bǎochí zhuōmiàn zhěngjié.',
        vietnamese: 'Nhân tiện tắt đèn phòng họp giùm tôi luôn nhé, sau giờ tan làm mọi người cần giữ bàn làm việc gọn gàng.',
      },
      {
        id: 'hsk4-03-d4',
        speaker: 'B',
        speakerName: '小李',
        avatar: '👨‍💼',
        hanzi: '没问题，我都记住了，保证把办公室整理得井井有条！',
        pinyin: 'Méi wèntí, wǒ dōu jì zhù le, bǎozhèng bǎ bàngōngshì zhěnglǐ de jǐngjǐng-yǒutiáo!',
        vietnamese: 'Không vấn đề gì, tôi nhớ hết rồi, đảm bảo thu dọn văn phòng ngăn nắp tinh tươm!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk4-03-sd1',
        hanzi: '请把文件放到经理的办公桌上。',
        pinyin: 'Qǐng bǎ wénjiàn fàng dào jīnglǐ de bàngōngzhuō shàng.',
        vietnamese: 'Xin hãy đặt tài liệu lên bàn làm việc của giám đốc.',
        difficulty: 'medium',
      },
      {
        id: 'hsk4-03-sd2',
        hanzi: '下班前请把电脑和灯关掉。',
        pinyin: 'Xiàbān qián qǐng bǎ diànnǎo hé dēng guāndiào.',
        vietnamese: 'Trước khi tan làm xin hãy tắt máy tính và đèn.',
        difficulty: 'easy',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk4-03-ss1',
        hanzi: '养成随手把文件归类的良好习惯，能大幅提高日常工作效率。',
        pinyin: 'Yǎngchéng suíshǒu bǎ wénjiàn guīlèi de liánghǎo xíguàn, néng dàfú tígāo rìcháng gōngzuò xiàolǜ.',
        vietnamese: 'Rèn luyện thói quen tiện tay phân loại tài liệu có thể nâng cao đáng kể hiệu suất làm việc hàng ngày.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk4-03-v1',
        hanzi: '整理',
        pinyin: 'zhěnglǐ',
        meaningVi: 'Sắp xếp, thu dọn',
        radical: '攵 (Phộc - đánh khẽ)',
        strokeCount: 11,
        exampleSentence: '每周末我都把书架重新整理一遍。',
        examplePinyin: 'Měi zhōumò wǒ dōu bǎ shūjià chóngxīn zhěnglǐ yí biàn.',
        exampleVi: 'Mỗi cuối tuần tôi đều sắp xếp lại giá sách một lần.',
        hskLevel: 'HSK4' as HSKLevel,
      },
      {
        id: 'hsk4-03-v2',
        hanzi: '保证',
        pinyin: 'bǎozhèng',
        meaningVi: 'Bảo đảm, cam kết',
        radical: '亻 (Nhân - người)',
        strokeCount: 9,
        exampleSentence: '我保证按时保质完成这项任务。',
        examplePinyin: 'Wǒ bǎozhèng ànshí bǎozhì wánchéng zhè xiàng rènwu.',
        exampleVi: 'Tôi cam kết hoàn thành nhiệm vụ này đúng hạn và đạt chất lượng.',
        hskLevel: 'HSK4' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk4-03-gn1',
        title: 'Câu chữ 把 kết hợp bổ ngữ kết quả (到 / 在 / 给)',
        pattern: 'Chủ ngữ + 把 + Tân ngữ + Động từ + 到/在/给 + Vị trí/Đối tượng',
        explanationVi: 'Nhấn mạnh hành động làm cho tân ngữ chuyển dịch đến một vị trí hoặc chuyển giao cho ai đó.',
        examples: [
          {
            hanzi: '请把名片递给客人。',
            pinyin: 'Qǐng bǎ míngpiàn dì gěi kèrén.',
            vietnamese: 'Xin hãy trao danh thiếp cho khách.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk4-03-q1',
        type: 'single_choice',
        prompt: '王秘书要求小李把财务报表送到哪里？ (Thư ký Vương yêu cầu Tiểu Lý mang báo cáo đến đâu?)',
        options: [
          'A. 会议室 (Phòng họp)',
          'B. 王经理的桌子上 (Trên bàn của Giám đốc Vương)',
          'C. 打印室 (Phòng in ấn)',
          'D. 财务部档案柜 (Tủ hồ sơ phòng tài chính)',
        ],
        correctAnswer: 'B. 王经理的桌子上 (Trên bàn của Giám đốc Vương)',
        explanation: 'Thư ký Vương nói: "请把上个月的财务报表放到王经理的桌子上。"',
      },
    ],
  },
  {
    id: 'hsk4-04',
    lessonNumber: 4,
    level: 'HSK4' as HSKLevel,
    title: '网络购物与物流服务 — Mua sắm trực tuyến & Dịch vụ logistics',
    subtitleVi: 'Tra cứu đơn hàng, liên hệ shipper và quy trình đổi trả hàng trên các nền tảng thương mại điện tử.',
    topicIcon: 'ShoppingBag',
    imageUrl: '/images/lessons/hsk4_lesson04_ecommerce_delivery.png',
    estimatedMinutes: 35,
    summaryVi: 'Học hội thoại thực tế khi nhận bưu phẩm, kiểm tra hàng hóa, đánh giá dịch vụ và liên hệ shipper.',
    dialogue: [
      {
        id: 'hsk4-04-d1',
        speaker: 'A',
        speakerName: '快递小哥 (Nhân viên giao hàng)',
        avatar: '🛵',
        hanzi: '您好！顺丰快递，您的包裹到了，请到楼下签收一下。',
        pinyin: 'Nín hǎo! Shùnfēng kuàidì, nín de bāoguǒ dào le, qǐng dào lóuxià qiānshōu yíxià.',
        vietnamese: 'Xin chào! Chuyển phát nhanh Thuận Phong, kiện hàng của bạn đã tới rồi, phiền bạn xuống tầng nhận ký nhé.',
      },
      {
        id: 'hsk4-04-d2',
        speaker: 'B',
        speakerName: '买家小王 (Khách hàng Tiểu Vương)',
        avatar: '🙋‍♂️',
        hanzi: '师傅您好，我现在在外边开会，能麻烦您把包裹放进快递柜吗？',
        pinyin: 'Shīfu nín hǎo, wǒ xiànzài zài wàibiān kāihuì, néng máfan nín bǎ bāoguǒ fàng jìn kuàidìguì ma?',
        vietnamese: 'Chào bác tài, hiện tôi đang họp ở ngoài, có thể phiền bác bỏ bưu kiện vào tủ gửi đồ thông minh được không?',
      },
      {
        id: 'hsk4-04-d3',
        speaker: 'A',
        speakerName: '快递小哥',
        avatar: '🛵',
        hanzi: '好的，我已经存进去了，取件码稍后会通过短信发到您的手机上。',
        pinyin: 'Hǎo de, wǒ yǐjīng cún jìnqu le, qǔjiàn mǎ shāohòu huì tōngguò duǎnxìn fā dào nín de shǒujī shàng.',
        vietnamese: 'Được rồi, tôi đã cất vào rồi, mã lấy hàng một lát nữa sẽ được gửi qua tin nhắn SMS tới điện thoại của bạn.',
      },
      {
        id: 'hsk4-04-d4',
        speaker: 'B',
        speakerName: '买家小王',
        avatar: '🙋‍♂️',
        hanzi: '太感谢了！服务真周到，我一定会给您好评！',
        pinyin: 'Tài gǎnxiè le! Fúwù zhēn zhōudào, wǒ yídìng huì gěi nín hǎopíng!',
        vietnamese: 'Vô cùng cảm ơn bác! Dịch vụ thật chu đáo, tôi nhất định sẽ đánh giá 5 sao cho bác!',
      },
    ],
    speechDrills: [
      {
        id: 'hsk4-04-sd1',
        hanzi: '请把包裹放进快递柜。',
        pinyin: 'Qǐng bǎ bāoguǒ fàng jìn kuàidìguì.',
        vietnamese: 'Xin hãy đặt bưu kiện vào tủ gửi đồ.',
        difficulty: 'medium',
      },
      {
        id: 'hsk4-04-sd2',
        hanzi: '取件码会发到您的手机上。',
        pinyin: 'Qǔjiàn mǎ huì fā dào nín de shǒujī shàng.',
        vietnamese: 'Mã nhận đồ sẽ được gửi vào điện thoại của bạn.',
        difficulty: 'easy',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk4-04-ss1',
        hanzi: '网购不仅节省了宝贵的时间，而且提供了更加丰富的商品选择。',
        pinyin: 'Wǎnggòu bùjǐn jiéshěng le bǎoguì de shíjiān, érqiě tígōng le gèngjiā fēngfù de shāngpǐn xuǎnzé.',
        vietnamese: 'Mua sắm qua mạng không chỉ tiết kiệm thời gian quý báu mà còn đem lại sự lựa chọn hàng hóa phong phú hơn.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk4-04-v1',
        hanzi: '快递',
        pinyin: 'kuàidì',
        meaningVi: 'Chuyển phát nhanh',
        radical: '辶 (Xước - bước đi)',
        strokeCount: 9,
        exampleSentence: '顺丰快递的配送速度非常快。',
        examplePinyin: 'Shùnfēng kuàidì de pèisòng sùdù fēicháng kuài.',
        exampleVi: 'Tốc độ giao hàng của chuyển phát Thuận Phong rất nhanh.',
        hskLevel: 'HSK4' as HSKLevel,
      },
      {
        id: 'hsk4-04-v2',
        hanzi: '包裹',
        pinyin: 'bāoguǒ',
        meaningVi: 'Bưu kiện, gói hàng',
        radical: '勹 (Bao - bọc lấy)',
        strokeCount: 5,
        exampleSentence: '请确认包裹外包装完好无损再签收。',
        examplePinyin: 'Qǐng quèrèn bāoguǒ wàibāozhuāng wánhǎo-wúsǔn zài qiānshōu.',
        exampleVi: 'Xin xác nhận bao bì bên ngoài còn nguyên vẹn rồi mới ký nhận.',
        hskLevel: 'HSK4' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk4-04-gn1',
        title: 'Liên từ tăng tiến "不仅...而且..." (Không những...mà còn...)',
        pattern: 'Chủ ngữ + 不仅 + Vế 1, 而且 + Vế 2',
        explanationVi: 'Dùng để nối hai mệnh đề cùng chiều hướng, vế sau có mức độ sâu sắc hoặc mở rộng hơn vế trước.',
        examples: [
          {
            hanzi: '这家网店不仅价格便宜，而且售后服务非常好。',
            pinyin: 'Zhè jiā wǎngdiàn bùjǐn jiàgé piányi, érqiě shòuhòu fúwù fēicháng hǎo.',
            vietnamese: 'Cửa hàng trực tuyến này không những giá rẻ mà dịch vụ hậu mãi còn rất tốt.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk4-04-q1',
        type: 'single_choice',
        prompt: '为什么买家让快递员把包裹放进快递柜？ (Vì sao người mua nhờ để bưu kiện vào tủ gửi đồ?)',
        options: [
          'A. 他在外面开会 (Anh ấy đang họp ở bên ngoài)',
          'B. 他不想要这个包裹 (Anh ấy không muốn nhận gói hàng)',
          'C. 他没有带钱 (Anh ấy không mang theo tiền)',
        ],
        correctAnswer: 'A. 他在外面开会 (Anh ấy đang họp ở bên ngoài)',
        explanation: 'Người mua nói: "我现在在外边开会，能麻烦您把包裹放进快递柜吗？"',
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
      {
        id: 'hsk5-01-d3',
        speaker: 'A',
        speakerName: '播音员',
        avatar: '🎙️',
        hanzi: '感谢特约评论员的深刻分析。接下来请观众朋友们继续关注国际财经快讯。',
        pinyin: 'Gǎnxiè tèyuē pínglùnyuán de shēnkè fēnxī. Jiēxiàlái qǐng guānzhòng péngyoumen jìxù guānzhù guójì cáijīng kuàixùn.',
        vietnamese: 'Cảm ơn bài phân tích sâu sắc của bình luận viên đặc biệt. Tiếp theo xin mời quý vị khán giả tiếp tục theo dõi bản tin nhanh tài chính quốc tế.',
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
      {
        id: 'hsk5-01-v2',
        hanzi: '投资',
        pinyin: 'tóuzī',
        meaningVi: 'Đầu tư',
        radical: '扌 (Thủ - bàn tay)',
        strokeCount: 7,
        exampleSentence: '吸引外资对促进本地经济发展至关重要。',
        examplePinyin: 'Xīyǐn wàizī duì cùjìn běndì jīngjì fāzhǎn zhìguān-zhòngyào.',
        exampleVi: 'Thu hút đầu tư nước ngoài có ý nghĩa sống còn để thúc đẩy kinh tế địa phương.',
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
  {
    id: 'hsk5-02',
    lessonNumber: 2,
    level: 'HSK5' as HSKLevel,
    title: '中国茶道与待客礼仪 — Văn hóa trà đạo & Nghệ thuật ẩm thực truyền thống',
    subtitleVi: 'Tìm hiểu 6 nhóm trà chính, phong cách thưởng trà Gongfu và đạo lý xử thế truyền thống Á Đông.',
    topicIcon: 'Coffee',
    imageUrl: '/images/lessons/hsk5_lesson02_tea_culture.png',
    estimatedMinutes: 40,
    summaryVi: 'Học cách đàm đạo về văn hóa thưởng trà truyền thống, các công đoạn pha trà Tử Sa và nghi thức tiếp đãi khách quý.',
    dialogue: [
      {
        id: 'hsk5-02-d1',
        speaker: 'A',
        speakerName: '林老师 (Nghệ nhân trà Lâm)',
        avatar: '🍵',
        hanzi: '欢迎来到茶艺室。在中国，饮茶不仅是一种生活习惯，更蕴含着深厚的文化底蕴。',
        pinyin: 'Huānyíng lái dào cháyìshì. Zài Zhōngguó, yǐnchá bùjǐn shì yì zhǒng shēnghuó xíguàn, gèng yùnhán zhe shēnhòu de wénhuà dǐyùn.',
        vietnamese: 'Chào mừng các bạn đến phòng trà đạo. Tại Trung Quốc, uống trà không chỉ là một thói quen sinh hoạt mà còn hàm chứa chiều sâu văn hóa uyên thâm.',
      },
      {
        id: 'hsk5-02-d2',
        speaker: 'B',
        speakerName: '大卫 (Du học sinh David)',
        avatar: '👨‍🎓',
        hanzi: '林老师，请问功夫茶冲泡时为什么要用紫砂壶？',
        pinyin: 'Lín lǎoshī, qǐngwèn gōngfuchá chōngpào shí wèishénme yào yòng zǐshāhú?',
        vietnamese: 'Thưa cô Lâm, xin hỏi khi pha trà Công Phu tại sao lại dùng ấm Tử Sa?',
      },
      {
        id: 'hsk5-02-d3',
        speaker: 'A',
        speakerName: '林老师',
        avatar: '🍵',
        hanzi: '紫砂壶之所以广受推崇，是因为它透气性好，能最大程度保留茶叶的醇厚香气。',
        pinyin: 'Zǐshāhú zhī suǒyǐ guǎng shòu tuīchóng, shì yīnwèi tā tòuqìxìng hǎo, néng zuì dà chéngdù bǎoliú cháyè de chúnhòu xiāngqì.',
        vietnamese: 'Ấm Tử Sa sở dĩ được tôn sùng rộng rãi là vì nó có độ thoáng khí tốt, giữ được trọn vẹn hương thơm nồng hậu của lá trà.',
      },
      {
        id: 'hsk5-02-d4',
        speaker: 'B',
        speakerName: '大卫',
        avatar: '👨‍🎓',
        hanzi: '原来如此！茶香入口甘甜，令人心旷神怡。',
        pinyin: 'Yuánlái rúcǐ! Cháxiāng rùkǒu gāntián, lìng rén xīnkuàng-shényí.',
        vietnamese: 'Hóa ra là vậy! Hương trà đọng lại vị ngọt lành, khiến lòng người thư thái sảng khoái.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk5-02-sd1',
        hanzi: '紫砂壶之所以广受推崇，是因为它能保留茶香。',
        pinyin: 'Zǐshāhú zhī suǒyǐ guǎng shòu tuīchóng, shì yīnwèi tā néng bǎoliú cháxiāng.',
        vietnamese: 'Ấm Tử Sa sở dĩ được ưa chuộng là vì nó giữ được hương trà.',
        difficulty: 'hard',
      },
      {
        id: 'hsk5-02-sd2',
        hanzi: '品茶讲究心平气和，细品其味。',
        pinyin: 'Pǐnchá jiǎngjiu xīnpíng-qìhé, xì pǐn qí wèi.',
        vietnamese: 'Thưởng trà cần tâm bình khí hòa, cảm nhận kỹ dư vị của nó.',
        difficulty: 'medium',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk5-02-ss1',
        hanzi: '茶道追求的是一种天人合一、淡泊宁静的精神境界。',
        pinyin: 'Chádào zhuīqiú de shì yì zhǒng tiānrén-héyī, dànbó níngjìng de jīngshén jìngjiè.',
        vietnamese: 'Trà đạo hướng tới cảnh giới tinh thần thuận hòa cùng trời đất, an tĩnh và đạm bạc.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk5-02-v1',
        hanzi: '品尝',
        pinyin: 'pǐncháng',
        meaningVi: 'Nếm thử, thưởng thức hương vị',
        radical: '口 (Khẩu - miệng)',
        strokeCount: 9,
        exampleSentence: '请大家品尝一下这款特级铁观音。',
        examplePinyin: 'Qǐng dàjiā pǐncháng yíxià zhè kuǎn tèjí tiěguānyīn.',
        exampleVi: 'Mời mọi người cùng thưởng thức loại trà Thiết Quan Âm đặc biệt này.',
        hskLevel: 'HSK5' as HSKLevel,
      },
      {
        id: 'hsk5-02-v2',
        hanzi: '传统',
        pinyin: 'chuántǒng',
        meaningVi: 'Truyền thống',
        radical: '亻 (Nhân - người)',
        strokeCount: 6,
        exampleSentence: '尊老爱幼是中华民族的传统美德。',
        examplePinyin: 'Zūnlǎo-àiyòu shì Zhōnghuá mínzú de chuántǒng měidé.',
        exampleVi: 'Kính lão yêu trẻ là phẩm chất truyền thống tốt đẹp của dân tộc Trung Hoa.',
        hskLevel: 'HSK5' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk5-02-gn1',
        title: 'Cấu trúc nguyên nhân - kết quả: "之所以...是因为..."',
        pattern: 'Chủ ngữ + 之所以 + Kết quả, 是因为 + Nguyên nhân',
        explanationVi: 'Dùng đảo ngược kết quả lên trước để nhấn mạnh nguyên nhân đằng sau một hiện tượng/sự thật.',
        examples: [
          {
            hanzi: '他之所以成功，是因为他付出了常人难以想象的努力。',
            pinyin: 'Tā zhī suǒyǐ chénggōng, shì yīnwèi tā fùchū le chángrén nányǐ xiǎngxiàng de nǔlì.',
            vietnamese: 'Anh ấy sở dĩ thành công là vì đã bỏ ra nỗ lực người thường khó hình dung.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk5-02-q1',
        type: 'single_choice',
        prompt: '为什么冲泡功夫茶喜欢选用紫砂壶？ (Tại sao pha trà công phu lại chuộng dùng ấm Tử Sa?)',
        options: [
          'A. 价格便宜 (Giá rẻ)',
          'B. 透气性好，能最大程度保留茶香 (Độ thoáng khí tốt, giữ trọn hương trà)',
          'C. 容易清洗 (Dễ chùi rửa)',
        ],
        correctAnswer: 'B. 透气性好，能最大程度保留茶香 (Độ thoáng khí tốt, giữ trọn hương trà)',
        explanation: 'Cô Lâm giải thích: "紫砂壶之所以广受推崇，是因为它透气性好，能最大程度保留茶叶的醇厚香气。"',
      },
    ],
  },
  {
    id: 'hsk5-03',
    lessonNumber: 3,
    level: 'HSK5' as HSKLevel,
    title: '优秀团队表彰与被动表达 — Vinh danh dự án xuất sắc & Câu bị động (Chữ 被)',
    subtitleVi: 'Diễn văn chúc mừng thành tựu, cấu trúc bị động trang trọng và phân tích nguyên nhân - kết quả.',
    topicIcon: 'Award',
    imageUrl: '/images/lessons/hsk5_lesson03_bei_passive.png',
    estimatedMinutes: 40,
    summaryVi: 'Học cách sử dụng câu bị động trong văn phong báo cáo, ca ngợi thành tích tập thể và tổng kết kinh nghiệm dự án.',
    dialogue: [
      {
        id: 'hsk5-03-d1',
        speaker: 'A',
        speakerName: '张总监 (Giám đốc Trương)',
        avatar: '👨‍💼',
        hanzi: '经过评审委员会的严格评估，我们团队研发的新系统被评为年度最具创新奖！',
        pinyin: 'Jīngguò píngshěn wěiyuánhuì de yángé pínggū, wǒmen tuánduì yánfā de xīn xìtǒng bèi píng wéi niándù zuì jù chuàngxīn jiǎng!',
        vietnamese: 'Qua quá trình đánh giá nghiêm ngặt của Hội đồng thẩm định, hệ thống mới do đội ngũ chúng ta phát triển đã được bình chọn là giải Sáng tạo nhất năm!',
      },
      {
        id: 'hsk5-03-d2',
        speaker: 'B',
        speakerName: '研发主管 (Trưởng nhóm R&D)',
        avatar: '👩‍💻',
        hanzi: '太棒了！这个荣誉是对大家几个月来夜以继日辛勤付出的最大肯定。',
        pinyin: 'Tài bàng le! Zhè gè róngyù shì duì dàjiā jǐ gè yuè lái yèyǐjìrì xīnqín fùchū de zuì dà kěndìng.',
        vietnamese: 'Tuyệt vời quá! Vinh dự này là sự ghi nhận to lớn nhất đối với sự nỗ lực làm việc ngày đêm suốt mấy tháng qua của mọi người.',
      },
      {
        id: 'hsk5-03-d3',
        speaker: 'A',
        speakerName: '张总监',
        avatar: '👨‍💼',
        hanzi: '我们提出的智能化方案也被客户高度认可，下个月将全面投入使用。',
        pinyin: 'Wǒmen tíchū de zhìnénghuà fāng\'àn yě bèi kèhù gāodù rènkě, xià gè yuè jiāng quánmiàn tóurù shǐyòng.',
        vietnamese: 'Phương án thông minh hóa do chúng ta đề xuất cũng được khách hàng đánh giá cao, tháng sau sẽ chính thức đưa vào vận hành toàn diện.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk5-03-sd1',
        hanzi: '该方案被专家评审团评为年度最佳创新奖。',
        pinyin: 'Gāi fāng\'àn bèi zhuānjiā píngshěntuán píng wéi niándù zuì jiā chuàngxīn jiǎng.',
        vietnamese: 'Phương án này đã được hội đồng chuyên gia chấm giải Sáng tạo xuất sắc nhất năm.',
        difficulty: 'hard',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk5-03-ss1',
        hanzi: '任何伟大的成果，都是由无数微小的坚持与克服困难所凝聚而成的。',
        pinyin: 'Rènhé wěidà de chéngguǒ, dōu shì yóu wúshù wēixiǎo de jiānchí yǔ kèfú kùnnan suǒ níngjù ér chéng de.',
        vietnamese: 'Bất kỳ thành quả vĩ đại nào cũng đều được đúc kết từ vô số kiên trì nhỏ bé và việc vượt qua thử thách.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk5-03-v1',
        hanzi: '认可',
        pinyin: 'rènkě',
        meaningVi: 'Công nhận, tán thành đánh giá cao',
        radical: '讠 (Ngôn - lời nói)',
        strokeCount: 4,
        exampleSentence: '他的专业能力得到了业界的一致认可。',
        examplePinyin: 'Tā de zhuānyè nénglì dédào le yèjiè de yízhì rènkě.',
        exampleVi: 'Năng lực chuyên môn của anh ấy đã nhận được sự công nhận nhất trí từ giới trong ngành.',
        hskLevel: 'HSK5' as HSKLevel,
      },
      {
        id: 'hsk5-03-v2',
        hanzi: '克服',
        pinyin: 'kèfú',
        meaningVi: 'Khắc phục, vượt qua khó khăn',
        radical: '十 (Thập - mười)',
        strokeCount: 7,
        exampleSentence: '只要大家团结一心，就没有克服不了的困难。',
        examplePinyin: 'Zhǐyào dàjiā tuánjié yìxīn, jiù méiyǒu kèfú bù liǎo de kùnnan.',
        exampleVi: 'Chỉ cần mọi người đồng lòng đoàn kết thì không có khó khăn nào không vượt qua được.',
        hskLevel: 'HSK5' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk5-03-gn1',
        title: 'Cấu trúc câu bị động trang trọng "为...所..."',
        pattern: 'Chủ ngữ (Tân ngữ chịu tác động) + 为 + Chủ thể gây ra + 所 + Động từ',
        explanationVi: 'Hình thức bị động kinh điển trong văn viết và diễn văn trang trọng, tương đương với "被..." trong khẩu ngữ.',
        examples: [
          {
            hanzi: '这项突破性成果为国际学术界所瞩目。',
            pinyin: 'Zhè xiàng tūpòxìng chéngguǒ wéi guójì xuéshùjiè suǒ zhǔmù.',
            vietnamese: 'Thành quả đột phá này được giới học thuật quốc tế đặc biệt dõi theo.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk5-03-q1',
        type: 'single_choice',
        prompt: '团队的新系统获得了什么奖项？ (Hệ thống mới của nhóm đạt được giải thưởng gì?)',
        options: [
          'A. 年度最佳销售奖 (Giải Bán hàng xuất sắc nhất năm)',
          'B. 年度最具创新奖 (Giải Sáng tạo nhất năm)',
          'C. 最佳新人奖 (Giải Nhân viên mới xuất sắc)',
        ],
        correctAnswer: 'B. 年度最具创新奖 (Giải Sáng tạo nhất năm)',
        explanation: 'Trương giám đốc thông báo: "新系统被评为年度最具创新奖！"',
      },
    ],
  },
  {
    id: 'hsk5-04',
    lessonNumber: 4,
    level: 'HSK5' as HSKLevel,
    title: '环境保护与低碳生活 — Thuyết trình thành phố xanh & Phát triển bền vững',
    subtitleVi: 'Kỹ năng thuyết trình bảo vệ môi trường, năng lượng tái tạo và lối sống giảm thiểu rác thải nhựa.',
    topicIcon: 'Leaf',
    imageUrl: '/images/lessons/hsk5_lesson04_green_presentation.png',
    estimatedMinutes: 40,
    summaryVi: 'Học cách trình bày bài phát biểu trước đám đông về chủ đề sinh thái, tiết kiệm năng lượng và giải pháp bền vững.',
    dialogue: [
      {
        id: 'hsk5-04-d1',
        speaker: 'A',
        speakerName: '主讲人 (Diễn giả chính)',
        avatar: '🎤',
        hanzi: '尊敬的各位嘉宾，今天我演讲的主题是“践行低碳理念，共建绿色家园”。',
        pinyin: 'Zūnjìng de gèwèi jiābīn, jīntiān wǒ yǎnjiǎng de zhǔtí shì “jiànxíng dītàn lǐniàn, gòng jiàn lǜsè jiāyuán”.',
        vietnamese: 'Kính thưa các quý vị đại biểu, chủ đề bài thuyết trình hôm nay của tôi là “Thực hành lối sống carbon thấp, chung tay xây dựng ngôi nhà xanh”.',
      },
      {
        id: 'hsk5-04-d2',
        speaker: 'B',
        speakerName: '现场观众 (Khán giả)',
        avatar: '🙋‍♀️',
        hanzi: '请问对于普通市民来说，日常生活中最有效的减碳行动有哪些？',
        pinyin: 'Qǐngwèn duìyú pǔtōng shìmín láishuō, rìcháng shēnghuó zhōng zuì yǒuxiào de jiǎntàn xíngdòng yǒu nǎxiē?',
        vietnamese: 'Xin hỏi đối với người dân bình thường, những hành động giảm phát thải carbon hiệu quả nhất hàng ngày là gì?',
      },
      {
        id: 'hsk5-04-d3',
        speaker: 'A',
        speakerName: '主讲人',
        avatar: '🎤',
        hanzi: '无论距离远近，优先选择公共交通或骑行；拒绝使用一次性塑料制品，这些都是行之有效的举措。',
        pinyin: 'Wúlùn jùlí yuǎnjìn, yōuxiān xuǎnzé gōnggòng jiāotōng huò qíxíng; jùjué shǐyòng yícìxìng sùliào zhìpǐn, zhèxiē dōu shì xíngzhī-yǒuxiào de jǔcuò.',
        vietnamese: 'Bất luận khoảng cách xa gần, ưu tiên dùng phương tiện công cộng hoặc đi xe đạp; từ chối đồ nhựa dùng một lần, đó đều là các biện pháp cực kỳ hiệu quả.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk5-04-sd1',
        hanzi: '无论面对多大挑战，我们都必须坚持绿色发展之路。',
        pinyin: 'Wúlùn miànduì duō dà tiǎozhàn, wǒmen dōu bìxū jiānchí lǜsè fāzhǎn zhī lù.',
        vietnamese: 'Bất luận đối mặt thử thách to lớn đến đâu, chúng ta đều phải kiên trì con đường phát triển xanh.',
        difficulty: 'hard',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk5-04-ss1',
        hanzi: '保护生态环境功在当代、利在千秋，需要全社会的共同参与。',
        pinyin: 'Bǎohù shēngtài huánjìng gōng zài dāngdài, lì zài qiānqiū, xūyào quán shèhuì de gòngtóng cānyù.',
        vietnamese: 'Bảo vệ môi trường sinh thái là công lao thời nay, lợi ích nghìn thu, đòi hỏi sự tham gia chung của toàn xã hội.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk5-04-v1',
        hanzi: '资源',
        pinyin: 'zīyuán',
        meaningVi: 'Tài nguyên',
        radical: '贝 (Bối - của cải)',
        strokeCount: 10,
        exampleSentence: '合理利用水资源是每个公民的责任。',
        examplePinyin: 'Hélǐ lìyòng shuǐ zīyuán shì měi gè gōngmín de zérèn.',
        exampleVi: 'Sử dụng hợp lý tài nguyên nước là trách nhiệm của mỗi công dân.',
        hskLevel: 'HSK5' as HSKLevel,
      },
      {
        id: 'hsk5-04-v2',
        hanzi: '节能',
        pinyin: 'jiénéng',
        meaningVi: 'Tiết kiệm năng lượng',
        radical: '竹 (Trúc - tre nứa)',
        strokeCount: 13,
        exampleSentence: '推广节能环保汽车有助于降低空气污染。',
        examplePinyin: 'Tuīguǎng jiénéng huánbǎo qìchē yǒuzhùyú jiàngdī kōngqì wūrǎn.',
        exampleVi: 'Phổ biến xe hơi tiết kiệm năng lượng thân thiện môi trường giúp giảm thiểu ô nhiễm không khí.',
        hskLevel: 'HSK5' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk5-04-gn1',
        title: 'Cấu trúc vô điều kiện "无论...都/也..."',
        pattern: '无论 + (A 还是 B / Đại từ nghi vấn 什么/哪/谁 / Tính từ + 不 + Tính từ), 都/也 + Vị ngữ',
        explanationVi: 'Biểu thị trong bất kỳ điều kiện hoặc hoàn cảnh nào thì kết quả vẫn không thay đổi.',
        examples: [
          {
            hanzi: '无论天气多冷，他都坚持每天晨跑。',
            pinyin: 'Wúlùn tiānqì duō lěng, tā dōu jiānchí měitiān chénpǎo.',
            vietnamese: 'Bất luận thời tiết có lạnh thế nào, anh ấy đều kiên trì chạy bộ sáng mỗi ngày.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk5-04-q1',
        type: 'single_choice',
        prompt: '演讲人建议市民采取哪些环保行动？ (Diễn giả khuyên người dân thực hiện những hành động bảo vệ môi trường nào?)',
        options: [
          'A. 尽量多开私家车 (Cố gắng lái xe hơi cá nhân nhiều hơn)',
          'B. 优先选择公共交通，拒绝使用一次性塑料制品 (Ưu tiên dùng phương tiện công cộng, từ chối đồ nhựa dùng một lần)',
          'C. 减少运动 (Giảm vận động thể thao)',
        ],
        correctAnswer: 'B. 优先选择公共交通，拒绝使用一次性塑料制品 (Ưu tiên dùng phương tiện công cộng, từ chối đồ nhựa dùng một lần)',
        explanation: 'Diễn giả trả lời: "无论距离远近，优先选择公共交通或骑行；拒绝使用一次性塑料制品。"',
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
  {
    id: 'hsk6-02',
    lessonNumber: 2,
    level: 'HSK6' as HSKLevel,
    title: '成语典故与中华智慧 — Thành ngữ kinh điển & Triết lý ngôn ngữ',
    subtitleVi: 'Vận dụng thành ngữ 4 chữ chuẩn xác, hiểu rõ điển cố và nâng tầm biểu đạt tự nhiên như người bản xứ.',
    topicIcon: 'ScrollText',
    imageUrl: '/images/lessons/hsk6_lesson02_chengyu_idioms.png',
    estimatedMinutes: 45,
    summaryVi: 'Học cách sử dụng thành ngữ trong các ngữ cảnh cao cấp, giải thích ngụ ngôn và làm giàu văn phong diễn đạt.',
    dialogue: [
      {
        id: 'hsk6-02-d1',
        speaker: 'A',
        speakerName: '张教授 (Giáo sư Trương)',
        avatar: '👨‍🏫',
        hanzi: '学汉语到达高级阶段，成语典故是必须攻克的一大关隘。',
        pinyin: 'Xué Hànyǔ dàodá gāojí jiēduàn, chéngyǔ diǎngù shì bìxū gōngkè de yí dà guān\'ài.',
        vietnamese: 'Học tiếng Hán đạt tới trình độ cao cấp, thành ngữ điển tích là cửa ải lớn bắt buộc phải chinh phục.',
      },
      {
        id: 'hsk6-02-d2',
        speaker: 'B',
        speakerName: '王同学 (Học viên Vương)',
        avatar: '👨‍🎓',
        hanzi: '张老师，成语不仅言简意赅，背后往往还藏着一段引人深思的历史故事。',
        pinyin: 'Zhāng lǎoshī, chéngyǔ bùjǐn yánjiǎn-yìgāi, bèihòu wǎngwǎng hái cáng zhe yí duàn yǐnrén-shēnsī de lìshǐ gùshì.',
        vietnamese: 'Thưa thầy Trương, thành ngữ không những lời ít ý nhiều mà đằng sau thường còn ẩn chứa một câu chuyện lịch sử gợi nhiều suy ngẫm.',
      },
      {
        id: 'hsk6-02-d3',
        speaker: 'A',
        speakerName: '张教授',
        avatar: '👨‍🏫',
        hanzi: '没错！比如“坚持不懈”、“循序渐进”，只有做到举一反三，才能真正融会贯通。',
        pinyin: 'Méi cuò! Bǐrú “jiānchí-bùxiè”, “xúnxù-jiànjìn”, zhǐyǒu zuò dào jǔyī-fǎnsān, cáinèng zhēnzhèng rónghuì-guàntōng.',
        vietnamese: 'Đúng vậy! Ví dụ như “kiên trì không nản”, “tuần tự từng bước”, chỉ khi làm được suy một biết mười mới có thể thực sự thông suốt toàn diện.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk6-02-sd1',
        hanzi: '学习语言必须循序渐进，坚持不懈。',
        pinyin: 'Xuéxí yǔyán bìxū xúnxù-jiànjìn, jiānchí-bùxiè.',
        vietnamese: 'Học ngôn ngữ cần phải theo từng bước tuần tự và kiên trì bền bỉ.',
        difficulty: 'hard',
      },
      {
        id: 'hsk6-02-sd2',
        hanzi: '优秀的学者往往能够触类旁通、举一反三。',
        pinyin: 'Yōuxiù de xuézhě wǎngwǎng nénggòu chùlèi-pángtōng, jǔyī-fǎnsān.',
        vietnamese: 'Học giả ưu tú thường có thể suy một biết mười, thấu suốt mọi việc tương tự.',
        difficulty: 'hard',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk6-02-ss1',
        hanzi: '成语是中华文化的璀璨明珠，凝聚了千百年来古人的处世哲学与智慧结晶。',
        pinyin: 'Chéngyǔ shì Zhōnghuá wénhuà de cuǐcàn míngzhū, níngjù le qiānbǎi nián lái gǔrén de chǔshì zhéxué yǔ zhìhuì jiéjīng.',
        vietnamese: 'Thành ngữ là viên ngọc sáng rực rỡ của văn hóa Trung Hoa, ngưng tụ triết lý xử thế và kết tinh trí tuệ của người xưa suốt hàng ngàn năm.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk6-02-v1',
        hanzi: '坚持不懈',
        pinyin: 'jiānchí-bùxiè',
        meaningVi: 'Kiên trì không nản chí, bền bỉ đến cùng',
        radical: '扌 (Thủ - bàn tay)',
        strokeCount: 16,
        exampleSentence: '经过三年的坚持不懈，他终于攻克了科研难关。',
        examplePinyin: 'Jīngguò sān nián de jiānchí-bùxiè, tā zhōngyú gōngkè le kēyán nánguān.',
        exampleVi: 'Trải qua 3 năm kiên trì không nản lòng, cuối cùng anh ấy đã vượt qua ải khó nghiên cứu khoa học.',
        hskLevel: 'HSK6' as HSKLevel,
      },
      {
        id: 'hsk6-02-v2',
        hanzi: '举一反三',
        pinyin: 'jǔyī-fǎnsān',
        meaningVi: 'Suy một biết mười, nắm vững bản chất',
        radical: '手 (Thủ - bàn tay)',
        strokeCount: 9,
        exampleSentence: '掌握了核心公式，遇到同类型题目就能举一反三。',
        examplePinyin: 'Zhǎngwò le héxīn gōngshì, yù dào tóng lèixíng tímù jiù néng jǔyī-fǎnsān.',
        exampleVi: 'Nắm vững công thức cốt lõi thì khi gặp bài tập cùng dạng sẽ tự suy ra được cách giải.',
        hskLevel: 'HSK6' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk6-02-gn1',
        title: 'Thành ngữ 4 chữ làm định ngữ và vị ngữ trong câu cao cấp',
        pattern: 'Chủ ngữ + Thành ngữ (Vị ngữ) HOẶC Thành ngữ + 的 + Danh từ',
        explanationVi: 'Thành ngữ giúp câu văn súc tích, sang trọng và thể hiện tư duy ngôn ngữ sâu sắc.',
        examples: [
          {
            hanzi: '他那坚持不懈的精神令人肃然起敬。',
            pinyin: 'Tā nà jiānchí-bùxiè de jīngshén lìng rén sùrán-qǐjìng.',
            vietnamese: 'Tinh thần kiên trì bền bỉ của anh ấy khiến mọi người kính phục sâu sắc.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk6-02-q1',
        type: 'single_choice',
        prompt: '\"举一反三\" 表达的意思是： (Thành ngữ \"jǔyī-fǎnsān\" có ý nghĩa là:)',
        options: [
          'A. 从一件事情类推知道许多同类事情 (Từ một sự việc suy luận hiểu ra nhiều việc cùng loại)',
          'B. 只做一件事就要放弃 (Chỉ làm một việc rồi bỏ cuộc)',
          'C. 算数算错三次 (Tính toán nhầm 3 lần)',
        ],
        correctAnswer: 'A. 从一件事情类推知道许多同类事情 (Từ một sự việc suy luận hiểu ra nhiều việc cùng loại)',
        explanation: '举一反三 có nghĩa là từ một ví dụ mà suy ra và hiểu rõ nhiều việc tương tự.',
      },
    ],
  },
  {
    id: 'hsk6-03',
    lessonNumber: 3,
    level: 'HSK6' as HSKLevel,
    title: '社交心理与沟通艺术 — Tâm lý học giao tiếp & Nghệ thuật ứng xử',
    subtitleVi: 'Thấu hiểu tâm lý đối thoại, nghệ thuật lắng nghe tích cực và giải quyết mâu thuẫn khéo léo.',
    topicIcon: 'HeartHandshake',
    imageUrl: '/images/lessons/hsk6_lesson03_social_psychology.png',
    estimatedMinutes: 45,
    summaryVi: 'Học cách vận dụng trí tuệ cảm xúc (EQ), kỹ năng đàm thoại đồng cảm và hóa giải bất đồng trong công việc và quan hệ xã hội.',
    dialogue: [
      {
        id: 'hsk6-03-d1',
        speaker: 'A',
        speakerName: '心理顾问 (Chuyên viên tâm lý)',
        avatar: '👩‍🏫',
        hanzi: '高效沟通的秘诀并不在于说了多少漂亮话，而在于是否懂得真诚地倾听对方。',
        pinyin: 'Gāoxiào gōutōng de mìjué bìng bù zàiyú shuō le duōshǎo piàoliang huà, ér zàiyú shìfǒu dǒngde zhēnchéng de qīngtīng duìfāng.',
        vietnamese: 'Bí quyết của giao tiếp hiệu quả không nằm ở việc nói bao nhiêu lời hoa mỹ, mà nằm ở chỗ có biết lắng nghe đối phương một cách chân thành hay không.',
      },
      {
        id: 'hsk6-03-d2',
        speaker: 'B',
        speakerName: '人事总监 (Giám đốc nhân sự)',
        avatar: '👔',
        hanzi: '确实如此。许多职场矛盾的产生，往往是因为沟通不畅和缺乏换位思考所致。',
        pinyin: 'Quèshí rúcǐ. Xǔduō zhíchǎng máodùn de chǎnshēng, wǎngwǎng shì yīnwèi gōutōng bú chàng hé quēfá huànwèi-sīkǎo suǒ zhì.',
        vietnamese: 'Thật sự đúng như vậy. Nhiều mâu thuẫn chốn công sở nảy sinh thường là do giao tiếp không thông suốt và thiếu sự đặt mình vào vị trí người khác.',
      },
      {
        id: 'hsk6-03-d3',
        speaker: 'A',
        speakerName: '心理顾问',
        avatar: '👩‍🏫',
        hanzi: '学会情绪管理，以温和而坚定的态度表达需求，才能营造和谐的人际网络。',
        pinyin: 'Xuéhuì qíngxù guǎnlǐ, yǐ wēnhé ér jiāndìng de tàidù biǎodá xūqiú, cáinèng yíngzào héxié de rénjì wǎngluò.',
        vietnamese: 'Biết cách quản trị cảm xúc, biểu đạt nhu cầu bằng thái độ ôn hòa nhưng dứt khoát thì mới tạo dựng được mạng lưới quan hệ hài hòa.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk6-03-sd1',
        hanzi: '换位思考是解决人际矛盾不可或缺的重要法宝。',
        pinyin: 'Huànwèi-sīkǎo shì jiějué rénjì máodùn bùkě-huòquē de zhòngyào fǎbǎo.',
        vietnamese: 'Đặt mình vào vị trí của người khác là bảo bối quan trọng không thể thiếu để hóa giải mâu thuẫn giữa người với người.',
        difficulty: 'hard',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk6-03-ss1',
        hanzi: '敏锐的情感洞察力与宽容的胸怀，是一个成熟领导者最核心的魅力所在。',
        pinyin: 'Mǐnruì de qínggǎn dòngchálì yǔ kuānróng de xiōnghuái, shì yí gè chéngshú lǐngdǎozhě zuì héxīn de mèilì suǒzài.',
        vietnamese: 'Khả năng thấu cảm tinh tế và tấm lòng bao dung chính là sức hút cốt lõi nhất của một nhà lãnh đạo trưởng thành.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk6-03-v1',
        hanzi: '倾听',
        pinyin: 'qīngtīng',
        meaningVi: 'Lắng nghe chân thành, chăm chú',
        radical: '亻 (Nhân - người)',
        strokeCount: 11,
        exampleSentence: '懂得倾听他人的人更容易赢得信任与尊重。',
        examplePinyin: 'Dǒngde qīngtīng tārén de rén gèng róngyì yíngdé xìnrèn yǔ zūnzhòng.',
        exampleVi: 'Người biết lắng nghe người khác sẽ dễ dàng giành được sự tin cậy và tôn trọng hơn.',
        hskLevel: 'HSK6' as HSKLevel,
      },
      {
        id: 'hsk6-03-v2',
        hanzi: '和谐',
        pinyin: 'héxié',
        meaningVi: 'Hài hòa, hòa thuận',
        radical: '禾 (Hòa - cây lúa)',
        strokeCount: 14,
        exampleSentence: '营造和谐友善的团队氛围有助于激发工作创造力。',
        examplePinyin: 'Yíngzào héxié yǒushàn de tuánduì fēnwéi yǒuzhùyú jīfā gōngzuò chuàngzàolì.',
        exampleVi: 'Xây dựng bầu không khí đội ngũ hài hòa thân thiện giúp khơi dậy sức sáng tạo công việc.',
        hskLevel: 'HSK6' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk6-03-gn1',
        title: 'Cấu trúc phó từ ngữ khí cao cấp "未免" (Không khỏi / Thật là có phần...)',
        pattern: 'Chủ ngữ + 未免 + 太 / 过分 / 过于 + Tính từ / Động từ',
        explanationVi: 'Dùng để đưa ra nhận xét chừng mực nhưng mang ý không đồng tình, cho rằng mức độ đã đi quá giới hạn.',
        examples: [
          {
            hanzi: '你这样单方面下结论，未免太草率了。',
            pinyin: 'Nǐ zhèyàng dānfāngmiàn xià jiélùn, wèimiǎn tài cǎoshuài le.',
            vietnamese: 'Bạn vội vàng kết luận một chiều như vậy thật là có phần quá hấp tấp.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk6-03-q1',
        type: 'single_choice',
        prompt: '心理顾问认为高效沟通的关键在于什么？ (Chuyên viên tâm lý cho rằng mấu chốt của giao tiếp hiệu quả là gì?)',
        options: [
          'A. 讲很多漂亮话 (Nói thật nhiều lời hoa mỹ)',
          'B. 真诚地倾听对方 (Chân thành lắng nghe đối phương)',
          'C. 坚持己见不妥协 (Bảo thủ ý kiến không nhượng bộ)',
        ],
        correctAnswer: 'B. 真诚地倾听对方 (Chân thành lắng nghe đối phương)',
        explanation: 'Chuyên viên tâm lý khẳng định: "高效沟通的秘诀并不在于说了多少漂亮话，而在于是否懂得真诚地倾听对方。"',
      },
    ],
  },
  {
    id: 'hsk6-04',
    lessonNumber: 4,
    level: 'HSK6' as HSKLevel,
    title: '媒介素养与深度思考 — Đọc báo chí & Tư duy phản biện thời đại số',
    subtitleVi: 'Phân tích thông tin đa chiều, rèn luyện tư duy phản biện và khả năng tổng hợp luận điểm sâu sắc.',
    topicIcon: 'BookOpen',
    imageUrl: '/images/lessons/hsk6_lesson04_library_critical_reading.png',
    estimatedMinutes: 45,
    summaryVi: 'Học cách đọc hiểu bài xã luận học thuật, phân biệt thông tin giả mạo và trình bày quan điểm logic phản biện.',
    dialogue: [
      {
        id: 'hsk6-04-d1',
        speaker: 'A',
        speakerName: '媒体评论员 (Nhà bình luận truyền thông)',
        avatar: '✍️',
        hanzi: '在信息爆炸的数字化时代，我们每天被海量碎片化信息所包围，培养媒介素养尤为紧迫。',
        pinyin: 'Zài xìnxī bàozhà de shùzìhuà shídài, wǒmen měitiān bèi hǎiliàng suìpiànhuà xìnxī suǒ bāowéi, péiyǎng méijiè sùyǎng yóuwéi jǐnpò.',
        vietnamese: 'Trong kỷ nguyên số hóa bùng nổ thông tin, mỗi ngày chúng ta bị bao quanh bởi vô vàn thông tin phân mảnh, việc bồi dưỡng năng lực truyền thông càng trở nên cấp thiết.',
      },
      {
        id: 'hsk6-04-d2',
        speaker: 'B',
        speakerName: '青年学者 (Học giả trẻ)',
        avatar: '👨‍🎓',
        hanzi: '您说得非常深刻。与其盲目跟风转发，不如静下心来核实信源，保持独立的理性思考。',
        pinyin: 'Nín shuō de fēicháng shēnkè. Yǔqí mángmù gēnfēng zhuǎnfā, bùrú jìng xià xīn lái héshí xìnyuán, bǎochí dúlì de lǐxìng sīkǎo.',
        vietnamese: 'Thầy nói rất sâu sắc. Thay vì mù quáng hùa theo chia sẻ, thà tĩnh tâm kiểm chứng nguồn tin, giữ vững tư duy lý tính độc lập.',
      },
      {
        id: 'hsk6-04-d3',
        speaker: 'A',
        speakerName: '媒体评论员',
        avatar: '✍️',
        hanzi: '对！只有具备去伪存真的辨别力，才能在纷繁复杂的舆论浪潮中保持清醒。',
        pinyin: 'Duì! Zhǐyǒu jùbèi qùwěi-cúnzhēn de biànbiélì, cáinèng zài fēnfán-fùzá de yúlùn làngcháo zhōng bǎochí qīngxǐng.',
        vietnamese: 'Đúng vậy! Chỉ khi sở hữu khả năng gạn đục khơi trong, phân biệt thật giả, bạn mới có thể giữ được sự tỉnh táo giữa làn sóng dư luận phức tạp.',
      },
    ],
    speechDrills: [
      {
        id: 'hsk6-04-sd1',
        hanzi: '与其盲目跟风，不如保持独立思考与理性判断。',
        pinyin: 'Yǔqí mángmù gēnfēng, bùrú bǎochí dúlì sīkǎo yǔ lǐxìng pànduàn.',
        vietnamese: 'Thay vì mù quáng hùa theo phong trào, chẳng thà giữ vững tư duy độc lập và phán đoán lý tính.',
        difficulty: 'hard',
      },
    ],
    shadowSentences: [
      {
        id: 'hsk6-04-ss1',
        hanzi: '真正的深度阅读，是一场跨越时空与智者对话的精神旅行。',
        pinyin: 'Zhēnzhèng de shēndù yuèdú, shì yì chǎng kuàyuè shíkōng yǔ zhìzhě duìhuà de jīngshén lǚxíng.',
        vietnamese: 'Đọc sách chuyên sâu thực sự là một chuyến hành trình tinh thần vượt thời không để đối thoại cùng các bậc hiền triết.',
      },
    ],
    vocabulary: [
      {
        id: 'hsk6-04-v1',
        hanzi: '辨别',
        pinyin: 'biànbié',
        meaningVi: 'Phân biệt, nhận diện rõ chân tướng',
        radical: '辛 (Tân - cay đắng)',
        strokeCount: 16,
        exampleSentence: '青年人要提高辨别网络谣言与虚假信息的能力。',
        examplePinyin: 'Qīngniánrén yào tígāo biànbié wǎngluò yáoyán yǔ xūjiǎ xìnxī de nénglì.',
        exampleVi: 'Thế hệ trẻ cần nâng cao năng lực phân biệt tin đồn mạng và thông tin sai lệch.',
        hskLevel: 'HSK6' as HSKLevel,
      },
      {
        id: 'hsk6-04-v2',
        hanzi: '客观',
        pinyin: 'kèguān',
        meaningVi: 'Khách quan',
        radical: '宀 (Miên - mái nhà)',
        strokeCount: 9,
        exampleSentence: '评价历史事件需要秉持客观公正的立场。',
        examplePinyin: 'Píngjià lìshǐ shìjiàn xūyào bǐngchí kèguān gōngzhèng de lìchǎng.',
        exampleVi: 'Đánh giá sự kiện lịch sử cần giữ vững lập trường khách quan và công bằng.',
        hskLevel: 'HSK6' as HSKLevel,
      },
    ],
    grammarNotes: [
      {
        id: 'hsk6-04-gn1',
        title: 'Cấu trúc so sánh lựa chọn "与其...不如..." (Thay vì...chẳng thà...)',
        pattern: '与其 + Phương án A (Bị loại bỏ), 不如 + Phương án B (Được ưu tiên lựa chọn)',
        explanationVi: 'Dùng khi đứng trước hai sự lựa chọn, người nói dứt khoát nghiêng về phương án B.',
        examples: [
          {
            hanzi: '与其在这里空想担忧，不如马上动手实践。',
            pinyin: 'Yǔqí zài zhèlǐ kōngxiǎng dānyōu, bùrú mǎshàng dòngshǒu shíjiàn.',
            vietnamese: 'Thay vì ở đây lo nghĩ viển vông, chẳng thà bắt tay vào hành động thực tế ngay.',
          },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'hsk6-04-q1',
        type: 'single_choice',
        prompt: '青年学者建议在面对海量网络信息时应该怎么做？ (Học giả trẻ khuyên nên làm gì khi đối mặt thông tin mạng ngập tràn?)',
        options: [
          'A. 盲目转发 (Mù quáng chia sẻ)',
          'B. 静下心核实信源，保持独立理性思考 (Tĩnh tâm kiểm chứng nguồn tin, giữ tư duy độc lập)',
          'C. 不再接触任何信息 (Không tiếp cận thông tin nữa)',
        ],
        correctAnswer: 'B. 静下心核实信源，保持独立理性思考 (Tĩnh tâm kiểm chứng nguồn tin, giữ tư duy độc lập)',
        explanation: 'Học giả trẻ nêu rõ: "与其盲目跟风转发，不如静下心来核实信源，保持独立的理性思考。"',
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
