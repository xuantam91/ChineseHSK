import type { LibraryTopicKey } from './media-resources';

export interface MindmapSubNode {
  hanzi: string;
  pinyin: string;
  meaningVi: string;
}

export interface MindmapBranch {
  id: string;
  title: string;
  color: 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo' | 'teal';
  items: MindmapSubNode[];
}

export interface LibraryMindmapItem {
  id: string;
  title: string;
  subtitle: string;
  centerHanzi: string;
  centerTitle: string;
  topic: LibraryTopicKey;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6' | 'HSK 1 - 2' | 'All Levels';
  targetAudience: 'kids' | 'teens_adults' | 'all';
  branches: MindmapBranch[];
  tags: string[];
}

export interface LibraryInfographicItem {
  id: string;
  title: string;
  hanziTitle: string;
  imageUrl: string;
  topic: LibraryTopicKey;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6' | 'HSK 7-9';
  targetAudience: 'kids' | 'teens_adults' | 'all';
  lessonId?: string;
  keyWords: MindmapSubNode[];
  tags: string[];
}

export interface LibraryExtraResourceItem {
  id: string;
  title: string;
  shortDesc: string;
  format: 'pdf' | 'audio';
  topic: LibraryTopicKey;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6' | 'All Levels';
  targetAudience: 'kids' | 'teens_adults' | 'all';
  url: string;
  embedUrl?: string;
  isEmbeddable: boolean;
  sourceLabel: string;
  tags: string[];
}

export const LIBRARY_TOPICS: Array<{ id: 'all' | LibraryTopicKey; label: string; emoji: string }> = [
  { id: 'all', label: 'Tất cả chủ đề', emoji: '✨' },
  { id: 'pinyin', label: 'Pinyin & Thanh điệu', emoji: '🎙️' },
  { id: 'greeting_family', label: 'Chào hỏi & Gia đình', emoji: '👋' },
  { id: 'numbers_time', label: 'Số đếm & Thời gian', emoji: '⏰' },
  { id: 'food_shopping', label: 'Ẩm thực & Mua sắm', emoji: '🥟' },
  { id: 'travel_transport', label: 'Du lịch & Giao thông', emoji: '✈️' },
  { id: 'grammar_speaking', label: 'Ngữ pháp & Giao tiếp', emoji: '🧩' },
  { id: 'kids_stories', label: 'Thiếu nhi & Truyện kể', emoji: '🧸' },
];

