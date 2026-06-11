/**
 * Lead capture webhook for payecalculator.co.ke
 * -------------------------------------------------------------------------
 * Receives form submissions (payslip generator gate, etc.) and appends them
 * to a Google Sheet. The site POSTs JSON to the deployed /exec URL.
 *
 * It is schema-flexible: it writes a header row of friendly labels if the
 * sheet has none, and if a submission contains a field it has never seen, it
 * adds a new labelled column on the fly. So you can add form fields later
 * without ever touching this script — no data is dropped, no manual setup.
 *
 * SETUP (one time):
 *  1. Create a Google Sheet (e.g. "PAYE Calculator — Leads").
 *  2. Extensions > Apps Script. Delete the default code, paste this file.
 *  3. (Optional) Run `setup` once and grant the permissions prompt — this
 *     just creates the header row. Otherwise it is created on the first lead.
 *  4. Deploy > New deployment > type "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Deploy, grant permissions, then copy the Web app URL ending in /exec.
 *  5. Send that /exec URL back — it gets hardcoded as a const in the site
 *     (fleet rule: webhook URLs live in code, never in env vars).
 */

var SHEET_NAME = 'Leads'

// Friendly labels + preferred column order. Any field NOT listed here still
// gets its own column, labelled with the raw field key.
var FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  source: 'Source',   // which tool/page the lead came from
  consent: 'Consent', // "yes" when the consent box is ticked
  notes: 'Notes',
}

function doPost(e) {
  try {
    appendLead_(getSheet_(), parseBody_(e))
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

// Open the /exec URL in a browser to confirm it is live.
function doGet() {
  return ContentService.createTextOutput('Lead webhook is live.')
}

// Optional: run once to pre-create the header row.
function setup() {
  ensureHeaders_(getSheet_())
}

function appendLead_(sheet, data) {
  var headers = ensureHeaders_(sheet)

  // Add a labelled column for any field we have not seen before.
  Object.keys(data).forEach(function (key) {
    var label = FIELD_LABELS[key] || key
    if (headers.indexOf(label) === -1) {
      headers.push(label)
      sheet.getRange(1, headers.length).setValue(label)
    }
  })

  // Build the row aligned to the current header order.
  var labelToKey = {}
  Object.keys(FIELD_LABELS).forEach(function (k) { labelToKey[FIELD_LABELS[k]] = k })

  var row = headers.map(function (header) {
    if (header === 'Timestamp') return new Date()
    var key = labelToKey[header] || header // unknown columns map header -> key
    return data[key] !== undefined && data[key] !== null ? data[key] : ''
  })

  sheet.appendRow(row)
}

// Returns the current header row, creating it (Timestamp + known labels) if the
// sheet is empty.
function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    var initial = ['Timestamp'].concat(Object.keys(FIELD_LABELS).map(function (k) { return FIELD_LABELS[k] }))
    sheet.getRange(1, 1, 1, initial.length).setValues([initial])
    return initial
  }
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents) } catch (ignore) {}
  }
  return (e && e.parameter) ? e.parameter : {}
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
