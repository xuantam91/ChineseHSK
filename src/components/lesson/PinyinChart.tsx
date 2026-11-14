'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { MouthDiagram, ArticulationZone } from './MouthDiagram';
import { speakChinese } from '@/lib/tts';
import { TTSVoiceSelector } from '@/components/common/TTSVoiceSelector';

function getArticulationZone(id: string): ArticulationZone {
  if (['b', 'p', 'm'].includes(id)) return 'bilabial';
  if (['f'].includes(id)) return 'labiodental';
  if (['d', 't', 'n', 'l'].includes(id)) return 'alveolar';
  if (['g', 'k', 'h'].includes(id)) return 'velar';
  if (['j', 'q', 'x'].includes(id)) return 'palatal';
  if (['zh', 'ch', 'sh', 'r'].includes(id)) return 'retroflex';
  if (['z', 'c', 's'].includes(id)) return 'dental_sibilant';
  return 'alveolar';
}

export interface PhonemeItem {
  id: string;
  symbol: string;
  ipa?: string;
  vietnameseGuide: string;
  mouthTip: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleMeaningVi: string;
  group: string;
}

export interface ToneItem {
  toneNumber: number;
  name: string;
  pitchContour: string; // e.g. "55"
  symbol: string;
  descriptionVi: string;
  tip: string;
  exampleChar: string;
  examplePinyin: string;
  exampleMeaning: string;
}

