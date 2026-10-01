import { Assignment, ClassGroup } from '../types';

export const INITIAL_CLASSES: ClassGroup[] = [
  { id: 'class-10a', name: '10-A sinf', studentCount: 28 },
  { id: 'class-11b', name: '11-B sinf', studentCount: 26 },
  { id: 'class-cs204', name: 'CS-204 (Universitet guruhi)', studentCount: 32 },
  { id: 'class-all', name: 'Barcha guruhlar', studentCount: 86 },
];

export const SUBJECTS_LIST = [
  { name: 'Algebra va Geometriya', code: 'MATH', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Fizika', code: 'PHYS', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Ingliz tili', code: 'ENG', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Informatika va Dasturlash', code: 'IT', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Ona tili va Adabiyot', code: 'LIT', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: "O'zbekiston tarixi", code: 'HIST', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Kimyo', code: 'CHEM', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Biologiya', code: 'BIO', color: 'bg-lime-50 text-lime-700 border-lime-200' },
];

export function getInitialAssignments(): Assignment[] {
  const now = new Date();

  const addHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000).toISOString();
  const addDays = (d: number, hour = 18) => {
    const target = new Date(now.getTime() + d * 24 * 3600 * 1000);
    target.setHours(hour, 0, 0, 0);
    return target.toISOString();
  };

  return [
    {
      id: 'asg-overdue-1',
      title: 'Kimyo: Kimyoviy tenglamalarni tenglashtirish va valentlik masalalari',
      subject: 'Kimyo',
      subjectCode: 'CHEM',
      subjectColor: 'bg-teal-500',
      description: 'Darslikning 36-betidagi 10 ta kimyoviy reaksiya tenglamasini tenglashtirish va valentliklarini aniqlash.',
      instructions: [
        'Reaksiya tenglamasidagi har bir element atomlari sonini tenglashtirish',
        'Oksidlanish-qaytarilish darajalarini belgilash',
        'Molyar massalarni hisoblash'
      ],
      teacherName: 'Otabek Zokirov',
      teacherRole: 'Kimyo fani o\'qituvchisi',
      targetClass: '10-A sinf',
      createdAt: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(),
      dueDate: new Date(now.getTime() - 14 * 3600 * 1000).toISOString(), // MUDDATI O'TGAN (KECHIKKAN)!
      priority: 'high',
      maxScore: 100,
      estimatedMinutes: 45,
      status: 'not_started',
      attachments: [],
      topicKnowledge: {
        summary: "Kimyoviy tenglama — kimyoviy reaksiyaning kimyoviy formulalar va belgilar yordamida shartli yozilishidir. Moddalar massasining saqlanish qonuniga ko'ra reaksiyaga kirishgan moddalar massasi hosil bo'lgan moddalar massasiga teng bo'lishi shart.",
        keyRules: [
          "1. Massaning saqlanish qonuni: Chap va o'ng tarafdagi har bir element atomlari soni teng bo'lishi shart.",
          "2. Valentlik qoidasi: Vodorod valentligi doimo I ga, Kislorod valentligi esa II ga teng deb qabul qilinadi.",
          "3. Koeffitsiyentlar faqat butun sonlar ko'rinishida formula oldiga qo'yiladi."
        ],
        exampleSolution: "Misol: Fe + O2 -> Fe2O3 tenglamasini tenglashtirish:\n1. O'ngda 3 ta kislorod, chapda 2 ta. Eng kichik umumiy karrali son: 6.\n2. Chapga 3 ta O2 (3*2=6), o'ngga 2 ta Fe2O3 (2*3=6) qo'yamiz.\n3. Temir: o'ngda 2*2=4 ta temir bo'ldi, demak chapga 4Fe qo'yamiz.\nYechim: 4Fe + 3O2 -> 2Fe2O3",
        usefulTips: [
          "Avval metall bo'lmagan elementlarni, keyin metallarni, eng oxirida vodorod va kislorodni tenglashtiring."
        ],
        cheatSheet: "⚡ Oksidlanish darajalari yig'indisi neytral molekulada doimo 0 ga teng! Indekslarni emas, faqat oldidagi koeffitsiyentni o'zgartiring!",
        commonMistakes: [
          "Indekslarni o'zgartirib yuborish (masalan: O2 o'rniga O3 yozib qo'yish taqiqlanadi)",
          "Kislorodni birinchi bo'lib tenglashtirishga urinish (har doim oxirida tenglashtiriladi)"
        ]
      },
      allSubmissionsCount: 20,
      totalStudentsCount: 28,
    },
    {
      id: 'asg-1',
      title: 'Kvadrat tenglamalar va Viyet teoremasi masalalari',
      subject: 'Algebra va Geometriya',
      subjectCode: 'MATH',
      subjectColor: 'bg-blue-500',
      description: 'Darslikdagi 48-betdagi 142 dan 150 gacha bo\'lgan barcha juft raqamli misollarni yechish va daftarga chiroyli qayd qilish. Har bir misolda diskriminant formulasi ko\'rsatilsin.',
      instructions: [
        '142, 144, 146, 148, 150-misollarni daftarga to\'liq yechish',
        'Viyet teoremasidan foydalanib ildizlar yig\'indisi va ko\'paytmasini tekshirish',
        'Grafik ko\'rinishini x=0 va y=0 nuqtalarida tasvirlash'
      ],
      teacherName: 'Prof. Alisher Qodirov',
      teacherRole: 'Katta o\'qituvchi',
      targetClass: '10-A sinf',
      createdAt: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
      dueDate: addHours(3.5), // Due in 3.5 hours today! URGENT
      priority: 'high',
      maxScore: 100,
      estimatedMinutes: 60,
      status: 'in_progress',
      attachments: [
        { id: 'att-1', name: 'Algebra_10_bob_tenglamalar.pdf', type: 'pdf', size: '2.4 MB' },
        { id: 'att-2', name: 'Qo\'shimcha formulalar to\'plami.doc', type: 'doc', size: '540 KB' },
      ],
      topicKnowledge: {
        summary: "Kvadrat tenglama deb ax^2 + bx + c = 0 (a != 0) ko'rinishidagi tenglamaga aytiladi. Tenglamaning ildizlari soni diskriminant (D) ga bog'liq.",
        keyRules: [
          "Diskriminant formulasi: D = b^2 - 4ac",
          "Agar D > 0 bo'lsa: tenglama ikkita haqiqiy ildizga ega: x1,2 = (-b ± √D) / (2a)",
          "Agar D = 0 bo'lsa: tenglama bitta ildizga ega (ikkita karrali ildiz): x = -b / (2a)",
          "Agar D < 0 bo'lsa: tenglama haqiqiy sonlar to'plamida ildizga ega emas.",
          "Viyet teoremasi (a=1 bo'lganda): x1 + x2 = -b,  x1 * x2 = c"
        ],
        exampleSolution: "Misol: x^2 - 5x + 6 = 0 tenglamani yeching.\na = 1, b = -5, c = 6.\n1. Diskriminant: D = (-5)^2 - 4 * 1 * 6 = 25 - 24 = 1.\n2. Ildizlar: x1 = (5 + √1) / 2 = 6 / 2 = 3.\n   x2 = (5 - √1) / 2 = 4 / 2 = 2.\n3. Viyet tekshiruvi: x1 + x2 = 3 + 2 = 5 (-b ga teng), x1 * x2 = 3 * 2 = 6 (c ga teng).\nJavob: x1 = 3, x2 = 2.",
        usefulTips: [
          "Agar a + b + c = 0 bo'lsa, x1 = 1 va x2 = c/a bo'ladi!",
          "Agar a - b + c = 0 bo'lsa, x1 = -1 va x2 = -c/a bo'ladi!"
        ],
        cheatSheet: "⚡ SHPARGALKA: a+b+c=0 bo'lsa, hech qanday diskriminantsiz x1=1, x2=c/a deb darhol yozing! Masalan: 2x^2 - 5x + 3 = 0 (2-5+3=0) -> x1=1, x2=1.5.",
        commonMistakes: [
          "b ning ishorasini unutish: formulada -b turibdi, agar b=-5 bo'lsa, formula boshida +5 bo'ladi!",
          "D manfiy chiqqanda ildiz hisoblashga urinish (haqiqiy ildiz mavjud emas deb yoziladi)",
          "Maxrajdagi 2a ni unutib faqat 2 ga bo'lish (agar a=3 bo'lsa, maxraj 6 bo'lishi shart)"
        ]
      },
      allSubmissionsCount: 22,
      totalStudentsCount: 28,
    },
    {
      id: 'asg-2',
      title: 'Essay: The Impact of Artificial Intelligence on Future Jobs',
      subject: 'Ingliz tili',
      subjectCode: 'ENG',
      subjectColor: 'bg-purple-500',
      description: 'Write an argumentative essay of 250-300 words discussing how AI technologies will reshape employment, ethical concerns, and necessary skills for the next decade.',
      instructions: [
        'Introduction: hook, background sentence, and clear thesis statement',
        'Body paragraph 1: positive impacts (automation of repetitive tasks, new fields)',
        'Body paragraph 2: challenges (workforce displacement, data privacy)',
        'Conclusion: summary of main points and personal recommendation',
        'Check grammar and vocabulary: at least 5 academic linking words (moreover, consequently, etc.)'
      ],
      teacherName: 'Nilufar Rahimova',
      teacherRole: 'Ingliz tili fani o\'qituvchisi',
      targetClass: '10-A sinf',
      createdAt: new Date(now.getTime() - 12 * 3600 * 1000).toISOString(),
      dueDate: addDays(1, 16), // Tomorrow at 16:00
      priority: 'high',
      maxScore: 50,
      estimatedMinutes: 90,
      status: 'not_started',
      attachments: [
        { id: 'att-3', name: 'Essay_Rubric_and_Vocabulary.pdf', type: 'pdf', size: '1.1 MB' },
      ],
      topicKnowledge: {
        summary: "An argumentative essay presents a well-structured argument on a debatable topic. It must have an introduction with a clear thesis, coherent body paragraphs supported by evidence, and a balanced conclusion.",
        keyRules: [
          "Introduction: General hook sentence -> Bridge context -> Thesis statement (your direct stance).",
          "Body Paragraphs: Topic Sentence (main idea) -> Evidence/Explanation -> Real-world Example -> Concluding link.",
          "Academic Linking Words: Furthermore, However, Consequently, In addition to, In conclusion.",
          "Word limit: 250 - 300 words. Avoid informal slangs like 'gonna', 'wanna', 'kids'."
        ],
        exampleSolution: "Thesis Statement Example:\n'Although artificial intelligence raises legitimate concerns regarding job displacement, it ultimately enhances human productivity and fosters new technological industries when managed ethically.'",
        usefulTips: [
          "Do not introduce new arguments in the conclusion paragraph.",
          "Use passive voice and academic vocabulary to maintain formal tone."
        ],
        cheatSheet: "⚡ ESSAY TEMPLATE: Intro (Hook + Background + Thesis) -> Body 1 (Furthermore, it is evident that...) -> Body 2 (On the other hand, opponents argue that...) -> Conclusion (To sum up, while...)!",
        commonMistakes: [
          "Using personal conversational phrases like 'I think that' or 'As you know' (Use 'It is widely believed that')",
          "Starting sentences with 'And', 'But', or 'Because'",
          "Exceeding the word limit by more than 10% (stay within 250-300 words)"
        ]
      },
      allSubmissionsCount: 14,
      totalStudentsCount: 28,
    },
    {
      id: 'asg-3',
      title: 'Nyutonning II qonuni va harakat dinamikasi laboratoriya ishi',
      subject: 'Fizika',
      subjectCode: 'PHYS',
      subjectColor: 'bg-indigo-500',
      description: 'Laboratoriya daftarlarida aravacha harakatini o\'rganish tajribasi hisoboti. Olingan ma\'lumotlar asosida a(F) va a(m) grafiklarini chizish va xatoliklar chegarasini hisoblash.',
      instructions: [
        'Tajriba ma\'lumotlar jadvalini to\'ldirish (5 ta o\'lchov)',
        'F=ma formulasi orqali tezlanishni solishtirish',
        'Nisbiy va mutloq xatoliklarni aniqlash',
        'Xulosa yozish: kuch va massa tezlanishga qanday ta\'sir qiladi?'
      ],
      teacherName: 'Sardor Mahmudov',
      teacherRole: 'Fizika kafedrasi mudiri',
      targetClass: '10-A sinf',
      createdAt: new Date(now.getTime() - 36 * 3600 * 1000).toISOString(),
      dueDate: addDays(2, 14),
      priority: 'medium',
      maxScore: 75,
      estimatedMinutes: 75,
      status: 'not_started',
      attachments: [
        { id: 'att-4', name: 'Laboratoriya_shabloni_N2.pdf', type: 'pdf', size: '3.8 MB' },
        { id: 'att-5', name: 'Simulyatsiya havolasi (PhET Interactive)', type: 'link', url: 'https://phet.colorado.edu' }
      ],
      topicKnowledge: {
        summary: "Nyutonning ikkinchi qonuni klassik mexanikaning asosiy qonunlaridan biri bo'lib, jismga ta'sir qiluvchi natijaviy kuch uning massasi va olgan tezlanishi ko'paytmasiga tengligini ifodalaydi.",
        keyRules: [
          "Asosiy formula: F = m * a  (Kuch = Massa * Tezlanish)",
          "Tezlanishni topish: a = F / m",
          "Kuch birligi: 1 Nyuton (N) = 1 kg * m/s^2",
          "Agar jismga bir nechta kuch ta'sir qilsa: ∑F = F1 + F2 + ... = m * a"
        ],
        exampleSolution: "Misol: Massasi 2 kg bo'lgan aravachaga 10 N doimiy kuch ta'sir qilmoqda. Uning tezlanishini toping.\nBerilgan: m = 2 kg, F = 10 N.\nTopish kerak: a = ?\nYechish: a = F / m = 10 N / 2 kg = 5 m/s^2.\nJavob: aravacha 5 m/s^2 tezlanish bilan harakatlanadi.",
        usefulTips: [
          "Har doim birliklarni SI sistemasiga (kg, metr, soniya) o'tkazishni unutmang!"
        ],
        cheatSheet: "⚡ SHPARGALKA: F = m * a. Kuch massaga to'g'ri, tezlanishga to'g'ri mutanosib. Massa 2 barobar oshsa, tezlanish 2 barobar kamayadi (teskari mutanosib)!",
        commonMistakes: [
          "Massani grammda qoldirish (500 g ni 0.5 kg ga o'tkazish shart)",
          "Ishqalanish kuchini hisobga olmaslik (F_natijaviy = F_tortish - F_ishqalanish)"
        ]
      },
      allSubmissionsCount: 8,
      totalStudentsCount: 28,
    },
    {
      id: 'asg-4',
      title: 'Python: Rekursiv funksiyalar va ro\'yxatlar bilan ishlash (5 ta masala)',
      subject: 'Informatika va Dasturlash',
      subjectCode: 'IT',
      subjectColor: 'bg-emerald-500',
      description: 'Quyidagi 5 ta algoritmik topshiriq kodini yozib .py fayl yoki GitHub havolasi ko\'rinishida topshiring. Har bir funksiya uchun docstring va kamida 3 ta test case bo\'lishi shart.',
      instructions: [
        '1. Faktorialni rekursiv hisoblovchi funksiya',
        '2. Fibonachchi ketma-ketligining n-hadini topish',
        '3. Ichma-ich ro\'yxatni tekislovchi (flatten list) funksiya',
        '4. Matndagi eng ko\'p uchragan so\'zlarni topuvchi dastur',
        '5. Ikki saralangan massivni bitta massivga birlashtirish (Merge)'
      ],
      teacherName: 'Jasur Abdullayev',
      teacherRole: 'Dasturlash fani ustozi',
      targetClass: 'CS-204 (Universitet guruhi)',
      createdAt: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
      dueDate: addDays(3, 20),
      priority: 'medium',
      maxScore: 100,
      estimatedMinutes: 120,
      status: 'not_started',
      attachments: [
        { id: 'att-6', name: 'algoritmik_masalalar_shartlari.pdf', type: 'pdf', size: '890 KB' },
      ],
      topicKnowledge: {
        summary: "Rekursiya — bu funksiyaning o'z-o'zini to'g'ridan-to'g'ri yoki bilvosita chaqirish mexanizmi. Har qanday rekursiv funksiyada cheksiz tsiklga tushib qolmaslik uchun asosiy shart (Base Case) bo'lishi shart.",
        keyRules: [
          "1. Asosiy shart (Base Case): Rekursiya to'xtaydigan eng kichik holat.",
          "2. Rekursiv qadam (Recursive Step): Masalani kichikroq qismga bo'lib o'zini qayta chaqirish.",
          "3. Python da standart rekursiya chuqurligi chegarasi 1000 tadir (sys.setrecursionlimit)."
        ],
        exampleSolution: "Faktorial kodi misoli:\ndef factorial(n):\n    # 1. Asosiy shart (Base case)\n    if n <= 1:\n        return 1\n    # 2. Rekursiv qadam\n    return n * factorial(n - 1)\n\n# Test:\nprint(factorial(5)) # Natija: 120",
        usefulTips: [
          "Fibonachchi masalasida takroriy hisoblashlarni oldini olish uchun memoizatsiya yoki lru_cache dan foydalaning."
        ],
        cheatSheet: "⚡ PYTHON SHPARGALKA: Har bir rekursiv funksiyada 2 ta narsa bo'lishi shart: 1) if n <= 1: return natija (Base case). 2) return n * func(n-1) (Recursive step)!",
        commonMistakes: [
          "Base Case ni unutish -> RecursionError: maximum recursion depth exceeded xatosiga olib keladi",
          "Ro'yxatni rekursiyaga uzatganda ro'yxatning o'zini o'zgartirib yuborish (a.copy() yoki slice [:] ishlating)"
        ]
      },
      allSubmissionsCount: 19,
      totalStudentsCount: 32,
    },
    {
      id: 'asg-5',
      title: 'Amir Temur davrida ilm-fan, madaniyat va me\'morchilik referati',
      subject: "O'zbekiston tarixi",
      subjectCode: 'HIST',
      subjectColor: 'bg-amber-500',
      description: 'Samarqand va Shahrisabzdagi me\'moriy obidalar (Bibixonim, Go\'ri Amir, Oqsaroy) va Temuriylar davri intellektual yuksalishi mavzusida 4-5 sahifalik referat.',
      instructions: [
        'Mavzu rejasini tuzish (Kirish, 2 asosiy bob, Xulosa)',
        'Foydalanilgan tarixiy manbalar ro\'yxatini kiritish (Ibn Arabshoh, Sharafiddin Ali Yazdiy)',
        'Arxitektura namunalarining fotolari va tavsifi'
      ],
      teacherName: 'Gulchehra Yoqubova',
      teacherRole: 'Tarix fani yetakchi o\'qituvchisi',
      targetClass: '10-A sinf',
      createdAt: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(),
      dueDate: addDays(5, 17),
      priority: 'low',
      maxScore: 60,
      estimatedMinutes: 90,
      status: 'not_started',
      attachments: [
        { id: 'att-7', name: 'Temuriylar_madaniyati_manbalar.pdf', type: 'pdf', size: '4.2 MB' }
      ],
      topicKnowledge: {
        summary: "XIV asrning ikkinchi yarmi va XV asr boshlarida Amir Temur tomonidan markazlashgan qudratli davlat barpo etilishi Movarounnahrda ilm-fan, madaniyat, savdo va beqiyos me'morchilik taraqqiyotiga turtki bo'ldi.",
        keyRules: [
          "Asosiy me'moriy obidalar: Bibixonim jome masjidi (1399-1404), Go'ri Amir maqbarasi (1404), Shahrisabzdagi Oqsaroy (1380-1404), Shohi Zinda majmuasi.",
          "Amir Temur shiori: 'Kuch — adolatdadir' (Rosti — rusti).",
          "Tarixiy manbalar: Nizomiddin Shomiy 'Zafarnoma', Sharafiddin Ali Yazdiy 'Zafarnoma', Ibn Arabshoh 'Ajoyib al-maqdur'."
        ],
        exampleSolution: "Referat rejasining namunaviy strukturasi:\n1. Kirish: Amir Temur davrida markazlashgan davlatning tashkil topishi.\n2. 1-bob: Samarqand — Sharqning sayqali va ilm-fan poytaxti.\n3. 2-bob: Temuriylar me'morchiligining o'ziga xosligi va jahon madaniyatidagi o'rni.\n4. Xulosa va foydalanilgan adabiyotlar.",
        usefulTips: [
          "Ispan elchisi Ruy Gonsales de Klavixoning kundaliklaridagi qiziqarli ma'lumotlarni qo'shsangiz yuqori ball olasiz!"
        ],
        cheatSheet: "⚡ TARIX SHPARGALKA: Amir Temur davri: 1370–1405 yillar. Poytaxt: Samarqand. Eng mashhur obida: Bibixonim (Hindiston yurishidan so'ng 1399-yilda boshlangan).",
        commonMistakes: [
          "Go'ri Amir maqbarasini Amir Temur o'zi uchun qurdirgan deb o'ylash (Aslida sevimli nabirasi Muhammad Sulton vafotidan so'ng qurilgan)",
          "Zafarnoma asari mualliflarini aralashtirib yuborish (Nizomiddin Shomiy va Sharafiddin Ali Yazdiy ikkalasida ham Zafarnoma bor)"
        ]
      },
      allSubmissionsCount: 5,
      totalStudentsCount: 28,
    }
  ];
}