export const LIBRARY_MINDMAPS: LibraryMindmapItem[] = [
  {
    id: 'mindmap-pinyin',
    title: 'Mindmap Hệ Thống Pinyin & 4 Thanh Điệu',
    subtitle: '21 Thanh mẫu • 36 Vận mẫu • Biến điệu 3+3',
    centerHanzi: '拼音',
    centerTitle: 'Ngữ Âm Pinyin',
    topic: 'pinyin',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    tags: ['Pinyin', 'Thanh điệu', 'Phát âm'],
    branches: [
      {
        id: 'tones',
        title: '4 Thanh Điệu + Khinh Thanh',
        color: 'emerald',
        items: [
          { hanzi: '妈 mā', pinyin: 'Thanh 1 (55)', meaningVi: 'Cao, ngân ngang đều' },
          { hanzi: '麻 má', pinyin: 'Thanh 2 (35)', meaningVi: 'Vút lên như dấu sắc' },
          { hanzi: '马 mǎ', pinyin: 'Thanh 3 (214)', meaningVi: 'Trầm xuống rồi vồng lên' },
          { hanzi: '骂 mà', pinyin: 'Thanh 4 (51)', meaningVi: 'Rơi dốc dứt khoát từ cao' },
        ],
      },
      {
        id: 'sandhi',
        title: 'Quy Tắc Biến Điệu Cốt Lõi',
        color: 'amber',
        items: [
          { hanzi: '你好', pinyin: 'nǐ hǎo → ní hǎo', meaningVi: 'Hai thanh 3: âm đầu thành 2' },
          { hanzi: '不对', pinyin: 'bù duì → bú duì', meaningVi: '不 + thanh 4 → đọc thành bú' },
          { hanzi: '一个', pinyin: 'yī gè → yí gè', meaningVi: '一 + thanh 4 → đọc thành yí' },
        ],
      },
      {
        id: 'initials',
        title: 'Nhóm Thanh Mẫu Dễ Nhầm',
        color: 'sky',
        items: [
          { hanzi: 'b / p', pinyin: 'bàba / pà', meaningVi: 'Không bật hơi / Bật hơi mạnh' },
          { hanzi: 'zh ch sh r', pinyin: 'zhōngguó', meaningVi: 'Uốn đầu lưỡi lên ngạc cứng' },
          { hanzi: 'j q x', pinyin: 'xuéxí / qù', meaningVi: 'Mặt lưỡi chạm vòm, đi với ü' },
        ],
      },
      {
        id: 'finals',
        title: 'Vận Mẫu Mũi & Đặc Biệt',
        color: 'rose',
        items: [
          { hanzi: 'an / ang', pinyin: 'tiān / fáng', meaningVi: 'Mũi trước (-n) vs Mũi sau (-ng)' },
          { hanzi: 'ü (yu)', pinyin: 'nǚ / lǜ / qù', meaningVi: 'Tròn môi, giữ nguyên hình môi' },
          { hanzi: 'er (儿)', pinyin: 'érzi / zhèr', meaningVi: 'Âm cuốn lưỡi đặc trưng Bắc Kinh' },
        ],
      },
    ],
  },
  {
    id: 'mindmap-radicals',
    title: 'Mindmap 24 Bộ Thủ Chữ Hán Cốt Lõi',
    subtitle: 'Nhớ mặt chữ theo hình tượng & ý nghĩa gốc',
    centerHanzi: '部首',
    centerTitle: 'Bộ Thủ Chữ Hán',
    topic: 'pinyin',
    hskLevel: 'HSK 1 - 2',
    targetAudience: 'all',
    tags: ['Bộ thủ', 'Chữ Hán', 'Ghi nhớ nhanh'],
    branches: [
      {
        id: 'human',
        title: 'Con Người & Hành Động',
        color: 'emerald',
        items: [
          { hanzi: '亻 (Nhân đứng)', pinyin: '你, 他, 们', meaningVi: 'Liên quan đến người' },
          { hanzi: '口 (Khẩu)', pinyin: '吃, 喝, 叫', meaningVi: 'Miệng, ăn uống, nói năng' },
          { hanzi: '扌 (Thủ - Tay)', pinyin: '打, 找, 拿', meaningVi: 'Động tác bằng bàn tay' },
          { hanzi: '女 (Nữ)', pinyin: '妈, 姐, 好', meaningVi: 'Phụ nữ, gia đình' },
        ],
      },
      {
        id: 'nature',
        title: 'Thiên Nhiên & Vạn Vật',
        color: 'sky',
        items: [
          { hanzi: '氵 (Thủy)', pinyin: '水, 河, 洗', meaningVi: 'Nước, chất lỏng' },
          { hanzi: '木 (Mộc)', pinyin: '树, 桌, 杯', meaningVi: 'Cây cối, đồ gỗ' },
          { hanzi: '火 / 灬 (Hỏa)', pinyin: '热, 烧, 点', meaningVi: 'Lửa, nhiệt độ' },
          { hanzi: '日 (Nhật)', pinyin: '明, 时, 晴', meaningVi: 'Mặt trời, thời gian' },
        ],
      },
      {
        id: 'mind',
        title: 'Tư Duy & Ngôn Ngữ',
        color: 'indigo',
        items: [
          { hanzi: '讠 (Ngôn)', pinyin: '说, 话, 谢', meaningVi: 'Lời nói, giao tiếp' },
          { hanzi: '忄 / 心 (Tâm)', pinyin: '想, 爱, 忘', meaningVi: 'Tâm trạng, suy nghĩ' },
          { hanzi: '目 (Mục)', pinyin: '看, 眼, 睡', meaningVi: 'Đôi mắt, nhìn ngắm' },
        ],
      },
      {
        id: 'place',
        title: 'Di Chuyển & Nhà Cửa',
        color: 'amber',
        items: [
          { hanzi: '辶 (Sước)', pinyin: '这, 进, 远', meaningVi: 'Bước đi, quãng đường' },
          { hanzi: '宀 (Miên)', pinyin: '家, 安, 客', meaningVi: 'Mái nhà, che chở' },
          { hanzi: '钅 (Kim)', pinyin: '钱, 钟, 铁', meaningVi: 'Kim loại, tiền bạc' },
        ],
      },
    ],
  },
  {
    id: 'mindmap-grammar-hsk12',
    title: 'Mindmap Ngữ Pháp Nền Tảng HSK 1–2',
    subtitle: 'Trật tự câu • Đại từ nghi vấn • Trợ từ động thái',
    centerHanzi: '语法',
    centerTitle: 'Ngữ Pháp HSK 1–2',
    topic: 'grammar_speaking',
    hskLevel: 'HSK 1 - 2',
    targetAudience: 'all',
    tags: ['Ngữ pháp', 'HSK 1-2', 'Trật tự câu'],
    branches: [
      {
        id: 'word-order',
        title: 'Trật Tự Câu Chuẩn',
        color: 'emerald',
        items: [
          { hanzi: 'Chủ + Thời + Địa + Động', pinyin: '我明天在家吃饭', meaningVi: 'Ngày mai tôi ăn cơm ở nhà' },
          { hanzi: '是 / 有 / 在', pinyin: '我是学生', meaningVi: 'Là / Có / Ở tại đâu' },
          { hanzi: 'Định ngữ + 的 + Danh từ', pinyin: '我的书', meaningVi: 'Sách của tôi' },
        ],
      },
      {
        id: 'questions',
        title: 'Cách Đặt Câu Hỏi',
        color: 'amber',
        items: [
          { hanzi: '... 吗？', pinyin: '你忙吗？', meaningVi: 'Câu hỏi Có/Không' },
          { hanzi: '什么 / 谁 / 哪儿', pinyin: '你去哪儿？', meaningVi: 'Cái gì / Ai / Ở đâu' },
          { hanzi: '多少 / 几', pinyin: '多少钱？几点？', meaningVi: 'Bao nhiêu / Mấy' },
        ],
      },
      {
        id: 'particles',
        title: 'Trợ Từ Quan Trọng',
        color: 'sky',
        items: [
          { hanzi: '了 (le)', pinyin: '我买了苹果', meaningVi: 'Hành động đã hoàn thành' },
          { hanzi: '过 (guo)', pinyin: '我去过北京', meaningVi: 'Đã từng trải nghiệm' },
          { hanzi: '着 (zhe)', pinyin: '门开着', meaningVi: 'Trạng thái đang duy trì' },
        ],
      },
      {
        id: 'comparison',
        title: 'So Sánh & Mức Độ',
        color: 'rose',
        items: [
          { hanzi: 'A 比 B + Tính từ', pinyin: '今天比昨天冷', meaningVi: 'A hơn B' },
          { hanzi: '太...了！', pinyin: '太好了！', meaningVi: 'Quá... rồi! (Cảm thán)' },
          { hanzi: 'V + 得 + Mức độ', pinyin: '说得很好', meaningVi: 'Làm gì như thế nào' },
        ],
      },
    ],
  },
  {
    id: 'mindmap-travel-food',
    title: 'Mindmap Giao Tiếp Du Lịch & Ẩm Thực',
    subtitle: 'Sân bay • Khách sạn • Gọi món • Hỏi đường',
    centerHanzi: '旅游',
    centerTitle: 'Du Lịch & Ẩm Thực',
    topic: 'travel_transport',
    hskLevel: 'HSK 2',
    targetAudience: 'all',
    tags: ['Du lịch', 'Ẩm thực', 'Thực chiến'],
    branches: [
      {
        id: 'restaurant',
        title: 'Tại Nhà Hàng',
        color: 'amber',
        items: [
          { hanzi: '点菜', pinyin: 'diǎncài', meaningVi: 'Gọi món ăn' },
          { hanzi: '不要太辣', pinyin: 'búyào tài là', meaningVi: 'Đừng cay quá' },
          { hanzi: '买单', pinyin: 'mǎidān', meaningVi: 'Tính tiền' },
        ],
      },
      {
        id: 'transport',
        title: 'Đi Lại & Hỏi Đường',
        color: 'sky',
        items: [
          { hanzi: '坐地铁', pinyin: 'zuò dìtiě', meaningVi: 'Đi tàu điện ngầm' },
          { hanzi: '往左拐 / 直走', pinyin: 'wǎng zuǒ guǎi', meaningVi: 'Rẽ trái / Đi thẳng' },
          { hanzi: '离这儿远吗？', pinyin: 'lí zhèr yuǎn ma?', meaningVi: 'Cách đây có xa không?' },
        ],
      },
      {
        id: 'hotel-airport',
        title: 'Sân Bay & Khách Sạn',
        color: 'emerald',
        items: [
          { hanzi: '登机牌', pinyin: 'dēngjīpái', meaningVi: 'Thẻ lên máy bay' },
          { hanzi: '办理入住', pinyin: 'bànlǐ rùzhù', meaningVi: 'Làm thủ tục check-in' },
          { hanzi: '护照', pinyin: 'hùzhào', meaningVi: 'Hộ chiếu' },
        ],
      },
      {
        id: 'shopping',
        title: 'Mua Sắm Mặc Cả',
        color: 'rose',
        items: [
          { hanzi: '多少钱？', pinyin: 'duōshao qián?', meaningVi: 'Bao nhiêu tiền?' },
          { hanzi: '可以便宜点吗？', pinyin: 'kěyǐ piányi diǎn ma?', meaningVi: 'Bớt chút được không?' },
          { hanzi: '微信 / 支付宝', pinyin: 'Wēixìn / Zhīfùbǎo', meaningVi: 'Quét mã thanh toán' },
        ],
      },
    ],
  },
  {
    id: 'mindmap-grammar-hsk34',
    title: 'Mindmap Ngữ Pháp Trọng Điểm HSK 3–4',
    subtitle: 'Câu chữ 把 • Câu bị động 被 • Liên từ & Bổ ngữ',
    centerHanzi: '把/被',
    centerTitle: 'Ngữ Pháp HSK 3–4',
    topic: 'grammar_speaking',
    hskLevel: 'HSK 3',
    targetAudience: 'teens_adults',
    tags: ['Câu chữ 把', 'Câu chữ 被', 'HSK 3-4'],
    branches: [
      {
        id: 'ba',
        title: 'Câu Chữ 把 (Xử Lý)',
        color: 'emerald',
        items: [
          { hanzi: 'S + 把 + O + V + Thành phần khác', pinyin: '请把书拿出来', meaningVi: 'Tác động làm đổi trạng thái' },
          { hanzi: 'Phủ định đặt trước 把', pinyin: '我没把钱花完', meaningVi: '没 / 别 đứng trước 把' },
        ],
      },
      {
        id: 'bei',
        title: 'Câu Bị Động 被 / 让 / 叫',
        color: 'rose',
        items: [
          { hanzi: 'O + 被 + (S) + V + Kết quả', pinyin: '手机被弟弟弄坏了', meaningVi: 'Điện thoại bị em làm hỏng rồi' },
          { hanzi: 'Lược bỏ tác nhân', pinyin: '问题被解决了', meaningVi: 'Vấn đề đã được giải quyết' },
        ],
      },
      {
        id: 'complements',
        title: 'Bổ Ngữ Kết Quả & Xu Hướng',
        color: 'sky',
        items: [
          { hanzi: '看完 / 听懂 / 找到', pinyin: 'kànwán / tīngdǒng', meaningVi: 'Xem xong / Nghe hiểu / Tìm thấy' },
          { hanzi: '进来 / 出去 / 回来', pinyin: 'jìnlái / chūqù', meaningVi: 'Hướng về người nói (来) hay ra xa (去)' },
        ],
      },
      {
        id: 'connectors',
        title: 'Cặp Liên Từ Kinh Điển',
        color: 'indigo',
        items: [
          { hanzi: '虽然...但是...', pinyin: 'suīrán... dànshì...', meaningVi: 'Tuy... nhưng...' },
          { hanzi: '不但...而且...', pinyin: 'búdàn... érqiě...', meaningVi: 'Không những... mà còn...' },
          { hanzi: '只要...就...', pinyin: 'zhǐyào... jiù...', meaningVi: 'Chỉ cần... thì...' },
        ],
      },
    ],
  },
  {
    id: 'mindmap-idioms-hsk56',
    title: 'Mindmap Thành Ngữ & Diễn Đạt HSK 5–6',
    subtitle: 'Thành ngữ 4 chữ • Ngôn ngữ công sở • Biện luận',
    centerHanzi: '成语',
    centerTitle: 'Thành Ngữ HSK 5–6',
    topic: 'grammar_speaking',
    hskLevel: 'HSK 5',
    targetAudience: 'teens_adults',
    tags: ['Thành ngữ', 'HSK 5-6', 'Công sở'],
    branches: [
      {
        id: 'effort',
        title: 'Nỗ Lực & Kiên Trì',
        color: 'amber',
        items: [
          { hanzi: '坚持不懈', pinyin: 'jiānchí búxiè', meaningVi: 'Kiên trì không ngừng nghỉ' },
          { hanzi: '水滴石穿', pinyin: 'shuǐdī shíchuān', meaningVi: 'Nước chảy đá mòn' },
          { hanzi: '循序渐进', pinyin: 'xúnxù jiànjìn', meaningVi: 'Tiến từng bước vững chắc' },
        ],
      },
      {
        id: 'business',
        title: 'Đàm Phán & Công Việc',
        color: 'emerald',
        items: [
          { hanzi: '互利共赢', pinyin: 'hùlì gòngyíng', meaningVi: 'Đôi bên cùng có lợi (Win-Win)' },
          { hanzi: '精益求精', pinyin: 'jīngyì qiújīng', meaningVi: 'Không ngừng hoàn thiện chất lượng' },
          { hanzi: '脚踏实地', pinyin: 'jiǎotà shídì', meaningVi: 'Làm việc thực tế, chắc chắn' },
        ],
      },
      {
        id: 'argument',
        title: 'Từ Nối Học Thuật',
        color: 'indigo',
        items: [
          { hanzi: '与此同时', pinyin: 'yǔcǐ tóngshí', meaningVi: 'Đồng thời với đó' },
          { hanzi: '归根结底', pinyin: 'guīgēn jiédǐ', meaningVi: 'Quy cho cùng, xét đến tận gốc' },
          { hanzi: '不可否认', pinyin: 'bùkě fǒurèn', meaningVi: 'Không thể phủ nhận rằng' },
        ],
      },
      {
        id: 'culture',
        title: 'Văn Hóa & Giao Tế',
        color: 'teal',
        items: [
          { hanzi: '以茶会友', pinyin: 'yǐ chá huì yǒu', meaningVi: 'Lấy trà kết bạn' },
          { hanzi: '入乡随俗', pinyin: 'rùxiāng suísú', meaningVi: 'Nhập gia tùy tục' },
        ],
      },
    ],
  },
];

