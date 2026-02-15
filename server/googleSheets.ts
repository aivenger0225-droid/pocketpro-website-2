import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Initialize auth
const getAuth = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: SCOPES,
  });
  return auth;
};

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

export async function appendLeadToSheet(data: {
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  industryOther?: string;
  budget: string;
  painPoint: string;
}) {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
    console.warn("[Google Sheets] Credentials not configured");
    return null;
  }

  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const row = [
      new Date().toISOString(), // 提交時間
      data.name,
      data.phone,
      data.email,
      data.company,
      data.industry + (data.industryOther ? ` (${data.industryOther})` : ""),
      data.budget || "未填寫",
      data.painPoint || "未填寫",
      "新客戶", // 狀態
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "A:I", // Adjust based on your sheet columns
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    console.log("[Google Sheets] Lead added:", response.data.updates?.updatedCells);
    return response;
  } catch (error) {
    console.error("[Google Sheets] Failed to add lead:", error);
    throw error;
  }
}
