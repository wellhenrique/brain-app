'use client'
import { useAction } from 'convex/react'
import { ArrowUpIcon, Loader2 } from 'lucide-react'

import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'

type QuestionFormProps = {
  documentId: Id<'documents'>
  setWarningMessage: (message: string) => void
}

const QuestionFormSchema = z.object({
  question: z.string().min(1),
})

export function QuestionForm({
  documentId,
  setWarningMessage,
}: QuestionFormProps) {
  const [isSending, setIsSending] = useState(false)

  const askQuestion = useAction(api.documents.askQuestion)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
  })

  const onSubmit = async (data: z.infer<typeof QuestionFormSchema>) => {
    setIsSending(true)

    await askQuestion({
      question: data.question,
      documentId,
    })

    form.reset()

    setIsSending(false)
  }

  const ask = form.watch('question')

  useEffect(() => {
    if (form.formState.errors.question?.message) {
      setWarningMessage(form.formState.errors.question.message)
    } else {
      setWarningMessage('')
    }
  }, [form.formState.errors, setWarningMessage, ask])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <Textarea
              {...field}
              rows={1}
              id="message"
              name="message"
              ref={inputRef}
              placeholder="Ask a question about the document..."
              className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16 dark:border-gray-800"
            />
          )}
        />

        <Button
          size="icon"
          type="submit"
          disabled={isSending}
          className="absolute flex justify-center items-center top-3 right-3 w-8 h-8 cursor-pointer"
        >
          {isSending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ArrowUpIcon className="w-4 h-4 cursor-pointer" />
          )}
        </Button>
      </form>
    </Form>
  )
}
