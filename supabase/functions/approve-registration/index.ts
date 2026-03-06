import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { registration_id } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get registration details
  const { data: reg, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registration_id)
    .single()

  if (regError || !reg) {
    return new Response(JSON.stringify({ error: 'Registration not found' }), { status: 404 })
  }

  // Generate a cryptographically secure random password
  const randomBytes = new Uint8Array(12)
  crypto.getRandomValues(randomBytes)
  const password = Array.from(randomBytes).map(b => b.toString(36)).join('').slice(0, 10).toUpperCase() +
    Array.from(new Uint8Array(4)).map((_, i) => { crypto.getRandomValues(new Uint8Array(1)); return '0123456789'[randomBytes[i] % 10] }).join('') + '!'

  // Create auth user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: reg.email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: reg.student_name,
      registration_id,
    }
  })

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400 })
  }

  // TODO: Send email with credentials via Resend or Supabase email
  // Credentials should be sent via secure email delivery, not returned in API responses
  console.log(`Auth user created for ${reg.email} (user_id: ${authUser.user?.id})`)

  return new Response(JSON.stringify({
    success: true,
    message: `Credentials created for ${reg.email}. Send password via email to the student.`,
  }), { status: 200 })
})
