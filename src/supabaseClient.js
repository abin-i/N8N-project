import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ltbaeojrnpomciprpgen.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0YmFlb2pybnBvbWNpcHJwZ2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTc1NDIsImV4cCI6MjA2ODEzMzU0Mn0.hDVRShkGQeDHH18U2Kl5D8rDQZHhJBbYSGhBHVAVEOA'

export const supabase = createClient(supabaseUrl, supabaseKey)