// 21 Thanh Mẫu (Initials)
const INITIALS_DATA: PhonemeItem[] = [
  // Âm hai môi & môi răng
  {
    id: 'b',
    symbol: 'b',
    vietnameseGuide: 'Gần giống "p" tiếng Việt, không bật hơi',
    mouthTip: 'Hai môi khép chặt, giữ luồng khí lại rồi mở nhanh hai môi cho luồng khí bật nhẹ ra ngoài.',
    exampleHanzi: '八',
    examplePinyin: 'bā',
    exampleMeaningVi: 'Số 8',
    group: 'Âm hai môi & Môi răng',
  },
  {
    id: 'p',
    symbol: 'p',
    vietnameseGuide: 'Giống "p" bật hơi mạnh',
    mouthTip: 'Khẩu hình giống b, nhưng luồng hơi nén mạnh bên trong khoang miệng và bật mạnh ra ngoài.',
    exampleHanzi: '爬',
    examplePinyin: 'pá',
    exampleMeaningVi: 'Bò, leo trèo',
    group: 'Âm hai môi & Môi răng',
  },
  {
    id: 'm',
    symbol: 'm',
    vietnameseGuide: 'Giống "m" tiếng Việt',
    mouthTip: 'Hai môi khép kín, luồng hơi thoát ra từ khoang mũi, dây thanh rung.',
    exampleHanzi: '妈',
    examplePinyin: 'mā',
    exampleMeaningVi: 'Mẹ',
    group: 'Âm hai môi & Môi răng',
  },
  {
    id: 'f',
    symbol: 'f',
    vietnameseGuide: 'Giống "ph" tiếng Việt',
    mouthTip: 'Răng trên chạm nhẹ môi dưới, luồng hơi ma sát thoát ra ngoài.',
    exampleHanzi: '发',
    examplePinyin: 'fā',
    exampleMeaningVi: 'Phát ra, gửi',
    group: 'Âm hai môi & Môi răng',
  },

  // Âm đầu lưỡi
  {
    id: 'd',
    symbol: 'd',
    vietnameseGuide: 'Gần giống "t" tiếng Việt, không bật hơi',
    mouthTip: 'Đầu lưỡi chạm chân răng trên, luồng khí chặn lại rồi hạ đầu lưỡi xuống nhẹ nhàng.',
    exampleHanzi: '大',
    examplePinyin: 'dà',
    exampleMeaningVi: 'To, lớn',
    group: 'Âm đầu lưỡi',
  },
  {
    id: 't',
    symbol: 't',
    vietnameseGuide: 'Giống "th" tiếng Việt bật hơi mạnh',
    mouthTip: 'Vị trí giống d nhưng đầu lưỡi hạ dứt khoát để luồng hơi bật ra thật mạnh.',
    exampleHanzi: '他',
    examplePinyin: 'tā',
    exampleMeaningVi: 'Anh ấy, cậu ấy',
    group: 'Âm đầu lưỡi',
  },
  {
    id: 'n',
    symbol: 'n',
    vietnameseGuide: 'Giống "n" tiếng Việt',
    mouthTip: 'Đầu lưỡi chạm nướu trên, luồng hơi thoát qua đường mũi, dây thanh rung.',
    exampleHanzi: '你',
    examplePinyin: 'nǐ',
    exampleMeaningVi: 'Bạn, anh, chị',
    group: 'Âm đầu lưỡi',
  },
  {
    id: 'l',
    symbol: 'l',
    vietnameseGuide: 'Giống "l" tiếng Việt',
    mouthTip: 'Đầu lưỡi chạm lợi trên, luồng hơi lướt qua hai bên cạnh lưỡi.',
    exampleHanzi: '来',
    examplePinyin: 'lái',
    exampleMeaningVi: 'Đến, tới',
    group: 'Âm đầu lưỡi',
  },

  // Âm gốc lưỡi
  {
    id: 'g',
    symbol: 'g',
    vietnameseGuide: 'Gần giống "c/k" tiếng Việt, không bật hơi',
    mouthTip: 'Gốc lưỡi nâng lên áp vào ngạc mềm chắn luồng khí, sau đó hạ nhẹ xuống.',
    exampleHanzi: '哥',
    examplePinyin: 'gē',
    exampleMeaningVi: 'Anh trai',
    group: 'Âm gốc lưỡi',
  },
  {
    id: 'k',
    symbol: 'k',
    vietnameseGuide: 'Giống "kh" tiếng Việt hoặc "k" bật hơi mạnh',
    mouthTip: 'Vị trí giống g nhưng gốc lưỡi mở ra tạo luồng hơi ma sát bật mạnh ra ngoài.',
    exampleHanzi: '看',
    examplePinyin: 'kàn',
    exampleMeaningVi: 'Nhìn, xem',
    group: 'Âm gốc lưỡi',
  },
  {
    id: 'h',
    symbol: 'h',
    vietnameseGuide: 'Nằm giữa "h" và "kh" tiếng Việt',
    mouthTip: 'Gốc lưỡi tiếp cận ngạc mềm tạo khe hẹp, luồng hơi ma sát nhẹ thoát ra.',
    exampleHanzi: '好',
    examplePinyin: 'hǎo',
    exampleMeaningVi: 'Tốt, đẹp',
    group: 'Âm gốc lưỡi',
  },

  // Âm mặt lưỡi
  {
    id: 'j',
    symbol: 'j',
    vietnameseGuide: 'Gần giống "ch" tiếng Việt, không bật hơi',
    mouthTip: 'Mặt trước của lưỡi dính chặt ngạc cứng, mép môi hơi kéo sang hai bên.',
    exampleHanzi: '家',
    examplePinyin: 'jiā',
    exampleMeaningVi: 'Nhà, gia đình',
    group: 'Âm mặt lưỡi',
  },
  {
    id: 'q',
    symbol: 'q',
    vietnameseGuide: 'Giống "ch" bật hơi mạnh',
    mouthTip: 'Vị trí lưỡi giống j nhưng luồng khí bật ra mạnh và xì rõ rệt.',
    exampleHanzi: '去',
    examplePinyin: 'qù',
    exampleMeaningVi: 'Đi',
    group: 'Âm mặt lưỡi',
  },
  {
    id: 'x',
    symbol: 'x',
    vietnameseGuide: 'Giống "x" tiếng Việt, miệng dẹt',
    mouthTip: 'Mặt lưỡi tiếp cận ngạc cứng tạo khe hẹp cho luồng hơi xì nhẹ qua.',
    exampleHanzi: '谢',
    examplePinyin: 'xiè',
    exampleMeaningVi: 'Cảm ơn',
    group: 'Âm mặt lưỡi',
  },

  // Âm cuộn lưỡi (uốn lưỡi)
  {
    id: 'zh',
    symbol: 'zh',
    vietnameseGuide: 'Giống "tr" tiếng Việt uốn lưỡi sâu, không bật hơi',
    mouthTip: 'Đầu lưỡi cong lên chạm vào ngạc cứng trên, không bật hơi.',
    exampleHanzi: '中',
    examplePinyin: 'zhōng',
    exampleMeaningVi: 'Ở giữa, Trung Quốc',
    group: 'Âm cuộn lưỡi (Uốn lưỡi)',
  },
  {
    id: 'ch',
    symbol: 'ch',
    vietnameseGuide: 'Giống "tr" uốn lưỡi và bật hơi thật mạnh',
    mouthTip: 'Vị trí giống zh nhưng hạ đầu lưỡi nhanh để luồng hơi nóng bật mạnh ra.',
    exampleHanzi: '吃',
    examplePinyin: 'chī',
    exampleMeaningVi: 'Ăn',
    group: 'Âm cuộn lưỡi (Uốn lưỡi)',
  },
  {
    id: 'sh',
    symbol: 'sh',
    vietnameseGuide: 'Giống "s" uốn lưỡi sâu',
    mouthTip: 'Đầu lưỡi uốn cong lên gần ngạc cứng, để khe hẹp cho luồng hơi thoát ra.',
    exampleHanzi: '书',
    examplePinyin: 'shū',
    exampleMeaningVi: 'Sách',
    group: 'Âm cuộn lưỡi (Uốn lưỡi)',
  },
  {
    id: 'r',
    symbol: 'r',
    vietnameseGuide: 'Giống "r" tiếng Việt hoặc âm "d/gi" rung nhẹ',
    mouthTip: 'Vị trí giống sh nhưng dây thanh rung mạnh, phát âm êm tai.',
    exampleHanzi: '日',
    examplePinyin: 'rì',
    exampleMeaningVi: 'Mặt trời, ngày',
    group: 'Âm cuộn lưỡi (Uốn lưỡi)',
  },

  // Âm đầu lưỡi trước
  {
    id: 'z',
    symbol: 'z',
    vietnameseGuide: 'Giống "ch" hoặc "x" nhẹ, đầu lưỡi thẳng',
    mouthTip: 'Đầu lưỡi chạm thẳng mặt sau răng cửa trên, không bật hơi.',
    exampleHanzi: '在',
    examplePinyin: 'zài',
    exampleMeaningVi: 'Ở, tại',
    group: 'Âm đầu lưỡi trước',
  },
  {
    id: 'c',
    symbol: 'c',
    vietnameseGuide: 'Giống "x" bật hơi thật mạnh',
    mouthTip: 'Đầu lưỡi chạm mặt sau răng trên rồi nhả ra ngay để luồng hơi bật xì mạnh.',
    exampleHanzi: '菜',
    examplePinyin: 'cài',
    exampleMeaningVi: 'Món ăn, rau',
    group: 'Âm đầu lưỡi trước',
  },
  {
    id: 's',
    symbol: 's',
    vietnameseGuide: 'Giống "x" tiếng Việt nhẹ',
    mouthTip: 'Đầu lưỡi tiếp cận mặt sau răng cửa trên, luồng hơi ma sát trơn tru ra ngoài.',
    exampleHanzi: '四',
    examplePinyin: 'sì',
    exampleMeaningVi: 'Số 4',
    group: 'Âm đầu lưỡi trước',
  },
];

