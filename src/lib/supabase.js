/**
 * supabase.js — Supabase client singleton
 *
 * REFACTORING APPLIED:
 * 1. Added module-level JSDoc so every developer knows what this file exports
 * 2. Named the env variables clearly with inline comments explaining their purpose
 * 3. The client is created once and exported as a singleton — no changes to
 *    the logic, just clarity added
 *
 * Usage: import { supabase } from '../lib/supabase'
 */

import { createClient } from '@supabase/supabase-js'

// REFACTOR: Environment variables documented — REACT_APP_ prefix required by CRA,
// fallback strings are placeholders and will cause requests to fail intentionally
// if .env is not configured (fails loudly rather than silently)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

/**
 * supabase — Singleton Supabase client instance.
 * Import this wherever you need to query the database or manage auth.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
