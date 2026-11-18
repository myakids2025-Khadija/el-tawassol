/* =========================================================
   أكاديمية الأمل - بيانات المحتوى التعليمي
   ---------------------------------------------------------
   كل عنصر له "id" يُستخدم لتحديد مسار فيديو/صورة الإشارة:
     media/letters/<id>.mp4   (أو .png / .gif)
     media/numbers/<id>.mp4
     media/vocab/<category>/<id>.mp4
   راجع media/README.md لمعرفة طريقة إضافة الوسائط.
   ========================================================= */

const LETTERS = [
  { id: 'alef',  char: 'ا', name: 'ألف',  word: 'أرنب',   emoji: '🐰' },
  { id: 'baa',   char: 'ب', name: 'باء',  word: 'بطة',    emoji: '🦆' },
  { id: 'taa',   char: 'ت', name: 'تاء',  word: 'تفاحة',  emoji: '🍎' },
  { id: 'thaa',  char: 'ث', name: 'ثاء',  word: 'ثعلب',   emoji: '🦊' },
  { id: 'jeem',  char: 'ج', name: 'جيم',  word: 'جمل',    emoji: '🐪' },
  { id: 'haa',   char: 'ح', name: 'حاء',  word: 'حصان',   emoji: '🐴' },
  { id: 'khaa',  char: 'خ', name: 'خاء',  word: 'خروف',   emoji: '🐑' },
  { id: 'dal',   char: 'د', name: 'دال',  word: 'دب',     emoji: '🐻' },
  { id: 'thal',  char: 'ذ', name: 'ذال',  word: 'ذرة',    emoji: '🌽' },
  { id: 'raa',   char: 'ر', name: 'راء',  word: 'ريشة',   emoji: '🪶' },
  { id: 'zay',   char: 'ز', name: 'زاي',  word: 'زرافة',  emoji: '🦒' },
  { id: 'seen',  char: 'س', name: 'سين',  word: 'سمكة',   emoji: '🐟' },
  { id: 'sheen', char: 'ش', name: 'شين',  word: 'شمس',    emoji: '☀️' },
  { id: 'sad',   char: 'ص', name: 'صاد',  word: 'صقر',    emoji: '🦅' },
  { id: 'dad',   char: 'ض', name: 'ضاد',  word: 'ضفدع',   emoji: '🐸' },
  { id: 'taa2',  char: 'ط', name: 'طاء',  word: 'طائرة',  emoji: '✈️' },
  { id: 'thaa2', char: 'ظ', name: 'ظاء',  word: 'ظرف',    emoji: '✉️' },
  { id: 'ain',   char: 'ع', name: 'عين',  word: 'عنب',    emoji: '🍇' },
  { id: 'ghain', char: 'غ', name: 'غين',  word: 'غيمة',   emoji: '☁️' },
  { id: 'faa',   char: 'ف', name: 'فاء',  word: 'فيل',    emoji: '🐘' },
  { id: 'qaf',   char: 'ق', name: 'قاف',  word: 'قطة',    emoji: '🐱' },
  { id: 'kaf',   char: 'ك', name: 'كاف',  word: 'كتاب',   emoji: '📖' },
  { id: 'lam',   char: 'ل', name: 'لام',  word: 'ليمون',  emoji: '🍋' },
  { id: 'meem',  char: 'م', name: 'ميم',  word: 'موز',    emoji: '🍌' },
  { id: 'noon',  char: 'ن', name: 'نون',  word: 'نحلة',   emoji: '🐝' },
  { id: 'ha',    char: 'ه', name: 'هاء',  word: 'هلال',   emoji: '🌙' },
  { id: 'waw',   char: 'و', name: 'واو',  word: 'وردة',   emoji: '🌹' },
  { id: 'yaa',   char: 'ي', name: 'ياء',  word: 'يد',     emoji: '✋' },
];

