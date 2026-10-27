/**
 * Guardian Ruang Digital - Interactive Branching Decision Simulator
 * 5 Skenario realistis pemuda Indonesia dengan antarmuka Chat Interaktif (WhatsApp/DM style)
 * Mengedukasi pengambilan keputusan aman dan membongkar teknik rekayasa sosial (social engineering).
 */

const SimulatorEngine = (() => {
  const SCENARIOS = [
    {
      id: 'kurir_apk',
      title: 'Kurir Paket J&T & File .APK',
      category: 'Malware & Ekstensi Berbahaya',
      avatar: '📦',
      contactName: 'Kurir Ekspedisi J&T Express',
      contactSubtitle: '+62 821-9981-XXXX (Tidak Dikenal)',
      difficulty: 'Semua Tingkat',
      description: 'Anda menerima pesan WhatsApp dari nomor asing mengaku kurir yang mengantarkan paket, namun melampirkan file dengan ekstensi mencurigakan.',
      initialMessages: [
        { sender: 'incoming', text: 'Permisi kak, saya kurir J&T. Ada paket atas nama kakak tapi alamat rumahnya kurang jelas / nomor rumah tidak tertera.', time: '14:20' },
        { sender: 'incoming', text: 'Mohon dicek dulu foto paket dan resinya di file ini ya kak supaya bisa saya antar sekarang:', time: '14:21', attachment: { type: 'apk', name: 'Foto_Resi_Paket_J&T.apk', size: '7.8 MB' } }
      ],
      currentStep: 'step_1',
      steps: {
        step_1: {
          prompt: 'Apa yang Anda lakukan saat menerima file dengan ekstensi .APK tersebut?',
          options: [
            {
              text: 'A. Langsung klik dan buka filenya agar paket cepat sampai.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Oke saya klik dan buka sekarang ya mas.',
              scammerReply: 'Baik kak, mohon tunggu sebentar ya sedang proses sinkronisasi sistem...',
              scoreImpact: -40,
              insight: 'BAHAYA FATAL! File berakhiran .APK adalah file instalasi aplikasi Android, bukan gambar (.JPG/.PNG). Membuka file ini akan menginstal spyware yang membaca seluruh SMS perbankan dan menyedot saldo tanpa Anda sadari!'
            },
            {
              text: 'B. Tanya nomor resi tertulisnya dan nama marketplace tempat belanja.',
              nextStep: 'step_2_verify',
              isSafe: true,
              userReply: 'Saya tidak sedang pesan paket via J&T. Boleh tolong sebutkan nomor resinya langsung di teks chat dan siapa pengirimnya?',
              scammerReply: 'Duh kak saya cuma kurir lapangan, buruan dicek di aplikasi itu kak kalau gak mau paketnya diretur ke gudang pusat hari ini!',
              scoreImpact: +25,
              insight: 'KEPUTUSAN TEPAT! Meminta nomor resi teks adalah langkah cerdas. Kurir resmi TIDAK PERNAH mengirim aplikasi .apk. Ciri penipu: langsung membalas dengan ancaman retur agar korban panik.'
            },
            {
              text: 'C. Blokir nomor langsung dan laporkan sebagai spam.',
              nextStep: 'outcome_safe_block',
              isSafe: true,
              userReply: '[Anda tidak membalas, langsung memblokir nomor dan melaporkan spam]',
              scammerReply: null,
              scoreImpact: +35,
              insight: 'PERTANAHAN SEMPURNA! Modus file APK kurir paket adalah salah satu penipuan digital paling merugikan di Indonesia. Mengabaikan dan memblokir nomor asing adalah tindakan terbaik.'
            }
          ]
        },
        step_2_verify: {
          prompt: 'Pengirim mulai menekan Anda dengan ancaman "Paket akan diretur hari ini". Apa tindakan Anda selanjutnya?',
          options: [
            {
              text: 'A. Karena takut diretur, akhirnya saya download aplikasinya.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Aduh jangan diretur mas, saya buka filenya deh.',
              scammerReply: 'Nah gitu kak, setelah dibuka izinkan semua akses SMS dan notifikasi ya...',
              scoreImpact: -35,
              insight: 'JEBAKAN URGENSI! Penipu memanfaatkan rasa takut kehilangan barang (Loss Aversion). Ingat: Kurir resmi selalu bisa mengecek resi di web resmi jtexpress.co.id, bukan kirim file mentah.'
            },
            {
              text: 'B. Tolak tegas: "Kalau kurir resmi, silakan tinggalkan paket di pos satpam atau cek web resmi J&T."',
              nextStep: 'outcome_safe_educate',
              isSafe: true,
              userReply: 'Kurir resmi punya resi di aplikasi e-commerce. Saya cek di akun Shopee/Tokopedia saya tidak ada paket dikirim. Nomor Anda saya laporkan.',
              scammerReply: '[Pelaku menghapus pesannya dan memblokir Anda]',
              scoreImpact: +30,
              insight: 'GUARDIAN TANGGUH! Anda membongkar kebohongan pelaku dengan cross-check riwayat pesanan resmi di marketplace. Pelaku langsung kabur saat tahu korbannya melek digital.'
            }
          ]
        }
      }
    },

    {
      id: 'loker_like',
      title: 'Loker Freelance Like Video YouTube',
      category: 'Social Engineering & Deposit Trap',
      avatar: '💼',
      contactName: 'Recruiter HR Global Media',
      contactSubtitle: '+62 858-1092-XXXX',
      difficulty: 'Menengah',
      description: 'Ditawari pekerjaan paruh waktu mudah: hanya like video YouTube & subscribe, dibayar Rp 30.000 per tugas langsung masuk rekening.',
      initialMessages: [
        { sender: 'incoming', text: 'Halo kak! Kami dari agensi digital partner YouTube & TikTok membuka lowongan part-time online fleksibel dari rumah.', time: '10:15' },
        { sender: 'incoming', text: 'Tugasnya sangat mudah, hanya memberi LIKE pada 3 video YouTube. Komisi Rp 30.000 per tugas. Apakah kakak berminat mencoba tugas pertama secara gratis?', time: '10:16' }
      ],
      currentStep: 'step_1',
      steps: {
        step_1: {
          prompt: 'Tawaran kerja seperti ini tampak menarik dan mudah. Apa respon awal Anda?',
          options: [
            {
              text: 'A. Boleh dicoba, kan belum keluar uang sama sekali.',
              nextStep: 'step_2_bait',
              isSafe: false,
              userReply: 'Boleh kak, saya coba tugas pertamanya gimana caranya?',
              scammerReply: 'Keren! Ini link video YouTube: [link]. Silakan like dan kirim bukti screenshot + nomor rekening/DANA kakak untuk pencairan komisi pertama!',
              scoreImpact: -15,
              insight: 'WASPADA UMPAN! Ini adalah taktik "Foot-in-the-Door". Penipu memang akan benar-benar mentransfer uang kecil (Rp 30.000) di awal untuk membangun rasa percaya palsu sebelum menjebak Anda dalam deposit jutaan rupiah.'
            },
            {
              text: 'B. Tanyakan legalitas perusahaan dan tolak tawaran pekerjaan tak masuk akal ini.',
              nextStep: 'outcome_safe_block',
              isSafe: true,
              userReply: 'Terima kasih, tapi perusahaan resmi tidak merekrut melalui pesan WhatsApp acak dengan skema like video.',
              scammerReply: '[Pengirim langsung mengabaikan Anda]',
              scoreImpact: +30,
              insight: 'SANGAT CERDAS! Tidak ada perusahaan periklanan resmi yang membayar puluhan ribu rupiah hanya untuk satu klik like. Model bisnis ini tidak ada di industri nyata; ini 100% skema penipuan tugas berbayar (Task Scam).'
            }
          ]
        },
        step_2_bait: {
          prompt: 'Anda menyelesaikan like video dan pelaku benar-benar mengirim Rp 30.000 ke e-wallet Anda! Lalu pelaku berkata:',
          options: [
            {
              text: 'A. Mengikuti tugas VIP deposit Rp 200.000 karena terbukti transfer Rp 30.000 tadi cair.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Wah beneran masuk ya! Oke saya mau gabung grup VIP dan transfer deposit Rp 200.000 sekarang.',
              scammerReply: 'Pilihan tepat! Setelah transfer Rp 200rb, uang kakak akan berkembang jadi Rp 500rb dalam 30 menit...',
              scoreImpact: -45,
              insight: 'TERJEBAK SKEMA PONZI TUGAS! Begitu Anda menyetor Rp 200.000, penipu akan menahan uang Anda dengan alasan "sistem error" dan memaksa Anda deposit lagi Rp 1.000.000 hingga puluhan juta rupiah. Uang tersebut tidak akan pernah bisa ditarik!'
            },
            {
              text: 'B. Sadar ini modus pancingan, ambil uang Rp 30.000 lalu segera blokir kontak penipu.',
              nextStep: 'outcome_safe_educate',
              isSafe: true,
              userReply: 'Saya tidak bersedia melakukan deposit uang apapun untuk bekerja. Stop hubungi saya.',
              scammerReply: '[Penipu mulai marah dan mengancam akan membekukan rekening Anda]',
              scoreImpact: +35,
              insight: 'KEPUTUSAN KRUSIAL! Begitu syarat "deposit uang" muncul, rumus mutlaknya adalah: PEKERJAAN ASLI MEMBERI GAJI, BUKAN MEMINTA PELAMAR DEPOSIT UANG.'
            }
          ]
        }
      }
    },

    {
      id: 'teman_pinjam',
      title: 'Teman Akrab Pinjam Uang (Nomor Baru)',
      category: 'Impersonasi & Rekayasa Sosial',
      avatar: '👤',
      contactName: 'Dimas Teman SMA',
      contactSubtitle: '+62 813-8820-XXXX (Foto Profil Teman Anda)',
      difficulty: 'Tinggi',
      description: 'Pesan dari nomor tak dikenal yang menggunakan foto profil sahabat Anda, mengaku ponselnya rusak dan butuh pinjaman darurat.',
      initialMessages: [
        { sender: 'incoming', text: 'Bro! Ini gue Dimas. HP gue yang lama layarnya pecah mati total, ini nomor sementara gue.', time: '21:10' },
        { sender: 'incoming', text: 'Gue lagi di klinik darurat nih mau bayar obat adik gue tapi m-banking di nomor baru belum aktif. Boleh pinjam transfer 200rb dulu gak bro? Besok pagi jam 8 langsung gue ganti pas ke ATM.', time: '21:11' }
      ],
      currentStep: 'step_1',
      steps: {
        step_1: {
          prompt: 'Pesan ini menggunakan foto profil teman dekat Anda dan bernada darurat. Apa yang harus Anda lakukan?',
          options: [
            {
              text: 'A. Langsung transfer 200rb ke nomor rekening yang dikirim karena kasihan dan nominalnya kecil.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Aduh parah banget, ya udah sini nomor rekeningnya gue transfer sekarang.',
              scammerReply: 'Makasih banget bro lo sahabat sejati! Transfer ke Bank Jago no: 1029384729 a.n Rian ya bro itu rekening apoteknya.',
              scoreImpact: -35,
              insight: 'TERKENA IMPERSONASI! Penipu mengambil foto profil teman Anda dari media sosial (Instagram/Facebook) lalu menyamar. Nama rekening yang dikirim bukan nama teman Anda melainkan rekening penampung penipu!'
            },
            {
              text: 'B. Telepon langsung nomor tersebut (Voice Call) atau video call untuk membuktikan wajahnya.',
              nextStep: 'step_2_call',
              isSafe: true,
              userReply: 'Bentar Dim, gue telepon biasa sekarang ya mau make sure.',
              scammerReply: 'Jangan ditelepon bro sinyal di dalem klinik jelek banget gak bisa angkat telpon, chat aja buruan penting banget ini...',
              scoreImpact: +30,
              insight: 'LANGKAH EMAS! Penipu penyamaran SELALU menolak panggilan telepon atau video call dengan berbagai alasan klise (sinyal jelek, lagi ramai, mic rusak).'
            },
            {
              text: 'C. Tanyakan pertanyaan jebakan yang hanya diketahui oleh Anda dan Dimas asli.',
              nextStep: 'step_2_trick',
              isSafe: true,
              userReply: 'Eh Dim, motor lo yang kemarin mogok di bengkel Pak Joko udah beres belum?',
              scammerReply: 'Udah beres kok bro aman, nah makanya tolongin transfer dulu bro...',
              scoreImpact: +35,
              insight: 'TRIK JENIUS! Jika Dimas tidak pernah punya motor atau tidak kenal Pak Joko, dan pelaku menjawab "udah beres", Anda 100% yakin lawan bicara Anda adalah bot atau penipu!'
            }
          ]
        },
        step_2_call: {
          prompt: 'Pelaku menolak ditelepon dengan alasan sinyal buruk di klinik dan terus memohon transfer cepat. Langkah Anda:',
          options: [
            {
              text: 'A. Hubungi nomor Dimas yang asli atau hubungi teman satu lingkaran untuk klarifikasi.',
              nextStep: 'outcome_safe_educate',
              isSafe: true,
              userReply: '[Anda menelepon nomor Dimas yang tersimpan di kontak HP Anda]',
              scammerReply: null,
              scoreImpact: +30,
              insight: 'VERIFIKASI DUA ARAH (Out-of-band verification) berhasil! Saat ditelepon, Dimas asli menjawab dari rumahnya dan bingung karena HP-nya tidak rusak sama sekali. Anda baru saja menggagalkan upaya pencurian uang!'
            },
            {
              text: 'B. Minta maaf dan langsung transfer karena takut benar-benar kondisi darurat.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Oh ya udah deh kalau gak bisa ditelepon, gue transfer ya.',
              scammerReply: 'Siap bro ditunggu buktinya sekarang!',
              scoreImpact: -30,
              insight: 'EMPATI YANG DIEKSPLOITASI. Sindikat penipu sengaja memanfaatkan rasa kepedulian antar teman. Selalu pegang prinsip: Tidak ada transfer ke nomor baru tanpa konfirmasi suara langsung!'
            }
          ]
        },
        step_2_trick: {
          prompt: 'Pelaku terjebak pertanyaan pura-pura Anda. Bagaimana respon penutup Anda?',
          options: [
            {
              text: 'A. "Haha ketahuan lu penipu ya! Dimas aslinya gak punya motor. Nomor lu gue laporin ke Kominfo."',
              nextStep: 'outcome_safe_educate',
              isSafe: true,
              userReply: 'Haha ketahuan ya! Dimas aslinya gak pernah punya motor. Foto profil curian lu udah gue screenshot dan laporin ke Patroli Siber!',
              scammerReply: '[Pengguna langsung menghapus akun dan menghilang]',
              scoreImpact: +25,
              insight: 'GUARDIAN LEVEL MAKSIMAL! Anda berhasil membuktikan bahwa kewaspadaan kritis dan akal sehat adalah senjata terkuat melawan penipuan siber.'
            }
          ]
        }
      }
    },

    {
      id: 'giveaway_dana',
      title: 'Giveaway Saldo DANA & Undian Shopee',
      category: 'Phishing & Pencurian Kredensial',
      avatar: '🎁',
      contactName: 'Akun Promo Hadiah Shopee ID',
      contactSubtitle: '@shopee_pesta_kejutan (Akun Baru)',
      difficulty: 'Pemula',
      description: 'Menerima pesan Instagram bahwa Anda memenangkan undian Rp 5.000.000 dari event tahunan Shopee/DANA.',
      initialMessages: [
        { sender: 'incoming', text: 'SELAMAT! Akun kakak terpilih sebagai pemenang ke-2 Gebyar Promo Shopee 2026 berhadiah uang tunai Rp 5.000.000 bebas pajak!', time: '16:00' },
        { sender: 'incoming', text: 'Untuk pencairan hadiah ke akun DANA/ShopeePay kakak, silakan klaim melalui formulir verifikasi resmi panitia: http://shopee-pesta-hadiah.site/claim-dana', time: '16:01' }
      ],
      currentStep: 'step_1',
      steps: {
        step_1: {
          prompt: 'Perhatikan pesan dan tautan di atas. Apa kejanggalan utama yang Anda temukan?',
          options: [
            {
              text: 'A. Domain website menggunakan akhiran .site dan bukan shopee.co.id resmi.',
              nextStep: 'step_2_link_check',
              isSafe: true,
              userReply: 'Domain link Anda menggunakan .site dan bukan domain resmi Shopee (shopee.co.id). Ini situs phishing kan?',
              scammerReply: 'Itu server alternatif promosi khusus kak agar server utama tidak down. Dijamin resmi 100% diawasi OJK.',
              scoreImpact: +30,
              insight: 'ANALISIS URL SEMPURNA! Penipu sering memakai domain tiruan murah (.site, .xyz, .top) dan mengklaim "server alternatif". Pihak Shopee/DANA resmi TIDAK PERNAH memakai domain pihak ketiga.'
            },
            {
              text: 'B. Segera klik linknya mumpung hadiah Rp 5 juta belum kedaluwarsa.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Wah beneran menang Rp 5 juta? Saya klik linknya sekarang ya kak.',
              scammerReply: 'Silakan isi formulirnya kak, masukkan nomor HP dan PIN DANA kakak untuk otentikasi pencairan saldo...',
              scoreImpact: -45,
              insight: 'PHISHING TRAP! Di web palsu tersebut Anda akan diminta memasukkan PIN atau kode OTP. Begitu Anda ketik, saldo akun e-wallet Anda yang asli langsung dikuras habis oleh penipu!'
            }
          ]
        },
        step_2_link_check: {
          prompt: 'Pelaku bersikeras bahwa link tersebut aman dan resmi diawasi OJK. Tindakan Anda:',
          options: [
            {
              text: 'A. Cek akun Instagram resmi Shopee (@shopee_id centang biru) untuk konfirmasi ada undian atau tidak.',
              nextStep: 'outcome_safe_educate',
              isSafe: true,
              userReply: 'Shopee resmi hanya mengumumkan pemenang di aplikasi resmi atau akun bercentang biru @shopee_id. Modus Anda sudah basi.',
              scammerReply: '[Akun penipu langsung memblokir Anda]',
              scoreImpact: +30,
              insight: 'GOLDEN RULE: Semua pengumuman pemenang resmi dari e-commerce selalu diumumkan DI DALAM aplikasi resmi, bukan lewat DM akun kloningan tanpa centang biru.'
            },
            {
              text: 'B. Mengisi formulir tapi dengan data acak / palsu.',
              nextStep: 'outcome_safe_block',
              isSafe: true,
              userReply: '[Anda tidak membuka link, melaporkan akun Instagram tersebut]',
              scammerReply: null,
              scoreImpact: +25,
              insight: 'BIJAKSANA. Jangan pernah membuka link mencurigakan meskipun hanya ingin iseng, karena tautan bisa saja memuat skrip pelacak (IP tracker) atau unduhan otomatis berbahaya.'
            }
          ]
        }
      }
    },

    {
      id: 'investasi_kilat',
      title: 'Investasi Saham/Kripto Cuan 50% Seminggu',
      category: 'Finansial & Pinjol Ilegal',
      avatar: '📈',
      contactName: 'Mentor Trading Profit Konsisten',
      contactSubtitle: 'Admin Komunitas VIP Cuan',
      difficulty: 'Menengah',
      description: 'Diajak masuk grup Telegram investasi dengan janji titip dana modal 500rb jadi 5jt dalam 3 hari dengan jaminan anti-rugi.',
      initialMessages: [
        { sender: 'incoming', text: 'Halo bro! Mau penghasilan pasif modal kecil? Di platform trading automated AI kita, titip dana Rp 500.000 dijamin untung Rp 2.500.000 dalam 3 hari.', time: '13:00' },
        { sender: 'incoming', text: 'Ini screenshot member-member grup yang udah sukses wd puluhan juta hari ini. Kami legal dan berizin Bappebti & OJK.', time: '13:01' }
      ],
      currentStep: 'step_1',
      steps: {
        step_1: {
          prompt: 'Investasi ini menjanjikan keuntungan 500% dalam 3 hari dan mengklaim diawasi OJK. Bagaimana pertimbangan Anda?',
          options: [
            {
              text: 'A. Cek daftar legalitas entitas investasi di situs resmi OJK atau WhatsApp OJK 157.',
              nextStep: 'outcome_safe_educate',
              isSafe: true,
              userReply: 'Saya mau cek nama perusahaannya di Kontak OJK 157 (WhatsApp 081157157157) dulu ya.',
              scammerReply: 'Ngapain repot kak, kami legal kok kalau gak percaya nanti nyesel loh slot titip dananya sisa 2 orang lagi!',
              scoreImpact: +35,
              insight: 'PRINSIP 2L OJK (LEGAL & LOGIS)! Investasi yang menjanjikan keuntungan pasti tanpa risiko adalah ciri khas investasi bodong skema Ponzi. Tidak ada instrumen investasi legal di dunia yang bisa menjamin return 500% dalam hitungan hari.'
            },
            {
              text: 'B. Langsung transfer Rp 500.000 untuk coba-coba karena uang dingin.',
              nextStep: 'outcome_trap',
              isSafe: false,
              userReply: 'Oke deh kak saya coba modal awal Rp 500.000 dulu ya.',
              scammerReply: 'Mantap! Silakan transfer ke rekening bendahara kami. Nanti akun trading Anda akan kami buatkan...',
              scoreImpact: -40,
              insight: 'TITIP DANA BODONG! Saldo di aplikasi trading palsu mereka memang akan dibuat seolah-olah bertambah miliaran rupiah. Namun saat Anda mau menarik uang (Withdraw), Anda akan diminta biaya pajak fiktif 20%, biaya admin, dll hingga uang Anda habis terkuras.'
            }
          ]
        }
      }
    }
  ];

  return {
    SCENARIOS
  };
})();
