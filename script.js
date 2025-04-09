// Supabase Initialization
const SUPABASE_URL = 'https://erabbaphqueanoddsoqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYWJiYXBocXVlYW5vZGRzb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDQ5MTMsImV4cCI6MjA1OTQyMDkxM30._o0s404jR_FrJcEEC-7kQIuV-9T2leBe1QfUhXpcmG4';
const tableName = 'callproperty';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Track authentication state
let user = null;

// Listen for authentication state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  user = session?.user;
  if (user) {
    showPage('navPage');
    fetchData(); // Fetch data after login
  } else {
    showPage('authPage');
  }
});

// Show page function
function showPage(pageId) {
  document.querySelectorAll('.page').forEach((page) => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

// Sign Up
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  const { user, error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    alert('❌ Failed to sign up: ' + error.message);
  } else {
    alert('✅ Sign-up successful!');
    showPage('loginPage');
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { user, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    alert('❌ Login failed: ' + error.message);
  } else {
    alert('✅ Login successful!');
    showPage('navPage');
    fetchData(); // Fetch data after login
  }
});

// Logout
function logout() {
  supabaseClient.auth.signOut();
  showPage('authPage');
}

// Fetch data and populate the table
async function fetchData(query = '') {
  let { data, error } = await supabaseClient.from(tableName).select('*');

  if (error) {
    alert('❌ Failed to load data: ' + error.message);
    return;
  }

  if (query) {
    data = data.filter((row) => {
      return (
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.location.toLower
