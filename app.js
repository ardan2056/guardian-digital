/**
 * Guardian Ruang Digital - Master Application Controller
 * Mengatur routing navigasi tampilan, web audio synthesizer, state local storage,
 * integrasi antar-modul, serta feedback interaktif.
 */

// Sound Synthesizer Engine (Web Audio API - 100% Client-side, Tanpa Ketergantungan File Eksternal)
const SoundFX = (() => {
  let audioCtx = null;
  let isMuted = false;

  function initCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  function play(type) {
    if (isMuted) return;
    try {
      initCtx();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'danger') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'safe' || type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'scan') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      // Audio fallback jika browser memblokir autoplay
    }
  }

  return { play, toggleMute, isMuted: () => isMuted };
})();

// Main App State & Controller
const App = (() => {
  let currentView = 'scanner';
  let activePanicScenario = 'otp';
  let activeSimScenarioId = 'kurir_apk';
  let simDifficulty = 'guided'; // 'guided' | 'pro'
  let simState = {};

  // Sample Scenarios untuk Pengujian Instan oleh Juri / Pengguna
  const DEMO_SAMPLES = {
    apk_tilang: 'Selamat siang Bapak/Ibu. Kami dari Ditlantas Polri menginformasikan bahwa kendaraan Anda tercatat melakukan pelanggaran lalu lintas kamera ETLE. Surat tilang dan foto bukti pelanggaran terlampir di file berikut, mohon segera dikonfirmasi dalam 1x24 jam sebelum STNK diblokir: Surat_Tilang_ETLE_Resmi.apk',
    loker_like: 'Halo kak! Mau penghasilan sampingan 300rb - 1jt per hari? Tugas sangat gampang cukup like video YouTube dan follow akun. Gaji langsung cair harian! Silakan coba tugas pertama dan deposit VIP 50rb untuk cairkan bonus pendaftaran.',
    phishing_bca: 'Yth Nasabah Bank BCA, akun BCA Mobile Anda terdeteksi login di perangkat tidak dikenal. Segera verifikasi akun Anda dalam 10 menit agar tidak terblokir permanen melalui tautan resmi CS: https://bca-klik-verifikasi.xyz/login-auth',
    giveaway_dana: 'SELAMAT! Nomor Anda terpilih mendapatkan Hadiah Saldo DANA Kaget Rp 2.500.000 dari Gebyar Promo DANA 2026. Klaim sekarang tanpa diundi di link: http://dana-kaget-claim.site/saldo-gratis',
    nomor_asing: '+234 803 129 4819'
  };

  function init() {
    setupNavigation();
    setupSoundToggle();
    setupScanner();
    setupPanicView();
    setupSimulator();
    setupAlertGenerator();
    setupCheckupView();
    setupResourcesView();
    updateGuardianProfile();

    // Jalankan scan otomatis pada sampel pertama agar juri langsung melihat keajaiban fitur
    const inputEl = document.getElementById('smart-input');
    if (inputEl && !inputEl.value) {
      inputEl.value = DEMO_SAMPLES.apk_tilang;
      runScan();
    }
  }

  // Navigasi Antar Tab View
  function setupNavigation() {
    const navButtons = document.querySelectorAll('[data-view]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-view');
        switchView(targetView);
        SoundFX.play('click');
      });
    });
  }

  function switchView(viewName) {
    currentView = viewName;

    // Update active class pada navigasi desktop & mobile
    document.querySelectorAll('[data-view]').forEach(b => {
      if (b.getAttribute('data-view') === viewName) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Update tampilan konten
    document.querySelectorAll('.view-section').forEach(sec => {
      if (sec.id === `view-${viewName}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateGuardianProfile();
  }

  // Toggle Suara UI
  function setupSoundToggle() {
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      const isMuted = SoundFX.toggleMute();
      soundBtn.title = isMuted ? 'Nyalakan Efek Suara' : 'Matikan Efek Suara';
      soundBtn.innerHTML = isMuted ? `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      ` : `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      `;
      showToast(isMuted ? 'Efek suara dimatikan' : 'Efek suara aktif', 'info');
      if (!isMuted) SoundFX.play('click');
    });
  }

  // ==========================================
  // FITUR 1: SCAN CENTER (DETEKSI & ANALISIS)
  // ==========================================
  function setupScanner() {
    const inputEl = document.getElementById('smart-input');
    const btnScan = document.getElementById('btn-run-scan');
    const btnClear = document.getElementById('btn-clear-scan');
    const badgeType = document.getElementById('detected-type-badge');

    if (!inputEl) return;

    // Deteksi tipe input secara real-time
    inputEl.addEventListener('input', () => {
      const val = inputEl.value;
      const type = ScannerEngine.detectInputType(val);
      if (type === 'url') {
        badgeType.className = 'type-detector-badge url';
        badgeType.textContent = '🔗 Tautan Web (URL)';
      } else if (type === 'phone') {
        badgeType.className = 'type-detector-badge phone';
        badgeType.textContent = '📞 Nomor Telepon';
      } else if (type === 'account') {
        badgeType.className = 'type-detector-badge phone';
        badgeType.textContent = '💳 Nomor Rekening Bank';
      } else if (type === 'message') {
        badgeType.className = 'type-detector-badge message';
        badgeType.textContent = '💬 Pesan / Teks Percakapan';
      } else {
        badgeType.className = 'type-detector-badge';
        badgeType.textContent = '🔍 Deteksi Otomatis';
      }
    });

    btnScan.addEventListener('click', () => {
      SoundFX.play('scan');
      runScan();
    });

    btnClear.addEventListener('click', () => {
      inputEl.value = '';
      badgeType.className = 'type-detector-badge';
      badgeType.textContent = '🔍 Deteksi Otomatis';
      document.getElementById('scan-results').classList.remove('active');
      SoundFX.play('click');
    });

    // Sampel Demo Sekali Klik
    document.querySelectorAll('.sample-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleKey = chip.getAttribute('data-sample');
        if (DEMO_SAMPLES[sampleKey]) {
          inputEl.value = DEMO_SAMPLES[sampleKey];
          inputEl.dispatchEvent(new Event('input'));
          SoundFX.play('click');
          runScan();
        }
      });
    });
  }

  function runScan() {
    const inputEl = document.getElementById('smart-input');
    const rawText = inputEl.value.trim();
    const resultBox = document.getElementById('scan-results');

    if (!rawText) {
      showToast('Silakan tempelkan pesan, tautan, atau nomor terlebih dahulu!', 'warning');
      return;
    }

    const result = ScannerEngine.analyze(rawText);
    renderScanResult(result);
    resultBox.classList.add('active');

    if (result.status === 'danger') {
      SoundFX.play('danger');
    } else {
      SoundFX.play('safe');
    }

    // Scroll halus ke hasil
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderScanResult(res) {
    const meterContainer = document.getElementById('risk-meter-container');
    const scoreValEl = document.getElementById('risk-score-val');
    const badgeEl = document.getElementById('risk-badge-text');
    const summaryEl = document.getElementById('risk-summary-desc');
    const dialCircle = document.getElementById('risk-dial-progress');
    const highlightBox = document.getElementById('highlight-rendered-text');
    const indicatorsList = document.getElementById('indicators-rendered-list');
    const panicBridge = document.getElementById('panic-bridge-box');
    const urlAnatomySection = document.getElementById('url-anatomy-section');

    meterContainer.className = `risk-meter-container ${res.status}`;
    scoreValEl.textContent = `${res.score}%`;
    badgeEl.textContent = res.statusText;
    summaryEl.textContent = res.summaryText;

    // Update circular progress gauge (Keliling lingkaran r=36 adalah 2 * PI * 36 ≈ 226)
    const maxOffset = 226;
    const offset = maxOffset - (res.score / 100) * maxOffset;
    if (dialCircle) {
      dialCircle.style.strokeDashoffset = offset;
      dialCircle.style.stroke = res.status === 'danger' ? '#EF4444' : (res.status === 'warning' ? '#F59E0B' : '#10B981');
    }

    // Render Text dengan Kata Berbahaya yang Disorot
    highlightBox.innerHTML = res.highlightedHtml;

    // Render Temuan Indikator / Red Flags
    indicatorsList.innerHTML = '';

    if (res.matchedRules.length === 0 && res.urlAnalyses.length === 0) {
      indicatorsList.innerHTML = `
        <div class="indicator-item safe">
          <div class="indicator-dot"></div>
          <div class="indicator-content">
            <strong>Tidak Ditemukan Frasa Ancaman Khas</strong>
            <p>Pola kalimat tidak mencocoki kamus penipuan umum. Tetap selalu pastikan identitas lawan bicara Anda sebelum membagikan informasi rahasia.</p>
          </div>
        </div>
      `;
    }

    res.matchedRules.forEach(item => {
      const div = document.createElement('div');
      div.className = `indicator-item ${item.rule.level}`;
      div.innerHTML = `
        <div class="indicator-dot"></div>
        <div class="indicator-content">
          <strong>${item.rule.category} (Terdeteksi: "${item.hits.join(', ')}")</strong>
          <p>${item.rule.reason}</p>
          <p style="margin-top: 4px; font-weight: 600; color: var(--text-main);">🛡️ Saran: ${item.rule.advice}</p>
        </div>
      `;
      indicatorsList.appendChild(div);
    });

    // Render Analisis Tautan Web Jika Ada
    if (res.urlAnalyses.length > 0) {
      urlAnatomySection.style.display = 'block';
      const anatomyContainer = document.getElementById('url-anatomy-content');
      anatomyContainer.innerHTML = '';

      res.urlAnalyses.forEach(urlData => {
        const urlCard = document.createElement('div');
        urlCard.className = 'url-anatomy-box';
        
        let pathSnippet = urlData.pathname.length > 25 ? urlData.pathname.slice(0, 25) + '...' : urlData.pathname;
        let reasonsHtml = urlData.reasons.map(r => `<li>⚠️ ${r}</li>`).join('');

        urlCard.innerHTML = `
          <div class="url-parts">
            <span class="url-part protocol">${urlData.protocol || 'https:'}//</span>
            <span class="url-part domain-core">${urlData.hostname || urlData.original}</span>
            <span class="url-part path">${pathSnippet || '/'}</span>
          </div>
          <ul style="list-style: none; font-size: 0.8rem; color: #FFA5B2; line-height: 1.5; margin-top: 0.5rem;">
            ${reasonsHtml || '<li>✅ Struktur domain tampak normal</li>'}
          </ul>
        `;
        anatomyContainer.appendChild(urlCard);
      });
    } else {
      urlAnatomySection.style.display = 'none';
    }

    // Tampilkan Banner Panic Bridge jika terindikasi darurat
    if (res.suggestedPanicScenario || res.score >= 50) {
      panicBridge.style.display = 'flex';
      const bridgeBtn = document.getElementById('btn-panic-bridge');
      bridgeBtn.onclick = () => {
        const scenarioToOpen = res.suggestedPanicScenario || 'apk';
        switchView('panic');
        selectPanicScenario(scenarioToOpen);
        SoundFX.play('danger');
      };
    } else {
      panicBridge.style.display = 'none';
    }

    // Update generator alert dengan data scan terakhir secara otomatis
    autoPopulateAlertFromScan(res);
  }

  function autoPopulateAlertFromScan(scanRes) {
    if (scanRes.matchedRules.length === 0) return;
    const mainRule = scanRes.matchedRules[0].rule;
    const titleInput = document.getElementById('alert-custom-title');
    if (titleInput && !titleInput.value) {
      titleInput.value = `Waspada: Modus ${mainRule.category}`;
    }
  }

  // ==========================================
  // FITUR 2: PANIC TO ACTION (PERTOLONGAN PERTAMA)
  // ==========================================
  function setupPanicView() {
    const scenarioChips = document.querySelectorAll('.panic-chip');
    scenarioChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const scenarioId = chip.getAttribute('data-panic');
        selectPanicScenario(scenarioId);
        SoundFX.play('click');
      });
    });

    renderPanicContent(activePanicScenario);
  }

  function selectPanicScenario(scenarioId) {
    activePanicScenario = scenarioId;

    document.querySelectorAll('.panic-chip').forEach(c => {
      if (c.getAttribute('data-panic') === scenarioId) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    renderPanicContent(scenarioId);
  }

  function renderPanicContent(scenarioId) {
    const sc = PanicEngine.SCENARIOS[scenarioId];
    if (!sc) return;

    const titleEl = document.getElementById('panic-active-title');
    const taglineEl = document.getElementById('panic-active-tagline');
    const goldenTimeEl = document.getElementById('panic-golden-time');
    const stepsListEl = document.getElementById('panic-steps-list');
    const templatesListEl = document.getElementById('panic-templates-list');

    titleEl.innerHTML = `${sc.icon} ${sc.title}`;
    taglineEl.textContent = sc.tagline;
    goldenTimeEl.textContent = `⏱️ ${sc.goldenTime}`;

    // Render Steps
    stepsListEl.innerHTML = '';
    const savedStates = PanicEngine.getSavedChecklist()[scenarioId] || {};

    sc.steps.forEach(step => {
      const isChecked = !!savedStates[step.id];
      const stepItem = document.createElement('div');
      stepItem.className = `panic-step-item ${step.priority === 'first' ? 'priority-first' : ''} ${isChecked ? 'completed' : ''}`;
      stepItem.id = `step-item-${step.id}`;

      let actionBtnHtml = '';
      if (step.actionText) {
        if (step.externalLink) {
          actionBtnHtml = `<a href="${step.externalLink}" target="_blank" rel="noopener" class="btn btn-sm btn-outline">${step.actionText} ↗</a>`;
        } else if (step.actionTarget) {
          actionBtnHtml = `<button class="btn btn-sm btn-outline btn-go-resource" data-target="${step.actionTarget}">${step.actionText}</button>`;
        }
      }

      stepItem.innerHTML = `
        <div class="step-top">
          <input type="checkbox" class="step-checkbox" id="chk-${step.id}" ${isChecked ? 'checked' : ''}>
          <div class="step-info">
            <span class="step-priority-badge">${step.priorityLabel}</span>
            <h4 class="step-title">${step.title}</h4>
            <p class="step-desc">${step.desc}</p>
            ${actionBtnHtml ? `<div class="step-actions">${actionBtnHtml}</div>` : ''}
          </div>
        </div>
      `;

      // Event toggle checkbox
      const chk = stepItem.querySelector('.step-checkbox');
      chk.addEventListener('change', () => {
        const checked = chk.checked;
        PanicEngine.setStepStatus(scenarioId, step.id, checked);
        stepItem.classList.toggle('completed', checked);
        if (checked) SoundFX.play('safe');
        else SoundFX.play('click');
        updatePanicProgressBar(scenarioId);
        updateGuardianProfile();
      });

      // Event tombol action internal
      const resBtn = stepItem.querySelector('.btn-go-resource');
      if (resBtn) {
        resBtn.addEventListener('click', () => {
          switchView('resources');
          SoundFX.play('click');
        });
      }

      stepsListEl.appendChild(stepItem);
    });

    // Render Quick Copy Templates
    templatesListEl.innerHTML = '';
    sc.templates.forEach((tmpl, idx) => {
      const tDiv = document.createElement('div');
      tDiv.className = 'step-template-box';
      tDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
          <strong style="color: var(--text-main); font-size: 0.85rem;">📋 ${tmpl.title}</strong>
          <button class="btn btn-sm btn-outline btn-copy-tmpl" data-tmpl-idx="${idx}">Salin Teks</button>
        </div>
        <p style="font-size: 0.82rem; font-style: italic; white-space: pre-wrap;">${tmpl.text}</p>
      `;

      const copyBtn = tDiv.querySelector('.btn-copy-tmpl');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(tmpl.text);
        copyBtn.textContent = '✓ Tersalin!';
        SoundFX.play('safe');
        showToast('Template berhasil disalin ke clipboard!', 'success');
        setTimeout(() => { copyBtn.textContent = 'Salin Teks'; }, 2000);
      });

      templatesListEl.appendChild(tDiv);
    });

    updatePanicProgressBar(scenarioId);
  }

  function updatePanicProgressBar(scenarioId) {
    const progress = PanicEngine.getScenarioProgress(scenarioId);
    const fillEl = document.getElementById('panic-progress-fill');
    const textEl = document.getElementById('panic-progress-text');
    if (fillEl && textEl) {
      fillEl.style.width = `${progress.percent}%`;
      textEl.textContent = `${progress.completed} dari ${progress.total} Tindakan Selesai (${progress.percent}%)`;
    }
  }

  // ==========================================
  // FITUR 3: SIMULATOR BERSEKENARIO (SIMULASI)
  // ==========================================
  function setupSimulator() {
    renderScenarioSidebar();
    startSimulatorScenario(activeSimScenarioId);

    // Difficulty switch
    const diffToggle = document.getElementById('sim-diff-toggle');
    if (diffToggle) {
      diffToggle.addEventListener('change', () => {
        simDifficulty = diffToggle.checked ? 'pro' : 'guided';
        document.getElementById('sim-diff-label').textContent = simDifficulty === 'pro' ? 'Mode Waspada Pro (Uji Mandiri)' : 'Mode Panduan (Dengan Petunjuk)';
        SoundFX.play('click');
        startSimulatorScenario(activeSimScenarioId);
      });
    }

    // Reset button
    const resetBtn = document.getElementById('btn-reset-scenario');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        SoundFX.play('click');
        startSimulatorScenario(activeSimScenarioId);
      });
    }
  }

  function renderScenarioSidebar() {
    const listEl = document.getElementById('simulator-scenario-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const completedScenarios = getCompletedScenarios();

    SimulatorEngine.SCENARIOS.forEach(sc => {
      const isCompleted = !!completedScenarios[sc.id];
      const div = document.createElement('div');
      div.className = `scenario-item ${sc.id === activeSimScenarioId ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
      div.setAttribute('data-sim-id', sc.id);

      div.innerHTML = `
        <div class="scenario-header-mini">
          <span class="scenario-tag">${sc.category}</span>
          <span>${isCompleted ? '✅ Lulus' : '⏳ Belum'}</span>
        </div>
        <div class="scenario-title">${sc.avatar} ${sc.title}</div>
      `;

      div.addEventListener('click', () => {
        activeSimScenarioId = sc.id;
        document.querySelectorAll('.scenario-item').forEach(i => i.classList.remove('active'));
        div.classList.add('active');
        SoundFX.play('click');
        startSimulatorScenario(sc.id);
      });

      listEl.appendChild(div);
    });
  }

  function startSimulatorScenario(scenarioId) {
    const sc = SimulatorEngine.SCENARIOS.find(s => s.id === scenarioId);
    if (!sc) return;

    simState = {
      scenarioId: sc.id,
      currentNode: 'step_1',
      score: 50,
      history: []
    };

    // Update Header Profil Target Chat
    document.getElementById('sim-chat-avatar').textContent = sc.avatar;
    document.getElementById('sim-chat-name').textContent = sc.contactName;
    document.getElementById('sim-chat-sub').textContent = sc.contactSubtitle;

    const chatBody = document.getElementById('sim-chat-body');
    chatBody.innerHTML = '';

    // Tampilkan System Notice
    const notice = document.createElement('div');
    notice.className = 'chat-bubble system-note';
    notice.innerHTML = `🔒 Skenario Simulasi: <strong>${sc.title}</strong><br>Pesan di bawah adalah simulasi interaktif edukatif. Amati tanda bahaya dan tentukan tindakan Anda.`;
    chatBody.appendChild(notice);

    // Render pesan awal
    sc.initialMessages.forEach((msg, idx) => {
      setTimeout(() => {
        appendChatMessage(msg);
      }, idx * 300);
    });

    // Render Decision Options
    setTimeout(() => {
      renderDecisionNode(sc, 'step_1');
    }, sc.initialMessages.length * 350 + 200);
  }

  function appendChatMessage(msg) {
    const chatBody = document.getElementById('sim-chat-body');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${msg.sender}`;

    let attachmentHtml = '';
    if (msg.attachment) {
      attachmentHtml = `
        <div class="chat-attachment-card ${msg.attachment.type === 'apk' ? 'suspicious' : ''}">
          <span style="font-size: 1.5rem;">📁</span>
          <div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #FFA5B2;">${msg.attachment.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-dim);">${msg.attachment.size} • File Aplikasi Android</div>
          </div>
        </div>
      `;
    }

    bubble.innerHTML = `
      <div>${msg.text}</div>
      ${attachmentHtml}
      <div class="chat-time">${msg.time || 'Baru saja'}</div>
    `;

    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderDecisionNode(scenario, nodeId) {
    const decisionBox = document.getElementById('sim-decision-box');
    const optionsContainer = document.getElementById('sim-decision-options');
    const feedbackBox = document.getElementById('sim-insight-feedback');

    if (!decisionBox || !optionsContainer) return;
    feedbackBox.style.display = 'none';

    // Periksa apakah ini node akhir (outcome)
    if (nodeId.startsWith('outcome_')) {
      handleScenarioConclusion(scenario, nodeId);
      return;
    }

    const nodeData = scenario.steps[nodeId];
    if (!nodeData) return;

    document.getElementById('sim-decision-title').textContent = nodeData.prompt;
    optionsContainer.innerHTML = '';

    nodeData.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = `decision-btn ${opt.isSafe ? 'safe-choice' : 'danger-choice'}`;
      btn.innerHTML = `
        <span>${opt.text}</span>
        <span style="font-size: 1rem;">➔</span>
      `;

      btn.addEventListener('click', () => {
        handleUserDecision(scenario, opt);
      });

      optionsContainer.appendChild(btn);
    });

    decisionBox.style.display = 'block';
  }

  function handleUserDecision(scenario, chosenOpt) {
    SoundFX.play('click');
    const decisionBox = document.getElementById('sim-decision-box');
    decisionBox.style.display = 'none';

    // 1. Tampilkan Balasan User di Chat
    appendChatMessage({
      sender: 'outgoing',
      text: chosenOpt.userReply,
      time: '14:23'
    });

    // 2. Tampilkan Insight Feedback Card
    const feedbackBox = document.getElementById('sim-insight-feedback');
    feedbackBox.style.display = 'block';
    feedbackBox.className = `insight-feedback-box ${chosenOpt.isSafe ? 'correct' : 'wrong'}`;

    feedbackBox.innerHTML = `
      <div class="insight-title">
        ${chosenOpt.isSafe ? '✅ Keputusan Waspada & Aman!' : '⚠️ Jebakan Terpicu!'}
      </div>
      <p class="insight-desc">${chosenOpt.insight}</p>
      <div style="margin-top: 0.75rem; text-align: right;">
        <button class="btn btn-sm btn-primary" id="btn-next-step">Lanjutkan Skenario ➔</button>
      </div>
    `;

    if (chosenOpt.isSafe) {
      SoundFX.play('safe');
      simState.score += chosenOpt.scoreImpact;
    } else {
      SoundFX.play('danger');
      simState.score += chosenOpt.scoreImpact;
    }

    document.getElementById('btn-next-step').onclick = () => {
      feedbackBox.style.display = 'none';
      if (chosenOpt.scammerReply) {
        appendChatMessage({
          sender: 'incoming',
          text: chosenOpt.scammerReply,
          time: '14:24'
        });
      }
      setTimeout(() => {
        renderDecisionNode(scenario, chosenOpt.nextStep);
      }, 400);
    };
  }

  function handleScenarioConclusion(scenario, outcomeId) {
    const decisionBox = document.getElementById('sim-decision-box');
    const feedbackBox = document.getElementById('sim-insight-feedback');
    decisionBox.style.display = 'none';
    feedbackBox.style.display = 'block';

    const isSuccess = outcomeId.includes('safe');
    feedbackBox.className = `insight-feedback-box ${isSuccess ? 'correct' : 'wrong'}`;

    if (isSuccess) {
      SoundFX.play('success');
      markScenarioCompleted(scenario.id);
      renderScenarioSidebar();
      updateGuardianProfile();

      feedbackBox.innerHTML = `
        <div class="insight-title">🎉 Skenario Selesai: Anda Lulus Sebagai Guardian!</div>
        <p class="insight-desc">Anda berhasil menggagalkan jebakan <strong>${scenario.title}</strong> tanpa mengalami kerugian finansial atau kebocoran data. Pertahankan insting waspada ini di dunia nyata!</p>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-sm btn-primary" id="btn-sim-next-sc">Uji Skenario Berikutnya ➔</button>
          <button class="btn btn-sm btn-outline" id="btn-sim-share-alert">Buat Peringatan Modus Ini</button>
        </div>
      `;

      document.getElementById('btn-sim-next-sc').onclick = () => {
        // Cari skenario berikutnya yang belum selesai
        const currentIndex = SimulatorEngine.SCENARIOS.findIndex(s => s.id === scenario.id);
        const nextSc = SimulatorEngine.SCENARIOS[(currentIndex + 1) % SimulatorEngine.SCENARIOS.length];
        activeSimScenarioId = nextSc.id;
        renderScenarioSidebar();
        startSimulatorScenario(nextSc.id);
      };

      document.getElementById('btn-sim-share-alert').onclick = () => {
        switchView('alert');
        const titleEl = document.getElementById('alert-custom-title');
        if (titleEl) titleEl.value = `Waspada: Modus ${scenario.title}`;
        SoundFX.play('click');
      };
    } else {
      SoundFX.play('danger');
      feedbackBox.innerHTML = `
        <div class="insight-title">💔 Anda Terjebak Penipuan!</div>
        <p class="insight-desc">Pada simulasi ini Anda menuruti perintah pelaku yang membahayakan akun atau saldo Anda. Jangan berkecil hati, jadikan latihan ini sebagai pelajaran berharga tanpa kerugian nyata.</p>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button class="btn btn-sm btn-danger" id="btn-sim-retry">Ulangi Skenario Ini</button>
          <button class="btn btn-sm btn-outline" id="btn-sim-panic">Lihat Pertolongan Pertama</button>
        </div>
      `;

      document.getElementById('btn-sim-retry').onclick = () => {
        startSimulatorScenario(scenario.id);
      };

      document.getElementById('btn-sim-panic').onclick = () => {
        switchView('panic');
        selectPanicScenario(scenario.id === 'kurir_apk' ? 'apk' : 'otp');
      };
    }
  }

  function getCompletedScenarios() {
    try {
      const data = localStorage.getItem('guardian_completed_sims_v1');
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function markScenarioCompleted(scenarioId) {
    const completed = getCompletedScenarios();
    completed[scenarioId] = true;
    try {
      localStorage.setItem('guardian_completed_sims_v1', JSON.stringify(completed));
    } catch (e) {}
  }

  // ==========================================
  // FITUR 4: GUARDIAN ALERT GENERATOR
  // ==========================================
  function setupAlertGenerator() {
    const presetSelect = document.getElementById('alert-preset-select');
    const customTitleInput = document.getElementById('alert-custom-title');
    const targetInput = document.getElementById('alert-target-input');
    const redflagsArea = document.getElementById('alert-redflags-area');
    const defenseArea = document.getElementById('alert-defense-area');
    const btnCopyBroadcast = document.getElementById('btn-copy-broadcast');

    if (!presetSelect) return;

    function updateCardPreview() {
      const title = AlertGenerator.anonymizeText(customTitleInput.value || 'Modus Penipuan Digital');
      const target = AlertGenerator.anonymizeText(targetInput.value || 'Masyarakat Umum & Pemuda');
      const flags = AlertGenerator.anonymizeText(redflagsArea.value).split('\n').filter(l => l.trim().length > 0);
      const defenses = AlertGenerator.anonymizeText(defenseArea.value).split('\n').filter(l => l.trim().length > 0);

      document.getElementById('card-preview-title').textContent = title;
      document.getElementById('card-preview-target').textContent = `Sasaran: ${target}`;

      const flagsList = document.getElementById('card-preview-flags');
      flagsList.innerHTML = flags.map(f => `<li>${f}</li>`).join('');

      const defenseList = document.getElementById('card-preview-defense');
      defenseList.innerHTML = defenses.map(d => `<li>${d}</li>`).join('');
    }

    presetSelect.addEventListener('change', () => {
      const key = presetSelect.value;
      if (AlertGenerator.PRESET_MODUS[key]) {
        const data = AlertGenerator.PRESET_MODUS[key];
        customTitleInput.value = data.title;
        targetInput.value = data.target;
        redflagsArea.value = data.redFlags.join('\n');
        defenseArea.value = data.defenses.join('\n');
        SoundFX.play('click');
        updateCardPreview();
      }
    });

    [customTitleInput, targetInput, redflagsArea, defenseArea].forEach(input => {
      input.addEventListener('input', updateCardPreview);
    });

    // Inisialisasi awal
    presetSelect.dispatchEvent(new Event('change'));

    // Salin Teks Siap Broadcast WA
    btnCopyBroadcast.addEventListener('click', () => {
      const cardData = {
        title: customTitleInput.value || 'Modus Penipuan Digital',
        redFlags: redflagsArea.value.split('\n').filter(l => l.trim().length > 0),
        defenses: defenseArea.value.split('\n').filter(l => l.trim().length > 0)
      };

      const broadcastText = AlertGenerator.formatWhatsAppBroadcast(cardData);
      navigator.clipboard.writeText(broadcastText);
      SoundFX.play('success');
      showToast('Format pesan broadcast WhatsApp disalin!', 'success');
      btnCopyBroadcast.textContent = '✓ Pesan Tersalin!';
      setTimeout(() => { btnCopyBroadcast.textContent = 'Salin Teks Broadcast WhatsApp'; }, 2200);
    });
  }

  // ==========================================
  // FITUR 5: SECURITY CHECKUP
  // ==========================================
  function setupCheckupView() {
    const listEl = document.getElementById('checkup-habits-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const saved = CheckupEngine.getSavedAnswers();

    CheckupEngine.HABITS.forEach(h => {
      const isChecked = !!saved[h.id];
      const item = document.createElement('div');
      item.className = `checkup-item ${isChecked ? 'checked' : ''}`;
      item.id = `checkup-item-${h.id}`;

      item.innerHTML = `
        <input type="checkbox" class="step-checkbox" id="chk-habit-${h.id}" ${isChecked ? 'checked' : ''}>
        <div style="flex: 1;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.2rem;">${h.title}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">${h.desc}</p>
          <div style="font-size: 0.8rem; color: var(--primary); margin-top: 0.35rem;">💡 Tips: ${h.tip}</div>
        </div>
      `;

      const chk = item.querySelector('.step-checkbox');
      chk.addEventListener('change', () => {
        const checked = chk.checked;
        CheckupEngine.saveAnswer(h.id, checked);
        item.classList.toggle('checked', checked);
        if (checked) SoundFX.play('safe');
        else SoundFX.play('click');
        updateCheckupScore();
        updateGuardianProfile();
      });

      listEl.appendChild(item);
    });

    updateCheckupScore();
  }

  function updateCheckupScore() {
    const res = CheckupEngine.calculateScore();
    const scoreEl = document.getElementById('checkup-score-number');
    const badgeEl = document.getElementById('checkup-badge-status');
    const summaryEl = document.getElementById('checkup-score-summary');

    if (scoreEl && badgeEl && summaryEl) {
      scoreEl.textContent = `${res.score}/100`;
      badgeEl.className = `risk-badge-large ${res.badgeColor}`;
      badgeEl.textContent = res.status;
      summaryEl.textContent = res.summary;
    }
  }

  // ==========================================
  // FITUR 6: PUSAT BANTUAN & TRANSPARANSI
  // ==========================================
  function setupResourcesView() {
    const dirGrid = document.getElementById('official-directory-grid');
    if (!dirGrid) return;
    dirGrid.innerHTML = '';

    ResourcesData.OFFICIAL_CHANNELS.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'directory-card';

      let actionHtml = '';
      if (ch.url) {
        actionHtml = `<a href="${ch.url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline">${ch.actionText || 'Kunjungi Situs'} ↗</a>`;
      } else if (ch.phone) {
        actionHtml = `<a href="tel:${ch.phone}" class="btn btn-sm btn-outline">📞 Hubungi ${ch.phone}</a>`;
      }

      card.innerHTML = `
        <div>
          <div class="directory-icon">${ch.icon}</div>
          <span class="type-detector-badge" style="margin-bottom: 0.4rem;">${ch.badge}</span>
          <h3 class="directory-name">${ch.name}</h3>
          <p class="directory-desc">${ch.desc}</p>
        </div>
        <div style="margin-top: 0.75rem;">
          ${actionHtml}
        </div>
      `;

      dirGrid.appendChild(card);
    });

    // Tombol Reset Data Lokal (100% Hak Privasi Pengguna)
    const btnResetData = document.getElementById('btn-reset-local-data');
    if (btnResetData) {
      btnResetData.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat simulator, checklist panik, dan skor lokal?')) {
          localStorage.removeItem('guardian_panic_checklist_v1');
          localStorage.removeItem('guardian_completed_sims_v1');
          localStorage.removeItem('guardian_security_checkup_v1');
          SoundFX.play('click');
          showToast('Seluruh data lokal berhasil dibersihkan!', 'info');
          setTimeout(() => { location.reload(); }, 600);
        }
      });
    }
  }

  // ==========================================
  // GUARDIAN PROFILE & GAMIFICATION LEVEL
  // ==========================================
  function updateGuardianProfile() {
    const completedSims = Object.keys(getCompletedScenarios()).length;
    const checkupRes = CheckupEngine.calculateScore();
    const panicStates = PanicEngine.getSavedChecklist();
    let completedSteps = 0;
    Object.values(panicStates).forEach(scSteps => {
      completedSteps += Object.values(scSteps).filter(Boolean).length;
    });

    // Total XP Formula
    const totalXP = (completedSims * 150) + Math.round(checkupRes.score * 1.5) + (completedSteps * 25);

    let rankTitle = 'Warga Digital Pemula';
    let rankBadge = '🌱';
    let nextThreshold = 300;

    if (totalXP >= 500) {
      rankTitle = 'Guardian Tangguh Indonesia';
      rankBadge = '🛡️';
      nextThreshold = 1000;
    } else if (totalXP >= 200) {
      rankTitle = 'Pengamat Waspada Digital';
      rankBadge = '👁️';
      nextThreshold = 500;
    }

    const xpPercent = Math.min(Math.round((totalXP / nextThreshold) * 100), 100);

    const badgeRing = document.getElementById('guardian-badge-icon');
    const rankTitleEl = document.getElementById('guardian-rank-title');
    const xpTextEl = document.getElementById('guardian-xp-text');
    const xpFillEl = document.getElementById('guardian-xp-fill');

    if (badgeRing && rankTitleEl && xpTextEl && xpFillEl) {
      badgeRing.textContent = rankBadge;
      rankTitleEl.textContent = rankTitle;
      xpTextEl.textContent = `${totalXP} / ${nextThreshold} XP Guardian`;
      xpFillEl.style.width = `${xpPercent}%`;
    }
  }

  // Toast Notification Utility
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '🚨';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => { toast.remove(); }, 300);
    }, 3000);
  }

  return {
    init,
    switchView,
    selectPanicScenario,
    showToast
  };
})();

// Jalankan aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
