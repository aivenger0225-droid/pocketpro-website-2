import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createContact: vi.fn().mockResolvedValue(undefined),
  getContacts: vi.fn().mockResolvedValue([]),
  getContactsStats: vi.fn().mockResolvedValue({
    daily: [
      { date: "2026-01-26", count: 5 },
      { date: "2026-01-27", count: 3 },
    ],
    monthly: [
      { month: "2026-01", count: 15 },
    ],
    total: 15,
  }),
}));

describe("contact.getStats", () => {
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

  it("should return stats with daily and monthly data", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.contact.getStats();

    expect(result).toBeDefined();
    expect(result.daily).toBeDefined();
    expect(result.monthly).toBeDefined();
    expect(result.total).toBeDefined();
    expect(Array.isArray(result.daily)).toBe(true);
    expect(Array.isArray(result.monthly)).toBe(true);
  });

  it("should have correct structure for daily data", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.contact.getStats();

    if (result.daily.length > 0) {
      expect(result.daily[0]).toHaveProperty("date");
      expect(result.daily[0]).toHaveProperty("count");
      expect(typeof result.daily[0].count).toBe("number");
    }
  });

  it("should have correct structure for monthly data", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.contact.getStats();

    if (result.monthly.length > 0) {
      expect(result.monthly[0]).toHaveProperty("month");
      expect(result.monthly[0]).toHaveProperty("count");
      expect(typeof result.monthly[0].count).toBe("number");
    }
  });

  it("should return total count", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.contact.getStats();

    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(typeof result.total).toBe("number");
  });
});
