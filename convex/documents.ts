import OpenAi from 'openai'
import { ConvexError, v } from 'convex/values'

import {
  MutationCtx,
  QueryCtx,
  action,
  internalQuery,
  mutation,
  query,
} from './_generated/server'
import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<'documents'>,
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

  if (!userId) {
    return null
  }

  const document = await ctx.db.get(documentId)

  if (!document) {
    return null
  }

  if (document.tokenIdentifier !== userId) {
    return null
  }

  return { document, userId }
}

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if (!userId) {
      return []
    }

    return await ctx.db
      .query('documents')
      .withIndex('by_tokenIdentifier', (query) =>
        query.eq('tokenIdentifier', userId),
      )
      .collect()
  },
})

export const getDocumentByUniqueId = query({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObject = await hasAccessToDocument(ctx, args.documentId)

    if (!accessObject) {
      return null
    }

    const documentUrl = await ctx.storage.getUrl(accessObject.document.fileId)

    return {
      ...accessObject.document,
      documentUrl,
    }
  },
})

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id('_storage'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if (!userId) {
      throw new ConvexError('Not authenticated')
    }

    await ctx.db.insert('documents', {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
    })
  },
})

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl()
})

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    return hasAccessToDocument(ctx, args.documentId)
  },
})

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObject = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      },
    )

    if (!accessObject?.document) {
      throw new ConvexError('You do not have access to this document')
    }

    const file = await ctx.storage.get(accessObject.document.fileId)

    if (!file) {
      throw new ConvexError('File not found')
    }

    const text = await file.text()

    const chatCompletion: OpenAi.Chat.ChatCompletion =
      await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Here is a text file: ${text}`,
          },
          {
            role: 'user',
            content: `Please answer this question: ${args.question}`,
          },
        ],
      })

    await ctx.runMutation(internal.chats.createChatRecord, {
      tokenIdentifier: accessObject.userId,
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
    })

    const assistantResponse =
      chatCompletion.choices[0].message.content ?? 'Could not generate response'

    await ctx.runMutation(internal.chats.createChatRecord, {
      tokenIdentifier: accessObject.userId,
      documentId: args.documentId,
      text: assistantResponse,
      isHuman: false,
    })

    return chatCompletion.choices[0].message.content
  },
})
