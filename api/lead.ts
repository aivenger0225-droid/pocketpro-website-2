import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

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

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
