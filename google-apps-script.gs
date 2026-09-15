/**
 * CollegeSeva — lead capture backend
 * ------------------------------------------------------------
 * 1. Create a new Google Sheet, name the first tab "Leads".
 *    Add a header row: Timestamp | Name | Phone | Email | Course | College ID | College Name
 * 2. In the Sheet: Extensions > Apps Script. Delete any starter code
 *    and paste this file's contents in.
 * 3. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL and paste it into js/main.js as LEAD_ENDPOINT_URL.
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.course || "",
    data.collegeId || "",
    data.collegeName || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
