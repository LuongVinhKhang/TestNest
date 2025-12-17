
import type { TestCase, TestResult, Reporter } from '@playwright/test/reporter';
import { google } from 'googleapis';
import fs from 'fs';

// Set these in your .env file or directly here
const SHEET_ID = process.env.GOOGLE_SHEET_ID || '<YOUR_SHEET_ID>';
const CREDENTIALS_PATH = process.env.GOOGLE_API_CREDENTIALS || './google-credentials.json';

export class GoogleSheetReporter implements Reporter {
  private results: Array<{ name: string; status: string; duration: number }> = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
    });
  }

  async onEnd() {
    try {
      // Load client secrets from a local file.
      const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });

      // Prepare rows to append
      const values = this.results.map(r => [r.name, r.status, r.duration]);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'RAW',
        requestBody: { values },
      });
      console.log('Test results pushed to Google Sheets.');
    } catch (err) {
      console.error('Failed to push results to Google Sheets:', err);
    }
  }
}

// Setup instructions:
// 1. Create a Google Cloud project and enable Sheets API.
// 2. Download credentials as google-credentials.json and place in project root.
// 3. Set GOOGLE_SHEET_ID and GOOGLE_API_CREDENTIALS in .env.
// 4. Add to playwright.config.ts:
//    import { GoogleSheetReporter } from './utils/googleSheetReporter';
//    reporter: [ ['html'], [new GoogleSheetReporter()] ]
