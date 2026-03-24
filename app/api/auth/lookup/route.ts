import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// This endpoint looks up a user's email by their username/full_name
export async function POST(request: Request) {
  try {
    const { identifier } = await request.json()

    if (!identifier) {
      return NextResponse.json({ error: 'Identifier required' }, { status: 400 })
    }

    // If it looks like an email, return it directly
    if (identifier.includes('@')) {
      return NextResponse.json({ email: identifier })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Otherwise, search for a user by full_name using service role
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error looking up user:', error)
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
    }

    // Find user by full_name (case-insensitive)
    const user = data.users.find(
      (u) => u.user_metadata?.full_name?.toLowerCase() === identifier.toLowerCase()
    )

    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ email: user.email })
  } catch (error) {
    console.error('Error in lookup API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
