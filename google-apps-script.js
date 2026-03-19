// Memory Combine — Google Apps Script
// Paste this entire file into Extensions → Apps Script, then deploy as a web app.
//
// Sheet setup:
//   Tab 1 name: "Leaderboard"  — columns: Name | Score | Date
//   Tab 2 name: "Shots"        — columns: Name | Date | Distance (yds) | Bucket | Shot # | Proximity (ft) | Points | Feedback
//
// Add headers manually to row 1 of each tab before first use.

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'leaderboard') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leaderboard');
    const rows = sheet.getDataRange().getValues().slice(1); // skip header
    const entries = rows
      .filter(r => r[0] && r[1])
      .map(r => ({ name: r[0], score: parseFloat(r[1]) || 0, date: r[2] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return ContentService
      .createTextOutput(JSON.stringify({ entries }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (data.action === 'submitRound') {
    // Append round summary to Leaderboard tab
    const lb = ss.getSheetByName('Leaderboard');
    lb.appendRow([data.name, data.score, data.date]);

    // Append every individual shot to Shots tab
    const shots = ss.getSheetByName('Shots');
    for (const shot of data.shots) {
      shots.appendRow([
        data.name,
        data.date,
        shot.yards,
        shot.bucket,
        shot.shotNum,
        shot.proximity,
        shot.points,
        shot.feedback,
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}