// 36 Vận Mẫu (Finals)
const FINALS_DATA: PhonemeItem[] = [
  // Vận mẫu đơn (6)
  {
    id: 'a',
    symbol: 'a',
    vietnameseGuide: 'Giống "a" tiếng Việt, mở to miệng',
    mouthTip: 'Miệng mở rộng, lưỡi hạ thấp tự nhiên, dây thanh rung.',
    exampleHanzi: '啊',
    examplePinyin: 'ā',
    exampleMeaningVi: 'A, à',
    group: 'Vận mẫu đơn',
  },
  {
    id: 'o',
    symbol: 'o',
    vietnameseGuide: 'Nằm giữa "ô" và "o" tiếng Việt',
    mouthTip: 'Môi tròn lại, gốc lưỡi hơi nâng lên, dây thanh rung.',
    exampleHanzi: '哦',
    examplePinyin: 'ó',
    exampleMeaningVi: 'Ồ, thế à',
    group: 'Vận mẫu đơn',
  },
  {
    id: 'e',
    symbol: 'e',
    vietnameseGuide: 'Gần giống "ưa" hoặc "ơ" trong tiếng Việt',
    mouthTip: 'Miệng dẹt nửa mở, gốc lưỡi hơi nâng về phía sau.',
    exampleHanzi: '鹅',
    examplePinyin: 'é',
    exampleMeaningVi: 'Con ngỗng',
    group: 'Vận mẫu đơn',
  },
  {
    id: 'i',
    symbol: 'i',
    vietnameseGuide: 'Giống "i" tiếng Việt, kéo khóe môi sang hai bên',
    mouthTip: 'Môi dẹt kéo sang hai bên, mặt lưỡi nâng sát ngạc cứng.',
    exampleHanzi: '衣',
    examplePinyin: 'yī',
    exampleMeaningVi: 'Áo, quần áo',
    group: 'Vận mẫu đơn',
  },
  {
    id: 'u',
    symbol: 'u',
    vietnameseGuide: 'Giống "u" tiếng Việt, tròn môi',
    mouthTip: 'Môi tròn và nhô về phía trước, gốc lưỡi nâng cao.',
    exampleHanzi: '乌',
    examplePinyin: 'wū',
    exampleMeaningVi: 'Đen, quạ',
    group: 'Vận mẫu đơn',
  },
  {
    id: 'v_umlaut',
    symbol: 'ü',
    vietnameseGuide: 'Tròn môi phát âm "uy", giữ tròn môi từ đầu đến cuối',
    mouthTip: 'Phát âm "i" nhưng chu tròn môi như khi thổi sáo, không thay đổi khẩu hình.',
    exampleHanzi: '鱼',
    examplePinyin: 'yú',
    exampleMeaningVi: 'Con cá',
    group: 'Vận mẫu đơn',
  },

  // Vận mẫu kép (13)
  {
    id: 'ai',
    symbol: 'ai',
    vietnameseGuide: 'Giống "ai" tiếng Việt',
    mouthTip: 'Bắt đầu từ "a" rồi lướt nhanh sang "i".',
    exampleHanzi: '爱',
    examplePinyin: 'ài',
    exampleMeaningVi: 'Yêu, thích',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ei',
    symbol: 'ei',
    vietnameseGuide: 'Giống "ây" tiếng Việt',
    mouthTip: 'Bắt đầu từ "e" rồi trượt nhanh sang "i".',
    exampleHanzi: '杯',
    examplePinyin: 'bēi',
    exampleMeaningVi: 'Cốc, chén',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ao',
    symbol: 'ao',
    vietnameseGuide: 'Giống "ao" tiếng Việt',
    mouthTip: 'Bắt đầu từ "a" rồi thu tròn môi sang "o/u".',
    exampleHanzi: '高',
    examplePinyin: 'gāo',
    exampleMeaningVi: 'Cao',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ou',
    symbol: 'ou',
    vietnameseGuide: 'Giống "âu" tiếng Việt',
    mouthTip: 'Bắt đầu từ "o" rồi thu môi sang "u".',
    exampleHanzi: '口',
    examplePinyin: 'kǒu',
    exampleMeaningVi: 'Miệng, khẩu',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ia',
    symbol: 'ia',
    vietnameseGuide: 'Giống "ia" tiếng Việt',
    mouthTip: 'Từ "i" lướt nhanh sang "a" mở rộng.',
    exampleHanzi: '家',
    examplePinyin: 'jiā',
    exampleMeaningVi: 'Nhà',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ie',
    symbol: 'ie',
    vietnameseGuide: 'Giống "iê" tiếng Việt',
    mouthTip: 'Từ "i" lướt sang "ê" hơi mở miệng.',
    exampleHanzi: '写',
    examplePinyin: 'xiě',
    exampleMeaningVi: 'Viết',
    group: 'Vận mẫu kép',
  },
  {
    id: 'iao',
    symbol: 'iao',
    vietnameseGuide: 'Giống "ieo" trong tiếng Việt',
    mouthTip: 'Lướt từ "i" sang "ao" liên tục mượt mà.',
    exampleHanzi: '小',
    examplePinyin: 'xiǎo',
    exampleMeaningVi: 'Nhỏ, bé',
    group: 'Vận mẫu kép',
  },
  {
    id: 'iu',
    symbol: 'iou (iu)',
    vietnameseGuide: 'Giống "iêu" tiếng Việt',
    mouthTip: 'Viết tắt là iu, phát âm lướt i-o-u.',
    exampleHanzi: '九',
    examplePinyin: 'jiǔ',
    exampleMeaningVi: 'Số 9',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ua',
    symbol: 'ua',
    vietnameseGuide: 'Giống "oa" tiếng Việt',
    mouthTip: 'Từ "u" tròn môi trượt nhanh sang "a" mở to.',
    exampleHanzi: '花',
    examplePinyin: 'huā',
    exampleMeaningVi: 'Hoa',
    group: 'Vận mẫu kép',
  },
  {
    id: 'uo',
    symbol: 'uo',
    vietnameseGuide: 'Giống "ua/uô" tiếng Việt',
    mouthTip: 'Từ "u" lướt sang "o".',
    exampleHanzi: '多',
    examplePinyin: 'duō',
    exampleMeaningVi: 'Nhiều',
    group: 'Vận mẫu kép',
  },
  {
    id: 'uai',
    symbol: 'uai',
    vietnameseGuide: 'Giống "oai" tiếng Việt',
    mouthTip: 'Lướt mượt mà từ "u" sang "ai".',
    exampleHanzi: '快',
    examplePinyin: 'kuài',
    exampleMeaningVi: 'Nhanh',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ui',
    symbol: 'uei (ui)',
    vietnameseGuide: 'Giống "uây" tiếng Việt',
    mouthTip: 'Viết tắt là ui, lướt u-e-i.',
    exampleHanzi: '会',
    examplePinyin: 'huì',
    exampleMeaningVi: 'Biết, cuộc họp',
    group: 'Vận mẫu kép',
  },
  {
    id: 'ue',
    symbol: 'üe',
    vietnameseGuide: 'Tròn môi "uy" lướt sang "ê"',
    mouthTip: 'Bắt đầu từ ü rồi mở miệng dẹt sang e.',
    exampleHanzi: '月',
    examplePinyin: 'yuè',
    exampleMeaningVi: 'Mặt trăng, tháng',
    group: 'Vận mẫu kép',
  },

  // Vận mẫu mũi (16)
  {
    id: 'an',
    symbol: 'an',
    vietnameseGuide: 'Giống "an" tiếng Việt',
    mouthTip: 'Bắt đầu từ a rồi đầu lưỡi chạm chân răng trên kết thúc âm n.',
    exampleHanzi: '安',
    examplePinyin: 'ān',
    exampleMeaningVi: 'Bình an, yên ổn',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'en',
    symbol: 'en',
    vietnameseGuide: 'Giống "ơn" hoặc "ân" tiếng Việt',
    mouthTip: 'Từ e lướt sang n kết thúc ở nướu trên.',
    exampleHanzi: '本',
    examplePinyin: 'běn',
    exampleMeaningVi: 'Cuốn, quyển',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'in',
    symbol: 'in',
    vietnameseGuide: 'Giống "in" tiếng Việt',
    mouthTip: 'Từ i chuyển sang n trong khoang mũi.',
    exampleHanzi: '金',
    examplePinyin: 'jīn',
    exampleMeaningVi: 'Vàng, kim loại',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'un_umlaut',
    symbol: 'ün',
    vietnameseGuide: 'Tròn môi ü kết thúc bằng âm n ("uyn")',
    mouthTip: 'Giữ tròn môi ü rồi đưa đầu lưỡi chạm lợi trên.',
    exampleHanzi: '云',
    examplePinyin: 'yún',
    exampleMeaningVi: 'Mây',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'ian',
    symbol: 'ian',
    vietnameseGuide: 'Giống "iên" tiếng Việt',
    mouthTip: 'Lướt từ i sang an, âm mở nhẹ.',
    exampleHanzi: '天',
    examplePinyin: 'tiān',
    exampleMeaningVi: 'Trời, ngày',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'uan',
    symbol: 'uan',
    vietnameseGuide: 'Giống "oan" tiếng Việt',
    mouthTip: 'Lướt từ u tròn môi sang an.',
    exampleHanzi: '关',
    examplePinyin: 'guān',
    exampleMeaningVi: 'Đóng, quan hệ',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'uan_umlaut',
    symbol: 'üan',
    vietnameseGuide: 'Tròn môi ü lướt sang an ("oen/uyên")',
    mouthTip: 'Từ ü tròn môi lướt sang an.',
    exampleHanzi: '远',
    examplePinyin: 'yuǎn',
    exampleMeaningVi: 'Xa',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'uen',
    symbol: 'uen (un)',
    vietnameseGuide: 'Giống "uân" tiếng Việt',
    mouthTip: 'Viết tắt là un khi ghép thanh mẫu, phát âm u-e-n.',
    exampleHanzi: '文',
    examplePinyin: 'wén',
    exampleMeaningVi: 'Văn, ngôn ngữ',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'ang',
    symbol: 'ang',
    vietnameseGuide: 'Giống "ang" tiếng Việt',
    mouthTip: 'Gốc lưỡi chạm ngạc mềm kết thúc âm ng vang trong vòm họng.',
    exampleHanzi: '忙',
    examplePinyin: 'máng',
    exampleMeaningVi: 'Bận rộn',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'eng',
    symbol: 'eng',
    vietnameseGuide: 'Giống "âng" tiếng Việt',
    mouthTip: 'Từ e lướt sang ng ở cuống họng.',
    exampleHanzi: '风',
    examplePinyin: 'fēng',
    exampleMeaningVi: 'Gió',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'ing',
    symbol: 'ing',
    vietnameseGuide: 'Giống "inh" tiếng Việt',
    mouthTip: 'Từ i sang ng vang ở cuống mũi.',
    exampleHanzi: '明',
    examplePinyin: 'míng',
    exampleMeaningVi: 'Sáng, ngày mai',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'ong',
    symbol: 'ong',
    vietnameseGuide: 'Giống "ung" tiếng Việt',
    mouthTip: 'Từ u/o thu tròn môi rồi vang ng ở khoang mũi.',
    exampleHanzi: '同',
    examplePinyin: 'tóng',
    exampleMeaningVi: 'Cùng, đồng',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'iang',
    symbol: 'iang',
    vietnameseGuide: 'Giống "iang" tiếng Việt',
    mouthTip: 'Lướt mượt mà từ i sang ang.',
    exampleHanzi: '想',
    examplePinyin: 'xiǎng',
    exampleMeaningVi: 'Nghĩ, muốn',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'uang',
    symbol: 'uang',
    vietnameseGuide: 'Giống "oang" tiếng Việt',
    mouthTip: 'Lướt từ u tròn môi sang ang vang rộng.',
    exampleHanzi: '黄',
    examplePinyin: 'huáng',
    exampleMeaningVi: 'Màu vàng',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'ueng',
    symbol: 'ueng',
    vietnameseGuide: 'Giống "u-âng" kết hợp',
    mouthTip: 'Từ u chuyển tiếp sang eng.',
    exampleHanzi: '翁',
    examplePinyin: 'wēng',
    exampleMeaningVi: 'Ông lão',
    group: 'Vận mẫu mũi',
  },
  {
    id: 'iong',
    symbol: 'iong',
    vietnameseGuide: 'Giống "i-ung" tiếng Việt',
    mouthTip: 'Từ i lướt nhanh sang ong tròn môi.',
    exampleHanzi: '用',
    examplePinyin: 'yòng',
    exampleMeaningVi: 'Dùng, sử dụng',
    group: 'Vận mẫu mũi',
  },

  // Vận mẫu uốn lưỡi (1)
  {
    id: 'er',
    symbol: 'er',
    vietnameseGuide: 'Âm uốn lưỡi "ơ-r"',
    mouthTip: 'Mở miệng phát âm e/ơ đồng thời uốn cong đầu lưỡi lên ngạc cứng.',
    exampleHanzi: '二',
    examplePinyin: 'èr',
    exampleMeaningVi: 'Số 2',
    group: 'Vận mẫu uốn lưỡi',
  },
];

