'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'

import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'

import { QuestionForm } from './question-form'
import { ChatMessages } from './chat-messages'

type ChatPanelProps = {
  documentId: Id<'documents'>
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const [warningMessage, setWarningMessage] = useState('')

  const chats = useQuery(api.chats.getChatsForDocument, {
    documentId,
  })

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <div className="sticky top-0 bg-white dark:bg-gray-950 p-4 border-b">
        <h2 className="text-lg font-medium">Document Q&A</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <ChatMessages chats={chats} />
      </div>

      <div className="max-w-2xl w-full sticky bottom-0 mx-auto py-2 flex flex-col gap-1.5 px-4 bg-white dark:bg-gray-950">
        <div className="relative">
          <QuestionForm
            documentId={documentId}
            setWarningMessage={setWarningMessage}
          />
        </div>

        <p className="text-xs text-center h-4 text-red-500 font-medium">
          {warningMessage}
        </p>
      </div>
    </div>
  )
}
