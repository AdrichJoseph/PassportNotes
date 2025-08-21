import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://hxlnegsgozqzmjilieao.supabase.co'
const supabaseKey = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bG5lZ3Nnb3pxem1qaWxpZWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTY1MzMsImV4cCI6MjA3MTA5MjUzM30.mnIWOtQsrvnYr3q3hQofUIGXDjmVNiQ_imnRmOQ6ClU"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;