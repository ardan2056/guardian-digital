/**
 * Guardian Ruang Digital - Resources, Official Emergency Directory & Transparency
 * Direktori resmi kanal pelaporan Indonesia dan transparansi sistem & kebijakan privasi.
 */

const ResourcesData = (() => {
  const OFFICIAL_CHANNELS = [
    {
      name: 'CekRekening.id (Kominfo)',
      category: 'Pengecekan & Pelaporan Rekening',
      icon: '🏦',
      desc: 'Portal resmi Kementerian Kominfo untuk memeriksa apakah nomor rekening bank atau e-wallet pernah dilaporkan terlibat penipuan.',
      url: 'https://cekrekening.id',
      actionText: 'Buka CekRekening.id',
      badge: 'Resmi Kominfo'
    },
    {
      name: 'PatroliSiber.id (Polri)',
      category: 'Pelaporan Tindak Pidana Siber',
      icon: '👮',
      desc: 'Direktorat Tindak Pidana Siber Bareskrim Polri untuk pelaporan resmi penipuan siber, pemerasan online, dan peretasan.',
      url: 'https://patrolisiber.id',
      actionText: 'Buka PatroliSiber.id',
      badge: 'Bareskrim Polri'
    },
    {
      name: 'Kontak OJK 157',
      category: 'Pinjol Ilegal & Investasi Bodong',
      icon: '⚖️',
      desc: 'Layanan konsumen Otoritas Jasa Keuangan untuk mengecek izin legalitas pinjaman online, perbankan, dan investasi berjangka.',
      phone: '157',
      whatsapp: '081157157157',
      url: 'https://kontak157.ojk.go.id',
      actionText: 'Chat WhatsApp OJK 157',
      badge: 'Otoritas Jasa Keuangan'
    },
    {
      name: 'AduanKonten.id (Kominfo)',
      category: 'Pemblokiran Situs & Konten Phishing',
      icon: '🌐',
      desc: 'Fasilitas pengaduan masyarakat untuk meminta pemblokiran situs web phishing, domain penipuan, atau konten ilegal.',
      url: 'https://aduankonten.id',
      actionText: 'Lapor ke AduanKonten',
      badge: 'Resmi Kominfo'
    },
    {
      name: 'Halo BCA (1500888)',
      category: 'Call Center Perbankan',
      icon: '💳',
      desc: 'Hotline resmi 24 jam Bank Central Asia untuk pemblokiran rekening darurat, kartu ATM, dan akun BCA mobile / myBCA.',
      phone: '1500888',
      badge: 'Perbankan'
    },
    {
      name: 'Mandiri Call (14000)',
      category: 'Call Center Perbankan',
      icon: '💳',
      desc: 'Hotline resmi 24 jam Bank Mandiri untuk pelaporan transaksi mencurigakan dan pemblokiran akun Livin\' by Mandiri.',
      phone: '14000',
      badge: 'Perbankan'
    },
    {
      name: 'Contact BRI (1500017)',
      category: 'Call Center Perbankan',
      icon: '💳',
      desc: 'Hotline resmi 24 jam Bank Rakyat Indonesia untuk pemblokiran rekening darurat dan pengamanan akun BRImo.',
      phone: '1500017',
      badge: 'Perbankan'
    },
    {
      name: 'Customer Support E-Wallet Resmi',
      category: 'Dompet Digital',
      icon: '📱',
      desc: 'DANA: 1500445 / help@dana.id | GoPay: Buka menu Bantuan di aplikasi Gojek | OVO: 1500696 / cs@ovo.id',
      badge: 'Dompet Digital'
    }
  ];

  const TRANSPARENCY_POLICY = {
    methodology: {
      title: 'Bagaimana Cara Kerja Analisis Sistem?',
      content: 'Guardian Ruang Digital menggunakan kombinasi aturan heuristik deterministik (Rule-based pattern matching), analisis struktur URL, pemeriksaan kamus manipulasi psikologis khas Indonesia, serta pendeteksi ekstensi berbahaya (.apk, .exe). Sistem mengevaluasi bobot risiko secara modular tanpa ketergantungan API pihak ketiga yang lambat.'
    },
    privacy: {
      title: 'Jaminan Privasi & Keamanan Data (Zero-Data Harvesting)',
      content: 'Kami sangat menghormati privasi Anda. Setiap teks, tautan, atau nomor yang Anda tempelkan pada Scan Center diproses 100% secara lokal di peramban (client-side browser) Anda. Kami TIDAK PERNAH mengirim data masukan Anda ke server pihak ketiga mana pun atau menyimpannya di database eksternal.'
    },
    limitations: {
      title: 'Keterbatasan & Penafian (Disclaimer Jujur)',
      content: 'Hasil evaluasi risiko pada aplikasi ini adalah instrumen edukasi dan panduan pencegahan untuk meningkatkan kewaspadaan Anda. Hasil analisis BUKAN merupakan jaminan mutlak 100% keabsahan hukum atau sertifikasi keamanan permanen dari suatu pihak. Kejahatan siber terus berevolusi, sehingga konfirmasi ganda melalui kanal resmi tetap menjadi langkah teraman.'
    },
    storage: {
      title: 'Data Apa yang Disimpan di Perangkat Anda?',
      content: 'Aplikasi hanya menyimpan riwayat progres kuis/simulator (skor XP level Guardian) dan status centang checklist darurat Anda di memori lokal peramban (localStorage). Anda dapat menghapus seluruh data ini kapan saja dengan menekan tombol "Hapus Semua Data Lokal".'
    }
  };

  return {
    OFFICIAL_CHANNELS,
    TRANSPARENCY_POLICY
  };
})();
