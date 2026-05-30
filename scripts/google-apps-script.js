/**
 * CareerSpark – Google Apps Script Web App
 * =========================================
 * Receives form submissions from the CareerSpark static site and
 * appends each lead as a new row in the active Google Sheet.
 *
 * SETUP INSTRUCTIONS
 * ------------------
 * 1. Open your Google Sheet.
 * 2. Click Extensions → Apps Script.
 * 3. Delete any existing code and paste this entire file.
 * 4. Save (Ctrl+S / Cmd+S).
 * 5. Click Deploy → New Deployment.
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone   ← required for the static site to POST
 * 6. Click Deploy → copy the Web App URL.
 * 7. Paste that URL into your .env / .env.production as PUBLIC_WEBHOOK_URL.
 * 8. Re-deploy (Manage Deployments → Edit → New Version) whenever you
 *    change this script.
 *
 * SHEET COLUMNS (auto-created on first submission)
 * -------------------------------------------------
 * A  Timestamp
 * B  Name
 * C  City
 * D  Phone
 * E  Email
 * F  Result        (passed / failed)
 * G  Stream
 * H  Percentage
 * I  Recommended Courses
 * J  Source
 * K  Device
 * L  Campaign
 * M  UTM Medium
 * N  UTM Content
 * O  UTM Term
 */

// ── Configuration ────────────────────────────────────────────────
// Change SHEET_NAME if your tab is named differently.
var SHEET_NAME = 'Leads';

// Column headers — order must match the row array in doPost().
var HEADERS = [
  'Timestamp',
  'Name',
  'City',
  'Phone',
  'Email',
  'Result',
  'Stream',
  'Percentage',
  'Top Subjects',
  'Recommended Courses',
  'Source',
  'Device',
  'Campaign',
  'UTM Medium',
  'UTM Content',
  'UTM Term',
];

// ── CORS helper ──────────────────────────────────────────────────
function corsResponse(output) {
  return ContentService.createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

// ── doGet – health check ─────────────────────────────────────────
// Lets you verify the deployment is live by visiting the URL in a browser.
function doGet() {
  return corsResponse(JSON.stringify({ status: 'ok', service: 'CareerSpark Leads' }));
}

// ── doPost – receive lead submission ─────────────────────────────
function doPost(e) {
  try {
    // Read fields from form-encoded body (e.parameter)
    // This works with fetch mode:'no-cors' + URLSearchParams from the browser.
    var data = e.parameter || {};

    // Get or create the Leads sheet
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Write header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);

      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1a2e');
      headerRange.setFontColor('#00F5D4');
      sheet.setFrozenRows(1);

      // Auto-resize columns for readability
      sheet.autoResizeColumns(1, HEADERS.length);
    }

    // Build the data row — order must match HEADERS above
    var row = [
      data.timestamp          || new Date().toISOString(),
      data.name               || '',
      data.city               || '',
      data.phone              || '',
      data.email              || '',
      data.result             || '',
      data.stream             || '',
      data.percentage         || '',
      data.topSubjects        || '',
      data.recommendedCourses || '',
      data.source             || 'direct',
      data.device             || '',
      data.campaign           || '',
      data.utm_medium         || '',
      data.utm_content        || '',
      data.utm_term           || '',
    ];

    sheet.appendRow(row);

    // Return success
    return corsResponse(JSON.stringify({ status: 'success' }));

  } catch (err) {
    // Log the error to Apps Script execution log for debugging
    console.error('CareerSpark doPost error:', err.toString());

    return corsResponse(JSON.stringify({
      status: 'error',
      message: err.toString(),
    }));
  }
}
