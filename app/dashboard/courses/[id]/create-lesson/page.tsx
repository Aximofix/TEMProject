'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [orderIndex, setOrderIndex] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!orderIndex) {
        setError('Order is required')
        return
      }

      const { error: insertError } = await supabase.from('lessons').insert({
        course_id: courseId,
        title,
        description,
        content,
        order_index: parseInt(orderIndex),
      })

      if (insertError) throw insertError

      router.push(`/dashboard/courses/${courseId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Lesson</h1>
        <p className="text-muted-foreground">Add a new lesson to your course</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="order">Lesson Order *</Label>
              <Input
                id="order"
                type="number"
                placeholder="1"
                min="1"
                required
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to HTML"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the lesson"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Lesson Content</Label>
              <Textarea
                id="content"
                placeholder="Write your lesson content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Lesson'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
