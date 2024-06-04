/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { z } from 'zod'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'convex/react'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '../../../convex/_generated/api'

import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { SheetFooter } from '@/components/ui/sheet'

const createDocumentFormSchema = z.object({
  title: z.string().min(1).max(250),
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'File is required',
  }),
})

export function UploadDocumentForm({ onClose }: { onClose: () => void }) {
  const [isUploading, setIsUploading] = useState(false)

  const createDocument = useMutation(api.documents.createDocument)
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl)

  const form = useForm<z.infer<typeof createDocumentFormSchema>>({
    resolver: zodResolver(createDocumentFormSchema),
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsUploading(true)
      const url = await generateUploadUrl()

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': data.file.type,
        },
        body: data.file,
      })

      const { storageId } = await response.json()
      await createDocument({
        title: data.title,
        fileId: storageId,
      })

      toast({
        title: 'Success',
        description: `Document uploaded successfully!`,
        variant: 'primary',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: `Document upload failed! Please try again later.`,
      })
    } finally {
      onClose()
      setIsUploading(false)
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="relative flex flex-col">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Expanse Report." {...field} />
                </FormControl>
                <FormDescription>
                  This will be the publicly displayed title for your document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col">
                    <FormLabel
                      htmlFor="formFile"
                      className="font-medium mb-2 text-sm cursor-pointer"
                    >
                      Document
                    </FormLabel>
                    <Input
                      {...fieldProps}
                      type="file"
                      id="formFile"
                      accept=".pdf, .csv, .json, .xml, .doc, .txt"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        if (file) {
                          onChange(file)
                        }
                      }}
                      className="file:bg-secondary file:h-10 p-0 placeholder:text-gray-500 text-gray-500"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Your document in the format (PDF, DOCX, PPTX, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SheetFooter className="mt-auto fixed bottom-4 right-[24px]">
          <Button
            type="submit"
            className="flex justify-center items-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                <span>Uploading Document</span>
              </>
            ) : (
              <span>Upload Document</span>
            )}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}
