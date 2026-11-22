# Fresh Datespot Google Sheets connection

New destination: https://docs.google.com/spreadsheets/d/15GfFqb3MHWjfiqDX9vDyJrm6wX1kqAMFkZR04WNp4iM/edit

The **Leads** tab contains: Date, Full Name, Phone Number, Status, Notes, Payment Screenshot.
The new version saves the screenshot privately in Google Drive, creates the lead, and deducts one of 26 slots per unique phone. A screenshot upload counts as a joining; payment status is **not** verified.

## Deploy before merging the website change

1. Open https://script.google.com and create a **new Apps Script project** (or use the fresh spreadsheet's **Extensions > Apps Script**).
2. Paste `google-apps-script/Code.gs` into `Code.gs` and save. It is preconfigured for the fresh spreadsheet ID above; authorize access as the spreadsheet owner.
3. Run `authorizeScreenshotStorage` once and grant Google Sheets and Drive permissions. Ensure the project owner can edit the destination spreadsheet.
4. Deploy > **New deployment** > **Web app**. Execute as **Me**; Who has access **Anyone**. Copy the new `/exec` URL.
5. In `src/app/slots.tsx`, replace the `SHEET_URL` with **that new deployment URL**. The payment form imports this same URL; do not use separate endpoints.
6. Check `/exec?action=slots&callback=dsCheck` returns `dsCheck({"slots":26});` before switching traffic.
7. Test a real signup from a preview build: select an image, submit a new name/phone, confirm one `Leads` row with the screenshot hyperlink in column F and slots = 25. Retry the **same phone** to confirm it does not reduce again.
8. After those backend tests pass, merge the pull request. A GitHub commit **does not** deploy Google Apps Script.

**Do not merge without deploying and verifying the Apps Script**, or registration will fail. Do not publish a screenshot folder or personal details publicly. Existing leads and screenshot links are untouched in the old spreadsheets. The new counter starts from 26; migrate old join counts manually if the 26 is not the true current remaining count.
