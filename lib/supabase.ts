import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cfwppxjifppdymsvmkhy.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd3BweGppZnBwZHltc3Zta2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI1MjM1NzgsImV4cCI6MjAwODA5OTU3OH0.IuyJanaiMAu0AZRJlxC3QicjlgN6ojJRweTxJBG5Ibw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})