# Deploy Datespot to the new Leads spreadsheet

The website and Apps Script are separate deployments. **Do not merge the frontend URL change until the script is deployed and tested.**

1. Open the **new** Google Sheet, then Extensions → Apps Script (the script must be bound to that spreadsheet).
2. Replace Code.gs with the contents of this repository's `google-apps-script/Code.gs` from this branch. The prior lead-only script does not support screenshots or slots.
3. Save and run `authorizeScreenshotStorage` once to grant Drive access.
4. Deploy → Manage deployments → Edit the existing web app ending `...PoTS7/exec` → New version → Deploy. Execute as **Me**, access **Anyone**. Keep the same /exec URL.
5. Test `?action=slots&callback=dsCheck` on the /exec URL. It should return a JavaScript callback with a slots count. Then submit a test signup and screenshot, verify a single row in the **Leads** tab (A date, B name, C phone, F screenshot link) and verify the slots count decreases once. Test duplicate receipt and duplicate phone.
6. Only after successful backend testing, merge the PR to deploy the frontend's new endpoint.

**Important:** The new Apps Script project has fresh Script Properties, so the slots counter starts at `INITIAL_SLOTS = 26` unless you manually migrate the previous remaining count and per-phone join markers. For an ongoing campaign, migrate those properties before launch to avoid resetting counts. Do not reset `ds_remaining_slots_v1` after deployment.

The screenshot is stored in a private Google Drive folder. The saved screenshot is **not** verification of payment.

This code assumes the new spreadsheet is clean and the Leads tab is dedicated to the automated leads. It finds the next row based on the last name/phone rather than prefilled dates. Do not add date-only rows to the Leads tab.
