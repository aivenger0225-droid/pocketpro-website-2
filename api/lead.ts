import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, company, industry, budget, painPoint } = request.body;

  // Validate required fields
  if (!name || !phone || !email || !company) {
    return response.status(400).json({ error: 'Missing required fields' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
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

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({ error: 'Failed to send email' });
  }
}