export const LIBRARY_INFOGRAPHICS: LibraryInfographicItem[] = [
  {
    id: 'img-greeting',
    title: 'Tranh Minh Họa: Chào Hỏi & Biến Điệu Thanh 3',
    hanziTitle: '你好',
    imageUrl: '/images/lessons/hsk1_lesson01_greeting.jpg',
    topic: 'greeting_family',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    lessonId: 'hsk1-lesson-01',
    tags: ['Chào hỏi', 'Poster bài học'],
    keyWords: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', meaningVi: 'Xin chào' },
      { hanzi: '您好', pinyin: 'nín hǎo', meaningVi: 'Chào ngài' },
      { hanzi: '再见', pinyin: 'zàijiàn', meaningVi: 'Tạm biệt' },
    ],
  },
  {
    id: 'img-nationality',
    title: 'Tranh Minh Họa: Quốc Tịch & Tự Giới Thiệu',
    hanziTitle: '国籍',
    imageUrl: '/images/lessons/hsk1_lesson02_nationality.jpg',
    topic: 'greeting_family',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    lessonId: 'hsk1-lesson-02',
    tags: ['Quốc tịch', 'Bản thân'],
    keyWords: [
      { hanzi: '越南', pinyin: 'Yuènán', meaningVi: 'Việt Nam' },
      { hanzi: '中国', pinyin: 'Zhōngguó', meaningVi: 'Trung Quốc' },
      { hanzi: '老师', pinyin: 'lǎoshī', meaningVi: 'Giáo viên' },
    ],
  },
  {
    id: 'img-family',
    title: 'Tranh Minh Họa: Gia Đình Ấm Áp',
    hanziTitle: '家庭',
    imageUrl: '/images/lessons/hsk1_lesson03_family.jpg',
    topic: 'greeting_family',
    hskLevel: 'HSK 1',
    targetAudience: 'kids',
    lessonId: 'hsk1-lesson-05',
    tags: ['Gia đình', 'Trẻ em'],
    keyWords: [
      { hanzi: '爸爸', pinyin: 'bàba', meaningVi: 'Bố' },
      { hanzi: '妈妈', pinyin: 'māma', meaningVi: 'Mẹ' },
      { hanzi: '家', pinyin: 'jiā', meaningVi: 'Nhà, gia đình' },
    ],
  },
  {
    id: 'img-time',
    title: 'Tranh Minh Họa: Giờ Giấc & Lịch Trình Ngày',
    hanziTitle: '时间',
    imageUrl: '/images/lessons/hsk1_lesson04_time_calendar.jpg',
    topic: 'numbers_time',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    lessonId: 'hsk1-lesson-11',
    tags: ['Thời gian', 'Lịch'],
    keyWords: [
      { hanzi: '现在几点', pinyin: 'xiànzài jǐ diǎn', meaningVi: 'Bây giờ mấy giờ?' },
      { hanzi: '明天', pinyin: 'míngtiān', meaningVi: 'Ngày mai' },
      { hanzi: '星期', pinyin: 'xīngqī', meaningVi: 'Thứ / Tuần' },
    ],
  },
  {
    id: 'img-shopping',
    title: 'Tranh Minh Họa: Đi Chợ & Hỏi Giá Tiền',
    hanziTitle: '买东西',
    imageUrl: '/images/lessons/hsk1_lesson05_shopping_market.jpg',
    topic: 'food_shopping',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    lessonId: 'hsk1-lesson-08',
    tags: ['Mua sắm', 'Hoa quả'],
    keyWords: [
      { hanzi: '多少钱', pinyin: 'duōshao qián', meaningVi: 'Bao nhiêu tiền?' },
      { hanzi: '苹果', pinyin: 'píngguǒ', meaningVi: 'Quả táo' },
      { hanzi: '买', pinyin: 'mǎi', meaningVi: 'Mua' },
    ],
  },
  {
    id: 'img-restaurant',
    title: 'Tranh Minh Họa: Ẩm Thực & Gọi Món Nhà Hàng',
    hanziTitle: '点菜',
    imageUrl: '/images/lessons/hsk2_lesson01_restaurant_menu.jpg',
    topic: 'food_shopping',
    hskLevel: 'HSK 2',
    targetAudience: 'all',
    lessonId: 'hsk2-lesson-01',
    tags: ['Nhà hàng', 'Món ăn'],
    keyWords: [
      { hanzi: '点菜', pinyin: 'diǎncài', meaningVi: 'Gọi món' },
      { hanzi: '好吃', pinyin: 'hǎochī', meaningVi: 'Ngon miệng' },
      { hanzi: '服务员', pinyin: 'fúwùyuán', meaningVi: 'Nhân viên phục vụ' },
    ],
  },
  {
    id: 'img-transport',
    title: 'Tranh Minh Họa: Giao Thông & Tàu Điện Ngầm',
    hanziTitle: '交通',
    imageUrl: '/images/lessons/hsk2_lesson02_transport_directions.jpg',
    topic: 'travel_transport',
    hskLevel: 'HSK 2',
    targetAudience: 'all',
    lessonId: 'hsk2-lesson-02',
    tags: ['Giao thông', 'Chỉ đường'],
    keyWords: [
      { hanzi: '地铁', pinyin: 'dìtiě', meaningVi: 'Tàu điện ngầm' },
      { hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', meaningVi: 'Xe buýt' },
      { hanzi: '左拐', pinyin: 'zuǒ guǎi', meaningVi: 'Rẽ trái' },
    ],
  },
  {
    id: 'img-seasons',
    title: 'Tranh Minh Họa: Bốn Mùa & Thời Tiết',
    hanziTitle: '天气',
    imageUrl: '/images/lessons/hsk2_lesson03_seasons_weather.jpg',
    topic: 'numbers_time',
    hskLevel: 'HSK 2',
    targetAudience: 'all',
    lessonId: 'hsk1-lesson-12',
    tags: ['Thời tiết', 'Bốn mùa'],
    keyWords: [
      { hanzi: '春天', pinyin: 'chūntiān', meaningVi: 'Mùa xuân' },
      { hanzi: '下雨', pinyin: 'xiàyǔ', meaningVi: 'Trời mưa' },
      { hanzi: '暖和', pinyin: 'nuǎnhuo', meaningVi: 'Ấm áp' },
    ],
  },
  {
    id: 'img-hobbies',
    title: 'Tranh Minh Họa: Sở Thích & Thể Thao',
    hanziTitle: '运动',
    imageUrl: '/images/lessons/hsk2_lesson04_hobbies_sports.jpg',
    topic: 'greeting_family',
    hskLevel: 'HSK 2',
    targetAudience: 'kids',
    lessonId: 'hsk2-lesson-04',
    tags: ['Thể thao', 'Sở thích'],
    keyWords: [
      { hanzi: '踢足球', pinyin: 'tī zúqiú', meaningVi: 'Đá bóng' },
      { hanzi: '游泳', pinyin: 'yóuyǒng', meaningVi: 'Bơi lội' },
      { hanzi: '跑步', pinyin: 'pǎobù', meaningVi: 'Chạy bộ' },
    ],
  },
  {
    id: 'img-doctor',
    title: 'Tranh Minh Họa: Sức Khỏe & Khám Bệnh',
    hanziTitle: '看病',
    imageUrl: '/images/lessons/hsk2_lesson05_hospital_doctor.jpg',
    topic: 'greeting_family',
    hskLevel: 'HSK 2',
    targetAudience: 'all',
    lessonId: 'hsk2-lesson-05',
    tags: ['Sức khỏe', 'Bệnh viện'],
    keyWords: [
      { hanzi: '医院', pinyin: 'yīyuàn', meaningVi: 'Bệnh viện' },
      { hanzi: '吃药', pinyin: 'chī yào', meaningVi: 'Uống thuốc' },
      { hanzi: '休息', pinyin: 'xiūxi', meaningVi: 'Nghỉ ngơi' },
    ],
  },
  {
    id: 'img-hotel',
    title: 'Tranh Minh Họa: Đặt Phòng Khách Sạn',
    hanziTitle: '酒店',
    imageUrl: '/images/lessons/hsk3_lesson01_hotel_room.jpg',
    topic: 'travel_transport',
    hskLevel: 'HSK 3',
    targetAudience: 'teens_adults',
    lessonId: 'hsk3-lesson-01',
    tags: ['Khách sạn', 'Du lịch'],
    keyWords: [
      { hanzi: '预订', pinyin: 'yùdìng', meaningVi: 'Đặt trước' },
      { hanzi: '房间', pinyin: 'fángjiān', meaningVi: 'Phòng' },
      { hanzi: '房卡', pinyin: 'fángkǎ', meaningVi: 'Thẻ phòng' },
    ],
  },
  {
    id: 'img-airport',
    title: 'Tranh Minh Họa: Sân Bay & Làm Thủ Tục Bay',
    hanziTitle: '机场',
    imageUrl: '/images/lessons/hsk3_lesson02_airport_travel.jpg',
    topic: 'travel_transport',
    hskLevel: 'HSK 3',
    targetAudience: 'teens_adults',
    lessonId: 'hsk3-lesson-02',
    tags: ['Sân bay', 'Hành lý'],
    keyWords: [
      { hanzi: '登机', pinyin: 'dēngjī', meaningVi: 'Lên máy bay' },
      { hanzi: '行李', pinyin: 'xíngli', meaningVi: 'Hành lý' },
      { hanzi: '准时', pinyin: 'zhǔnshí', meaningVi: 'Đúng giờ' },
    ],
  },
  {
    id: 'img-greatwall',
    title: 'Tranh Minh Họa: Văn Hóa & Vạn Lý Trường Thành',
    hanziTitle: '长城',
    imageUrl: '/images/lessons/hsk3_lesson04_great_wall_trip.jpg',
    topic: 'travel_transport',
    hskLevel: 'HSK 3',
    targetAudience: 'all',
    lessonId: 'hsk3-lesson-04',
    tags: ['Văn hóa', 'Danh lam'],
    keyWords: [
      { hanzi: '长城', pinyin: 'Chángchéng', meaningVi: 'Vạn Lý Trường Thành' },
      { hanzi: '拍照', pinyin: 'pāizhào', meaningVi: 'Chụp ảnh' },
      { hanzi: '风景', pinyin: 'fēngjǐng', meaningVi: 'Phong cảnh' },
    ],
  },
  {
    id: 'img-interview',
    title: 'Tranh Minh Họa: Phỏng Vấn Xin Việc HSK 4',
    hanziTitle: '面试',
    imageUrl: '/images/lessons/hsk4_lesson01_interview.jpg',
    topic: 'grammar_speaking',
    hskLevel: 'HSK 4',
    targetAudience: 'teens_adults',
    lessonId: 'hsk4-lesson-01',
    tags: ['Công việc', 'Phỏng vấn'],
    keyWords: [
      { hanzi: '面试', pinyin: 'miànshì', meaningVi: 'Phỏng vấn' },
      { hanzi: '经验', pinyin: 'jīngyàn', meaningVi: 'Kinh nghiệm' },
      { hanzi: '负责', pinyin: 'fùzé', meaningVi: 'Phụ trách' },
    ],
  },
  {
    id: 'img-tea',
    title: 'Tranh Minh Họa: Trà Đạo & Văn Hóa Truyền Thống',
    hanziTitle: '茶道',
    imageUrl: '/images/lessons/hsk5_lesson02_tea_ceremony.jpg',
    topic: 'food_shopping',
    hskLevel: 'HSK 5',
    targetAudience: 'teens_adults',
    lessonId: 'hsk5-lesson-02',
    tags: ['Trà đạo', 'Văn hóa'],
    keyWords: [
      { hanzi: '茶文化', pinyin: 'chá wénhuà', meaningVi: 'Văn hóa trà' },
      { hanzi: '品茶', pinyin: 'pǐn chá', meaningVi: 'Thưởng trà' },
      { hanzi: '传统', pinyin: 'chuántǒng', meaningVi: 'Truyền thống' },
    ],
  },
  {
    id: 'img-negotiation',
    title: 'Tranh Minh Họa: Đàm Phán Thương Mại HSK 6',
    hanziTitle: '合作',
    imageUrl: '/images/lessons/hsk6_lesson01_business_negotiation.jpg',
    topic: 'grammar_speaking',
    hskLevel: 'HSK 6',
    targetAudience: 'teens_adults',
    lessonId: 'hsk6-lesson-01',
    tags: ['Kinh doanh', 'Đàm phán'],
    keyWords: [
      { hanzi: '合作', pinyin: 'hézuò', meaningVi: 'Hợp tác' },
      { hanzi: '互利共赢', pinyin: 'hùlì gòngyíng', meaningVi: 'Đôi bên cùng có lợi' },
      { hanzi: '协议', pinyin: 'xiéyì', meaningVi: 'Thỏa thuận' },
    ],
  },
];

