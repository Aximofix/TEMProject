'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfessorCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Get course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single()

        if (courseError) throw courseError
        setCourse(courseData)

        // Get lessons
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true })

        setLessons(lessonsData || [])

        // Get assignments
        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('*')
          .eq('course_id', courseId)
          .order('due_date', { ascending: true })

        setAssignments(assignmentsData || [])

        // Get enrollments
        const { data: enrollmentsData } = await supabase
          .from('enrollments')
          .select('*, profiles:student_id(email, full_name)')
          .eq('course_id', courseId)

        setEnrollments(enrollmentsData || [])
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return
    try {
      await supabase.from('lessons').delete().eq('id', lessonId)
      setLessons(lessons.filter((l) => l.id !== lessonId))
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    if (!confirm('Delete this assignment?')) return
    try {
      await supabase.from('assignments').delete().eq('id', assignmentId)
      setAssignments(assignments.filter((a) => a.id !== assignmentId))
    } catch (error) {
      console.error('Error deleting assignment:', error)
    }
  }

  if (loading) {
    return <div>Loading course...</div>
  }

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">{course.code}</p>
      </div>

      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
          <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
          <TabsTrigger value="students">Students ({enrollments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lessons</h2>
            <Link href={`/dashboard/courses/${courseId}/create-lesson`}>
              <Button>Add Lesson</Button>
            </Link>
          </div>

          {lessons.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No lessons yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Lesson {lesson.order_index}: {lesson.title}</CardTitle>
                        {lesson.description && <CardDescription>{lesson.description}</CardDescription>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLesson(lesson.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Assignments</h2>
            <Link href={`/dashboard/courses/${courseId}/create-assignment`}>
              <Button>Create Assignment</Button>
            </Link>
          </div>

          {assignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No assignments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/assignments/${assignment.id}/submissions`}>
                          <Button variant="outline" size="sm">
                            View Submissions
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAssignment(assignment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <h2 className="text-2xl font-bold">Enrolled Students</h2>

          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No students enrolled yet</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{enrollment.profiles?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.profiles?.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
