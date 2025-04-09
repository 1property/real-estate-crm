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
        row.location.toLowerCase().includes(query.toLowerCase()) ||
        row.status.toLowerCase().includes(query.toLowerCase())
      );
    });
  }

  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = '';

  data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.phone}</td>
      <td>${row.email}</td>
      <td>${row.location}</td>
      <td>${row.property}</td>
      <td>${row.source}</td>
      <td>${row.followUp}</td>
      <td>${row.status}</td>
      <td>${row.notes}</td>
      <td>${row.nextFollowUp}</td>
      <td>
        <button onclick="editProperty(${row.id})">Edit</button>
        <button onclick="deleteProperty(${row.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Search properties
function searchProperties() {
  const query = document.getElementById('searchInput').value;
  fetchData(query);
}

// Edit property
async function editProperty(id) {
  const { data, error } = await supabaseClient
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    alert('❌ Failed to fetch property data: ' + error.message);
    return;
  }

  document.getElementById('recordId').value = data.id;
  document.getElementById('name').value = data.name;
  document.getElementById('phone').value = data.phone;
  document.getElementById('email').value = data.email;
  document.getElementById('location').value = data.location;
  document.getElementById('property').value = data.property;
  document.getElementById('source').value = data.source;
  document.getElementById('followUp').value = data.followUp;
  document.getElementById('status').value = data.status;
  document.getElementById('notes').value = data.notes;
  showPage('formPage');
}

// Delete property
async function deleteProperty(id) {
  const { error } = await supabaseClient.from(tableName).delete().eq('id', id);

  if (error) {
    alert('❌ Failed to delete property: ' + error.message);
  } else {
    alert('✅ Property deleted successfully!');
    fetchData(); // Refresh table data
  }
}

// Handle adding/editing property form submission
document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('recordId').value;
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const location = document.getElementById('location').value;
  const property = document.getElementById('property').value;
  const source = document.getElementById('source').value;
  const followUp = document.getElementById('followUp').value;
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value;

  let error;
  if (id) {
    const { error } = await supabaseClient
      .from(tableName)
      .update({ name, phone, email, location, property, source, followUp, status, notes })
      .eq('id', id);
  } else {
    const { error } = await supabaseClient
      .from(tableName)
      .insert([{ name, phone, email, location, property, source, followUp, status, notes }]);
  }

  if (error) {
    alert('❌ Failed to save property: ' + error.message);
  } else {
    alert('✅ Property saved successfully!');
    showPage('tablePage');
    fetchData(); // Refresh table data
  }
});