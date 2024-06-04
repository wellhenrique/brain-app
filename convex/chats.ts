import { internalMutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getChatsForDocument = query({
  args: {
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if (!userId) {
      return []
    }

    return await ctx.db
      .query('chats')
      .withIndex('by_documentId_tokenIdentifier', (q) =>
        q.eq('documentId', args.documentId).eq('tokenIdentifier', userId),
      )
      .collect()
  },
})

export const createChatRecord = internalMutation({
  args: {
    documentId: v.id('documents'),
    tokenIdentifier: v.string(),
    isHuman: v.boolean(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('chats', {
      tokenIdentifier: args.tokenIdentifier,
      documentId: args.documentId,
      isHuman: args.isHuman,
      text: args.text,
    })
  },
})
