import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContact, getContacts, getContactsStats } from "./db";
import { notifyOwner } from "./_core/notification";
import { createLeadInNotion } from "./notion";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submitContact: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          company: z.string().min(1),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createContact({
            name: input.name,
            email: input.email,
            phone: input.phone,
            company: input.company,
            message: input.message || null,
          });

          // Send email notification to admin
          const notificationTitle = `New Contact Submission from ${input.company}`;
          const notificationContent = buildNotificationContent(input);

          try {
            await notifyOwner({
              title: notificationTitle,
              content: notificationContent,
            });
          } catch (notificationError) {
            console.warn("Failed to send notification:", notificationError);
            // Don't throw - notification failure shouldn't block form submission
          }

          return { success: true, message: "Contact submitted successfully" };
        } catch (error) {
          console.error("Failed to submit contact:", error);
          throw new Error("Failed to submit contact");
        }
      }),
    getContacts: publicProcedure.query(async () => {
      try {
        const contacts = await getContacts();
        return contacts;
      } catch (error) {
        console.error("Failed to get contacts:", error);
        throw new Error("Failed to get contacts");
      }
    }),
    getStats: publicProcedure.query(async () => {
      try {
        const stats = await getContactsStats();
        return stats;
      } catch (error) {
        console.error("Failed to get stats:", error);
        throw new Error("Failed to get stats");
      }
    }),
  }),
  
  lead: router({
    submitLead: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().email(),
          company: z.string().min(1),
          industry: z.string().optional(),
          industryOther: z.string().optional(),
          budget: z.string().optional(),
          painPoint: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
            // Try to save to Notion (will fail if not properly shared)
            try {
              await createLeadInNotion({
                name: input.name,
                phone: input.phone,
                email: input.email,
                company: input.company,
                industry: input.industry || "未選擇",
                industryOther: input.industryOther,
                budget: input.budget || "未選擇",
                painPoint: input.painPoint || "",
              });
            } catch (notionError) {
              console.warn("[Lead] Notion save skipped:", notionError);
            }

            // Send notification to owner
            const notificationTitle = `🔔 新客戶！${input.company} - ${input.name}`;
            const notificationContent = [
              `姓名: ${input.name}`,
              `電話: ${input.phone}`,
              `Email: ${input.email}`,
              `公司: ${input.company}`,
              `產業: ${input.industry}${input.industryOther ? ` (${input.industryOther})` : ''}`,
              `預算: ${input.budget || '未填寫'}`,
              `痛點: ${input.painPoint || '未填寫'}`,
            ].join('\n');

            notifyOwner({
              title: notificationTitle,
              content: notificationContent,
            }).catch(console.warn);
          
          return { success: true, message: "Lead submitted successfully" };
        } catch (error) {
          console.error("Failed to submit lead:", error);
          throw new Error("Failed to submit lead");
        }
      }),
  }),
});

function buildNotificationContent(input: {
  name: string;
  email: string;
  phone: string;
  company: string;
  message?: string;
}): string {
  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Company: ${input.company}`,
  ];

  if (input.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(input.message);
  }

  return lines.join("\n");
}

export type AppRouter = typeof appRouter;
