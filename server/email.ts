import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ADMIN_EMAIL = "jump@pocketpro.tw";

export async function sendLeadNotification(data: {
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  industryOther?: string;
  budget: string;
  painPoint: string;
}) {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not configured");
    return null;
  }

  try {
    const data_ = await resend.emails.send({
      from: "PocketPro <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `🔔 新客戶！${data.company} - ${data.name}`,
      html: `
        <h2>新客戶資料</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">姓名</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">電話</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">公司</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.company}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">產業</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.industry}${data.industryOther ? ` (${data.industryOther})` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">預算</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.budget || '未填寫'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">痛點</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.painPoint || '未填寫'}</td>
          </tr>
        </table>
        <p style="margin-top: 16px; color: #666;">此信件由 PocketPro 官網自動發送</p>
      `,
    });
    console.log("[Email] Lead notification sent:", data_.data?.id);
    return data_;
  } catch (error) {
    console.error("[Email] Failed to send lead notification:", error);
    throw error;
  }
}
