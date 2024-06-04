'use client'

import {
  Bot,
  CircleUserRound,
  ClipboardIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Id } from '../../../../../convex/_generated/dataModel'

type Chat = {
  _id: Id<'chats'>
  _creationTime: number
  tokenIdentifier: string
  documentId: Id<'documents'>
  text: string
  isHuman: boolean
}

export function ChatMessages({ chats }: { chats?: Chat[] }) {
  if (!chats) return <div className="p-4 space-y-4" />

  return (
    <div className="p-4 space-y-4">
      {chats.map((chat) =>
        !chat.isHuman ? (
          <div
            className="flex items-start text-end justify-end gap-4"
            key={chat._id}
          >
            <div className="grid gap-1 text-end">
              <div className="font-bold text-end">AI Assistant</div>
              <div className="prose prose-stone text-end">
                <p>{chat.text}</p>
              </div>
              <div className="flex items-center gap-2 py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                >
                  <ClipboardIcon className="w-4 h-4" />
                  <span className="sr-only">Copy</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                >
                  <ThumbsUpIcon className="w-4 h-4" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                >
                  <ThumbsDownIcon className="w-4 h-4" />
                  <span className="sr-only">Downvote</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                >
                  <RefreshCcwIcon className="w-4 h-4" />
                  <span className="sr-only">Regenerate</span>
                </Button>
              </div>
            </div>
            <Avatar className="border w-8 h-8 flex justify-center items-center bg-primary">
              <Bot className="w-[22px] h-[22px] text-secondary" />
            </Avatar>
          </div>
        ) : (
          <div className="flex items-start gap-4" key={chat._id}>
            <Avatar className="border w-8 h-8 flex justify-center items-center bg-primary">
              <CircleUserRound className="w-[22px] h-[22px] text-secondary" />
            </Avatar>
            <div className="grid gap-1">
              <div className="font-bold">You</div>
              <div className="prose prose-stone">
                <p>{chat.text}</p>
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  )
}
