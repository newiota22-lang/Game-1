import { SilaInfo, SilaNumber, LevelConfig, Badge, DailyMission, TeacherAnalyticsData, ClassTeam } from '../types/game';

export const SILA_DATA: Record<SilaNumber, SilaInfo> = {
  1: {
    number: 1,
    name: 'Ketuhanan Yang Maha Esa',
    symbol: 'Bintang Emas Berlatar Hitam',
    color: '#eab308', // gold/yellow
    bgColor: 'bg-amber-100 text-amber-900 border-amber-300',
    borderColor: '#f59e0b',
    motto: 'Menghargai keberagaman agama & rajin beribadah',
    meaning: 'Mengakui keberadaan Tuhan dan saling menghormati antarumat beragama tanpa memaksakan kehendak.',
    dailyExamples: [
      'Menghormati teman yang sedang berdoa sebelum makan atau belajar',
      'Tidak mengganggu ibadah pemeluk agama lain di lingkungan sekitar',
      'Mengucapkan salam dan bersyukur atas nikmat yang didapatkan',
      'Berteman dengan siapa saja tanpa membedakan agamanya'
    ]
  },
  2: {
    number: 2,
    name: 'Kemanusiaan yang Adil dan Beradab',
    symbol: 'Rantai Emas Segi Empat & Lingkaran',
    color: '#ef4444', // red
    bgColor: 'bg-red-100 text-red-900 border-red-300',
    borderColor: '#dc2626',
    motto: 'Tolong-menolong, empati & anti-perundungan',
    meaning: 'Memperlakukan setiap manusia dengan adil, santun, welas asih, dan tidak menyakiti sesama makhluk.',
    dailyExamples: [
      'Menolong teman yang terjatuh di halaman sekolah',
      'Membantu korban bencana alam dengan menyisihkan uang jajan',
      'Bersikap sopan dan santun kepada guru, orang tua, dan teman',
      'Menolak perundungan (bullying) dan membela teman yang diejek'
    ]
  },
  3: {
    number: 3,
    name: 'Persatuan Indonesia',
    symbol: 'Pohon Beringin Rindang',
    color: '#10b981', // green
    bgColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    borderColor: '#059669',
    motto: 'Cinta tanah air & bangga keberagaman budaya',
    meaning: 'Menempatkan persatuan bangsa di atas kepentingan pribadi atau golongan, dengan semangat Bhinneka Tunggal Ika.',
    dailyExamples: [
      'Mempelajari tarian tradisional dan mengenakan batik dengan bangga',
      'Rukun bermain bersama teman yang berbeda suku dan daerah asal',
      'Menggunakan bahasa Indonesia yang baik dan benar',
      'Menjaga kerukunan di kelas dan menghindari pertengkaran antarkelompok'
    ]
  },
  4: {
    number: 4,
    name: 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan',
    symbol: 'Kepala Banteng Tangguh',
    color: '#8b5cf6', // purple
    bgColor: 'bg-purple-100 text-purple-900 border-purple-300',
    borderColor: '#7c3aed',
    motto: 'Musyawarah mufakat & lapang dada menerima hasil',
    meaning: 'Menyelesaikan masalah bersama melalui dialog terbuka, menghargai saran orang lain, dan tidak memaksakan kehendak.',
    dailyExamples: [
      'Bermusyawarah menentukan jadwal piket dan pemilihan ketua kelas',
      'Mendengarkan teman yang sedang mengemukakan pendapat di depan kelas',
      'Menerima hasil keputusan bersama dengan ikhlas dan lapang dada',
      'Menyelesaikan perbedaan pendapat melalui diskusi yang santun'
    ]
  },
  5: {
    number: 5,
    name: 'Keadilan Sosial bagi Seluruh Rakyat Indonesia',
    symbol: 'Padi dan Kapas Kesejahteraan',
    color: '#0284c7', // sky blue
    bgColor: 'bg-sky-100 text-sky-900 border-sky-300',
    borderColor: '#0369a1',
    motto: 'Sikap adil, hemat, kerja keras & tertib antre',
    meaning: 'Menghargai hak dan kewajiban orang lain, hidup hemat, tidak boros, dan bersikap adil dalam kehidupan bermasyarakat.',
    dailyExamples: [
      'Membagi tugas kelompok secara seimbang dan adil',
      'Tertib mengantre saat membeli makanan di kantin sekolah',
      'Menyisihkan uang saku untuk menabung dan tidak bergaya hidup boros',
      'Menghormati hak teman saat meminjam buku di perpustakaan'
    ]
  }
};