const NUMBERS = [
  { id: '0',  value: 0,  digit: '٠', name: 'صفر' },
  { id: '1',  value: 1,  digit: '١', name: 'واحد' },
  { id: '2',  value: 2,  digit: '٢', name: 'اثنان' },
  { id: '3',  value: 3,  digit: '٣', name: 'ثلاثة' },
  { id: '4',  value: 4,  digit: '٤', name: 'أربعة' },
  { id: '5',  value: 5,  digit: '٥', name: 'خمسة' },
  { id: '6',  value: 6,  digit: '٦', name: 'ستة' },
  { id: '7',  value: 7,  digit: '٧', name: 'سبعة' },
  { id: '8',  value: 8,  digit: '٨', name: 'ثمانية' },
  { id: '9',  value: 9,  digit: '٩', name: 'تسعة' },
  { id: '10', value: 10, digit: '١٠', name: 'عشرة' },
  { id: '20', value: 20, digit: '٢٠', name: 'عشرون' },
  { id: '50', value: 50, digit: '٥٠', name: 'خمسون' },
  { id: '100', value: 100, digit: '١٠٠', name: 'مئة' },
];

const VOCAB = {
  colors: {
    title: 'الألوان', emoji: '🎨', color: '#ff7aa2',
    items: [
      { id: 'red',    word: 'أحمر',    swatch: '#e53935' },
      { id: 'blue',   word: 'أزرق',    swatch: '#1e88e5' },
      { id: 'green',  word: 'أخضر',    swatch: '#43a047' },
      { id: 'yellow', word: 'أصفر',    swatch: '#fdd835' },
      { id: 'orange', word: 'برتقالي', swatch: '#fb8c00' },
      { id: 'purple', word: 'بنفسجي',  swatch: '#8e24aa' },
      { id: 'black',  word: 'أسود',    swatch: '#212121' },
      { id: 'white',  word: 'أبيض',    swatch: '#ffffff' },
      { id: 'pink',   word: 'وردي',    swatch: '#f48fb1' },
      { id: 'brown',  word: 'بني',     swatch: '#6d4c41' },
    ],
  },
  animals: {
    title: 'الحيوانات', emoji: '🦁', color: '#ffb74d',
    items: [
      { id: 'cat',      word: 'قطة',    emoji: '🐱' },
      { id: 'dog',      word: 'كلب',    emoji: '🐶' },
      { id: 'lion',     word: 'أسد',    emoji: '🦁' },
      { id: 'elephant', word: 'فيل',    emoji: '🐘' },
      { id: 'bird',     word: 'عصفور',  emoji: '🐦' },
      { id: 'fish',     word: 'سمكة',   emoji: '🐟' },
      { id: 'horse',    word: 'حصان',   emoji: '🐴' },
      { id: 'cow',      word: 'بقرة',   emoji: '🐄' },
      { id: 'rabbit',   word: 'أرنب',   emoji: '🐰' },
      { id: 'monkey',   word: 'قرد',    emoji: '🐵' },
    ],
  },
  family: {
    title: 'العائلة', emoji: '👨‍👩‍👧', color: '#81c784',
    items: [
      { id: 'mother',  word: 'أم',    emoji: '👩' },
      { id: 'father',  word: 'أب',    emoji: '👨' },
      { id: 'brother', word: 'أخ',    emoji: '👦' },
      { id: 'sister',  word: 'أخت',   emoji: '👧' },
      { id: 'grandma', word: 'جدة',   emoji: '👵' },
      { id: 'grandpa', word: 'جد',    emoji: '👴' },
      { id: 'baby',    word: 'رضيع',  emoji: '👶' },
      { id: 'family',  word: 'عائلة', emoji: '👨‍👩‍👧‍👦' },
    ],
  },
  food: {
    title: 'الطعام', emoji: '🍎', color: '#e57373',
    items: [
      { id: 'apple',  word: 'تفاحة', emoji: '🍎' },
      { id: 'banana', word: 'موز',   emoji: '🍌' },
      { id: 'bread',  word: 'خبز',   emoji: '🍞' },
      { id: 'milk',   word: 'حليب',  emoji: '🥛' },
      { id: 'water',  word: 'ماء',   emoji: '💧' },
      { id: 'egg',    word: 'بيضة',  emoji: '🥚' },
      { id: 'cheese', word: 'جبن',   emoji: '🧀' },
      { id: 'rice',   word: 'أرز',   emoji: '🍚' },
      { id: 'grapes', word: 'عنب',   emoji: '🍇' },
      { id: 'carrot', word: 'جزر',   emoji: '🥕' },
    ],
  },
  body: {
    title: 'جسمي', emoji: '🧍', color: '#64b5f6',
    items: [
      { id: 'head',  word: 'رأس',  emoji: '🙂' },
      { id: 'eye',   word: 'عين',  emoji: '👁️' },
      { id: 'ear',   word: 'أذن',  emoji: '👂' },
      { id: 'nose',  word: 'أنف',  emoji: '👃' },
      { id: 'mouth', word: 'فم',   emoji: '👄' },
      { id: 'hand',  word: 'يد',   emoji: '✋' },
      { id: 'foot',  word: 'قدم',  emoji: '🦶' },
      { id: 'tooth', word: 'سن',   emoji: '🦷' },
    ],
  },
  feelings: {
    title: 'المشاعر', emoji: '😊', color: '#ba68c8',
    items: [
      { id: 'happy',    word: 'سعيد',   emoji: '😄' },
      { id: 'sad',      word: 'حزين',   emoji: '😢' },
      { id: 'angry',    word: 'غاضب',   emoji: '😠' },
      { id: 'scared',   word: 'خائف',   emoji: '😨' },
      { id: 'tired',    word: 'متعب',   emoji: '😴' },
      { id: 'surprised',word: 'متفاجئ', emoji: '😲' },
      { id: 'sick',     word: 'مريض',   emoji: '🤒' },
      { id: 'love',     word: 'أحب',    emoji: '🥰' },
    ],
  },
  school: {
    title: 'المدرسة', emoji: '🏫', color: '#4db6ac',
    items: [
      { id: 'school',  word: 'مدرسة', emoji: '🏫' },
      { id: 'teacher', word: 'معلم',  emoji: '🧑‍🏫' },
      { id: 'book',    word: 'كتاب',  emoji: '📖' },
      { id: 'pencil',  word: 'قلم',   emoji: '✏️' },
      { id: 'bag',     word: 'حقيبة', emoji: '🎒' },
      { id: 'friend',  word: 'صديق',  emoji: '🧒' },
      { id: 'computer',word: 'حاسوب', emoji: '💻' },
      { id: 'scissors',word: 'مقص',   emoji: '✂️' },
    ],
  },
  daily: {
    title: 'كلمات يومية', emoji: '🙋', color: '#ffd54f',
    items: [
      { id: 'hello',   word: 'مرحبا',    emoji: '👋' },
      { id: 'thanks',  word: 'شكرا',     emoji: '🙏' },
      { id: 'yes',     word: 'نعم',      emoji: '👍' },
      { id: 'no',      word: 'لا',       emoji: '👎' },
      { id: 'eat',     word: 'آكل',      emoji: '🍽️' },
      { id: 'drink',   word: 'أشرب',     emoji: '🥤' },
      { id: 'sleep',   word: 'أنام',     emoji: '🛏️' },
      { id: 'help',    word: 'ساعدني',   emoji: '🆘' },
      { id: 'play',    word: 'ألعب',     emoji: '⚽' },
      { id: 'bathroom',word: 'الحمام',   emoji: '🚻' },
    ],
  },
};