// 4 Thanh điệu (Tones) + Khinh thanh
const TONES_DATA: ToneItem[] = [
  {
    toneNumber: 1,
    name: 'Thanh 1 (Âm Bình)',
    pitchContour: '55',
    symbol: 'ˉ',
    descriptionVi: 'Cao độ 5-5. Đọc cao, bằng phẳng và ngân đều như nốt Sol ngân dài.',
    tip: 'Giữ thanh quản ổn định ở mức cao nhất, không để giọng bị rơi hay vút lên.',
    exampleChar: '妈',
    examplePinyin: 'mā',
    exampleMeaning: 'Mẹ',
  },
  {
    toneNumber: 2,
    name: 'Thanh 2 (Dương Bình)',
    pitchContour: '35',
    symbol: 'ˊ',
    descriptionVi: 'Cao độ 3-5. Từ mức trung bình vút thẳng lên cao giống dấu hỏi ngạc nhiên "Hả?".',
    tip: 'Bắt đầu từ giữa giọng rồi đẩy dứt khoát lên đỉnh cao nhất, không ngắt quãng.',
    exampleChar: '麻',
    examplePinyin: 'má',
    exampleMeaning: 'Cây gai, tê rần',
  },
  {
    toneNumber: 3,
    name: 'Thanh 3 (Thượng Thanh)',
    pitchContour: '214',
    symbol: 'ˇ',
    descriptionVi: 'Cao độ 2-1-4. Hạ xuống thật trầm ở đáy rồi uốn lượn nhẹ lên.',
    tip: 'Xuống giọng trầm sâu nhất có thể trước khi lướt nhẹ lên. Khi đứng trước thanh 3 khác thì đọc như thanh 2.',
    exampleChar: '马',
    examplePinyin: 'mǎ',
    exampleMeaning: 'Con ngựa',
  },
  {
    toneNumber: 4,
    name: 'Thanh 4 (Khứ Thanh)',
    pitchContour: '51',
    symbol: 'ˋ',
    descriptionVi: 'Cao độ 5-1. Từ đỉnh cao rơi dứt khoát thẳng xuống đáy, phát âm mạnh mẽ.',
    tip: 'Dứt khoát như ra lệnh, rơi từ đỉnh 5 xuống đáy 1 ngay tức thì, không kéo dài như dấu huyền.',
    exampleChar: '骂',
    examplePinyin: 'mà',
    exampleMeaning: 'Mắng mỏ',
  },
  {
    toneNumber: 5,
    name: 'Thanh nhẹ (Khinh Thanh)',
    pitchContour: '--',
    symbol: '·',
    descriptionVi: 'Không dấu. Đọc nhẹ, ngắn gọn, lướt nhanh như âm phụ trợ.',
    tip: 'Chỉ phát âm thật nhẹ 1 nửa độ dài so với âm bình thường, phụ thuộc vào thanh điệu đứng trước nó.',
    exampleChar: '吗',
    examplePinyin: 'ma',
    exampleMeaning: 'Trợ từ nghi vấn (không?)',
  },
];

