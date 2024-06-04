'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UploadDocumentForm } from './upload-document-form'
import { Upload } from 'lucide-react'

export function CreateDocumentButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-3" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[60%] min-h-[350px] flex flex-col justify-start">
        <DialogHeader className="mt-10 mb-5">
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a team document for you to search over in the future.
          </DialogDescription>
        </DialogHeader>

        <UploadDocumentForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