export const GAME_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Aku dan Teman-teman yang Berbeda',
    subtitle: 'Rintangan: Jembatan Persatuan',
    sila: 1,
    themeColor: '#ef4444',
    description: 'Di kelas ada teman yang berbeda agama dan suku. Lewati Jembatan Persatuan dengan memilih sikap yang tepat!',
    targetDistance: 500,
    minScoreToPass: 120,
    environmentTheme: 'temple',
    dilemmas: [
      {
        id: 'dilemma-1-1',
        title: 'Teman Berbeda Agama & Suku',
        contextLocation: 'Rintangan Jembatan Persatuan',
        silaTarget: 1,
        characterSpeaker: 'Made, Siti, Frans & Dayu',
        scenario: 'Di kelas ada teman yang berbeda agama dan suku. Bagaimana sikapmu?',
        options: [
          {
            id: 'opt-1-1-a',
            text: 'Mengajak bermain bersama dengan ramah dan saling menghargai.',
            isCorrect: true,
            points: 50,
            silaAlignment: 1,
            explanation: 'Hebat! Kamu menerapkan nilai luhur Pancasila dengan merangkul semua teman tanpa membeda-bedakan agama maupun suku.'
          },
          {
            id: 'opt-1-1-b',
            text: 'Tidak mau bermain karena merasa berbeda latar belakang.',
            isCorrect: false,
            points: 5,
            silaAlignment: 1,
            explanation: 'Kurang tepat. Menolak berteman karena perbedaan bertentangan dengan semboyan Bhinneka Tunggal Ika.'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Jujur Itu Hebat',
    subtitle: 'Penerapan Nilai Kemanusiaan & Moral',
    sila: 2,
    themeColor: '#f59e0b',
    description: 'Buktikan kejujuran dan integritasmu saat menemukan barang milik orang lain di sekolah!',
    targetDistance: 520,
    minScoreToPass: 120,
    environmentTheme: 'village',
    dilemmas: [
      {
        id: 'dilemma-2-1',
        title: 'Menemukan Dompet Terjatuh',
        contextLocation: 'Jalan Setapak Sekolah',
        silaTarget: 2,
        characterSpeaker: 'Siswa Kelas 4',
        scenario: 'Kamu menemukan sebuah dompet berisi uang dan kartu identitas di lingkungan sekolah. Apa yang kamu lakukan?',
        options: [
          {
            id: 'opt-2-1-a',
            text: 'Mengembalikannya kepada pemilik atau menyerahkannya ke ruang Guru/Kepala Sekolah.',
            isCorrect: true,
            points: 50,
            silaAlignment: 2,
            explanation: 'Luar biasa jujur! Kejujuran adalah pilar adab dan akhlak mulia manusia Pancasila.'
          },
          {
            id: 'opt-2-1-b',
            text: 'Menyimpannya untuk diri sendiri secara diam-diam.',
            isCorrect: false,
            points: 0,
            silaAlignment: 2,
            explanation: 'Tidak terpuji. Mengambil hak orang lain melanggar nilai kejujuran dan merugikan orang yang kehilangan.'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Gotong Royong di Desaku',
    subtitle: 'Rintangan: Tebing Tanggung Jawab',
    sila: 3,
    themeColor: '#0284c7',
    description: 'Di lingkungan rumah sedang ada kegiatan kerja bakti. Pilih keputusan yang tepat untuk bisa melewati Tebing Tanggung Jawab!',
    targetDistance: 550,
    minScoreToPass: 130,
    environmentTheme: 'island',
    dilemmas: [
      {
        id: 'dilemma-3-1',
        title: 'Kerja Bakti Lingkungan',
        contextLocation: 'Rintangan Tebing Tanggung Jawab',
        silaTarget: 3,
        characterSpeaker: 'Warga Desa Nusantara',
        scenario: 'Di lingkungan rumah sedang diadakan kerja bakti membersihkan selokan dan jalan desa. Sikapmu?',
        options: [
          {
            id: 'opt-3-1-a',
            text: 'Ikut membantu dengan semangat sesuai kemampuan (seperti menyapu dan mengumpulkan sampah).',
            isCorrect: true,
            points: 50,
            silaAlignment: 3,
            explanation: 'Tepat sekali! Semangat gotong royong adalah jati diri bangsa Indonesia yang mempererat persatuan.'
          },
          {
            id: 'opt-3-1-b',
            text: 'Tidak ikut karena lebih suka bermain game sendirian di dalam kamar.',
            isCorrect: false,
            points: 5,
            silaAlignment: 3,
            explanation: 'Kurang tepat. Menolak peduli terhadap lingkungan sosial menjauhkan kita dari kebersamaan warga.'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Menghargai Pendapat Orang Lain',
    subtitle: 'Musyawarah Mufakat & Dialog Santun',
    sila: 4,
    themeColor: '#10b981',
    description: 'Latih caramu mendengarkan rekan kelompok belajar dan menghargai perbedaan pandangan dalam diskusi!',
    targetDistance: 580,
    minScoreToPass: 140,
    environmentTheme: 'hall',
    dilemmas: [
      {
        id: 'dilemma-4-1',
        title: 'Perbedaan Pendapat dalam Diskusi',
        contextLocation: 'Meja Belajar Kelompok',
        silaTarget: 4,
        characterSpeaker: 'Rekan Kelompok Kelas',
        scenario: 'Dalam diskusi kelompok belajar, pendapatmu berbeda dengan temanmu. Bagaimana sikapmu?',
        options: [
          {
            id: 'opt-4-1-a',
            text: 'Mendengarkan dengan sabar dan menghargai pendapat teman sebelum mencari solusi bersama.',
            isCorrect: true,
            points: 50,
            silaAlignment: 4,
            explanation: 'Sangat bijaksana! Mendengarkan pendapat kawan dengan lapang dada adalah perwujudan hikmat kebijaksanaan Sila ke-4.'
          },
          {
            id: 'opt-4-1-b',
            text: 'Memotong pembicaraan teman dan memaksakan pendapat sendiri yang harus dipakai.',
            isCorrect: false,
            points: 0,
            silaAlignment: 4,
            explanation: 'Keliru. Memaksakan kehendak dan memotong pembicaraan orang lain merusak musyawarah.'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Cinta Indonesia',
    subtitle: 'Rintangan: Gunung Cita-Cita Menuju Puncak Garuda',
    sila: 5,
    themeColor: '#8b5cf6',
    description: 'Raih puncak Gunung Cita-cita dengan menerapkan semua nilai luhur Pancasila demi kemajuan bangsa!',
    targetDistance: 600,
    minScoreToPass: 150,
    environmentTheme: 'valley',
    dilemmas: [
      {
        id: 'dilemma-5-1',
        title: 'Bukti Nyata Cinta Tanah Air',
        contextLocation: 'Rintangan Gunung Cita-cita',
        silaTarget: 5,
        characterSpeaker: 'Garuda Pembawa Bendera Merah Putih',
        scenario: 'Bagaimana cara kamu menunjukkan cinta Indonesia dalam kehidupan sehari-hari?',
        options: [
          {
            id: 'opt-5-1-a',
            text: 'Menjaga kebersihan lingkungan sekitar, rajin belajar, dan bangga menggunakan produk lokal Indonesia.',
            isCorrect: true,
            points: 50,
            silaAlignment: 5,
            explanation: 'Luar biasa patriotik! Mencintai tanah air dibuktikan melalui aksi nyata menjaga alam, berprestasi, dan mencintai produk bangsa.'
          },
          {
            id: 'opt-5-1-b',
            text: 'Tidak peduli terhadap lingkungan sekitar dan membuang sampah sembarangan.',
            isCorrect: false,
            points: 0,
            silaAlignment: 5,
            explanation: 'Sangat keliru. Tidak peduli lingkungan merusak kelestarian negeri tercinta.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-toleransi',
    title: 'Pahlawan Toleransi',
    category: 'sila1',
    description: 'Selesaikan dilema Sila ke-1 dengan menghormati ibadah dan keyakinan teman.',
    iconName: 'Sun',
    costPoints: 100,
    unlocked: false
  },
  {
    id: 'badge-welas-asih',
    title: 'Ksatria Welas Asih',
    category: 'sila2',
    description: 'Menolong sesama yang membutuhkan tanpa pamrih dan menolak perundungan.',
    iconName: 'HeartHandshake',
    costPoints: 120,
    unlocked: false
  },
  {
    id: 'badge-sahabat-bhinneka',
    title: 'Sahabat Bhinneka',
    category: 'sila3',
    description: 'Berteman akrab dengan teman dari beragam suku dan bangga memakai pakaian adat nusantara.',
    iconName: 'Sparkles',
    costPoints: 150,
    unlocked: false
  },
  {
    id: 'badge-pelopor-musyawarah',
    title: 'Pelopor Musyawarah',
    category: 'sila4',
    description: 'Mengutamakan mufakat, mendengarkan pendapat teman, dan lapang dada menerima keputusan bersama.',
    iconName: 'Users',
    costPoints: 160,
    unlocked: false
  },
  {
    id: 'badge-penjaga-keadilan',
    title: 'Penjaga Keadilan',
    category: 'sila5',
    description: 'Disiplin tertib antre di kantin, gemar menabung, dan membagi tugas secara adil.',
    iconName: 'Scale',
    costPoints: 180,
    unlocked: false
  },
  {
    id: 'badge-garuda-emas',
    title: 'Garuda Emas Nusantara',
    category: 'special',
    description: 'Lencana tertinggi untuk siswa teladan yang berhasil menuntaskan seluruh 5 Sila Pancasila!',
    iconName: 'Award',
    costPoints: 300,
    unlocked: false
  }
];

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'mission-1',
    title: 'Misi Senyum & Salam Pagi',
    description: 'Sapa guru dan teman dengan sopan sebelum memulai pelajaran (Sila 1 & 2).',
    sila: 1,
    targetCount: 1,
    currentCount: 0,
    rewardPoints: 30,
    completed: false
  },
  {
    id: 'mission-2',
    title: 'Misi Bantu Teman Piket',
    description: 'Bantu regu piket merapikan papan tulis dan menyapu kelas (Sila 2 & 3).',
    sila: 2,
    targetCount: 1,
    currentCount: 0,
    rewardPoints: 40,
    completed: false
  },
  {
    id: 'mission-3',
    title: 'Misi Tertib Antre Kantin',
    description: 'Mengantre dengan rapi dan sabar saat istirahat siang (Sila 5).',
    sila: 5,
    targetCount: 1,
    currentCount: 0,
    rewardPoints: 35,
    completed: false
  },
  {
    id: 'mission-4',
    title: 'Misi Musyawarah Kelompok',
    description: 'Dengarkan setidaknya 2 saran dari rekan kelompok belajarmu (Sila 4).',
    sila: 4,
    targetCount: 2,
    currentCount: 0,
    rewardPoints: 45,
    completed: false
  }
];

export const INITIAL_CLASS_TEAMS: ClassTeam[] = [
  {
    id: 'team-rajawali',
    name: 'Tim Rajawali Berani',
    mascot: 'Rajawali',
    color: '#dc2626',
    totalPoints: 850,
    members: [
      { id: 'm1', name: 'Alif Kurnia', score: 290, levelCompleted: 3, avatar: { gender: 'boy', skinTone: '#f8d9b5', hairStyle: 'short', outfit: 'sd_merah_putih', headwear: 'peci_nasional', accessory: 'garuda_badge' } },
      { id: 'm2', name: 'Dewi Lestari', score: 310, levelCompleted: 4, avatar: { gender: 'girl', skinTone: '#e0ac69', hairStyle: 'ponytail', outfit: 'pramuka', headwear: 'none', accessory: 'selempang_merah_putih' } },
      { id: 'm3', name: 'Putu Arya', score: 250, levelCompleted: 3, avatar: { gender: 'boy', skinTone: '#c68642', hairStyle: 'short', outfit: 'batik_nusantara', headwear: 'udeng_bali', accessory: 'garuda_badge' } }
    ]
  },
  {
    id: 'team-garuda',
    name: 'Tim Garuda Pancasila',
    mascot: 'Garuda',
    color: '#eab308',
    totalPoints: 920,
    members: [
      { id: 'm4', name: 'Nabila Zahra', score: 340, levelCompleted: 5, avatar: { gender: 'girl', skinTone: '#f8d9b5', hairStyle: 'curly', outfit: 'sd_merah_putih', headwear: 'none', accessory: 'garuda_badge' } },
      { id: 'm5', name: 'Budi Santoso', score: 300, levelCompleted: 4, avatar: { gender: 'boy', skinTone: '#e0ac69', hairStyle: 'short', outfit: 'batik_nusantara', headwear: 'blangkon_jawa', accessory: 'selempang_merah_putih' } },
      { id: 'm6', name: 'Fransiscus Papare', score: 280, levelCompleted: 3, avatar: { gender: 'boy', skinTone: '#8d5524', hairStyle: 'curly', outfit: 'tenun_ikat', headwear: 'none', accessory: 'tas_noken' } }
    ]
  },
  {
    id: 'team-cenderawasih',
    name: 'Tim Cenderawasih Indah',
    mascot: 'Cenderawasih',
    color: '#0284c7',
    totalPoints: 780,
    members: [
      { id: 'm7', name: 'Dayu Ratna', score: 260, levelCompleted: 3, avatar: { gender: 'girl', skinTone: '#e0ac69', hairStyle: 'ponytail', outfit: 'batik_nusantara', headwear: 'destar_minang', accessory: 'garuda_badge' } },
      { id: 'm8', name: 'Kevin Christian', score: 270, levelCompleted: 3, avatar: { gender: 'boy', skinTone: '#f8d9b5', hairStyle: 'short', outfit: 'pramuka', headwear: 'none', accessory: 'selempang_merah_putih' } },
      { id: 'm9', name: 'Siti Rohani', score: 250, levelCompleted: 3, avatar: { gender: 'girl', skinTone: '#f8d9b5', hairStyle: 'short', outfit: 'sd_merah_putih', headwear: 'none', accessory: 'garuda_badge' } }
    ]
  },
  {
    id: 'team-komodo',
    name: 'Tim Komodo Tangguh',
    mascot: 'Komodo',
    color: '#10b981',
    totalPoints: 810,
    members: [
      { id: 'm10', name: 'Rangga Wijaya', score: 290, levelCompleted: 4, avatar: { gender: 'boy', skinTone: '#c68642', hairStyle: 'short', outfit: 'tenun_ikat', headwear: 'peci_nasional', accessory: 'garuda_badge' } },
      { id: 'm11', name: 'Meilin Tan', score: 280, levelCompleted: 3, avatar: { gender: 'girl', skinTone: '#f8d9b5', hairStyle: 'ponytail', outfit: 'batik_nusantara', headwear: 'none', accessory: 'selempang_merah_putih' } },
      { id: 'm12', name: 'Yosep Rumbiak', score: 240, levelCompleted: 3, avatar: { gender: 'boy', skinTone: '#8d5524', hairStyle: 'curly', outfit: 'sd_merah_putih', headwear: 'udeng_bali', accessory: 'tas_noken' } }
    ]
  }
];

export const INITIAL_TEACHER_ANALYTICS: TeacherAnalyticsData = {
  classRoom: 'Kelas 4A - SDN Nusantara 01',
  totalStudents: 28,
  averageScore: 284,
  completionRate: 82,
  silaAverages: {
    1: 94, // Toleransi tinggi
    2: 91, // Empati sangat baik
    3: 88, // Persatuan & keberagaman baik
    4: 79, // Perlu penguatan dalam musyawarah (mendengarkan teman)
    5: 85  // Keadilan & tertib antre
  },
  topStrengths: [
    'Toleransi antarumat beragama sangat tinggi (Sila 1)',
    'Kepedulian terhadap kawan yang terluka/terjatuh (Sila 2)',
    'Antusiasme memakai busana daerah dan cinta tarian nusantara (Sila 3)'
  ],
  needImprovement: [
    'Kesabaran mendengarkan teman saat bermusyawarah di kelas (Sila 4)',
    'Menerima keputusan kelompok jika pendapat pribadi tidak terpilih (Sila 4)'
  ],
  studentList: [
    { name: 'Nabila Zahra', score: 340, completedLevels: 5, silaAccuracy: 96, lastActive: 'Hari ini, 09:15', team: 'Tim Garuda Pancasila' },
    { name: 'Dewi Lestari', score: 310, completedLevels: 4, silaAccuracy: 92, lastActive: 'Hari ini, 08:50', team: 'Tim Rajawali Berani' },
    { name: 'Budi Santoso', score: 300, completedLevels: 4, silaAccuracy: 90, lastActive: 'Kemarin, 14:20', team: 'Tim Garuda Pancasila' },
    { name: 'Alif Kurnia', score: 290, completedLevels: 3, silaAccuracy: 88, lastActive: 'Hari ini, 09:05', team: 'Tim Rajawali Berani' },
    { name: 'Rangga Wijaya', score: 290, completedLevels: 4, silaAccuracy: 89, lastActive: 'Kemarin, 15:10', team: 'Tim Komodo Tangguh' },
    { name: 'Meilin Tan', score: 280, completedLevels: 3, silaAccuracy: 86, lastActive: 'Kemarin, 11:30', team: 'Tim Komodo Tangguh' },
    { name: 'Fransiscus Papare', score: 280, completedLevels: 3, silaAccuracy: 85, lastActive: 'Hari ini, 08:30', team: 'Tim Garuda Pancasila' },
    { name: 'Kevin Christian', score: 270, completedLevels: 3, silaAccuracy: 84, lastActive: '2 hari lalu', team: 'Tim Cenderawasih Indah' },
    { name: 'Dayu Ratna', score: 260, completedLevels: 3, silaAccuracy: 82, lastActive: 'Kemarin, 13:40', team: 'Tim Cenderawasih Indah' }
  ]
};