const TONE_PRACTICE_SYLLABLES = [
  { base: 'ma', hanzi: ['妈', '麻', '马', '骂', '吗'], pinyin: ['mā', 'má', 'mǎ', 'mà', 'ma'] },
  { base: 'ba', hanzi: ['八', '拔', '把', '爸', '吧'], pinyin: ['bā', 'bá', 'bǎ', 'bà', 'ba'] },
  { base: 'da', hanzi: ['搭', '达', '打', '大', '哒'], pinyin: ['dā', 'dá', 'dǎ', 'dà', 'da'] },
  { base: 'shi', hanzi: ['师', '十', '始', '是', '事'], pinyin: ['shī', 'shí', 'shǐ', 'shì', 'shi'] },
];

export interface PinyinChartProps {
  defaultTab?: 'initials' | 'finals' | 'tones';
  className?: string;
}

export function PinyinChart({ defaultTab = 'initials', className = '' }: PinyinChartProps = {}) {
  const [activeTab, setActiveTab] = useState<'initials' | 'finals' | 'tones'>(defaultTab);
  const [selectedPhoneme, setSelectedPhoneme] = useState<PhonemeItem | null>(INITIALS_DATA[0]);
  const [selectedTone, setSelectedTone] = useState<ToneItem | null>(TONES_DATA[0]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeBaseIndex, setActiveBaseIndex] = useState(0);

  // Trigger Chinese Web Speech Synthesis
  const playAudio = (text: string, id: string) => {
    if (typeof window === 'undefined') return;
    setPlayingId(id);

    speakChinese(text, {
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  // Group initials for organized visual sections
  const initialGroups = Array.from(new Set(INITIALS_DATA.map((item) => item.group)));
  const finalGroups = Array.from(new Set(FINALS_DATA.map((item) => item.group)));

  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              Bảng Ngữ Âm Pinyin Chuẩn
            </span>
            <Badge variant="outline" size="sm">
              21 Thanh mẫu • 36 Vận mẫu • 4 Thanh điệu
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Bảng Phát Âm & Thanh Điệu Tiếng Trung
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Nhấn vào từng âm để nghe giọng bản xứ và xem hướng dẫn đặt khẩu hình chi tiết.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 rounded-2xl bg-gray-100 border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('initials')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'initials'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            21 Thanh mẫu
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finals')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'finals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            36 Vận mẫu
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tones')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'tones'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            4 Thanh điệu
          </button>
        </div>
      </div>

      {/* Voice Persona & Speed Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Giọng đọc mẫu:</span>
          </span>
          <span className="text-xs text-slate-500">Bắc Kinh (Phổ thông)</span>
        </div>
        <TTSVoiceSelector variant="compact" showSpeedControl={true} />
      </div>

      {/* TAB 1: 21 Thanh Mẫu (Initials) */}
      {activeTab === 'initials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Phoneme Grid */}
          <div className="lg:col-span-2 space-y-5">
            {initialGroups.map((groupName) => (
              <div key={groupName} className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {groupName}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {INITIALS_DATA.filter((item) => item.group === groupName).map((item) => {
                    const isSelected = selectedPhoneme?.id === item.id;
                    const isPlaying = playingId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedPhoneme(item);
                          playAudio(item.examplePinyin, item.id);
                        }}
                        className={`group relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50/70'
                        }`}
                      >
                        <span className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
                          {item.symbol}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                          {item.exampleHanzi} ({item.examplePinyin})
                        </span>

                        <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-emerald-600' : ''}`} />
                          <span>Nghe</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Selected Phoneme Detail Card */}
          <div className="lg:col-span-1">
            {selectedPhoneme ? (
              <div className="sticky top-20 rounded-3xl border border-emerald-200 bg-gradient-to-b from-[#f7fcf9] to-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-mono text-emerald-700">
                      {selectedPhoneme.symbol}
                    </span>
                    <Badge variant="outline" size="sm">
                      {selectedPhoneme.group}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => playAudio(selectedPhoneme.examplePinyin, selectedPhoneme.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition-all"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Sơ đồ khẩu hình và luồng khí trực quan */}
                <MouthDiagram
                  zone={getArticulationZone(selectedPhoneme.id)}
                  phoneme={selectedPhoneme.symbol}
                  vietnameseGuide={selectedPhoneme.vietnameseGuide}
                  mouthTip={selectedPhoneme.mouthTip}
                />

                {/* Pronunciation guide */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Quy chiếu tiếng Việt:
                  </span>
                  <p className="text-sm font-semibold text-gray-900 bg-white p-2.5 rounded-xl border border-gray-150">
                    {selectedPhoneme.vietnameseGuide}
                  </p>
                </div>

                {/* Mouth & Tongue position tip */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Vị trí đặt lưỡi & Khẩu hình:
                  </span>
                  <div className="text-xs text-gray-700 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    {selectedPhoneme.mouthTip}
                  </div>
                </div>

                {/* Example Vocabulary */}
                <div className="space-y-1 pt-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Từ vựng mẫu:
                  </span>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-200">
                    <div>
                      <span className="font-chinese text-2xl font-extrabold text-gray-900 mr-2">
                        {selectedPhoneme.exampleHanzi}
                      </span>
                      <span className="font-semibold text-emerald-700 text-sm">
                        {selectedPhoneme.examplePinyin}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {selectedPhoneme.exampleMeaningVi}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => playAudio(selectedPhoneme.examplePinyin, 'example-' + selectedPhoneme.id)}
                      className="p-2 text-gray-400 hover:text-emerald-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 2: 36 Vận Mẫu (Finals) */}
      {activeTab === 'finals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Finals Grid */}
          <div className="lg:col-span-2 space-y-5">
            {finalGroups.map((groupName) => (
              <div key={groupName} className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {groupName} ({FINALS_DATA.filter((i) => i.group === groupName).length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {FINALS_DATA.filter((item) => item.group === groupName).map((item) => {
                    const isSelected = selectedPhoneme?.id === item.id;
                    const isPlaying = playingId === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedPhoneme(item);
                          playAudio(item.examplePinyin, item.id);
                        }}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50/70'
                        }`}
                      >
                        <span className="text-lg sm:text-xl font-black text-gray-900 font-mono">
                          {item.symbol}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          {item.exampleHanzi} ({item.examplePinyin})
                        </span>

                        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                          <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-bounce text-emerald-600' : ''}`} />
                          <span>Nghe</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Selected Final Detail Card */}
          <div className="lg:col-span-1">
            {selectedPhoneme ? (
              <div className="sticky top-20 rounded-3xl border border-emerald-200 bg-gradient-to-b from-[#f7fcf9] to-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-700">
                      {selectedPhoneme.symbol}
                    </span>
                    <Badge variant="outline" size="sm">
                      {selectedPhoneme.group}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => playAudio(selectedPhoneme.examplePinyin, selectedPhoneme.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Cách phát âm:
                  </span>
                  <p className="text-sm font-semibold text-gray-900 bg-white p-2.5 rounded-xl border border-gray-150">
                    {selectedPhoneme.vietnameseGuide}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Khẩu hình & mẹo ghi nhớ:
                  </span>
                  <div className="text-xs text-gray-700 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    {selectedPhoneme.mouthTip}
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Ví dụ chữ Hán:
                  </span>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-200">
                    <div>
                      <span className="font-chinese text-2xl font-extrabold text-gray-900 mr-2">
                        {selectedPhoneme.exampleHanzi}
                      </span>
                      <span className="font-semibold text-emerald-700 text-sm">
                        {selectedPhoneme.examplePinyin}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {selectedPhoneme.exampleMeaningVi}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => playAudio(selectedPhoneme.examplePinyin, 'example-' + selectedPhoneme.id)}
                      className="p-2 text-gray-400 hover:text-emerald-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 3: 4 Thanh Điệu (Tones) */}
      {activeTab === 'tones' && (
        <div className="space-y-8">
          {/* 4 Tones Pitch Contour Diagram & Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TONES_DATA.slice(0, 4).map((tone) => {
              const isSelected = selectedTone?.toneNumber === tone.toneNumber;
              const isPlaying = playingId === 'tone-' + tone.toneNumber;

              return (
                <div
                  key={tone.toneNumber}
                  onClick={() => {
                    setSelectedTone(tone);
                    playAudio(tone.examplePinyin, 'tone-' + tone.toneNumber);
                  }}
                  className={`cursor-pointer rounded-3xl border p-5 transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-extrabold text-xs">
                      {tone.toneNumber}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      Cao độ: {tone.pitchContour}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mb-1">{tone.name}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {tone.descriptionVi}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-150">
                    <div>
                      <span className="font-chinese text-2xl font-extrabold text-gray-900 mr-2">
                        {tone.exampleChar}
                      </span>
                      <span className="font-semibold text-emerald-700 text-sm">
                        {tone.examplePinyin}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">({tone.exampleMeaning})</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(tone.examplePinyin, 'tone-' + tone.toneNumber);
                      }}
                      className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-emerald-700"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-emerald-600' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Neutral Tone Info Banner */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs">
                ·
              </span>
              <div>
                <h5 className="text-sm font-bold text-amber-900">
                  Thanh nhẹ (Khinh Thanh / Neutral Tone)
                </h5>
                <p className="text-xs text-amber-800">
                  Không mang dấu, đọc nhẹ và ngắn bằng 1/2 thanh bình thường. Ví dụ: 妈妈 (māma), 好的 (hǎo de).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => playAudio('ma', 'neutral-tone')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 shadow-xs shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe ví dụ "ma"</span>
            </button>
          </div>

          {/* Interactive Tone Contrast Practice Tool */}
          <div className="rounded-3xl border border-gray-200 bg-gray-50/50 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Bảng đối chiếu & luyện phân biệt 4 thanh điệu
                </h4>
                <p className="text-xs text-gray-500">
                  Chọn một âm gốc để nghe sự biến đổi cao độ liên tục từ Thanh 1 đến Thanh 4
                </p>
              </div>

              {/* Syllable Selector Buttons */}
              <div className="flex items-center gap-2">
                {TONE_PRACTICE_SYLLABLES.map((item, idx) => (
                  <button
                    key={item.base}
                    type="button"
                    onClick={() => setActiveBaseIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      activeBaseIndex === idx
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    /{item.base}/
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Tone comparison tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {TONE_PRACTICE_SYLLABLES[activeBaseIndex].pinyin.map((py, idx) => {
                const char = TONE_PRACTICE_SYLLABLES[activeBaseIndex].hanzi[idx];
                const toneLabel = idx === 4 ? 'Thanh nhẹ' : `Thanh ${idx + 1}`;
                const isPlaying = playingId === `compare-${py}`;

                return (
                  <button
                    key={py}
                    type="button"
                    onClick={() => playAudio(py, `compare-${py}`)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-xs transition-all"
                  >
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {toneLabel}
                    </span>
                    <span className="font-chinese text-3xl font-extrabold text-gray-900 my-0.5">
                      {char}
                    </span>
                    <span className="font-bold text-emerald-700 text-base">{py}</span>

                    <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
                      <span>Nghe</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
