import { Resend } from 'resend';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1IcjgEteD0ieSoNdWHYGMzukXp5Tu3mJUbGF7kB3E7rA';

export const dynamic = 'force-dynamic';

async function appendToSheet(data: {
  name: string;
  phone: string;
  email: string;
  company: string;
  industry?: string;
  budget?: string;
  painPoint?: string;
}) {
  try {
    console.log('Starting Google Sheets append...');
    console.log('CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
    console.log('PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const client = await auth.getClient();

    const timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    console.log('Appending to sheet:', SPREADSHEET_ID);
    
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: '工作表1!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          data.name,
          data.phone,
          data.email,
          data.company,
          data.industry || '未選擇',
          data.budget || '未選擇',
          data.painPoint || '未填寫',
          '新客戶'
        ]],
      },
    });

    console.log('Sheet appended successfully:', result.data);
    return true;
  } catch (error: any) {
    console.error('Google Sheets error full:', JSON.stringify(error, null, 2));
    console.error('Google Sheets error message:', error.message);
    console.error('Google Sheets error code:', error.code);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, company, industry, budget, painPoint } = body;

    // Validate required fields
    if (!name || !phone || !email || !company) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email notification
    await resend.emails.send({
      from: 'PocketPro <onboarding@getpocketpro.com>',
      to: 'jump@pocketpro.tw',
      subject: `新客戶：${name}`,
      html: `
        <h2>有新客戶提交表單！</h2>
        <p><strong>姓名：</strong>${name}</p>
        <p><strong>電話：</strong>${phone}</p>
        <p><strong>Email：</strong>${email}</p>
        <p><strong>公司：</strong>${company}</p>
        <p><strong>產業：</strong>${industry || '未選擇'}</p>
        <p><strong>預算：</strong>${budget || '未選擇'}</p>
        <p><strong>痛點：</strong>${painPoint || '未填寫'}</p>
      `
    });

    // Save to Google Sheets
    await appendToSheet({ name, phone, email, company, industry, budget, painPoint });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
