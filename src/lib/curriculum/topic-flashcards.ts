/**
 * Thematic Flashcard Collections from GamelearnChinese & A Little Chinese
 * Covers 9 foundational visual topics for beginners and young learners.
 */

export interface ThematicFlashcardWord {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  category: string;
  exampleSentence?: string;
  examplePinyin?: string;
  exampleVi?: string;
}

export interface ThematicFlashcardSet {
  id: string;
  topic: string;
  topicVi: string;
  iconName: string;
  videoUrl: string;
  videoId: string;
  descriptionVi: string;
  relatedHskLevel: 'HSK 1' | 'HSK 2';
  relatedLessonId: string;
  words: ThematicFlashcardWord[];
}

export const THEMATIC_FLASHCARD_SETS: ThematicFlashcardSet[] = [
  {
    id: 'tf-clothes',
    topic: 'Quần áo & Trang phục (衣服与配饰)',
    topicVi: 'Quần áo & Trang phục',
    iconName: 'Shirt',
    videoUrl: 'https://youtu.be/WmzZ_xI5ceM',
    videoId: 'WmzZ_xI5ceM',
    descriptionVi: 'Học từ vựng về các loại trang phục thường ngày qua video hình ảnh sinh động của GamelearnChinese.',
    relatedHskLevel: 'HSK 1',
    relatedLessonId: 'hsk1-lesson-05',
    words: [
      { id: 'tf-cl-1', hanzi: '衣服', pinyin: 'yīfu', vietnamese: 'quần áo', category: 'clothes', exampleSentence: '这件衣服很漂亮。', examplePinyin: 'Zhè jiàn yīfu hěn piàoliang.', exampleVi: 'Bộ quần áo này rất đẹp.' },
      { id: 'tf-cl-2', hanzi: '裤子', pinyin: 'kùzi', vietnamese: 'quần', category: 'clothes', exampleSentence: '他穿了一条黑色的裤子。', examplePinyin: 'Tā chuān le yì tiáo hēisè de kùzi.', exampleVi: 'Anh ấy mặc một chiếc quần màu đen.' },
      { id: 'tf-cl-3', hanzi: '衬衫', pinyin: 'chènshān', vietnamese: 'áo sơ mi', category: 'clothes', exampleSentence: '爸爸今天穿白衬衫。', examplePinyin: 'Bàba jīntiān chuān bái chènshān.', exampleVi: 'Hôm nay bố mặc áo sơ mi trắng.' },
      { id: 'tf-cl-4', hanzi: '裙子', pinyin: 'qúnzi', vietnamese: 'váy, đầm', category: 'clothes', exampleSentence: '妹妹喜欢穿红色的裙子。', examplePinyin: 'Mèimei xǐhuan chuān hóngsè de qúnzi.', exampleVi: 'Em gái thích mặc váy màu đỏ.' },
      { id: 'tf-cl-5', hanzi: '鞋子', pinyin: 'xiézi', vietnamese: 'giày', category: 'clothes', exampleSentence: '这双鞋子很舒服。', examplePinyin: 'Zhè shuāng xiézi hěn shūfu.', exampleVi: 'Đôi giày này đi rất êm.' },
      { id: 'tf-cl-6', hanzi: '帽子', pinyin: 'màozi', vietnamese: 'mũ, nón', category: 'clothes', exampleSentence: '出门请戴上帽子。', examplePinyin: 'Chūmén qǐng dài shàng màozi.', exampleVi: 'Ra ngoài xin hãy đội mũ.' },
    ],
  },
  {
    id: 'tf-body',
    topic: 'Bộ phận cơ thể con người (人体部位)',
    topicVi: 'Bộ phận cơ thể',
    iconName: 'User',
    videoUrl: 'https://youtu.be/PVnybNwHQis',
    videoId: 'PVnybNwHQis',
    descriptionVi: 'Nhận biết các bộ phận trên cơ thể người (mắt, mũi, miệng, tai, tay, chân) phục vụ bài khám bệnh và miêu tả ngoại hình.',
    relatedHskLevel: 'HSK 2',
    relatedLessonId: 'hsk2-lesson-05',
    words: [
      { id: 'tf-bd-1', hanzi: '眼睛', pinyin: 'yǎnjing', vietnamese: 'mắt', category: 'body', exampleSentence: '她的眼睛又大又亮。', examplePinyin: 'Tā de yǎnjing yòu dà yòu liàng.', exampleVi: 'Đôi mắt cô ấy vừa to vừa sáng.' },
      { id: 'tf-bd-2', hanzi: '鼻子', pinyin: 'bízi', vietnamese: 'mũi', category: 'body', exampleSentence: '大象有一个长长的鼻子。', examplePinyin: 'Dàxiàng yǒu yí gè chángcháng de bízi.', exampleVi: 'Con voi có một chiếc mũi rất dài.' },
      { id: 'tf-bd-3', hanzi: '嘴巴', pinyin: 'zuǐba', vietnamese: 'miệng', category: 'body', exampleSentence: '张开嘴巴，医生看一下。', examplePinyin: 'Zhāng kāi zuǐba, yīshēng kàn yíxià.', exampleVi: 'Há miệng ra để bác sĩ xem nào.' },
      { id: 'tf-bd-4', hanzi: '耳朵', pinyin: 'ěrduo', vietnamese: 'tai', category: 'body', exampleSentence: '兔子的耳朵很长。', examplePinyin: 'Tùzi de ěrduo hěn cháng.', exampleVi: 'Tai của chú thỏ rất dài.' },
      { id: 'tf-bd-5', hanzi: '手', pinyin: 'shǒu', vietnamese: 'tay', category: 'body', exampleSentence: '吃饭前请洗手。', examplePinyin: 'Chīfàn qián qǐng xǐ shǒu.', exampleVi: 'Trước khi ăn cơm xin hãy rửa tay.' },
      { id: 'tf-bd-6', hanzi: '脚', pinyin: 'jiǎo', vietnamese: 'chân', category: 'body', exampleSentence: '走了一天，脚有点儿酸。', examplePinyin: 'Zǒu le yì tiān, jiǎo yǒudiǎnr suān.', exampleVi: 'Đi bộ cả ngày, chân hơi mỏi.' },
    ],
  },
  {
    id: 'tf-animals',
    topic: 'Thế giới động vật quen thuộc (可爱动物)',
    topicVi: 'Động vật',
    iconName: 'Dog',
    videoUrl: 'https://youtu.be/-Clrihb7At8',
    videoId: '-Clrihb7At8',
    descriptionVi: 'Từ vựng các con thú cưng và động vật gần gũi trong đời sống, học qua tranh hoạt hình vui nhộn.',
    relatedHskLevel: 'HSK 1',
    relatedLessonId: 'hsk1-lesson-03',
    words: [
      { id: 'tf-an-1', hanzi: '狗', pinyin: 'gǒu', vietnamese: 'chó', category: 'animals', exampleSentence: '我家有一只可爱的小狗。', examplePinyin: 'Wǒ jiā yǒu yì zhī kě\'ài de xiǎogǒu.', exampleVi: 'Nhà tôi có một chú chó nhỏ đáng yêu.' },
      { id: 'tf-an-2', hanzi: '猫', pinyin: 'māo', vietnamese: 'mèo', category: 'animals', exampleSentence: '小猫在沙发上睡觉。', examplePinyin: 'Xiǎomāo zài shāfā shàng shuìjiào.', exampleVi: 'Mèo con đang ngủ trên ghế sofa.' },
      { id: 'tf-an-3', hanzi: '鸟', pinyin: 'niǎo', vietnamese: 'chim', category: 'animals', exampleSentence: '树上有很多小鸟在唱歌。', examplePinyin: 'Shù shàng yǒu hěn duō xiǎoniǎo zài chànggē.', exampleVi: 'Trên cây có rất nhiều chú chim đang hót.' },
      { id: 'tf-an-4', hanzi: '鱼', pinyin: 'yú', vietnamese: 'cá', category: 'animals', exampleSentence: '水里有几条小鱼在游。', examplePinyin: 'Shuǐ lǐ yǒu jǐ tiáo xiǎoyú zài yóu.', exampleVi: 'Dưới nước có mấy chú cá nhỏ đang bơi.' },
      { id: 'tf-an-5', hanzi: '熊猫', pinyin: 'xióngmāo', vietnamese: 'gấu trúc', category: 'animals', exampleSentence: '大熊猫是中国国宝。', examplePinyin: 'Dàxióngmāo shì Zhōngguó guóbǎo.', exampleVi: 'Gấu trúc là quốc bảo của Trung Quốc.' },
    ],
  },
  {
    id: 'tf-transport',
    topic: 'Phương tiện giao thông đi lại (交通工具)',
    topicVi: 'Phương tiện đi lại',
    iconName: 'Train',
    videoUrl: 'https://youtu.be/umGf6u4Oj7E',
    videoId: 'umGf6u4Oj7E',
    descriptionVi: 'Từ vựng các loại xe buýt, tàu điện ngầm, taxi, máy bay giúp giao tiếp hỏi đường và du lịch.',
    relatedHskLevel: 'HSK 2',
    relatedLessonId: 'hsk2-lesson-02',
    words: [
      { id: 'tf-tr-1', hanzi: '出租车', pinyin: 'chūzūchē', vietnamese: 'taxi', category: 'transport', exampleSentence: '我们打出租车去机场吧。', examplePinyin: 'Wǒmen dǎ chūzūchē qù jīchǎng ba.', exampleVi: 'Chúng ta bắt taxi đi sân bay nhé.' },
      { id: 'tf-tr-2', hanzi: '公共汽车', pinyin: 'gōnggòng qìchē', vietnamese: 'xe buýt', category: 'transport', exampleSentence: '坐公共汽车很环保。', examplePinyin: 'Zuò gōnggòng qìchē hěn huánbǎo.', exampleVi: 'Đi xe buýt rất bảo vệ môi trường.' },
      { id: 'tf-tr-3', hanzi: '地铁', pinyin: 'dìtiě', vietnamese: 'tàu điện ngầm', category: 'transport', exampleSentence: '坐地铁上班不会堵车。', examplePinyin: 'Zuò dìtiě shàngbān bú huì dǔchē.', exampleVi: 'Đi tàu điện ngầm đi làm không bị kẹt xe.' },
      { id: 'tf-tr-4', hanzi: '自行车', pinyin: 'zìxíngchē', vietnamese: 'xe đạp', category: 'transport', exampleSentence: '他每天骑自行车上学。', examplePinyin: 'Tā měitiān qí zìxíngchē shàngxué.', exampleVi: 'Cậu ấy ngày nào cũng đạp xe đi học.' },
      { id: 'tf-tr-5', hanzi: '飞机', pinyin: 'fēijī', vietnamese: 'máy bay', category: 'transport', exampleSentence: '坐飞机两个小时就到了。', examplePinyin: 'Zuò fēijī liǎng gè xiǎoshí jiù dào le.', exampleVi: 'Đi máy bay hai tiếng là tới nơi rồi.' },
    ],
  },
  {
    id: 'tf-daily',
    topic: 'Hoạt động thường nhật trong ngày (日常生活动作)',
    topicVi: 'Hoạt động thường ngày',
    iconName: 'Clock',
    videoUrl: 'https://youtu.be/D-CCYx3KNn4',
    videoId: 'D-CCYx3KNn4',
    descriptionVi: 'Các hành động sinh hoạt từ sáng đến tối: thức dậy, đánh răng, rửa mặt, ăn cơm, đi ngủ.',
    relatedHskLevel: 'HSK 1',
    relatedLessonId: 'hsk1-lesson-04',
    words: [
      { id: 'tf-da-1', hanzi: '起床', pinyin: 'qǐchuáng', vietnamese: 'thức dậy', category: 'routine', exampleSentence: '我每天早上七点起床。', examplePinyin: 'Wǒ měitiān zǎoshang qī diǎn qǐchuáng.', exampleVi: 'Tôi thức dậy lúc 7 giờ mỗi sáng.' },
      { id: 'tf-da-2', hanzi: '刷牙', pinyin: 'shuāyá', vietnamese: 'đánh răng', category: 'routine', exampleSentence: '早晚都要认真刷牙。', examplePinyin: 'Zǎowǎn dōu yào rènzhēn shuāyá.', exampleVi: 'Sáng và tối đều phải đánh răng kỹ.' },
      { id: 'tf-da-3', hanzi: '洗脸', pinyin: 'xǐliǎn', vietnamese: 'rửa mặt', category: 'routine', exampleSentence: '用温水洗脸很舒服。', examplePinyin: 'Yòng wēnshuǐ xǐliǎn hěn shūfu.', exampleVi: 'Dùng nước ấm rửa mặt rất dễ chịu.' },
      { id: 'tf-da-4', hanzi: '吃早饭', pinyin: 'chī zǎofàn', vietnamese: 'ăn sáng', category: 'routine', exampleSentence: '记得按时吃早饭。', examplePinyin: 'Jìde ànshí chī zǎofàn.', exampleVi: 'Nhớ ăn sáng đúng giờ nhé.' },
      { id: 'tf-da-5', hanzi: '睡觉', pinyin: 'shuìjiào', vietnamese: 'đi ngủ', category: 'routine', exampleSentence: '现在已经很晚了，快去睡觉吧。', examplePinyin: 'Xiànzài yǐjīng hěn wǎn le, kuài qù shuìjiào ba.', exampleVi: 'Bây giờ đã rất muộn rồi, mau đi ngủ đi.' },
    ],
  },
  {
    id: 'tf-food',
    topic: 'Ẩm thực & Món ăn ngon (美味食物)',
    topicVi: 'Món ăn & Ẩm thực',
    iconName: 'UtensilsCrossed',
    videoUrl: 'https://www.youtube.com/watch?v=yjeSGzZzc-g',
    videoId: 'yjeSGzZzc-g',
    descriptionVi: 'Khám phá các món ăn truyền thống: cơm, mì sợi, sủi cảo, bánh bao thường gặp trong nhà hàng Trung Hoa.',
    relatedHskLevel: 'HSK 2',
    relatedLessonId: 'hsk2-lesson-01',
    words: [
      { id: 'tf-fd-1', hanzi: '米饭', pinyin: 'mǐfàn', vietnamese: 'cơm', category: 'food', exampleSentence: '我今天中午吃米饭。', examplePinyin: 'Wǒ jīntiān zhōngwǔ chī mǐfàn.', exampleVi: 'Trưa nay tôi ăn cơm.' },
      { id: 'tf-fd-2', hanzi: '面条', pinyin: 'miàntiáo', vietnamese: 'mì sợi', category: 'food', exampleSentence: '这家店的牛肉面条很好吃。', examplePinyin: 'Zhè jiā diàn de niúròu miàntiáo hěn hǎochī.', exampleVi: 'Mì bò của quán này rất ngon.' },
      { id: 'tf-fd-3', hanzi: '饺子', pinyin: 'jiǎozi', vietnamese: 'sủi cảo, bánh chẻo', category: 'food', exampleSentence: '过年的时候我们一起包饺子。', examplePinyin: 'Guònián de shíhou wǒmen yìqǐ bāo jiǎozi.', exampleVi: 'Dịp Tết chúng tôi cùng gói sủi cảo.' },
      { id: 'tf-fd-4', hanzi: '包子', pinyin: 'bāozi', vietnamese: 'bánh bao', category: 'food', exampleSentence: '买两个热腾腾的包子当早餐。', examplePinyin: 'Mǎi liǎng gè rèténgténg de bāozi dāng zǎocān.', exampleVi: 'Mua hai chiếc bánh bao nóng hổi ăn sáng.' },
    ],
  },
  {
    id: 'tf-drinks-fruit',
    topic: 'Thức uống & Trái cây tươi mát (饮品与水果)',
    topicVi: 'Đồ uống & Trái cây',
    iconName: 'CupSoda',
    videoUrl: 'https://www.youtube.com/watch?v=wwQUU4pSqO4',
    videoId: 'wwQUU4pSqO4',
    descriptionVi: 'Tên gọi các loại nước khoáng, sữa tươi, trà ô long, táo, chuối, dưa hấu thanh nhiệt.',
    relatedHskLevel: 'HSK 1',
    relatedLessonId: 'hsk1-lesson-05',
    words: [
      { id: 'tf-df-1', hanzi: '水', pinyin: 'shuǐ', vietnamese: 'nước', category: 'drinks', exampleSentence: '多喝水对身体好。', examplePinyin: 'Duō hē shuǐ duì shēntǐ hǎo.', exampleVi: 'Uống nhiều nước rất tốt cho cơ thể.' },
      { id: 'tf-df-2', hanzi: '牛奶', pinyin: 'niúnǎi', vietnamese: 'sữa bò', category: 'drinks', exampleSentence: '每天早上一杯热牛奶。', examplePinyin: 'Měitiān zǎoshang yì bēi rè niúnǎi.', exampleVi: 'Mỗi buổi sáng một ly sữa nóng.' },
      { id: 'tf-df-3', hanzi: '茶', pinyin: 'chá', vietnamese: 'trà', category: 'drinks', exampleSentence: '请喝一杯中国绿茶。', examplePinyin: 'Qǐng hē yì bēi Zhōngguó lǜchá.', exampleVi: 'Xin mời uống một tách trà xanh Trung Quốc.' },
      { id: 'tf-df-4', hanzi: '苹果', pinyin: 'píngguǒ', vietnamese: 'quả táo', category: 'fruit', exampleSentence: '桌子上有三个红苹果。', examplePinyin: 'Zhuōzi shàng yǒu sān gè hóng píngguǒ.', exampleVi: 'Trên bàn có 3 quả táo đỏ.' },
      { id: 'tf-df-5', hanzi: '西瓜', pinyin: 'xīguā', vietnamese: 'dưa hấu', category: 'fruit', exampleSentence: '夏天吃西瓜很解渴。', examplePinyin: 'Xiàtiān chī xīguā hěn jiěkě.', exampleVi: 'Mùa hè ăn dưa hấu rất giải khát.' },
    ],
  },
  {
    id: 'tf-colors',
    topic: 'Sắc màu cuộc sống (缤纷色彩)',
    topicVi: 'Màu sắc',
    iconName: 'Palette',
    videoUrl: 'https://www.youtube.com/watch?v=2eBi5q5JyDQ',
    videoId: '2eBi5q5JyDQ',
    descriptionVi: 'Các gam màu đỏ, vàng, xanh lam, xanh lá, đen, trắng giúp miêu tả đồ vật và lựa chọn khi mua sắm.',
    relatedHskLevel: 'HSK 1',
    relatedLessonId: 'hsk1-lesson-05',
    words: [
      { id: 'tf-col-1', hanzi: '红色', pinyin: 'hóngsè', vietnamese: 'màu đỏ', category: 'color', exampleSentence: '中国人过年喜欢穿红色的衣服。', examplePinyin: 'Zhōngguórén guònián xǐhuan chuān hóngsè de yīfu.', exampleVi: 'Người Trung Quốc dịp Tết thích mặc quần áo màu đỏ.' },
      { id: 'tf-col-2', hanzi: '黄色', pinyin: 'huángsè', vietnamese: 'màu vàng', category: 'color', exampleSentence: '秋天的银杏叶是黄色的。', examplePinyin: 'Qiūtiān de yínxìng yè shì huángsè de.', exampleVi: 'Lá ngân hạnh mùa thu có màu vàng.' },
      { id: 'tf-col-3', hanzi: '蓝色', pinyin: 'lánsè', vietnamese: 'màu xanh lam', category: 'color', exampleSentence: '今天的天空特别蓝。', examplePinyin: 'Jīntiān de tiānkōng tèbié lán.', exampleVi: 'Bầu trời hôm nay đặc biệt xanh.' },
      { id: 'tf-col-4', hanzi: '白色', pinyin: 'báisè', vietnamese: 'màu trắng', category: 'color', exampleSentence: '白色的雪花飘落下来。', examplePinyin: 'Báisè de xuěhuā piāoluò xiàlái.', exampleVi: 'Những bông tuyết trắng rơi xuống.' },
      { id: 'tf-col-5', hanzi: '黑色', pinyin: 'hēisè', vietnamese: 'màu đen', category: 'color', exampleSentence: '他买了一辆黑色的轿车。', examplePinyin: 'Tā mǎi le yí liàng hēisè de jiàochē.', exampleVi: 'Anh ấy đã mua một chiếc xe hơi màu đen.' },
    ],
  },
  {
    id: 'tf-numbers',
    topic: 'Chữ số & Đếm số căn bản (数字与数数)',
    topicVi: 'Chữ số & Đếm số',
    iconName: 'Hash',
    videoUrl: 'https://www.youtube.com/watch?v=WeYArTD9IHk',
    videoId: 'WeYArTD9IHk',
    descriptionVi: 'Cách đọc, viết Hán tự và phát âm chuẩn các con số từ 1 đến 10, nền tảng cho ngày tháng và số tiền.',
    relatedHskLevel: 'HSK 1',
    relatedLessonId: 'hsk1-lesson-04',
    words: [
      { id: 'tf-num-1', hanzi: '一', pinyin: 'yī', vietnamese: 'số 1', category: 'numbers', exampleSentence: '第一名 (hạng nhất)', examplePinyin: 'Dì-yī míng', exampleVi: 'Hạng nhất' },
      { id: 'tf-num-2', hanzi: '二', pinyin: 'èr', vietnamese: 'số 2', category: 'numbers', exampleSentence: '星期二 (thứ Ba)', examplePinyin: 'Xīngqī\'èr', exampleVi: 'Thứ Ba' },
      { id: 'tf-num-3', hanzi: '三', pinyin: 'sān', vietnamese: 'số 3', category: 'numbers', exampleSentence: '三本书 (ba quyển sách)', examplePinyin: 'Sān běn shū', exampleVi: 'Ba quyển sách' },
      { id: 'tf-num-4', hanzi: '五', pinyin: 'wǔ', vietnamese: 'số 5', category: 'numbers', exampleSentence: '五月 (tháng Năm)', examplePinyin: 'Wǔ yuè', exampleVi: 'Tháng Năm' },
      { id: 'tf-num-5', hanzi: '十', pinyin: 'shí', vietnamese: 'số 10', category: 'numbers', exampleSentence: '十分钟 (mười phút)', examplePinyin: 'Shí fēnzhōng', exampleVi: 'Mười phút' },
    ],
  },
];
