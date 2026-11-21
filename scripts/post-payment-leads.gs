/**
 * Datespot post-payment lead capture.
 * 1. Create a Google Apps Script at https://script.google.com
 * 2. Paste this file into Code.gs, save, then Deploy > New deployment > Web app.
 * 3. Execute as: Me. Who has access: Anyone.
 * 4. Set VITE_POST_PAYMENT_LEADS_URL to the deployed /exec URL in your hosting environment.
 * Only stores name, phone number, timestamp and metadata. Screenshots are never uploaded.
 */
const SPREADSHEET_ID = '17RS0uWwgVqJyPTGLBqSVfd71542Sy-ysq0wo0L1yZFM';
const SHEET_NAME = 'Payment Leads';

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const name = String(p.name || '').trim().slice(0, 80);
    const phone = String(p.phone || '').replace(/\D/g, '');
    if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone)) {
      return ContentService.createTextOutput('Invalid details');
    }
    const source = String(p.source || '').slice(0, 20);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Payment Leads sheet missing');
    // Prevent formula injection from user-controlled strings.
    const safe = s => "'" + s.replace(/[\r\n]/g, ' ');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([new Date(), safe(name), safe(phone), 499, safe(source), 'Yes (not stored)']);
    } finally {
      lock.releaseLock();
    }
    return ContentService.createTextOutput('OK');
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput('ERROR');
  }
}
