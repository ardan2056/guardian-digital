/**
 * Guardian Ruang Digital - Panic to Action (Pertolongan Pertama Digital)
 * Panduan respons darurat bertingkat (Golden Hour Response) saat pengguna terlanjur menjadi korban atau klik tautan/kirim data.
 */

const PanicEngine = (() => {
  const SCENARIOS = {
    otp: {
      id: 'otp',
      title: 'Terlanjur Kirim OTP / Sandi Akun',
      icon: '🔐',
      tagline: 'Kondisi Kritis: Pembobolan Akses Sedang Berlangsung',
      goldenTime: '0 - 15 Menit Pertama Sangat Menentukan!',
      steps: [
        {
          id: 'otp_s1',
          priority: 'first',
          priorityLabel: 'LAKUKAN MENIT INI',
          title: 'Segera Ubah Kata Sandi Akun Terkait (Atau Keluar dari Semua Perangkat)',
          desc: 'Masuk ke akun (email/bank/e-wallet) sekarang juga, ubah password, dan tekan opsi "Keluar dari semua perangkat lain / Log out of all sessions".',
          actionText: null
        },
        {
          id: 'otp_s2',
          priority: 'first',
          priorityLabel: 'LAKUKAN MENIT INI',
          title: 'Hubungi Call Center Resmi untuk Bekukan Akun Sementara',
          desc: 'Telepon call center bank atau customer service e-wallet terkait minta lakukan "Freeze Account" sementara agar tidak ada saldo yang disedot.',
          actionText: 'Buka Daftar Hotline Bank',
          actionTarget: 'resources'
        },
        {
          id: 'otp_s3',
          priority: 'high',
          priorityLabel: 'PRIORITAS TINGGI',
          title: 'Aktifkan Two-Factor Authentication (2FA) Menggunakan Authenticator App',
          desc: 'Hindari 2FA via SMS jika memungkinkan. Beralih ke Google Authenticator atau Microsoft Authenticator yang jauh lebih kebal penyadapan SMS.',
          actionText: null
        },
        {
          id: 'otp_s4',
          priority: 'medium',
          priorityLabel: 'LANGKAH PENCEGAHAN',
          title: 'Periksa Riwayat Transaksi & Perangkat Tertaut',
          desc: 'Cek daftar mutasi rekening terakhir dan perangkat yang sedang login. Screenshot bila ada aktivitas transaksi asing sebagai barang bukti.',
          actionText: null
        }
      ],
      templates: [
        {
          title: 'Template Chat ke CS Bank / Dompet Digital',
          text: 'Halo Customer Service, saya ingin melaporkan bahwa akun saya [Sebutkan No HP / Rekening] berpotensi diretas karena saya tidak sengaja memberikan kode OTP kepada pihak yang tidak berwenang pada pukul [Sebutkan Jam]. Mohon bantuan darurat untuk MEMBEKUKAN SEMENTARA akun dan transaksi keluar saya sekarang juga untuk verifikasi keamanan.'
        }
      ]
    },

    transfer: {
      id: 'transfer',
      title: 'Sudah Terlanjur Transfer Uang ke Penipu',
      icon: '💸',
      tagline: 'Waktu Kritis: Kejar Penarikan Saldo Sebelum Dicairkan!',
      goldenTime: 'Hubungi Bank dalam < 30 Menit!',
      steps: [
        {
          id: 'trf_s1',
          priority: 'first',
          priorityLabel: 'LAKUKAN DETIK INI',
          title: 'Hubungi Call Center Bank Asal Anda Sekarang Juga!',
          desc: 'Laporkan bahwa Anda adalah korban penipuan transfer baru saja. Minta CS Bank Anda untuk segera menghubungi Bank Tujuan (Rekening Penerima) guna melakukan PEMBLOKIRAN REKENING PENAMPUNG.',
          actionText: 'Buka Kontak Call Center Bank',
          actionTarget: 'resources'
        },
        {
          id: 'trf_s2',
          priority: 'first',
          priorityLabel: 'LAKUKAN SEGERA',
          title: 'Simpan & Amankan Semua Bukti Percakapan & Resi',
          desc: 'Ambil tangkapan layar (screenshot) bukti transfer utuh (nomor rekening, nama penerima, nominal, jam), isi chat penipu, tautan medsos/WA pelaku, dan nomor telepon pelaku. JANGAN HAPUS CHAT!',
          actionText: null
        },
        {
          id: 'trf_s3',
          priority: 'high',
          priorityLabel: 'PRIORITAS 1 HARI',
          title: 'Buat Surat Tanda Penerimaan Laporan (STPL) di Kantor Polisi Terdekat',
          desc: 'Datang ke Polsek/Polres bagian SPKT/Siber untuk membuat Surat Laporan Kepolisian. Surat ini adalah syarat wajib dari pihak bank agar saldo di rekening penampung bisa dibekukan dan diproses pengembaliannya.',
          actionText: null
        },
        {
          id: 'trf_s4',
          priority: 'high',
          priorityLabel: 'PRIORITAS 1 HARI',
          title: 'Laporkan Rekening Penipu ke CekRekening.id & PatroliSiber.id',
          desc: 'Daftarkan nomor rekening dan nomor telepon penipu di portal resmi Kementerian Kominfo (CekRekening.id) agar rekening tersebut masuk daftar hitam nasional dan tidak memakan korban baru.',
          actionText: 'Kunjungi CekRekening.id',
          externalLink: 'https://cekrekening.id'
        }
      ],
      templates: [
        {
          title: 'Template Pengaduan ke Halo BCA / Mandiri / BRI',
          text: 'Halo Tim Fraud Perbankan, saya baru saja mentransfer dana sebesar Rp[Nominal] ke rekening Bank [Nama Bank Tujuan] no [No Rekening Penipu] a.n [Nama Penipu] pada [Jam/Tanggal]. Transaksi tersebut terbukti merupakan tindak penipuan [Sebutkan jenis modus]. Mohon bantuan segera untuk mengkoordinasikan pemblokiran rekening tujuan tersebut demi pengamanan dana sisa.'
        }
      ]
    },

    apk: {
      id: 'apk',
      title: 'Terlanjur Klik Link & Instal File .APK Palsu',
      icon: '📲',
      tagline: 'Kondisi Bahaya: Malware Berpotensi Menyadap SMS/OTP & Kontak',
      goldenTime: 'Matikan Akses Internet Ponsel Segera!',
      steps: [
        {
          id: 'apk_s1',
          priority: 'first',
          priorityLabel: 'LAKUKAN DETIK INI JUGA',
          title: 'Aktifkan Mode Pesawat (Airplane Mode) atau Cabut SIM Card & Wi-Fi',
          desc: 'Malware APK membutuhkan koneksi internet untuk mengirim data SMS/OTP Anda ke server penipu. Mematikan data & Wi-Fi langsung memutus kendali jarak jauh penipu!',
          actionText: null
        },
        {
          id: 'apk_s2',
          priority: 'first',
          priorityLabel: 'PRIORITAS TINGGI',
          title: 'Gunakan Perangkat Lain untuk Mengganti Sandi M-Banking & Email',
          desc: 'JANGAN gunakan ponsel yang terinfeksi. Pinjam ponsel keluarga atau laptop untuk login ke mobile banking Anda dan ubah PIN/password, atau hubungi CS bank untuk nonaktifkan m-banking sementara.',
          actionText: null
        },
        {
          id: 'apk_s3',
          priority: 'high',
          priorityLabel: 'PEMBERSIHAN PERANGKAT',
          title: 'Cari & Hapus Aplikasi Berbahaya dari Pengaturan Ponsel',
          desc: 'Masuk ke Pengaturan HP > Aplikasi > Kelola Aplikasi. Cari aplikasi asing tanpa ikon atau bernama mencurigakan (sering menyamar sebagai Surat Undangan, Paket J&T, Update Layanan). Tekan "Paksa Berhenti" lalu "Hapus Instalasi (Uninstall)".',
          actionText: null
        },
        {
          id: 'apk_s4',
          priority: 'medium',
          priorityLabel: 'OPSI TERBAIK JIKA RAGU',
          title: 'Lakukan Reset Pabrik (Factory Reset) Ponsel',
          desc: 'Jika aplikasi tidak bisa di-uninstall atau memiliki izin Administrator Perangkat, opsi paling aman dan bersih adalah melakukan Reset Data Pabrik (Factory Reset) setelah mencadangkan foto pribadi secara offline.',
          actionText: null
        }
      ],
      templates: [
        {
          title: 'Pesan Broadcast ke Kerabat (Pemberitahuan Penyadapan)',
          text: 'Pemberitahuan Penting: Ponsel saya baru saja disusupi aplikasi berbahaya / malware yang berpotensi menyadap SMS dan kontak saya. Jika ada pesan mencurigakan, permintaan transfer uang, atau permintaan kode apapun atas nama saya melalui WhatsApp atau SMS, MOHON ABAIKAN DAN JANGAN DITURUTI karena itu bukan dari saya.'
        }
      ]
    },

    leak: {
      id: 'leak',
      title: 'Data Pribadi Bocor (KTP, Selfie Wajah, KK)',
      icon: '🪪',
      tagline: 'Risiko: Penyalahgunaan untuk Pinjaman Online Ilegal / Penipuan',
      goldenTime: 'Lakukan Mitigasi Preventif Hari Ini',
      steps: [
        {
          id: 'leak_s1',
          priority: 'first',
          priorityLabel: 'PRIORITAS 1',
          title: 'Cek Riwayat SLIK OJK (iDeb) Secara Berkala',
          desc: 'Pastikan NIK KTP Anda tidak digunakan sindikat untuk mengajukan kredit atau pinjol. Anda bisa mengecek skor kredit SLIK melalui portal idebku.ojk.go.id secara gratis dan resmi.',
          actionText: 'Kunjungi iDebku OJK',
          externalLink: 'https://idebku.ojk.go.id'
        },
        {
          id: 'leak_s2',
          priority: 'high',
          priorityLabel: 'PERLINDUNGAN HUKUM',
          title: 'Buat Surat Laporan Kehilangan / Penyalahgunaan Identitas di Kepolisian',
          desc: 'Laporkan bahwa data identitas Anda telah tersebar tanpa persetujuan. Surat laporan ini menjadi bukti sah bahwa Anda adalah korban jika di masa depan ada penagih utang pinjol ilegal yang menagih ke alamat Anda.',
          actionText: null
        },
        {
          id: 'leak_s3',
          priority: 'medium',
          priorityLabel: 'EDUKASI KONTAK',
          title: 'Peringatkan Kontak Darurat & Keluarga Terdekat',
          desc: 'Beritahu keluarga dan teman dekat bahwa data Anda bocor, sehingga jika ada debt collector ilegal yang menghubungi mereka mengatasnamakan Anda, mereka tahu bahwa itu adalah penipuan.',
          actionText: null
        }
      ],
      templates: [
        {
          title: 'Template Pernyataan Bantahan Penyalahgunaan NIK',
          text: 'Pemberitahuan Klarifikasi: Dengan ini saya mengumumkan bahwa data identitas NIK dan KTP saya telah bocor di luar kendali saya dan telah dilaporkan ke pihak berwajib. Saya tidak pernah mengajukan pinjaman online atau transaksi finansial tanpa verifikasi langsung. Segala transaksi yang mengatasnamakan NIK saya tanpa kehadiran fisik adalah tindak kejahatan pemalsuan identitas.'
        }
      ]
    },

    hijack: {
      id: 'hijack',
      title: 'Akun WhatsApp / Medsos Diambil Alih (Dibajak)',
      icon: '👤',
      tagline: 'Waktu Kritis: Penipu Sedang Menghubungi Kontak Anda untuk Meminjam Uang',
      goldenTime: 'Segera Peringatkan Semua Kontak Teman & Keluarga!',
      steps: [
        {
          id: 'hjk_s1',
          priority: 'first',
          priorityLabel: 'LAKUKAN MENIT INI',
          title: 'Pasang Status di Instagram / Facebook & Beritahu Grup Keluarga',
          desc: 'Penipu biasanya langsung mengirim pesan "Pinjam uang dulu darurat" ke kontak Anda. Gunakan medsos lain untuk mengumumkan: "Akun WhatsApp saya dibajak, jangan transfer uang ke siapapun!".',
          actionText: null
        },
        {
          id: 'hjk_s2',
          priority: 'first',
          priorityLabel: 'REBUT KEMBALI AKSES',
          title: 'Login Kembali ke WhatsApp Menggunakan Nomor Anda',
          desc: 'Buka WhatsApp di ponsel Anda, masukkan nomor Anda, dan minta kode OTP verifikasi 6 digit via SMS. Begitu Anda memasukkan kode SMS, penipu yang sedang menggunakan akun Anda akan otomatis terputus (logged out).',
          actionText: null
        },
        {
          id: 'hjk_s3',
          priority: 'high',
          priorityLabel: 'JIKA DIMINTA PIN 2FA OLEH PENIPU',
          title: 'Jika Penipu Memasang Verifikasi 2 Langkah (2FA PIN)',
          desc: 'Jika Anda diminta memasukkan PIN 2 langkah yang tidak Anda ketahui, berarti penipu telah memasangnya. Anda harus menunggu 7 hari agar PIN tersebut kedaluwarsa, namun penipu SUDAH TIDAK DAPAT mengakses akun Anda sejak Anda memasukkan kode SMS.',
          actionText: null
        },
        {
          id: 'hjk_s4',
          priority: 'medium',
          priorityLabel: 'PENCEGAHAN KEDEPAN',
          title: 'Kirim Email ke Support WhatsApp untuk Menonaktifkan Akun',
          desc: 'Kirim email ke support@whatsapp.com dengan subjek "Hilang/Dicuri: Mohon nonaktifkan akun saya" disertai nomor telepon Anda dengan format internasional (+62...).',
          actionText: null
        }
      ],
      templates: [
        {
          title: 'Template Status Darurat Medsos (Akun Dibajak)',
          text: '🚨 PEMBERITAHUAN DARURAT 🚨\nTeman-teman dan keluarga, nomor WhatsApp saya (+62...) baru saja DIBOBOL / DIBAJAK oleh oknum tidak bertanggung jawab. JIKA ADA PESAN DARI NOMOR SAYA YANG MEMINTA TRANSFER UANG ATAU PINJAM DANA, ITU 100% PENIPU! Mohon jangan ditanggapi dan bantu sebarkan ke yang lain. Terima kasih!'
        }
      ]
    }
  };

  // State Checklist tersimpan di LocalStorage
  const STORAGE_KEY = 'guardian_panic_checklist_v1';

  function getSavedChecklist() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function setStepStatus(scenarioId, stepId, isChecked) {
    const saved = getSavedChecklist();
    if (!saved[scenarioId]) saved[scenarioId] = {};
    saved[scenarioId][stepId] = isChecked;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {}
  }

  function getScenarioProgress(scenarioId) {
    const scenario = SCENARIOS[scenarioId];
    if (!scenario) return { completed: 0, total: 0, percent: 0 };
    const saved = getSavedChecklist()[scenarioId] || {};
    const total = scenario.steps.length;
    let completed = 0;
    scenario.steps.forEach(s => {
      if (saved[s.id]) completed++;
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent };
  }

  return {
    SCENARIOS,
    getSavedChecklist,
    setStepStatus,
    getScenarioProgress
  };
})();
