// Load environment variables from .env file
import 'dotenv/config';

// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Create Supabase client using environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Test function to verify Supabase connection
async function testSupabaseConnection() {
  try {
    // Get the current user session to test authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError.message);
    } else {
      console.log('Session data:', session ? 'User is logged in' : 'No active session');
    }

    // Test a simple query to verify database connection
    // This will query the public schema's health check table if it exists
    // If not, it will just return an empty array which is still a successful connection
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Query error:', error.message);
      // Even if there's a query error (like table not found), we can still check if the connection is established
      console.log('Supabase connection status:', supabase.connectionStatus);
    } else {
      console.log('Query successful, data:', data);
      console.log('Supabase connection is working!');
    }

    return !sessionError; // Return true if no session error
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error.message);
    return false;
  }
}

// Execute the test
testSupabaseConnection()
  .then(isConnected => {
    console.log('Connection test completed. Connection status:', isConnected ? 'SUCCESS' : 'FAILED');
  })
  .catch(error => {
    console.error('Error running test:', error);
  });
