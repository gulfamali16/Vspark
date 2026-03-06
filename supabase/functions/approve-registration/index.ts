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

  // Generate a random password
  const password = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6).toUpperCase() + '!'

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
  // For now, the password is returned (in production, email it to reg.email)
  console.log(`Credentials for ${reg.email}: password=${password}`)

  return new Response(JSON.stringify({
    success: true,
    message: `Credentials created for ${reg.email}`,
    // Remove password from response in production:
    _debug_password: password
  }), { status: 200 })
})
