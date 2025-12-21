const { createClient } = require("@supabase/supabase-js");

/**
 * LAZY INITIALIZATION: Supabase client is created on-demand (request-time)
 * This ensures the server starts even if Supabase is unreachable.
 * @returns {Object} Supabase client instance
 * @throws {Error} If required environment variables are missing
 */
function getSupabase() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing Supabase env vars: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

module.exports = { getSupabase };
