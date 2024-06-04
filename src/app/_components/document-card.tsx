import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Doc } from '../../../convex/_generated/dataModel'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DocumentCard({ document }: { document: Doc<'documents'> }) {
  return (
    <Card className="min-w-[200px]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {document.title}
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/documents/${document._id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
