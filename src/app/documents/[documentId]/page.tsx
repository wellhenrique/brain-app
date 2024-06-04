/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

import { ChatPanel } from './_components/chat-panel'
import { DocumentIframe } from './_components/document-iframe'

type Props = {
  params: { documentId: Id<'documents'> }
}

export default function DocumentPage({ params }: Props) {
  const document = useQuery(api.documents.getDocumentByUniqueId, {
    documentId: params.documentId,
  })

  if (!document) {
    return (
      <div className="w-full h-[calc(100vh-75px)] m-auto flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          You don&apos;t have access to view this document
        </h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-start">
      <h1 className="text-2xl font-semibold pl-10 pt-10 mx-auto">
        {document.title}
      </h1>

      <div className="grid md:grid-cols-[1fr_400px] h-[700px] gap-8 w-full max-w-6xl mx-auto p-4 md:p-8">
        <div className="border rounded-lg overflow-hidden">
          <DocumentIframe url={document.documentUrl} />
        </div>

        <ChatPanel documentId={params.documentId} />
      </div>
    </div>
  )
}
