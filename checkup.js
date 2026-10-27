/**
 * Guardian Ruang Digital - Security Checkup (Audit Kebiasaan Aman)
 * Evaluasi kebiasaan keamanan digital tanpa meminta informasi kredensial sama sekali.
 */

const CheckupEngine = (() => {
  const HABITS = [
    {
      id: 'h1',
      title: 'Verifikasi Dua Langkah (2FA) di WhatsApp & Akun Utama',
      desc: 'Sudah mengaktifkan PIN verifikasi dua langkah di WhatsApp, akun Google, dan media sosial Anda.',
      weight: 15,
      tip: 'Buka WhatsApp > Pengaturan > Akun > Verifikasi Dua Langkah > Nyalakan PIN.'
    },
    {
      id: 'h2',
      title: 'Kombinasi Kata Sandi Unik & Berbeda',
      desc: 'Tidak menggunakan satu kata sandi yang sama persis untuk akun email, media sosial, dan mobile banking.',
      weight: 15,
      tip: 'Jika satu akun bocor, hacker akan mencoba kata sandi yang sama di semua platform lain (Credential Stuffing).'
    },
    {
      id: 'h3',
      title: 'Verifikasi Suara / Telepon Saat Kontak Meminjam Uang',
      desc: 'Selalu menolak transfer sebelum berhasil mendengar suara atau video call langsung dengan teman/kerabat yang meminta dana.',
      weight: 15,
      tip: 'Jangan pernah percaya hanya dari chat teks atau foto profil.'
    },
    {
      id: 'h4',
      title: 'Matikan Izin "Instal Aplikasi dari Sumber Tidak Dikenal"',
      desc: 'Memastikan pengaturan ponsel Android tidak mengizinkan penginstalan file APK dari peramban atau aplikasi WhatsApp.',
      weight: 15,
      tip: 'Masuk ke Pengaturan HP > Keamanan > Instal Aplikasi Tidak Dikenal > Nonaktifkan untuk semua aplikasi chat.'
    },
    {
      id: 'h5',
      title: 'Pemeriksaan Nama Domain Sebelum Memasukkan Akun',
      desc: 'Memeriksa apakah domain berakhiran resmi (.go.id, .co.id, atau domain perusahaan sah) sebelum login atau mengisi data pribadi.',
      weight: 10,
      tip: 'Jangan mudah percaya pada tampilan web yang mirip; selalu periksa kolom alamat (URL bar) browser Anda.'
    },
    {
      id: 'h6',
      title: 'Prinsip Kerahasiaan Mutlak Kode OTP & PIN',
      desc: 'Tidak pernah membagikan kode OTP atau PIN kepada siapapun dengan alasan apapun, termasuk orang yang mengaku petugas bank.',
      weight: 15,
      tip: 'Petugas bank resmi memiliki sistem internal dan tidak pernah memerlukan kode OTP nasabah.'
    },
    {
      id: 'h7',
      title: 'Prinsip 2L (Legal & Logis) untuk Investasi & Pinjaman',
      desc: 'Memeriksa izin OJK dan berpikir kritis terhadap janji keuntungan instan yang tidak masuk akal.',
      weight: 10,
      tip: 'Gunakan layanan WhatsApp resmi OJK 157 (081-157-157-157) untuk mengecek izin perusahaan.'
    },
    {
      id: 'h8',
      title: 'Rutin Memeriksa Perangkat Tertaut (Linked Devices)',
      desc: 'Rutin memeriksa menu "Perangkat Tertaut" di WhatsApp dan riwayat login di Instagram minimal sebulan sekali.',
      weight: 5,
      tip: 'Keluarkan (Log out) semua sesi komputer asing atau yang sudah tidak digunakan.'
    }
  ];

  const STORAGE_KEY = 'guardian_security_checkup_v1';

  function getSavedAnswers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAnswer(habitId, isChecked) {
    const answers = getSavedAnswers();
    answers[habitId] = isChecked;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {}
  }

  function calculateScore() {
    const answers = getSavedAnswers();
    let totalScore = 0;
    let missingTips = [];

    HABITS.forEach(h => {
      if (answers[h.id]) {
        totalScore += h.weight;
      } else {
        missingTips.push(h);
      }
    });

    let status = 'Rentan';
    let badgeColor = 'danger';
    let summary = 'Kebiasaan keamanan Anda masih rentan terhadap serangan rekayasa sosial dan malware. Segera perbaiki poin yang belum dicentang!';

    if (totalScore >= 80) {
      status = 'Guardian Tangguh';
      badgeColor = 'success';
      summary = 'Luar biasa! Pertahanan kebiasaan digital Anda sangat kokoh dan siap menghadapi aneka jebakan siber!';
    } else if (totalScore >= 50) {
      status = 'Cukup Waspada';
      badgeColor = 'warning';
      summary = 'Dasar kewaspadaan Anda sudah baik, namun masih ada beberapa celah kritis yang bisa dimanfaatkan penipu.';
    }

    return {
      score: totalScore,
      status,
      badgeColor,
      summary,
      missingTips,
      totalHabits: HABITS.length,
      completedHabits: HABITS.length - missingTips.length
    };
  }

  return {
    HABITS,
    getSavedAnswers,
    saveAnswer,
    calculateScore
  };
})();
