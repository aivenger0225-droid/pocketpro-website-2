import { Resend } from 'resend';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1IcjgEteD0ieSoNdWHYGMzukXp5Tu3mJUbGF7kB3E7rA';

// Hardcoded for testing - replace env vars later
const SERVICE_ACCOUNT = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL || 'pocketpro-sheet@project-d61f7947-3913-4800-b08.iam.gserviceaccount.com',
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCv44ONg1vbtDZy
Z0/nfKztYIpGxIgfvzQCkWXErg0vYXhMOYcK7sLFigp53J5An5dClGTASxXWMZlw
96GoyQib0RFHTJBX1nmUZJfinayf82+UDSItg3YkvgXynPX/9fOr51of+AaG5jWH
0EO3Y7/lnEr/RIcBih4UW65Sj7sBwIWRN3OMLIMguEnKTNLU/5pI4s46ezVXjIgS
q0m1x/JxgD8WsIQ+Ak1RKoIq4b9xKOTtmX4JRKyckz+K6Hjtn00uHHxWysGPo8T1
dQHiEXpIjS34R9E77Bh9YluTgAKBOARaTmQeLGpiPC4s/TJng5TGmlOmAYdrAMS+
gHHQZEV1AgMBAAECggEAGTEKVfni7bA9fhw67wpF0Efb9i/O2VEu11FQ1J8jJ06c
BrrUkyXIQre3MWX+Sn4xEWmkloAKlB+NfQcSodSNRZfnlCEsqVAAINdZg60WnOAm
cnuBEii6gp+uxWVivHLTICNmHp8M/EQ7lYSoNjt0sCO3ACGl/nv0O/E3of6RB7p4
+LkEG2xCMpYJR73eAAzFOU0pFeBYGEElDgWzoZO4JLI/DzfrFEsI1jI6mRkBAmEo
tbZYPGOqeKVVM7JYxFNSqIB3Z370pp8HK2Ctg+o/xtD3KuaEcR8Q3Se+GWeTZU13
i5CPq8mPzELYd1IPISz+0FKvCEI/mC0ExmNRGMUL4QKBgQDZ1nd6cYa6jfVWPc31
z5nx85R/uS8qI2DDLRvKBfsK1hy4k2MJ1e+kGbENfPri4Al31+ogT7cqMmxgNpHH
zoDAtsipy9Gz6BNk//qeUiBgWkNGLms/hzKx98QmLQlIln344MdYDMs77zWfW9o9
tFcq2ZTQeGUwSDtBDqIWwRZUhQKBgQDOs7o1nIM9GjGkscKocMqoC3585VLO7WP1
B4W3ltX7DhpYLTqfzlSonELD1LV0CCbv/Go3X07y0AzGrHUBzf4iirAhlOd1Ruqd
LRsgYsUorxASsWR50xDBySTBCPrlzYVX7y5nHCjqG4P+rGmYRzkDqAG5suodKy6n
at1mzG04MQKBgD6sBE3W8aMkimwYdfP9mVXR9WxVs+sUqJcemDskQ1iXx0WXKcw/
n6V/ur+dsHSrbi3rkbFgHdtnDGUV7hUlJUfMjqjDOf7fiwzo1IrOKABwl6BOZI6v
b/dhyC4PkPcwTOfYi6GadLI2nR/PBlfwVY+/b6AWs04TyfBqrFmNjcYdAoGAAxAA
o0i1XRNlRuZnVu2M4x6AekM/jddQktHQtl6ivvx/gWzyIGoDMRhXmOUu5xAz23xm
6nkcB1bzyYHGngc6S7K4V1cIcuFhGoEPlNRBzY+CcnR0Y6Wv6t8bD00dwofgAOSH
UHnHVWig9QYC7oGno5k6pVC0TUhVgZ+AtkQzHhECgYA+C91PBv6MxJ6A/TSUjbWh
EECnzio31464VQJn2zLNSeQp8kdfkKQ+jaBBF8c6to8HYTpEuBB6Zib4xp49ZdhC
9s4hIrq8oO51SQmYxRbWgcUrnEI6b+dI/QQjHxHVsOkC5iKsit25iFqNP7mA0Bfl
EaaIeswNF+nhhoBbOpLeeQ==
-----END PRIVATE KEY-----`
};

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
    console.log('Using service account:', SERVICE_ACCOUNT.client_email);
    
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    await auth.getClient();

    const timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    
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

    console.log('Sheet appended:', result.data);
    return true;
  } catch (error: any) {
    console.error('Sheets error:', error.message);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, company, industry, budget, painPoint } = body;

    if (!name || !phone || !email || !company) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

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
