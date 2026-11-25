export type TTSVoicePersona = 'female' | 'male' | 'adult' | 'child';

export interface TTSPersonaConfig {
  id: TTSVoicePersona;
  nameVi: string;
  subtitleVi: string;
  gender: 'female' | 'male' | 'neutral';
  ageType: 'adult' | 'child';
  descriptionVi: string;
  badge: string;
  defaultPitch: number;
  defaultRate: number;
  sampleSentenceZh: string;
  sampleSentencePinyin: string;
  sampleSentenceVi: string;
}

export interface TTSSettings {
  persona: TTSVoicePersona;
  speedRate: number; // e.g. 0.75 (chậm), 0.88 (chuẩn), 1.0 (nhanh)
  volume: number; // 0.0 - 1.0
  preferredVoiceURI?: string;
}

export const TTS_PERSONAS: Record<TTSVoicePersona, TTSPersonaConfig> = {
  female: {
    id: 'female',
    nameVi: 'Giọng Nữ (Thanh lịch)',
    subtitleVi: 'Cô giáo phát thanh Bắc Kinh',
    gender: 'female',
    ageType: 'adult',
    badge: 'Chuẩn phổ thông',
    descriptionVi: 'Phát âm truyền cảm, tròn vành rõ chữ, chuẩn khẩu âm tiếng Phổ thông Bắc Kinh.',
    defaultPitch: 1.0,
    defaultRate: 0.90,
    sampleSentenceZh: '你好！欢迎来到中文学习系统，祝你学习进步！',
    sampleSentencePinyin: 'Nǐ hǎo! Huānyíng lái dào zhōngwén xuéxí xìtǒng, zhù nǐ xuéxí jìnbù!',
    sampleSentenceVi: 'Xin chào! Chào mừng bạn đến với hệ thống học tiếng Trung, chúc bạn tiến bộ!',
  },
  male: {
    id: 'male',
    nameVi: 'Giọng Nam (Trầm ấm)',
    subtitleVi: 'Thầy giáo thân thiện',
    gender: 'male',
    ageType: 'adult',
    badge: 'Ấm áp & Thân thiện',
    descriptionVi: 'Âm sắc nam ấm áp, gần gũi, rõ từng thanh điệu, phù hợp luyện phản xạ hội thoại thực tế.',
    defaultPitch: 0.86,
    defaultRate: 0.90,
    sampleSentenceZh: '你好！每天坚持练习口语，汉语水平一定会突飞猛进！',
    sampleSentencePinyin: 'Nǐ hǎo! Měitiān jiānchí liànxí kǒuyǔ, hànyǔ shuǐpíng yídìng huì tūfēiměngjìn!',
    sampleSentenceVi: 'Xin chào! Kiên trì luyện khẩu ngữ mỗi ngày, trình độ tiếng Trung của bạn nhất định sẽ tiến bộ vượt bậc!',
  },
  adult: {
    id: 'adult',
    nameVi: 'Giọng Người Lớn (Sư phạm)',
    subtitleVi: 'Giáo viên mẫu HSK',
    gender: 'neutral',
    ageType: 'adult',
    badge: 'Ôn hòa & Dễ nghe',
    descriptionVi: 'Giọng ôn hòa, nhẹ nhàng, nhấn nhá rõ ràng 4 thanh điệu và quy tắc biến điệu thanh 3, phù hợp người mới học.',
    defaultPitch: 0.94,
    defaultRate: 0.87,
    sampleSentenceZh: '请注意听准声调和发音，掌握正确的舌位和口型。',
    sampleSentencePinyin: 'Qǐng zhùyì tīng zhǔn shēngdiào hé fāyīn, zhǎngwò zhèngquè de shéwèi hé kǒuxíng.',
    sampleSentenceVi: 'Xin chú ý nghe chuẩn thanh điệu và phát âm, nắm vững vị trí đặt lưỡi và khẩu hình chính xác.',
  },
  child: {
    id: 'child',
    nameVi: 'Giọng Trẻ Em (Trong trẻo)',
    subtitleVi: 'Bạn nhỏ vui tươi',
    gender: 'neutral',
    ageType: 'child',
    badge: 'Vui vẻ & Đáng yêu',
    descriptionVi: 'Âm sắc lảnh lót, vui tươi, hồn nhiên, rất thích hợp cho học viên nhí, học qua bài hát và hội thoại gia đình.',
    defaultPitch: 1.24,
    defaultRate: 0.92,
    sampleSentenceZh: '小朋友你好！我们一起快乐地学中文吧，加油！',
    sampleSentencePinyin: 'Xiǎopéngyǒu nǐ hǎo! Wǒmen yìqǐ kuàilè de xué zhōngwén ba, jiāyóu!',
    sampleSentenceVi: 'Chào bạn nhỏ! Chúng mình cùng vui học tiếng Trung nhé, cố lên!',
  },
};

export const DEFAULT_TTS_SETTINGS: TTSSettings = {
  persona: 'female',
  speedRate: 0.88,
  volume: 1.0,
};
