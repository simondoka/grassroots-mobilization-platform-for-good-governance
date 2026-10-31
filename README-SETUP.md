# Setup notes

## 1. Live member counter (Google Form -> website)
The site cannot read Google Form responses directly. Use this safe method (it shares ONLY the number, never names or phone numbers):
1. Open the Form -> Responses -> click the green Sheets icon to create a linked Google Sheet.
2. In that Sheet: Extensions -> Apps Script. Delete the sample code and paste:

    function doGet() {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var n = Math.max(sh.getLastRow() - 1, 0);
      return ContentService.createTextOutput(JSON.stringify({count: n}))
        .setMimeType(ContentService.MimeType.JSON);
    }

3. Deploy -> New deployment -> type "Web app" -> Execute as: Me -> Who has access: Anyone -> Deploy. Authorize when asked.
4. Copy the Web app URL (ends in /exec).
5. Open site.js and set:  var COUNT_URL = "PASTE_URL_HERE";
   If members who joined before the form existed should also be counted, set MEMBERS_BASE to that number.
6. Redeploy. The number updates by itself every 60 seconds.

Do NOT use "Publish to web" on the Sheet: that would expose every respondent's details publicly.

## 2. Facebook link
In site.js set:  var FB_URL = "https://www.facebook.com/your-page";

## 3. Join form link
The site uses the /viewform version of your Google Form link (the /edit link only works for the form owner).
Responses only work if the form is set to accept responses and not restricted to your organisation.

## 4. Deploy on Vercel
Drag the unzipped folder into a new Vercel project. No build settings needed.