/* المستويات حسب العمر */
const LEVELS = [
  { id: 1, name: 'البراعم',   ages: '3 - 6',   min: 3,  max: 6,  emoji: '🌱' },
  { id: 2, name: 'المستكشفون', ages: '7 - 11',  min: 7,  max: 11, emoji: '🚀' },
  { id: 3, name: 'المتقدمون',  ages: '12 - 17', min: 12, max: 17, emoji: '🏆' },
];

const AVATARS = ['🦁', '🐼', '🦊', '🐯', '🐸', '🐵', '🦄', '🐧', '🐨', '🐙', '🦋', '🐢'];

/* ألعاب المنصة */
const GAMES = [
  { id: 'letter-picture', title: 'حرف وصورة',      emoji: '🔤', desc: 'اختر الصورة التي تبدأ بالحرف', minLevel: 1 },
  { id: 'picture-word',   title: 'صورة وكلمة',     emoji: '🖼️', desc: 'اختر الكلمة الصحيحة للصورة',   minLevel: 1 },
  { id: 'count',          title: 'لنعدّ معاً',      emoji: '🔢', desc: 'عُدّ الأشياء واختر الرقم',      minLevel: 1 },
  { id: 'memory',         title: 'لعبة الذاكرة',   emoji: '🧠', desc: 'طابق كل صورة مع كلمتها',       minLevel: 1 },
  { id: 'math',           title: 'تحدي الحساب',    emoji: '➕', desc: 'جمع وطرح وضرب حسب مستواك',      minLevel: 1 },
  { id: 'spell',          title: 'رتّب الحروف',     emoji: '🧩', desc: 'كوّن الكلمة من حروفها',         minLevel: 2 },
];
