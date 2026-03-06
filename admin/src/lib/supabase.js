import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const adminLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const adminLogout = async () => {
  await supabase.auth.signOut()
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Events
export const getEvents = async () => {
  const { data, error } = await supabase.from('events').select('*').order('date')
  return { data, error }
}
export const addEvent = async (evt) => {
  const { data, error } = await supabase.from('events').insert([evt]).select()
  return { data, error }
}
export const updateEvent = async (id, updates) => {
  const { data, error } = await supabase.from('events').update(updates).eq('id', id).select()
  return { data, error }
}
export const deleteEvent = async (id) => {
  const { error } = await supabase.from('events').delete().eq('id', id)
  return { error }
}

// Registrations
export const getRegistrations = async () => {
  const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
  return { data, error }
}
export const deleteRegistration = async (id) => {
  const { error } = await supabase.from('registrations').delete().eq('id', id)
  return { error }
}

// Blogs
export const getBlogs = async () => {
  const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
  return { data, error }
}
export const addBlog = async (blog) => {
  const { data, error } = await supabase.from('blogs').insert([blog]).select()
  return { data, error }
}
export const updateBlog = async (id, updates) => {
  const { data, error } = await supabase.from('blogs').update(updates).eq('id', id).select()
  return { data, error }
}
export const deleteBlog = async (id) => {
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  return { error }
}

// Highlights
export const getHighlights = async () => {
  const { data, error } = await supabase.from('highlights').select('*').order('id', { ascending: false })
  return { data, error }
}
export const addHighlight = async (h) => {
  const { data, error } = await supabase.from('highlights').insert([h]).select()
  return { data, error }
}
export const deleteHighlight = async (id) => {
  const { error } = await supabase.from('highlights').delete().eq('id', id)
  return { error }
}