export const LIBRARY_EXTRA_RESOURCES: LibraryExtraResourceItem[] = [
  {
    id: 'extra-pinyin-drive',
    title: 'Sách & Audio Ngữ Âm Pinyin Cho Người Mới (PDF + MP3)',
    shortDesc: 'Bộ sách phát âm kèm đĩa nghe chuẩn',
    format: 'pdf',
    topic: 'pinyin',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    url: 'https://drive.google.com/drive/folders/12_7dgZXgNMDqnOT7vGVT5PgbX7nxjcVr?usp=sharing',
    embedUrl: 'https://drive.google.com/embeddedfolderview?id=12_7dgZXgNMDqnOT7vGVT5PgbX7nxjcVr#grid',
    isEmbeddable: true,
    sourceLabel: 'Drive PDF + MP3',
    tags: ['Pinyin', 'PDF', 'MP3'],
  },
  {
    id: 'extra-craven-audio',
    title: 'Kho File Nghe Thụ Động & Shadowing HSK 1 (MP3)',
    shortDesc: 'Âm thanh nạp phản xạ ngữ điệu tự nhiên',
    format: 'audio',
    topic: 'pinyin',
    hskLevel: 'HSK 1',
    targetAudience: 'all',
    url: 'https://drive.google.com/drive/folders/13ge0qbgNI1yQOBmj_6psALKav-3Iqj_h?usp=sharing',
    embedUrl: 'https://drive.google.com/embeddedfolderview?id=13ge0qbgNI1yQOBmj_6psALKav-3Iqj_h#grid',
    isEmbeddable: true,
    sourceLabel: 'Kho Audio MP3',
    tags: ['MP3', 'Nghe thụ động'],
  },
  {
    id: 'extra-radicals-chart',
    title: 'Bảng Tra Cứu 214 Bộ Thủ Tiếng Trung Chuẩn (Khang Hy)',
    shortDesc: 'Phân loại theo số nét từ 1 đến 17 nét',
    format: 'pdf',
    topic: 'pinyin',
    hskLevel: 'All Levels',
    targetAudience: 'all',
    url: 'https://flexiclasses.com/chinese-radicals/',
    isEmbeddable: false,
    sourceLabel: 'Tra cứu Bộ thủ',
    tags: ['214 Bộ thủ', 'Chữ Hán'],
  },
  {
    id: 'extra-saymei-hsk-pdf',
    title: 'Bảng Từ Vựng HSK 1–6 Kèm Pinyin & Audio (PDF/CSV)',
    shortDesc: 'In ấn luyện từ vựng hoặc nhập Anki Flashcard',
    format: 'pdf',
    topic: 'grammar_speaking',
    hskLevel: 'All Levels',
    targetAudience: 'teens_adults',
    url: 'https://saymei.app',
    isEmbeddable: false,
    sourceLabel: 'PDF Từ vựng HSK',
    tags: ['HSK 1-6', 'PDF', 'Flashcard'],
  },
  {
    id: 'extra-chineseboost-grammar',
    title: 'Kho Tổng Hợp Ngữ Pháp HSK 1–6 Theo Cấu Trúc',
    shortDesc: 'Tra nhanh cấu trúc câu, trợ từ và ví dụ',
    format: 'pdf',
    topic: 'grammar_speaking',
    hskLevel: 'All Levels',
    targetAudience: 'teens_adults',
    url: 'https://www.chineseboost.com/grammar/',
    isEmbeddable: false,
    sourceLabel: 'Ngữ pháp HSK',
    tags: ['Ngữ pháp', 'HSK 1-6'],
  },
];

