/**
 * Lead capture webhook for payecalculator.co.ke
 * -------------------------------------------------------------------------
 * Receives form submissions (payslip generator gate, etc.) and appends them
 * to a Google Sheet. The site POSTs JSON to the deployed /exec URL.
 *
 * SETUP (one time):
 *  1. Create a Google Sheet (e.g. "PAYE Calculator — Leads").
 *  2. Extensions > Apps Script. Delete the default code, paste this file.
 *  3. Save. Run `setup` once (Run menu) and grant the permissions prompt.
 *  4. Deploy > New deployment > type "Web app".
 *       - Description: leads v1
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Deploy, then copy the Web app URL ending in /exec.
 *  5. Send that /exec URL back — it gets hardcoded as a const in the site
 *     (fleet rule: webhook URLs live in code, never in env vars).
 *
 * To change the form later, just add fields to FIELDS below and redeploy
 * (Deploy > Manage deployments > edit > new version).
 */

var SHEET_NAME = 'Leads'
// Columns written, in order. `key` must match the JSON the site sends.
var FIELDS = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'source', header: 'Source' }, // which tool/page the lead came from
  { key: 'consent', header: 'Consent' }, // "yes" when the consent box is ticked
  { key: 'notes', header: 'Notes' },
]

function setup() {
  var sheet = getSheet_()
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp'].concat(FIELDS.map(function (f) { return f.header })))
  }
}

function doPost(e) {
  try {
    var data = parseBody_(e)
    var sheet = getSheet_()
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp'].concat(FIELDS.map(function (f) { return f.header })))
    }
    var row = [new Date()].concat(FIELDS.map(function (f) { return data[f.key] || '' }))
    sheet.appendRow(row)
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

// Lets you open the /exec URL in a browser to confirm it is live.
function doGet() {
  return ContentService.createTextOutput('Lead webhook is live.')
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
