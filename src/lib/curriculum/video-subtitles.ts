export interface VideoSubtitleCue {
  id: string;
  hanzi: string;
  pinyin: string;
  subVi: string;
  subEn: string;
  timeLabel?: string;
}

export interface VideoSubtitleScript {
  videoId: string;
  channelName: string;
  topicVi: string;
  topicEn: string;
  hasBuiltInYouTubeCC?: boolean;
  cues: VideoSubtitleCue[];
}

export const VIDEO_SUBTITLE_SCRIPTS: Record<string, VideoSubtitleScript> = {
  m_rDIzj6DRE: {
    videoId: 'm_rDIzj6DRE',
    channelName: 'Little Fox Chinese',
    topicVi: 'Bài hát Chào hỏi & Đếm số cơ bản (Hello Song)',
    topicEn: 'Hello Song — Chinese Greetings & Numbers',
    cues: [
      { id: 'c1', timeLabel: '0:05', hanzi: '你好！你好！', pinyin: 'Nǐ hǎo! Nǐ hǎo!', subVi: 'Xin chào! Xin chào!', subEn: 'Hello! Hello!' },
      { id: 'c2', timeLabel: '0:12', hanzi: '你好吗？我很好！', pinyin: 'Nǐ hǎo ma? Wǒ hěn hǎo!', subVi: 'Bạn có khỏe không? Mình rất khỏe!', subEn: 'How are you? I am fine!' },
      { id: 'c3', timeLabel: '0:24', hanzi: '一、二、三、四、五！', pinyin: 'Yī, èr, sān, sì, wǔ!', subVi: 'Một, hai, ba, bốn, năm!', subEn: 'One, two, three, four, five!' },
      { id: 'c4', timeLabel: '0:36', hanzi: '六、七、八、九、十！', pinyin: 'Liù, qī, bā, jiǔ, shí!', subVi: 'Sáu, bảy, tám, chín, mười!', subEn: 'Six, seven, eight, nine, ten!' },
      { id: 'c5', timeLabel: '0:50', hanzi: '谢谢！再见！', pinyin: 'Xièxie! Zàijiàn!', subVi: 'Cảm ơn! Tạm biệt!', subEn: 'Thank you! Goodbye!' },
    ],
  },
  '96ZzzwPdNhM': {
    videoId: '96ZzzwPdNhM',
    channelName: 'Little Fox Chinese',
    topicVi: 'Bài hát Chào hỏi bạn bè hằng ngày (Hello!)',
    topicEn: 'Hello! — Daily Greeting Learning Song',
    cues: [
      { id: 'c1', timeLabel: '0:06', hanzi: '你好，你好，你好吗？', pinyin: 'Nǐ hǎo, nǐ hǎo, nǐ hǎo ma?', subVi: 'Xin chào, xin chào, bạn khỏe không?', subEn: 'Hello, hello, how are you?' },
      { id: 'c2', timeLabel: '0:18', hanzi: '我很好，谢谢你！', pinyin: 'Wǒ hěn hǎo, xièxie nǐ!', subVi: 'Mình rất khỏe, cảm ơn bạn!', subEn: "I'm very good, thank you!" },
      { id: 'c3', timeLabel: '0:30', hanzi: '早上好！老师好！', pinyin: 'Zǎoshang hǎo! Lǎoshī hǎo!', subVi: 'Chào buổi sáng! Chào thầy/cô giáo!', subEn: 'Good morning! Hello teacher!' },
      { id: 'c4', timeLabel: '0:42', hanzi: '明天见！再见！', pinyin: 'Míngtiān jiàn! Zàijiàn!', subVi: 'Hẹn gặp lại ngày mai! Tạm biệt!', subEn: 'See you tomorrow! Goodbye!' },
    ],
  },
  '7ZMc8JJYA94': {
    videoId: '7ZMc8JJYA94',
    channelName: 'Little Fox Chinese',
    topicVi: 'Bài hát Hỏi tên & Làm quen (你叫什么名字？)',
    topicEn: "What's Your Name? — Introducing Yourself",
    cues: [
      { id: 'c1', timeLabel: '0:05', hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', subVi: 'Bạn tên là gì?', subEn: 'What is your name?' },
      { id: 'c2', timeLabel: '0:15', hanzi: '我叫大卫。很高兴认识你！', pinyin: 'Wǒ jiào Dàwèi. Hěn gāoxìng rènshi nǐ!', subVi: 'Mình tên là David. Rất vui được làm quen với bạn!', subEn: 'My name is David. Nice to meet you!' },
      { id: 'c3', timeLabel: '0:28', hanzi: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?', subVi: 'Bạn là người nước nào?', subEn: 'Where are you from?' },
      { id: 'c4', timeLabel: '0:40', hanzi: '我是越南人，我在学汉语。', pinyin: 'Wǒ shì Yuènánrén, wǒ zài xué Hànyǔ.', subVi: 'Tôi là người Việt Nam, tôi đang học tiếng Trung.', subEn: 'I am Vietnamese, I am learning Chinese.' },
    ],
  },
  '4TA2iKi_kPY': {
    videoId: '4TA2iKi_kPY',
    channelName: 'Little Fox Chinese',
    topicVi: 'Gia đình ngón tay (The Finger Family)',
    topicEn: 'The Finger Family — Family Members Song',
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '爸爸手指，你在哪里？我在这里！', pinyin: 'Bàba shǒuzhǐ, nǐ zài nǎlǐ? Wǒ zài zhèlǐ!', subVi: 'Ngón tay Bố ơi, bố ở đâu? Bố ở đây nè!', subEn: 'Daddy finger, where are you? Here I am!' },
      { id: 'c2', timeLabel: '0:22', hanzi: '妈妈手指，妈妈好！', pinyin: 'Māma shǒuzhǐ, māma hǎo!', subVi: 'Ngón tay Mẹ ơi, con chào mẹ!', subEn: 'Mommy finger, hello Mommy!' },
      { id: 'c3', timeLabel: '0:36', hanzi: '哥哥手指、姐姐手指！', pinyin: 'Gēge shǒuzhǐ, jiějie shǒuzhǐ!', subVi: 'Ngón tay Anh trai, ngón tay Chị gái!', subEn: 'Brother finger, Sister finger!' },
      { id: 'c4', timeLabel: '0:50', hanzi: '小宝宝，我们是一家人！', pinyin: 'Xiǎo bǎobǎo, wǒmen shì yì jiā rén!', subVi: 'Em bé nhỏ, chúng ta là một gia đình!', subEn: 'Baby finger, we are one happy family!' },
    ],
  },
  WeYArTD9IHk: {
    videoId: 'WeYArTD9IHk',
    channelName: 'GamesLearnChinese',
    topicVi: 'Số đếm từ 1 đến 10 & Cách đếm trực quan',
    topicEn: 'Learn Numbers 1–10 in Mandarin for Kids',
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:05', hanzi: '一、二、三 (1, 2, 3)', pinyin: 'Yī, èr, sān', subVi: 'Số một, số hai, số ba', subEn: 'One, two, three' },
      { id: 'c2', timeLabel: '0:18', hanzi: '四、五、六 (4, 5, 6)', pinyin: 'Sì, wǔ, liù', subVi: 'Số bốn, số năm, số sáu', subEn: 'Four, five, six' },
      { id: 'c3', timeLabel: '0:32', hanzi: '七、八、九、十 (7, 8, 9, 10)', pinyin: 'Qī, bā, jiǔ, shí', subVi: 'Số bảy, số tám, số chín, số mười', subEn: 'Seven, eight, nine, ten' },
      { id: 'c4', timeLabel: '0:48', hanzi: '今天几月几号？现在几点？', pinyin: 'Jīntiān jǐ yuè jǐ hào? Xiànzài jǐ diǎn?', subVi: 'Hôm nay ngày mấy tháng mấy? Bây giờ mấy giờ?', subEn: 'What date is today? What time is it now?' },
    ],
  },
  'OB5bL3Ow4-c': {
    videoId: 'OB5bL3Ow4-c',
    channelName: 'Little Fox Chinese',
    topicVi: 'Gia đình Carter đi siêu thị mua sắm (在超市)',
    topicEn: 'The Carter Family 5: At the Grocery Store',
    cues: [
      { id: 'c1', timeLabel: '0:10', hanzi: '欢迎光临！请问您想买什么？', pinyin: 'Huānyíng guānglín! Qǐngwèn nín xiǎng mǎi shénme?', subVi: 'Chào mừng quý khách! Xin hỏi bạn muốn mua gì?', subEn: 'Welcome! What would you like to buy?' },
      { id: 'c2', timeLabel: '0:25', hanzi: '我想买苹果、牛奶和面包。', pinyin: 'Wǒ xiǎng mǎi píngguǒ, niúnǎi hé miànbāo.', subVi: 'Mình muốn mua táo, sữa bò và bánh mì.', subEn: 'I want to buy apples, milk, and bread.' },
      { id: 'c3', timeLabel: '0:42', hanzi: '这个苹果多少钱一斤？', pinyin: 'Zhège píngguǒ duōshao qián yì jīn?', subVi: 'Táo này bao nhiêu tiền một cân (500g)?', subEn: 'How much is a jin (500g) of these apples?' },
      { id: 'c4', timeLabel: '0:58', hanzi: '一共二十块钱，谢谢您！', pinyin: 'Yígòng èrshí kuài qián, xièxie nín!', subVi: 'Tổng cộng 20 tệ, cảm ơn quý khách!', subEn: '20 yuan in total, thank you!' },
    ],
  },
  eGnHnz9eC9s: {
    videoId: 'eGnHnz9eC9s',
    channelName: 'Little Fox Chinese',
    topicVi: 'Thời tiết hôm nay thế nào? (天气怎么样？)',
    topicEn: "How's the Weather? — Weather & Seasons Song",
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '今天天气怎么样？', pinyin: 'Jīntiān tiānqì zěnmeyàng?', subVi: 'Thời tiết hôm nay thế nào?', subEn: "How's the weather today?" },
      { id: 'c2', timeLabel: '0:20', hanzi: '今天是晴天，有点儿热。', pinyin: 'Jīntiān shì qíngtiān, yǒudiǎnr rè.', subVi: 'Hôm nay trời nắng đẹp, hơi nóng một chút.', subEn: "Today is sunny and a little hot." },
      { id: 'c3', timeLabel: '0:34', hanzi: '下雨了！快带雨伞！', pinyin: 'Xià yǔ le! Kuài dài yǔsǎn!', subVi: 'Trời mưa rồi! Mau mang ô đi!', subEn: "It's raining! Hurry and take an umbrella!" },
      { id: 'c4', timeLabel: '0:48', hanzi: '冬天很冷，还会下雪。', pinyin: 'Dōngtiān hěn lěng, hái huì xià xuě.', subVi: 'Mùa đông rất lạnh, còn có tuyết rơi nữa.', subEn: 'Winter is very cold, and it even snows.' },
    ],
  },
  tyo3Rzbtl3w: {
    videoId: 'tyo3Rzbtl3w',
    channelName: 'Little Fox Chinese',
    topicVi: 'Hát theo giai điệu Thời tiết bốn mùa (天气怎么样？)',
    topicEn: "How Is the Weather? (Sing-Along)",
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '春天暖和，花儿开了。', pinyin: 'Chūntiān nuǎnhuo, huār kāi le.', subVi: 'Mùa xuân ấm áp, hoa nở rộ rồi.', subEn: 'Spring is warm, the flowers are blooming.' },
      { id: 'c2', timeLabel: '0:22', hanzi: '夏天很热，我想游泳。', pinyin: 'Xiàtiān hěn rè, wǒ xiǎng yóuyǒng.', subVi: 'Mùa hè rất nóng, mình muốn đi bơi.', subEn: 'Summer is hot, I want to go swimming.' },
      { id: 'c3', timeLabel: '0:35', hanzi: '秋天凉快，树叶红了。', pinyin: 'Qiūtiān liángkuai, shùyè hóng le.', subVi: 'Mùa thu mát mẻ, lá cây chuyển đỏ rồi.', subEn: 'Autumn is cool, the leaves turn red.' },
      { id: 'c4', timeLabel: '0:48', hanzi: '冬天下雪，多穿衣服！', pinyin: 'Dōngtiān xià xuě, duō chuān yīfu!', subVi: 'Mùa đông tuyết rơi, hãy mặc nhiều áo ấm!', subEn: 'It snows in winter, put on warm clothes!' },
    ],
  },
  'xkySrEZ4R-U': {
    videoId: 'xkySrEZ4R-U',
    channelName: 'Little Fox Chinese',
    topicVi: 'Bạn thích làm gì? (你喜欢什么？)',
    topicEn: 'What Do You Like? — Hobbies & Free Time',
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '你喜欢做什么运动？', pinyin: 'Nǐ xǐhuan zuò shénme yùndòng?', subVi: 'Bạn thích tập môn thể thao nào?', subEn: 'What sports do you like to play?' },
      { id: 'c2', timeLabel: '0:20', hanzi: '我喜欢踢足球和打篮球。', pinyin: 'Wǒ xǐhuan tī zúqiú hé dǎ lánqiú.', subVi: 'Mình thích đá bóng và chơi bóng rổ.', subEn: 'I like playing soccer and basketball.' },
      { id: 'c3', timeLabel: '0:34', hanzi: '周末我喜欢唱歌、听音乐。', pinyin: 'Zhōumò wǒ xǐhuan chànggē, tīng yīnyuè.', subVi: 'Cuối tuần mình thích ca hát, nghe nhạc.', subEn: 'On weekends I like singing and listening to music.' },
    ],
  },
  '0vCnLciboHY': {
    videoId: '0vCnLciboHY',
    channelName: 'Little Fox Chinese',
    topicVi: 'Tôi bị ốm rồi — Khám bệnh & Chăm sóc sức khỏe (我生病了)',
    topicEn: 'I Am Sick! — Visiting the Doctor',
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '我今天觉得不太舒服。', pinyin: 'Wǒ jīntiān juéde bú tài shūfu.', subVi: 'Hôm nay mình cảm thấy không khỏe lắm.', subEn: "I don't feel very well today." },
      { id: 'c2', timeLabel: '0:22', hanzi: '我有点儿发烧，还有点儿头疼。', pinyin: 'Wǒ yǒudiǎnr fāshāo, hái yǒudiǎnr tóuténg.', subVi: 'Mình hơi bị sốt, lại hơi đau đầu nữa.', subEn: 'I have a slight fever and a bit of a headache.' },
      { id: 'c3', timeLabel: '0:36', hanzi: '医生说：多喝热水，按时吃药，好好休息！', pinyin: 'Yīshēng shuō: duō hē rè shuǐ, ànshí chī yào, hǎohǎo xiūxi!', subVi: 'Bác sĩ dặn: uống nhiều nước ấm, uống thuốc đúng giờ và nghỉ ngơi thật tốt!', subEn: 'The doctor says: drink lots of warm water, take medicine on time, and get good rest!' },
    ],
  },
  D3o9X4pLUPQ: {
    videoId: 'D3o9X4pLUPQ',
    channelName: 'Little Fox Chinese',
    topicVi: 'Một ngày của tôi (我的一天 — Nhịp điệu sinh hoạt)',
    topicEn: 'My Day — Daily Routine Rhythm Chants',
    cues: [
      { id: 'c1', timeLabel: '0:06', hanzi: '早上七点我起床。', pinyin: 'Zǎoshang qī diǎn wǒ qǐchuáng.', subVi: '7 giờ sáng tôi thức dậy.', subEn: 'I get up at 7 in the morning.' },
      { id: 'c2', timeLabel: '0:18', hanzi: '我吃早饭，然后去学校。', pinyin: 'Wǒ chī zǎofàn, ránhòu qù xuéxiào.', subVi: 'Tôi ăn sáng, sau đó đến trường.', subEn: 'I eat breakfast, then go to school.' },
      { id: 'c3', timeLabel: '0:32', hanzi: '晚上九点我睡觉。', pinyin: 'Wǎnshang jiǔ diǎn wǒ shuìjiào.', subVi: '9 giờ tối tôi đi ngủ.', subEn: 'I go to sleep at 9 in the evening.' },
    ],
  },
  'yjeSGzZzc-g': {
    videoId: 'yjeSGzZzc-g',
    channelName: 'GamesLearnChinese',
    topicVi: 'Món ăn ngon & Ẩm thực Trung Hoa (美食)',
    topicEn: 'Learn Foods in Mandarin for Kids',
    cues: [
      { id: 'c1', timeLabel: '0:06', hanzi: '米饭、面条、饺子、包子', pinyin: 'Mǐfàn, miàntiáo, jiǎozi, bāozi', subVi: 'Cơm trắng, mì sợi, sủi cảo, bánh bao', subEn: 'Rice, noodles, dumplings, steamed buns' },
      { id: 'c2', timeLabel: '0:24', hanzi: '我想吃一碗牛肉面，很好吃！', pinyin: 'Wǒ xiǎng chī yì wǎn niúròumiàn, hěn hǎochī!', subVi: 'Tôi muốn ăn một bát mì bò, rất ngon!', subEn: 'I want to eat a bowl of beef noodles, very delicious!' },
    ],
  },
  umGf6u4Oj7E: {
    videoId: 'umGf6u4Oj7E',
    channelName: 'GamesLearnChinese',
    topicVi: 'Phương tiện giao thông & Đi lại (交通工具)',
    topicEn: 'Learn Vehicles & Transport in Chinese',
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '公共汽车、地铁、出租车', pinyin: 'Gōnggòng qìchē, dìtiě, chūzūchē', subVi: 'Xe buýt, tàu điện ngầm, xe taxi', subEn: 'Bus, subway, taxi' },
      { id: 'c2', timeLabel: '0:25', hanzi: '飞机、火车、自行车', pinyin: 'Fēijī, huǒchē, zìxíngchē', subVi: 'Máy bay, tàu hỏa, xe đạp', subEn: 'Airplane, train, bicycle' },
    ],
  },
  lm7oB_D1is0: {
    videoId: 'lm7oB_D1is0',
    channelName: 'Felicia Hu Laoshi · YAYA Mandarin',
    topicVi: 'HSK 2 Bài 1: Tháng 9 đi Bắc Kinh du lịch là tốt nhất',
    topicEn: 'HSK 2 Lesson 1: September is the best time to visit Beijing',
    cues: [
      { id: 'c1', timeLabel: '0:15', hanzi: '你要去北京旅游吗？', pinyin: 'Nǐ yào qù Běijīng lǚyóu ma?', subVi: 'Bạn sắp đi du lịch Bắc Kinh à?', subEn: 'Are you going to travel to Beijing?' },
      { id: 'c2', timeLabel: '0:35', hanzi: '我觉得九月去北京旅游最好！', pinyin: 'Wǒ juéde jiǔ yuè qù Běijīng lǚyóu zuì hǎo!', subVi: 'Mình thấy tháng 9 đi Bắc Kinh du lịch là tốt nhất!', subEn: 'I think September is the best time to visit Beijing!' },
      { id: 'c3', timeLabel: '0:55', hanzi: '因为九月的天气不冷也不热。', pinyin: 'Yīnwèi jiǔ yuè de tiānqì bù lěng yě bú rè.', subVi: 'Bởi vì thời tiết tháng 9 không lạnh cũng không nóng.', subEn: 'Because the weather in September is neither cold nor hot.' },
    ],
  },
  LIVbfNpifVg: {
    videoId: 'LIVbfNpifVg',
    channelName: 'Felicia Hu Laoshi · YAYA Mandarin',
    topicVi: 'HSK 2 Bài 2: Mỗi ngày tôi thức dậy lúc 6 giờ',
    topicEn: 'HSK 2 Lesson 2: I get up at six every day',
    cues: [
      { id: 'c1', timeLabel: '0:15', hanzi: '你每天早上几点起床？', pinyin: 'Nǐ měitiān zǎoshang jǐ diǎn qǐchuáng?', subVi: 'Mỗi sáng bạn thức dậy lúc mấy giờ?', subEn: 'What time do you get up every morning?' },
      { id: 'c2', timeLabel: '0:35', hanzi: '我每天六点起床去跑步。', pinyin: 'Wǒ měitiān liù diǎn qǐchuáng qù pǎobù.', subVi: 'Mỗi ngày tôi thức dậy lúc 6 giờ để đi chạy bộ.', subEn: 'I get up at six every day to go running.' },
      { id: 'c3', timeLabel: '0:55', hanzi: '多运动对身体非常好。', pinyin: 'Duō yùndòng duì shēntǐ fēicháng hǎo.', subVi: 'Tập thể dục nhiều rất tốt cho sức khỏe.', subEn: 'Exercising more is very good for your health.' },
    ],
  },
  '2e8zAu2_h2w': {
    videoId: '2e8zAu2_h2w',
    channelName: 'Felicia Hu Laoshi · YAYA Mandarin',
    topicVi: 'HSK 3 Bài 1: Cuối tuần bạn có dự định gì?',
    topicEn: "HSK 3 Lesson 1: What's your plan for the weekend?",
    cues: [
      { id: 'c1', timeLabel: '0:15', hanzi: '周末你有什么打算？', pinyin: 'Zhōumò nǐ yǒu shénme dǎsuàn?', subVi: 'Cuối tuần này bạn có dự định gì?', subEn: 'What are your plans for the weekend?' },
      { id: 'c2', timeLabel: '0:35', hanzi: '我早就买好电影票了！', pinyin: 'Wǒ zǎo jiù mǎi hǎo diànyǐngpiào le!', subVi: 'Mình đã mua sẵn vé xem phim từ sớm rồi!', subEn: 'I already bought the movie tickets early!' },
      { id: 'c3', timeLabel: '0:55', hanzi: '太好了，我们一起去吧！', pinyin: 'Tài hǎo le, wǒmen yìqǐ qù ba!', subVi: 'Tuyệt quá, chúng mình cùng đi nhé!', subEn: "Great, let's go together!" },
    ],
  },
  Rq5uEhZPpgY: {
    videoId: 'Rq5uEhZPpgY',
    channelName: 'Felicia Hu Laoshi · YAYA Mandarin',
    topicVi: 'HSK 3 Bài 2: Khi nào anh ấy quay về?',
    topicEn: 'HSK 3 Lesson 2: When will he come back?',
    cues: [
      { id: 'c1', timeLabel: '0:15', hanzi: '他什么时候回来？', pinyin: 'Tā shénme shíhou huílái?', subVi: 'Khi nào anh ấy quay về?', subEn: 'When is he coming back?' },
      { id: 'c2', timeLabel: '0:35', hanzi: '他买点儿水果就上来。', pinyin: 'Tā mǎi diǎnr shuǐguǒ jiù shànglái.', subVi: 'Anh ấy mua một ít trái cây rồi lên lầu ngay.', subEn: "He'll buy some fruit and come right up." },
    ],
  },
  xE3Sh1S2lWM: {
    videoId: 'xE3Sh1S2lWM',
    channelName: 'Felicia Hu Laoshi · YAYA Mandarin',
    topicVi: 'HSK 4 Bài 1: Tình yêu giản dị & Sự đồng hành',
    topicEn: 'HSK 4 Lesson 1: Simple Love (Text 1)',
    cues: [
      { id: 'c1', timeLabel: '0:20', hanzi: '真正的好感情不仅需要浪漫，更需要互相理解。', pinyin: 'Zhēnzhèng de hǎo gǎnqíng bùjǐn xūyào làngmàn, gèng xūyào hùxiāng lǐjiě.', subVi: 'Tình cảm tốt đẹp thực sự không chỉ cần lãng mạn mà càng cần sự thấu hiểu lẫn nhau.', subEn: 'True affection requires not only romance, but even more importantly mutual understanding.' },
      { id: 'c2', timeLabel: '0:45', hanzi: '有共同的爱好会让生活更丰富。', pinyin: 'Yǒu gòngtóng de àihào huì ràng shēnghuó gèng fēngfù.', subVi: 'Có sở thích chung sẽ làm cuộc sống phong phú hơn.', subEn: 'Having shared hobbies makes life richer.' },
    ],
  },
  tBqHmOH2ycs: {
    videoId: 'tBqHmOH2ycs',
    channelName: 'Wenjing-Zhiyuan',
    topicVi: 'HSK 5 Bài 1: Những chi tiết nhỏ của tình yêu thương',
    topicEn: 'HSK 5 Lesson 1: Details of Love',
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:20', hanzi: '真挚的感情往往体现在生活的细节中。', pinyin: 'Zhēnzhì de gǎnqíng wǎngwǎng tǐxiàn zài shēnghuó de xìjié zhōng.', subVi: 'Tình cảm chân thành thường được thể hiện qua những chi tiết nhỏ trong đời sống.', subEn: 'Sincere affection is often reflected in the small details of daily life.' },
      { id: 'c2', timeLabel: '0:45', hanzi: '夫妻之间最重要的是彼此信任与体贴。', pinyin: 'Fūqī zhījiān zuì zhòngyào de shì bǐcǐ xìnrèn yǔ tǐtiē.', subVi: 'Giữa vợ chồng điều quan trọng nhất là tin tưởng và chu đáo với nhau.', subEn: 'Between partners, mutual trust and thoughtfulness matter most.' },
    ],
  },
  '1s8FMW9wh_0': {
    videoId: '1s8FMW9wh_0',
    channelName: 'Mạt Trà (Giáo trình HSK 6)',
    topicVi: 'HSK 6 Bài 1: Sự khai sáng từ trẻ thơ (孩子给我们的启示)',
    topicEn: 'HSK 6 Lesson 1: What Children Teach Us',
    cues: [
      { id: 'c1', timeLabel: '0:20', hanzi: '孩子纯真的心灵常常给成年人带来深刻的启示。', pinyin: 'Háizi chúnzhēn de xīnlíng chángcháng gěi chéngniánrén dàilái shēnkè de qǐshì.', subVi: 'Tâm hồn thuần khiết của con trẻ thường mang lại sự khai sáng sâu sắc cho người lớn.', subEn: "Children's pure hearts often bring profound insights to adults." },
      { id: 'c2', timeLabel: '0:50', hanzi: '学会像孩子那样宽容，生活会简单快乐得多。', pinyin: 'Xuéhuì xiàng háizi nàyàng kuānróng, shēnghuó huì jiǎndān kuàilè de duō.', subVi: 'Học cách khoan dung như trẻ nhỏ, cuộc sống sẽ giản dị và hạnh phúc hơn nhiều.', subEn: 'Learning to forgive as freely as children makes life much simpler and happier.' },
    ],
  },
  WmzZ_xI5ceM: {
    videoId: 'WmzZ_xI5ceM',
    channelName: 'GamesLearnChinese',
    topicVi: 'Từ vựng Quần áo & Trang phục (衣服)',
    topicEn: 'Learn Clothes in Chinese for Kids',
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '衣服、衬衫、裤子、裙子', pinyin: 'Yīfu, chènshān, kùzi, qúnzi', subVi: 'Quần áo, áo sơ mi, quần dài, váy', subEn: 'Clothes, shirt, pants, skirt' },
      { id: 'c2', timeLabel: '0:28', hanzi: '这件新衣服真漂亮！', pinyin: 'Zhè jiàn xīn yīfu zhēn piàoliang!', subVi: 'Bộ quần áo mới này đẹp thật!', subEn: 'These new clothes are really pretty!' },
    ],
  },
  '-Clrihb7At8': {
    videoId: '-Clrihb7At8',
    channelName: 'GamesLearnChinese',
    topicVi: 'Từ vựng Động vật đáng yêu (动物)',
    topicEn: 'Learn Animals in Chinese for Kids',
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '小猫、小狗、小鸟、熊猫', pinyin: 'Xiǎo māo, xiǎo gǒu, xiǎo niǎo, xióngmāo', subVi: 'Mèo con, cún con, chim nhỏ, gấu trúc', subEn: 'Kitten, puppy, little bird, panda' },
      { id: 'c2', timeLabel: '0:28', hanzi: '我非常喜欢大熊猫！', pinyin: 'Wǒ fēicháng xǐhuan dà xióngmāo!', subVi: 'Mình vô cùng thích gấu trúc lớn!', subEn: 'I like giant pandas very much!' },
    ],
  },
  '2eBi5q5JyDQ': {
    videoId: '2eBi5q5JyDQ',
    channelName: 'GamesLearnChinese',
    topicVi: 'Từ vựng Màu sắc rực rỡ (颜色)',
    topicEn: 'Learn Colors in Chinese for Kids',
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '红色、黄色、蓝色、绿色', pinyin: 'Hóngsè, huángsè, lánsè, lǜsè', subVi: 'Màu đỏ, màu vàng, màu xanh dương, màu xanh lá', subEn: 'Red, yellow, blue, green' },
      { id: 'c2', timeLabel: '0:28', hanzi: '白色、黑色 — 你喜欢什么颜色？', pinyin: 'Báisè, hēisè — nǐ xǐhuan shénme yánsè?', subVi: 'Màu trắng, màu đen — Bạn thích màu gì?', subEn: 'White, black — What color do you like?' },
    ],
  },
  wwQUU4pSqO4: {
    videoId: 'wwQUU4pSqO4',
    channelName: 'GamesLearnChinese',
    topicVi: 'Đồ uống & Trái cây tươi mát (饮料与水果)',
    topicEn: 'Learn Drinks & Fruits in Chinese for Kids',
    hasBuiltInYouTubeCC: true,
    cues: [
      { id: 'c1', timeLabel: '0:08', hanzi: '水、茶、牛奶、果汁', pinyin: 'Shuǐ, chá, niúnǎi, guǒzhī', subVi: 'Nước lọc, trà, sữa bò, nước hoa quả', subEn: 'Water, tea, milk, fruit juice' },
      { id: 'c2', timeLabel: '0:28', hanzi: '苹果、香蕉、西瓜 — 我想喝茶！', pinyin: 'Píngguǒ, xiāngjiāo, xīguā — wǒ xiǎng hē chá!', subVi: 'Táo, chuối, dưa hấu — Tôi muốn uống trà!', subEn: 'Apple, banana, watermelon — I want to drink tea!' },
    ],
  },
  By5ql5a6Y40: {
    videoId: 'By5ql5a6Y40',
    channelName: 'Little Fox Chinese',
    topicVi: 'Truyện cổ tích Cô bé quàng khăn đỏ (小红帽)',
    topicEn: 'Little Red Riding Hood — Mandarin Story for Kids',
    cues: [
      { id: 'c1', timeLabel: '0:12', hanzi: '从前有一个可爱的小姑娘，大家叫她小红帽。', pinyin: 'Cóngqián yǒu yí gè kě’ài de xiǎo gūniang, dàjiā jiào tā Xiǎohóngmào.', subVi: 'Ngày xửa ngày xưa có một cô bé đáng yêu, mọi người gọi cô là Khăn Đỏ.', subEn: 'Once upon a time there was a lovely little girl everyone called Little Red Riding Hood.' },
      { id: 'c2', timeLabel: '0:35', hanzi: '小红帽提着篮子去森林里看望奶奶。', pinyin: 'Xiǎohóngmào tí zhe lánzi qù sēnlín lǐ kànwàng nǎinai.', subVi: 'Cô bé quàng khăn đỏ xách giỏ vào trong rừng thăm bà ngoại.', subEn: 'Little Red Riding Hood carried a basket into the forest to visit her grandma.' },
    ],
  },
  zZHomlS1CrA: {
    videoId: 'zZHomlS1CrA',
    channelName: 'Little Fox Chinese',
    topicVi: 'Tây Du Ký Tập 1: Thạch Hầu xuất thế (西游记)',
    topicEn: 'Journey to the West 1: The Monkey Was Born',
    cues: [
      { id: 'c1', timeLabel: '0:12', hanzi: '在花果山顶，一块仙石裂开，蹦出一只石猴！', pinyin: 'Zài Huāguǒshān dǐng, yí kuài xiānshí lièkāi, bèngchū yì zhī shíhóu!', subVi: 'Trên đỉnh Hoa Quả Sơn, một tảng đá tiên nứt ra, nhảy ra một chú khỉ đá!', subEn: 'On top of Flower-Fruit Mountain, a magic stone split open and out jumped a stone monkey!' },
      { id: 'c2', timeLabel: '0:35', hanzi: '它勇敢又聪明，后来成为了齐天大圣孙悟空！', pinyin: 'Tā yǒnggǎn yòu cōngming, hòulái chéngwéi le Qítiān Dàshèng Sūn Wùkōng!', subVi: 'Chú vừa dũng cảm lại thông minh, sau này trở thành Tề Thiên Đại Thánh Tôn Ngộ Không!', subEn: 'Brave and clever, he later became the Monkey King Sun Wukong!' },
    ],
  },
};

export function getVideoSubtitleScript(videoId: string): VideoSubtitleScript | undefined {
  if (!videoId) return undefined;
  return (
    VIDEO_SUBTITLE_SCRIPTS[videoId] ||
    Object.values(VIDEO_SUBTITLE_SCRIPTS).find((s) => s.videoId === videoId)
  );
}
