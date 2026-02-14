import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function createLeadInNotion(data: {
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  industryOther?: string;
  budget: string;
  painPoint: string;
}) {
  if (!process.env.NOTION_API_KEY) {
    console.warn("[Notion] API key not configured");
    return null;
  }

  if (!DATABASE_ID) {
    console.warn("[Notion] Database ID not configured");
    return null;
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.name,
              },
            },
          ],
        },
        電話: {
          rich_text: [
            {
              text: {
                content: data.phone,
              },
            },
          ],
        },
        Email: {
          email: data.email,
        },
        公司: {
          rich_text: [
            {
              text: {
                content: data.company,
              },
            },
          ],
        },
        產業: {
          select: {
            name: data.industryOther ? `${data.industry} (${data.industryOther})` : data.industry,
          },
        },
        預算: {
          select: {
            name: data.budget || "未填寫",
          },
        },
        痛點: {
          rich_text: [
            {
              text: {
                content: data.painPoint || "未填寫",
              },
            },
          ],
        },
        狀態: {
          select: {
            name: "新客戶",
          },
        },
      },
    });
    console.log("[Notion] Lead created:", response.id);
    return response;
  } catch (error) {
    console.error("[Notion] Failed to create lead:", error);
    throw error;
  }
}
