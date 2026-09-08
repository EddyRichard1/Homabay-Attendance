import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    organisation: v.string(),
    role: v.optional(v.string()),
    productInterest: v.optional(v.string()),
    status: v.string(), // "new", "contacted", "qualified", "archived"
    eventId: v.string(),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_eventId", ["eventId"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),
});
