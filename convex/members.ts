import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

const populateUsers = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    // we are returning only one user who is the member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return [];
    }

    const members = [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    for (const member of data) {
      const user = await populateUsers(ctx, member.userId);

      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }

    return members;
  },
});

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    // we are returning only one user who is the member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return member;
  },
});

export const getById = query({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      return null;
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) return null;

    const user = await populateUsers(ctx, member.userId);

    if (!user) return null;

    return {
      ...member,
      user,
    };
  },
});

export const update = mutation({
  args: {
    memberId: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorised");
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new Error("Unauthorised");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorised");
    }

    await ctx.db.patch(args.memberId, {
      role: args.role,
    });

    return args.memberId;
  },
});

export const remove = mutation({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorised");
    }

    const member = await ctx.db.get(args.memberId);

    if (!member) {
      throw new Error("Unauthorised");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", member.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      throw new Error("Unauthorised");
    }

    if (member.role === "admin") {
      throw new Error("Cannot remove an admin");
    }

    if (currentMember._id === args.memberId && currentMember.role === "admin") {
      throw new Error("Cannot remove self if self is an admin");
    }

    // delete all messages, reactions, conversation of the member
    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", args.memberId))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", args.memberId))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), args.memberId),
            q.eq(q.field("memberTwoId"), args.memberId)
          )
        )
        .collect(),
    ]);

    // iterate all the array and delete based in id
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(args.memberId);

    return args.memberId;
  },
});