export function inferMediaTopic(item: {
  topic?: LibraryTopicKey;
  category: string;
  title: string;
  recommendedTags?: string[];
}): LibraryTopicKey {
  if (item.topic) return item.topic;
  const hay = `${item.title} ${(item.recommendedTags || []).join(' ')}`.toLowerCase();
  if (item.category === 'pinyin' || hay.includes('pinyin') || hay.includes('thanh điệu') || hay.includes('phát âm')) {
    return 'pinyin';
  }
  if (hay.includes('gia đình') || hay.includes('động vật') || hay.includes('màu sắc') || hay.includes('cơ thể')) {
    return 'greeting_family';
  }
  if (hay.includes('số') || hay.includes('giờ') || hay.includes('ngày') || hay.includes('thời tiết') || hay.includes('sinh hoạt')) {
    return 'numbers_time';
  }
  if (hay.includes('món ăn') || hay.includes('đồ uống') || hay.includes('quần áo') || hay.includes('hoa quả') || hay.includes('giá')) {
    return 'food_shopping';
  }
  if (hay.includes('giao thông') || hay.includes('khách sạn') || hay.includes('sân bay') || hay.includes('du lịch')) {
    return 'travel_transport';
  }
  if (item.category === 'song' || item.category === 'cartoon' || item.category === 'story') {
    return 'kids_stories';
  }
  return 'grammar_speaking';
}
