import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createContact: vi.fn().mockResolvedValue(undefined),
  getContacts: vi.fn().mockResolvedValue([]),
}));

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

describe("contact.submitContact", () => {
  let mockContext: TrpcContext;

  beforeEach(() => {
    mockContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
      } as unknown as TrpcContext["res"],
    };
  });

  it("should submit contact successfully", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.contact.submitContact({
      name: "John Doe",
      email: "john@example.com",
      phone: "+886912345678",
      company: "Tech Company",
      message: "Interested in services",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Contact submitted successfully");
  });

  it("should validate email format", async () => {
    const caller = appRouter.createCaller(mockContext);

    try {
      await caller.contact.submitContact({
        name: "John Doe",
        email: "invalid-email",
        phone: "+886912345678",
        company: "Tech Company",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });

  it("should require all mandatory fields", async () => {
    const caller = appRouter.createCaller(mockContext);

    try {
      await caller.contact.submitContact({
        name: "",
        email: "john@example.com",
        phone: "+886912345678",
        company: "Tech Company",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toBeDefined();
    }
  });

  it("should accept optional message field", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.contact.submitContact({
      name: "John Doe",
      email: "john@example.com",
      phone: "+886912345678",
      company: "Tech Company",
    });

    expect(result.success).toBe(true);
  });
});
