import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rueuhdjpvamlwgoavyti.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXVoZGpwdmFtbHdnb2F2eXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzI0NzYsImV4cCI6MjA2ODE0ODQ3Nn0._8dFsXX6kDziiPeZOhI_VQpzy-2acP6_hGBjj-Zzepk'

export const supabase = createClient(supabaseUrl, supabaseKey)
