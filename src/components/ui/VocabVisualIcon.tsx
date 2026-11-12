'use client';

import React from 'react';
import {
  HandHeart,
  Smile,
  Heart,
  Users,
  User,
  Coffee,
  Utensils,
  Apple,
  Car,
  Plane,
  Train,
  Clock,
  Calendar,
  DollarSign,
  Coins,
  CreditCard,
  Briefcase,
  FileText,
  Building,
  GraduationCap,
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  Globe,
  Home,
  Hospital,
  Sun,
  CloudRain,
  Snowflake,
  Activity,
  ShoppingBag,
  Package,
  Handshake,
  TrendingUp,
  Sparkles,
  Award,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

interface VocabVisualIconProps {
  hanzi: string;
  pinyin?: string;
  meaningVi?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Map common Hanzi keywords to semantic visual themes and Lucide icons
interface IconMapping {
  keywords: string[];
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

const VOCAB_ICON_MAPPINGS: IconMapping[] = [
  // Greetings & Social
  {
    keywords: ['你好', '您好', '早', '嗨'],
    icon: Smile,
    bgColor: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
  },
  {
    keywords: ['谢谢', '多谢', '感恩', '客气'],
    icon: HandHeart,
    bgColor: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
  },
  {
    keywords: ['再见', '明天见', '走'],
    icon: Sparkles,
    bgColor: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
  },
  // Family & People
  {
    keywords: ['家', '家人', '回家'],
    icon: Home,
    bgColor: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  {
    keywords: ['爸爸', '妈妈', '父母', '爷爷', '奶奶', '姐姐', '哥哥', '弟弟', '妹妹'],
    icon: Users,
    bgColor: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600',
  },
  {
    keywords: ['人', '朋友', '同学', '同事', '男', '女'],
    icon: User,
    bgColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    keywords: ['老师', '教授', '学习', '学生', '学校', '大学', '毕业'],
    icon: GraduationCap,
    bgColor: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
  },
  // Food & Beverage
  {
    keywords: ['茶', '绿茶', '红茶', '喝茶'],
    icon: Coffee,
    bgColor: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-700',
  },
  {
    keywords: ['吃', '饭', '米饭', '菜', '菜单', '炒菜', '饺子', '面条', '点菜', '饿'],
    icon: Utensils,
    bgColor: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
  },
  {
    keywords: ['苹果', '水果', '香蕉', '西瓜'],
    icon: Apple,
    bgColor: 'bg-red-50 border-red-200',
    iconColor: 'text-red-500',
  },
  // Transportation & Travel
  {
    keywords: ['飞机', '机票', '起飞', '机场'],
    icon: Plane,
    bgColor: 'bg-sky-50 border-sky-200',
    iconColor: 'text-sky-600',
  },
  {
    keywords: ['出租车', '打车', '车', '开车'],
    icon: Car,
    bgColor: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-700',
  },
  {
    keywords: ['地铁', '站'],
    icon: Train,
    bgColor: 'bg-cyan-50 border-cyan-200',
    iconColor: 'text-cyan-700',
  },
  {
    keywords: ['火车', '高铁'],
    icon: Train,
    bgColor: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-700',
  },
  // Time & Date
  {
    keywords: ['现在', '时间', '点', '分', '小时', '分钟', '准时', '什么时候'],
    icon: Clock,
    bgColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    keywords: ['今天', '明天', '昨天', '年', '月', '日', '号', '星期', '周末', '日程'],
    icon: Calendar,
    bgColor: 'bg-violet-50 border-violet-200',
    iconColor: 'text-violet-600',
  },
  // Money & Commerce
  {
    keywords: ['钱', '多少钱', '元', '块', '贵', '便宜', '买', '卖', '结账', '现金'],
    icon: DollarSign,
    bgColor: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-700',
  },
  {
    keywords: ['网购', '快递', '退款', '评价', '优惠券', '购物'],
    icon: ShoppingBag,
    bgColor: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
  },
  {
    keywords: ['押金', '银行', '信用卡'],
    icon: CreditCard,
    bgColor: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  // Workplace & Professional
  {
    keywords: ['面试', '工作', '上班', '公司', '入职', '经理', '职位'],
    icon: Briefcase,
    bgColor: 'bg-slate-100 border-slate-300',
    iconColor: 'text-slate-800',
  },
  {
    keywords: ['简历', '报告', '文件', '方案', '合同', '协议'],
    icon: FileText,
    bgColor: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
  },
  {
    keywords: ['开会', '会议', '例会', '讨论'],
    icon: MessageSquare,
    bgColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-700',
  },
  {
    keywords: ['谈判', '合作', '互利共赢', '协议'],
    icon: Handshake,
    bgColor: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-700',
  },
  {
    keywords: ['趋势', '经济', '发展', '增长', '投资', '市场'],
    icon: TrendingUp,
    bgColor: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-600',
  },
  // Health & Medical
  {
    keywords: ['医院', '看病', '感冒', '发烧', '药', '身体', '不舒服', '生病'],
    icon: Hospital,
    bgColor: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
  },
  // Weather & Nature
  {
    keywords: ['天气', '晴天', '暖和', '热', '太阳'],
    icon: Sun,
    bgColor: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-500',
  },
  {
    keywords: ['下雨', '阴天', '冷', '雨伞'],
    icon: CloudRain,
    bgColor: 'bg-sky-50 border-sky-200',
    iconColor: 'text-sky-600',
  },
  {
    keywords: ['下雪', '冬天', '雪人'],
    icon: Snowflake,
    bgColor: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-500',
  },
  // Communication & Languages
  {
    keywords: ['汉语', '中文', '语言', '听', '说', '读', '写', '书'],
    icon: BookOpen,
    bgColor: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-700',
  },
];

export function VocabVisualIcon({
  hanzi,
  pinyin,
  size = 'md',
  className = '',
}: VocabVisualIconProps) {
  // Find matching mapping
  const match = VOCAB_ICON_MAPPINGS.find((m) =>
    m.keywords.some((kw) => hanzi.includes(kw) || kw.includes(hanzi))
  );

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-11 h-11 rounded-2xl text-sm',
    lg: 'w-14 h-14 rounded-3xl text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  if (match) {
    const IconComponent = match.icon;
    return (
      <div
        className={`shrink-0 flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105 ${match.bgColor} ${sizeClasses[size]} ${className}`}
        title={`${hanzi} (${pinyin || ''})`}
      >
        <IconComponent className={`${match.iconColor} ${iconSizes[size]}`} />
      </div>
    );
  }

  // Fallback: Elegant traditional Chinese Seal stamp icon
  return (
    <div
      className={`shrink-0 flex flex-col items-center justify-center border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 font-chinese font-bold shadow-2xs transition-transform group-hover:scale-105 ${sizeClasses[size]} ${className}`}
      title={`${hanzi}`}
    >
      <span className="leading-none text-[13px]">{hanzi.slice(0, 1)}</span>
    </div>
  );
}
