// Import the supabase client that you created earlier
const supabase = require('./lib/supabaseClient');

// Function to fetch data from Supabase
async function testConnection() {
  try {
    // Try to fetch all rows from a table called 'leads' (replace 'leads' with your actual table name)
    const { data, error } = await supabase.from('leads').select('*');

    // If there's an error, log it
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      // If there's no error, log the data
      console.log('Data from Supabase:', data);
    }
  } catch (err) {
    // Catch any unexpected errors
    console.error('Unexpected error:', err);
  }
}

// Call the function to test the connection
testConnection();
