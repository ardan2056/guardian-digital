/**
 * Guardian Ruang Digital - Heuristic Scanner Engine
 * Analisis pesan, tautan (URL), dan nomor telepon/rekening berbasis aturan (client-side heuristic).
 * 100% aman untuk privasi: Analisis berjalan murni di peramban pengguna.
 */

const ScannerEngine = (() => {
  // Database Kamus Kata Kunci Berbahaya Indonesia & Pola Manipulasi
  const RULE_SETS = [
    {
      id: 'malware_apk',
      category: 'Malware & File Berbahaya (.APK)',
      level: 'danger',
      weight: 40,
      regex: /(\.apk|\.exe|\.scr|\.bat|\.vbs|unduh\s+aplikasi|file\s+resi\s+paket|surat\s+undangan(\s+pernikahan)?\.apk|surat\s+tilang(\s+etle)?\.apk|foto_paket\.apk|surat_panggilan\.apk)/gi,
      reason: 'Modus pengiriman malware Android (.APK) berkedok foto paket, surat undangan, atau surat tilang. Membuka file ini akan menyedot SMS dan OTP perbankan!',
      advice: 'JANGAN PERNAH mengklik atau menginstal file berekstensi .apk dari pengirim yang tidak dikenal!'
    },
    {
      id: 'sensitive_credentials',
      category: 'Pencurian Data Sensitif & OTP',
      level: 'danger',
      weight: 35,
      regex: /(kode\s+otp|otp\s+anda|6\s+digit|kirimkan\s+kode|pin\s+atm|password|kata\s+sandi|foto\s+ktp|selfie\s+ktp|kartu\s+keluarga|cvv|3\s+angka\s+di\s+belakang|token\s+rahasia)/gi,
      reason: 'Pihak resmi TIDAK PERNAH meminta kode OTP, PIN, atau password akun Anda dengan alasan apapun!',
      advice: 'Tolak dengan tegas. Kode OTP adalah kunci digital rahasia yang tidak boleh dibagikan kepada siapapun, termasuk yang mengaku pihak bank.'
    },
    {
      id: 'urgency_manipulation',
      category: 'Tekanan Waktu & Urgensi Palsu',
      level: 'warning',
      weight: 20,
      regex: /(segera|dalam\s+10\s+menit|dalam\s+5\s+menit|akun\s+akan\s+diblokir|terblokir|tenggat\s+waktu|hari\s+ini\s+terakhir|jangan\s+sampai\s+hangus|sebelum\s+terlambat|peringatan\s+terakhir|kena\s+denda)/gi,
      reason: 'Teknik psikologis (manipulasi kepanikan) agar korban terburu-buru bertindak tanpa berpikir logis atau melakukan verifikasi.',
      advice: 'Tarik napas dan tenangkan diri. Jangan terburu-buru menuruti perintah yang memaksa.'
    },
    {
      id: 'job_scam',
      category: 'Loker Palsu & Tugas Berbayar (Deposit Trap)',
      level: 'danger',
      weight: 30,
      regex: /(like\s+video|tonton\s+youtube|subscibe\s+dibayar|komisi\s+harian|gaji\s+(300|500|1|2)\s*(ribu|jt|juta)|tugas\s+paruh\s+waktu|deposit\s+(awal|vip)|isi\s+ulang\s+saldo|pekerjaan\s+online\s+mudah|cukup\s+hp)/gi,
      reason: 'Modus rekrutmen palsu "like & subscribe video". Awalnya diberikan uang kecil untuk memancing kepercayaan, lalu korban dipaksa deposit jutaan rupiah yang tidak bisa ditarik.',
      advice: 'Pekerjaan resmi tidak pernah meminta pelamar menyetorkan uang atau deposit sebagai syarat komisi.'
    },
    {
      id: 'lottery_giveaway',
      category: 'Giveaway & Undian Palsu',
      level: 'warning',
      weight: 25,
      regex: /(selamat\s+anda\s+memenangkan|pemenang\s+undian|hadiah\s+uang\s+tunai|giveaway\s+(shopee|bca|bri|dana)|klaim\s+saldo\s+dana|dana\s+kaget|gratis\s+tanpa\s+diundi|pesta\s+hadiah|biaya\s+administrasi|ongkir\s+hadiah)/gi,
      reason: 'Modus hadiah palsu. Biasanya korban diminta membayar "biaya administrasi / pajak pemenang" atau diarahkan mengisi link phishing.',
      advice: 'Jika Anda tidak pernah mendaftar undian resmi, Anda TIDAK MUNGKIN menang. Hadiah resmi tidak meminta biaya ditransfer terlebih dahulu.'
    },
    {
      id: 'impersonation_authority',
      category: 'Penyamaran Pihak Resmi / Bank',
      level: 'warning',
      weight: 20,
      regex: /(bank\s+bca|bank\s+bri|bank\s+mandiri|bank\s+bni|customer\s+service\s+(bca|bri|mandiri|dana|shopee|gopay)|kurir\s+(j&t|jne|sicepat)|bareskrim|polda|kejaksaan|ojk|kemenkeu|bea\s+cukai)/gi,
      reason: 'Menyebut nama instansi perbankan atau aparat untuk menimbulkan kesan formalitas yang menakutkan atau meyakinkan.',
      advice: 'Cek kanal komunikasi resmi perusahaan. Bank resmi tidak menggunakan nomor WhatsApp reguler atau email gratisan seperti Gmail/Yahoo.'
    },
    {
      id: 'unrealistic_loans',
      category: 'Pinjaman Online Ilegal / Investasi Kilat',
      level: 'warning',
      weight: 25,
      regex: /(pinjaman\s+online\s+tanpa\s+syarat|bunga\s+0%|cair\s+5\s+menit|tanpa\s+bi\s+checking|investasi\s+titip\s+dana|profit\s+pasti|jaminan\s+untung\s+100%|trading\s+auto\s+cuan)/gi,
      reason: 'Ciri utama pinjol ilegal dan skema ponzi/investasi bodong. Menggunakan janji manis tanpa risiko logis.',
      advice: 'Cek legalitas entitas di OJK melalui WhatsApp resmi OJK di 081-157-157-157.'
    }
  ];

  // Database TLD Berisiko & Pemendek URL
  const SUSPICIOUS_TLDS = ['.xyz', '.top', '.site', '.click', '.icu', '.vip', '.club', '.buzz', '.rest', '.live', '.cfd', '.quest', '.shop', '.tk', '.ml', '.ga', '.cf', '.gq'];
  const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 's.id', 'linktr.ee', 'cutt.ly', 'is.gd', 't.co', 'rb.gy', 'shope.ee', 'tokopedia.link'];
  const TARGET_BRAND_SPOOFS = ['bca', 'bri', 'mandiri', 'bni', 'dana', 'shopee', 'tokopedia', 'gopay', 'ovo', 'pajak', 'tilang'];

  // Deteksi tipe input otomatis
  function detectInputType(rawText) {
    const trimmed = rawText.trim();
    if (!trimmed) return 'empty';
    
    // Periksa apakah murni URL
    const urlPattern = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    if (urlPattern.test(trimmed)) {
      return 'url';
    }

    // Periksa nomor rekening (angka murni 9-16 digit yang bukan awalan nomor HP 08)
    if (/^\d{9,16}$/.test(trimmed) && !trimmed.startsWith('08')) {
      return 'account';
    }

    // Periksa apakah nomor telepon internasional atau lokal murni
    const phonePattern = /^(\+?\d{1,4}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}$/;
    if (phonePattern.test(trimmed) && trimmed.replace(/\D/g, '').length >= 8 && trimmed.replace(/\D/g, '').length <= 16) {
      return 'phone';
    }

    return 'message';
  }

  // Ekstraksi seluruh link dari sebuah teks
  function extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:xyz|top|site|click|icu|vip|club|buzz|rest|live|cfd|quest|shop|tk|ml|ga|cf|gq)[^\s]*)/gi;
    const matches = text.match(urlRegex) || [];
    return [...new Set(matches)];
  }

  // Analisis mendalam satu URL
  function analyzeUrl(urlStr) {
    let normalized = urlStr.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = 'https://' + normalized;
    }

    let urlObj;
    try {
      urlObj = new URL(normalized);
    } catch (e) {
      return {
        original: urlStr,
        isValid: false,
        reasons: ['Format URL tidak valid atau rusak']
      };
    }

    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const reasons = [];
    let riskScore = 0;
    let isShortener = false;
    let isDirectIP = false;
    let hasDangerousExt = false;
    let hasBrandSpoof = false;
    let isRiskyTLD = false;

    // 1. Cek Protokol HTTP tanpa enkripsi SSL
    if (urlObj.protocol === 'http:') {
      reasons.push('Menggunakan HTTP tanpa enkripsi (tidak aman untuk transfer data).');
      riskScore += 15;
    }

    // 2. Cek apakah Hostname adalah Direct IP Address (misal: 192.168.1.1)
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      isDirectIP = true;
      reasons.push('Tautan mengarah langsung ke alamat IP numerik, bukan nama domain resmi.');
      riskScore += 35;
    }

    // 3. Cek Pemendek URL (Shortener)
    if (URL_SHORTENERS.some(s => hostname.includes(s))) {
      isShortener = true;
      reasons.push('Menggunakan pemendek tautan (URL Shortener) yang menyembunyikan alamat website tujuan aslinya.');
      riskScore += 25;
    }

    // 4. Cek TLD Berisiko Tinggi
    if (SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld))) {
      isRiskyTLD = true;
      reasons.push(`Menggunakan ekstensi domain murah/gratisan (${hostname.slice(hostname.lastIndexOf('.'))}) yang sangat lazim digunakan sindikat kejahatan siber.`);
      riskScore += 30;
    }

    // 5. Cek Typosquatting / Peniruan Merek Indonesia
    TARGET_BRAND_SPOOFS.forEach(brand => {
      if (hostname.includes(brand)) {
        // Cek apakah domain resmi yang sah
        const isOfficial = (brand === 'bca' && (hostname.endsWith('.bca.co.id') || hostname === 'bca.co.id' || hostname === 'klikbca.com')) ||
                           (brand === 'bri' && (hostname.endsWith('.bri.co.id') || hostname === 'bri.co.id')) ||
                           (brand === 'mandiri' && (hostname.endsWith('.bankmandiri.co.id') || hostname === 'bankmandiri.co.id')) ||
                           (brand === 'bni' && (hostname.endsWith('.bni.co.id') || hostname === 'bni.co.id')) ||
                           (brand === 'dana' && (hostname.endsWith('.dana.id') || hostname === 'dana.id')) ||
                           (brand === 'shopee' && (hostname.endsWith('.shopee.co.id') || hostname === 'shopee.co.id' || hostname.endsWith('.shopee.id'))) ||
                           (brand === 'tokopedia' && (hostname.endsWith('.tokopedia.com') || hostname === 'tokopedia.com'));
        if (!isOfficial) {
          hasBrandSpoof = true;
          reasons.push(`Domain memuat nama merek "${brand.toUpperCase()}", tetapi BUKAN domain web resmi instansi tersebut (Indikasi Phishing)!`);
          riskScore += 45;
        }
      }
    });

    // 6. Cek Ekstensi File Berbahaya dalam Path (.apk, .exe)
    if (pathname.endsWith('.apk') || pathname.endsWith('.exe') || pathname.endsWith('.scr') || pathname.endsWith('.zip')) {
      hasDangerousExt = true;
      reasons.push(`Tautan langsung mengunduh file aplikasi yang dieksekusi (${pathname.split('.').pop().toUpperCase()}).`);
      riskScore += 45;
    }

    return {
      original: urlStr,
      protocol: urlObj.protocol,
      hostname: hostname,
      pathname: pathname,
      isValid: true,
      isShortener,
      isDirectIP,
      hasDangerousExt,
      hasBrandSpoof,
      isRiskyTLD,
      riskScore: Math.min(riskScore, 100),
      reasons
    };
  }

  // Analisis Nomor Telepon atau Rekening
  function analyzeNumber(numberStr) {
    const cleaned = numberStr.replace(/[^0-9+]/g, '');
    const findings = [];
    let riskScore = 15;
    let isForeign = false;
    let countryNote = 'Nomor Indonesia (+62 / 08)';

    if (cleaned.startsWith('+')) {
      if (!cleaned.startsWith('+62')) {
        isForeign = true;
        riskScore = 55;
        if (cleaned.startsWith('+234')) countryNote = 'Nomor Nigeria (+234) - Sering dipakai sindikat penipuan asmara/loker internasional';
        else if (cleaned.startsWith('+1')) countryNote = 'Nomor Amerika Serikat/Kanada (+1) - Sering menggunakan VoIP virtual';
        else if (cleaned.startsWith('+44')) countryNote = 'Nomor Inggris Raya (+44)';
        else if (cleaned.startsWith('+91')) countryNote = 'Nomor India (+91)';
        else countryNote = 'Nomor Luar Negeri Bukan Indonesia';
        findings.push(`Nomor terdeteksi dari luar negeri: ${countryNote}. Berhati-hatilah jika orang tersebut mengaku teman atau pihak lokal Indonesia!`);
      }
    } else if (cleaned.startsWith('08')) {
      findings.push('Nomor seluler reguler Indonesia. Pelaku sering berganti kartu prabayar sekali pakai.');
    } else if (/^\d{9,16}$/.test(cleaned)) {
      findings.push('Format angka menyerupai nomor rekening bank / dompet digital.');
    }

    return {
      cleaned,
      isForeign,
      countryNote,
      riskScore,
      findings
    };
  }

  // Analisis Keseluruhan Konten (Pesan + Tautan + Nomor)
  function analyze(inputText) {
    if (!inputText || !inputText.trim()) {
      return null;
    }

    const type = detectInputType(inputText);
    const matchedRules = [];
    let totalScore = 0;
    const extractedUrls = extractUrls(inputText);
    const urlAnalyses = extractedUrls.map(u => analyzeUrl(u));

    // Evaluasi aturan kata kunci
    RULE_SETS.forEach(rule => {
      const matches = inputText.match(rule.regex);
      if (matches && matches.length > 0) {
        const uniqueHits = [...new Set(matches.map(m => m.trim().toLowerCase()))];
        matchedRules.push({
          rule,
          hits: uniqueHits,
          count: matches.length
        });
        totalScore += rule.weight;
      }
    });

    // Tambahkan skor risiko dari analisis URL
    urlAnalyses.forEach(u => {
      if (u.riskScore > 20) {
        totalScore += Math.floor(u.riskScore * 0.7);
      }
    });

    // Normalisasi Skor 0 - 100
    const finalScore = Math.min(Math.max(totalScore, 0), 100);

    // Kategori Keparahan
    let status = 'safe';
    let statusText = 'Pola Wajar / Risiko Rendah';
    let summaryText = 'Tidak ditemukan indikator ancaman umum yang mencolok. Namun tetaplah berhati-hati sebelum membagikan data atau mentransfer dana.';

    if (finalScore >= 60) {
      status = 'danger';
      statusText = 'BAHAYA TINGGI - Terindikasi Kuat Penipuan!';
      summaryText = 'Pesan atau tautan ini mengandung pola red flags yang identik dengan sindikat kejahatan siber (phishing, malware APK, atau rekayasa sosial manipulatif).';
    } else if (finalScore >= 25) {
      status = 'warning';
      statusText = 'WASPADA - Mengandung Pola Mencurigakan';
      summaryText = 'Ditemukan beberapa indikator manipulasi emosional atau format tidak lazim. Lakukan verifikasi ganda sebelum merespons.';
    }

    // Buat HTML dengan Kata-Kata Berbahaya yang Disorot (Highlighted Text)
    let highlightedHtml = escapeHtml(inputText);
    
    // Sort rules by match length descending agar tidak tumpang tindih
    const allMatches = [];
    matchedRules.forEach(item => {
      item.hits.forEach(phrase => {
        allMatches.push({ phrase, level: item.rule.level, category: item.rule.category, reason: item.rule.reason });
      });
    });

    // Tambahkan URL ke daftar highlight
    extractedUrls.forEach(url => {
      allMatches.push({ phrase: url, level: 'link', category: 'Tautan Web', reason: 'Tautan eksternal yang memerlukan verifikasi keaslian domain.' });
    });

    // Sort panjang kata terpanjang duluan
    allMatches.sort((a, b) => b.phrase.length - a.phrase.length);

    allMatches.forEach(item => {
      const escapedPhrase = escapeRegex(item.phrase);
      const reg = new RegExp(`(${escapedPhrase})`, 'gi');
      const cssClass = item.level === 'danger' ? 'hl-danger' : (item.level === 'link' ? 'hl-link' : 'hl-warning');
      highlightedHtml = highlightedHtml.replace(reg, `<mark class="${cssClass}" title="${escapeHtml(item.category)}: ${escapeHtml(item.reason)}">$1</mark>`);
    });

    // Tentukan apakah perlu memicu Panic Bridge (Langkah Cepat Panik)
    const hasApk = matchedRules.some(r => r.rule.id === 'malware_apk') || urlAnalyses.some(u => u.hasDangerousExt);
    const hasOtp = matchedRules.some(r => r.rule.id === 'sensitive_credentials');
    const hasTransfer = matchedRules.some(r => r.rule.id === 'lottery_giveaway' || r.rule.id === 'job_scam' || r.rule.id === 'unrealistic_loans');

    let suggestedPanicScenario = null;
    if (hasApk) suggestedPanicScenario = 'apk';
    else if (hasOtp) suggestedPanicScenario = 'otp';
    else if (hasTransfer) suggestedPanicScenario = 'transfer';

    return {
      type,
      rawText: inputText,
      score: finalScore,
      status,
      statusText,
      summaryText,
      matchedRules,
      urlAnalyses,
      highlightedHtml,
      suggestedPanicScenario
    };
  }

  // Helpers
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return {
    detectInputType,
    analyzeUrl,
    analyzeNumber,
    analyze,
    RULE_SETS
  };
})();
