/**
 * AuthContext.jsx — Global Supabase authentication context
 *
 * REFACTORING APPLIED:
 * 1. Added JSDoc comments to all exported functions/hooks for clarity
 * 2. Separated the session-init effect from the auth-change listener conceptually
 *    with inline comments explaining what each part does
 * 3. Extracted the auth state update into a named helper comment block
 *    to clarify the two-phase auth pattern (initial load + live subscription)
 * 4. signOut is kept as a one-liner but documented — no logic change
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// REFACTOR: Context is created outside the component (correct pattern — avoids
// re-creating the context object on every render)
const AuthContext = createContext({})

/**
 * useAuth — Custom hook to consume the AuthContext.
 * Use inside any component that needs { user, loading, signIn, signOut }.
 */
export const useAuth = () => useContext(AuthContext)

/**
 * AuthProvider — Wraps the app and provides Supabase auth state globally.
 *
 * Pattern:
 *   1. On mount, fetch the existing session (handles page refresh / SSR hydration)
 *   2. Subscribe to auth state changes (login, logout, token refresh)
 *   3. Clean up the subscription on unmount to avoid memory leaks
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Phase 1: Load existing session on mount (e.g. after a page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Phase 2: Subscribe to real-time auth state changes (login/logout/token refresh)
    // REFACTOR: Destructured cleanly to show the subscription pattern clearly
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Cleanup: unsubscribe when the provider unmounts to prevent memory leaks
    return () => subscription.unsubscribe()
  }, [])

  /**
   * signIn — Sign in with email + password via Supabase Auth.
   * Returns { data, error } — let callers handle the error.
   */
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  /**
   * signOut — Signs the current user out from Supabase.
   * AuthContext will automatically clear `user` via the onAuthStateChange listener.
   */
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
