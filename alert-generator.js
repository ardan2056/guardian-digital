/**
 * Guardian Ruang Digital - Guardian Alert Generator
 * Membantu pemuda membuat dan membagikan kartu peringatan modus penipuan ke keluarga/grup WhatsApp.
 * Dilengkapi sensor otomatis (Anonymizer) untuk menjaga privasi dan kepatuhan etika hukum.
 */

const AlertGenerator = (() => {
  // Preset Modus Populer
  const PRESET_MODUS = {
    apk_kurir: {
      title: 'Surat Undangan / Resi Paket Format .APK',
      target: 'Pengguna WhatsApp & Ponsel Android',
      redFlags: [
        'Pengirim tidak dikenal mengirim file berakhiran ".apk"',
        'Mengaku sebagai kurir J&T, undangan pernikahan teman, atau surat tilang ETLE',
        'Meminta izin akses SMS dan notifikasi saat diinstal'
      ],
      defenses: [
        'JANGAN PERNAH menginstal file berekstensi .apk dari chat WhatsApp',
        'Kurir asli memberi resi teks untuk dicek di web resmi, bukan kirim aplikasi',
        'Jika terlanjur klik: langsung nyalakan Mode Pesawat (Airplane Mode)!'
      ]
    },
    loker_deposit: {
      title: 'Loker Like Video YouTube Berkedok Deposit VIP',
      target: 'Pencari Kerja & Mahasiswa',
      redFlags: [
        'Ditawari gaji puluhan ribu hanya untuk like video YouTube/TikTok',
        'Awalnya ditransfer uang kecil agar korban percaya',
        'Diwajibkan deposit uang ratusan ribu hingga jutaan rupiah untuk "misi VIP"'
      ],
      defenses: [
        'Pekerjaan resmi TIDAK PERNAH meminta pelamar deposit uang',
        'Uang deposit yang disetor dipastikan hilang dan tidak akan pernah cair',
        'Tolak tawaran kerja freelance yang tidak masuk akal'
      ]
    },
    giveaway_dana: {
      title: 'Hadiah Saldo DANA Kaget / Undian Palsu',
      target: 'Remaja & Pengguna Dompet Digital',
      redFlags: [
        'Menerima DM mengaku menang undian jutaan rupiah padahal tidak mendaftar',
        'Mengarahkan ke web tiruan (bukan domain .dana.id atau .shopee.co.id)',
        'Meminta memasukkan nomor HP, PIN akun, atau kode OTP'
      ],
      defenses: [
        'Undian resmi selalu diumumkan di dalam aplikasi resmi berekstensi verified',
        'PIN dan OTP adalah rahasia pribadi, jangan pernah diketik di formulir web',
        'Jangan tergiur hadiah tanpa verifikasi sumber'
      ]
    },
    pinjol_ilegal: {
      title: 'Pinjaman Online Ilegal Cepat Cair Bunga 0%',
      target: 'Masyarakat yang Membutuhkan Dana Mendesak',
      redFlags: [
        'Ditawari pinjaman lewat SMS/WA tanpa syarat BI Checking',
        'Aplikasi meminta izin sadap seluruh kontak HP, foto, dan lokasi',
        'Bunga melonjak drastis dan menggunakan teror ancaman sebar data'
      ],
      defenses: [
        'Pinjol legal berizin OJK HANYA boleh mengakses Kamera, Mikrofon, dan Lokasi (CAMILAN)',
        'Cek legalitas pinjol di WhatsApp resmi OJK di nomor 081-157-157-157',
        'Hanya pinjam di platform terdaftar dan sesuai kemampuan bayar'
      ]
    }
  };

  // Sensor Otomatis Data Pribadi (Nomor Telepon, Nama)
  function anonymizeText(text) {
    if (!text) return '';
    // Sensor nomor telepon (+62 812-3456-7890 -> +62 812-XXXX-7890)
    let sanitized = text.replace(/(\+?62|0)8(\d{2})[-.\s]?(\d{4})[-.\s]?(\d{3,4})/g, (match, p1, p2, p3, p4) => {
      return `${p1}8${p2}-XXXX-${p4}`;
    });

    // Sensor nomor rekening (10-16 digit angka -> 1234-XXXX-5678)
    sanitized = sanitized.replace(/\b(\d{4})\d{4,8}(\d{4})\b/g, '$1-XXXX-$2');

    return sanitized;
  }

  // Format teks siap broadcast ke WhatsApp
  function formatWhatsAppBroadcast(cardData) {
    const title = cardData.title.toUpperCase();
    const flags = cardData.redFlags.map(f => `❌ ${f}`).join('\n');
    const defenses = cardData.defenses.map(d => `✅ ${d}`).join('\n');

    return `🚨 *PERINGATAN WASPADA SIBER: ${title}* 🚨\n\n` +
      `Teman-teman dan keluarga, mohon waspadai modus kejahatan siber yang sedang marak:\n\n` +
      `⚠️ *TANDA BAHAYA (RED FLAGS):*\n${flags}\n\n` +
      `🛡️ *CARA MELINDUNGI DIRI:*\n${defenses}\n\n` +
      `Sebarkan pesan ini ke grup keluarga dan kerabat agar tidak ada yang menjadi korban. Bersama menjadi Guardian Ruang Digital! 🛡️🇮🇩`;
  }

  return {
    PRESET_MODUS,
    anonymizeText,
    formatWhatsAppBroadcast
  };
})();
