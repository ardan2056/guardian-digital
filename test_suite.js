/**
 * Guardian Ruang Digital - Comprehensive Automated Test Suite
 * Memverifikasi integritas logika seluruh modul: Scanner, Panic, Simulator, Alert, Checkup.
 */

const fs = require('fs');
const path = require('path');

// Mock browser objects
global.window = {};
global.document = {
  createElement: (tag) => ({
    textContent: '',
    innerHTML: '',
    appendChild: () => {},
    style: {}
  })
};
global.localStorage = {
  _store: {},
  getItem: function(key) { return this._store[key] || null; },
  setItem: function(key, val) { this._store[key] = String(val); },
  removeItem: function(key) { delete this._store[key]; }
};

const vm = require('vm');

const scannerCode = fs.readFileSync(path.join(__dirname, 'scanner.js'), 'utf8');
vm.runInThisContext(scannerCode);

const panicCode = fs.readFileSync(path.join(__dirname, 'panic.js'), 'utf8');
vm.runInThisContext(panicCode);

const simulatorCode = fs.readFileSync(path.join(__dirname, 'simulator.js'), 'utf8');
vm.runInThisContext(simulatorCode);

const alertCode = fs.readFileSync(path.join(__dirname, 'alert-generator.js'), 'utf8');
vm.runInThisContext(alertCode);

const checkupCode = fs.readFileSync(path.join(__dirname, 'checkup.js'), 'utf8');
vm.runInThisContext(checkupCode);

console.log('=== RUNNING AUTOMATED UNIT & INTEGRATION TESTS ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Test Scanner Type Detection
assert(ScannerEngine.detectInputType('https://bca-klik-promo.xyz/auth') === 'url', 'Detect URL type correctly');
assert(ScannerEngine.detectInputType('+62 812 3456 7890') === 'phone', 'Detect Phone number type correctly');
assert(ScannerEngine.detectInputType('123456789012') === 'account', 'Detect Bank account number format');
assert(ScannerEngine.detectInputType('Halo selamat anda menang undian') === 'message', 'Detect Text message type');

// 2. Test Heuristic Detection on APK / Surat Tilang
const apkScan = ScannerEngine.analyze('Selamat siang, ini ada file Surat_Tilang_ETLE_Resmi.apk segera dibuka dalam 10 menit');
assert(apkScan.status === 'danger', 'APK + Urgency scored as DANGER');
assert(apkScan.score >= 60, `Score is high (${apkScan.score}%) for APK threat`);
assert(apkScan.matchedRules.some(r => r.rule.id === 'malware_apk'), 'Correctly identifies malware_apk rule');
assert(apkScan.matchedRules.some(r => r.rule.id === 'urgency_manipulation'), 'Correctly identifies urgency_manipulation rule');
assert(apkScan.suggestedPanicScenario === 'apk', 'Correctly routes to APK panic scenario');

// 3. Test URL Analysis (Typosquatting & Suspicious TLD)
const urlScan = ScannerEngine.analyzeUrl('http://bca-verifikasi-auth.xyz/login');
assert(urlScan.hasBrandSpoof === true, 'Detected brand spoofing on fake BCA domain');
assert(urlScan.isRiskyTLD === true, 'Detected high risk TLD .xyz');
assert(urlScan.riskScore >= 60, `URL risk score appropriately high: ${urlScan.riskScore}%`);

// 4. Test Official Domain (False Positive Protection)
const officialUrlScan = ScannerEngine.analyzeUrl('https://klikbca.com');
assert(officialUrlScan.hasBrandSpoof === false, 'Official domain klikbca.com is recognized as legitimate');

// 5. Test Panic Engine
const otpSteps = PanicEngine.SCENARIOS.otp.steps;
assert(otpSteps.length >= 4, 'Panic OTP scenario has complete steps');
PanicEngine.setStepStatus('otp', 'otp_s1', true);
const prog = PanicEngine.getScenarioProgress('otp');
assert(prog.completed === 1, 'Panic scenario progress correctly recorded');

// 6. Test Simulator Engine
const scenarios = SimulatorEngine.SCENARIOS;
assert(scenarios.length === 5, `Simulator has all 5 realistic Indonesian youth scenarios (actual: ${scenarios.length})`);
const kurirSc = scenarios.find(s => s.id === 'kurir_apk');
assert(kurirSc && kurirSc.steps.step_1.options.length >= 3, 'Kurir APK scenario has multiple branching options');
const safeOpt = kurirSc.steps.step_1.options.find(o => o.isSafe);
assert(safeOpt && safeOpt.scoreImpact > 0, 'Safe options award positive score');

// 7. Test Alert Generator & Anonymizer
const anonymizedPhone = AlertGenerator.anonymizeText('Hubungi +6281234567890 sekarang');
assert(anonymizedPhone.includes('XXXX'), `Phone number properly redacted for privacy: ${anonymizedPhone}`);
const broadcastMsg = AlertGenerator.formatWhatsAppBroadcast({
  title: 'Penipuan File APK Kurir',
  redFlags: ['File berakhiran .apk', 'Minta izin SMS'],
  defenses: ['Jangan instal file .apk', 'Nyalakan mode pesawat']
});
assert(broadcastMsg.includes('🚨 *PERINGATAN WASPADA SIBER:'), 'Broadcast formatter generates valid WhatsApp message');

// 8. Test Checkup Engine
CheckupEngine.saveAnswer('h1', true);
CheckupEngine.saveAnswer('h2', true);
const scoreCheck = CheckupEngine.calculateScore();
assert(scoreCheck.score === 30, `Score calculation correct: ${scoreCheck.score}`);

console.log(`\n=== SUMMARY: ${passedTests}/${totalTests} TESTS PASSED ===`);
