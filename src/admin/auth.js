/**
 * Autentikasi admin via Supabase Auth.
 *
 * Interface tetap sama: isAuthed(), login(), logout()
 * sehingga komponen lain tidak perlu berubah.
 *
 * ponytail: session listener bisa ditambahkan untuk multi-tab sync
 */
import { supabase } from '../utils/supabase.js'

/** @returns {Promise<boolean>} */
export async function isAuthed() {
  const { data } = await supabase.auth.getUser()
  return !!data?.user
}

/**
 * Login admin dengan email + password.
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function logout() {
  await supabase.auth.signOut()
}
