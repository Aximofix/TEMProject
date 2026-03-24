// Common types used throughout the application

export type UserRole = 'student' | 'professor' | 'admin'

export interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  code?: string
  description?: string
  professor_id: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  enrollment_date: string
  enrolled_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description?: string
  content?: string
  order_index?: number
  order_num?: number
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  course_id: string
  title: string
  description?: string
  due_date: string
  max_points?: number
  max_score?: number
  created_at: string
  updated_at: string
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  content?: string
  file_url?: string
  file_name?: string
  submitted_at: string
  updated_at: string
}

export interface Grade {
  id: string
  submission_id: string
  score: number
  feedback?: string
  graded_by: string
  graded_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface EnrollmentRequest {
  course_id: string
  enrollment_code?: string
}

export interface SubmissionRequest {
  assignment_id: string
  content?: string
  file_url?: string
  file_name?: string
}

export interface GradeRequest {
  submission_id: string
  score: number
  feedback?: string
}
