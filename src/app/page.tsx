'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

import { DocumentCard } from './_components/document-card'
import { CreateDocumentButton } from './_components/create-document-button'

export default function Home() {
  const documents = useQuery(api.documents.getDocuments)

  return (
    <main className="container py-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Documents</h1>

        <CreateDocumentButton />
      </div>

      <div className="grid mt-10 grid-cols-4 gap-8">
        {documents?.map((document) => (
          <DocumentCard key={document._id} document={document} />
        ))}
      </div>
    </main>
  )
}
