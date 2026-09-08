import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    organisation: v.string(),
    role: v.optional(v.string()),
    productInterest: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEmail = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingEmail) {
      throw new Error("ALREADY_REGISTERED");
    }

    // Check if phone already exists
    const existingPhone = await ctx.db
      .query("leads")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();

    if (existingPhone) {
      throw new Error("ALREADY_REGISTERED");
    }

    return await ctx.db.insert("leads", {
      ...args,
      status: "new",
      eventId: "osr-2026",
      createdAt: Date.now(),
    });
  },
});

const ADMIN_EMAILS = ["rodney@craftsilicon.com", "info@craftsilicon.com"];

const checkAdmin = (identity: any) => {
  if (!identity) return false;
  const role = identity.role || identity.publicMetadata?.role || identity.tokenIdentifier?.split("|")[2]; // Sometimes role is in tokenIdentifier
  const email = identity.email;
  return role === "admin" || (email && ADMIN_EMAILS.includes(email));
};

export const updateStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!checkAdmin(identity)) throw new Error("Unauthorized");
    
    return await ctx.db.patch(args.id, { status: args.status });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!checkAdmin(identity)) {
      console.log("Unauthorized access attempt to list leads", identity?.email);
      return [];
    }
    
    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!checkAdmin(identity)) return { total: 0, today: 0 };

    const leads = await ctx.db
      .query("leads")
      .withIndex("by_eventId", (q) => q.eq("eventId", "osr-2026"))
      .collect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayMillis = startOfToday.getTime();

    const todayLeads = leads.filter((l) => l.createdAt >= todayMillis).length;

    return {
      total: leads.length,
      today: todayLeads,
    };
  },
});

export const exportAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!checkAdmin(identity)) throw new Error("Unauthorized");

    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const checkDuplicate = query({
  args: {
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = { email: false, phone: false };
    if (args.email) {
      const existingEmail = await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("email", args.email!))
        .first();
      if (existingEmail) result.email = true;
    }
    if (args.phone) {
      const existingPhone = await ctx.db
        .query("leads")
        .withIndex("by_phone", (q) => q.eq("phone", args.phone!))
        .first();
      if (existingPhone) result.phone = true;
    }
    return result;
  },
});
