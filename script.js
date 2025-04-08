// Supabase Initialization
const SUPABASE_URL = 'https://erabbaphqueanoddsoqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYWJiYXBocXVlYW5vZGRzb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDQ5MTMsImV4cCI6MjA1OTQyMDkxM30._o0s404jR_FrJcEEC-7kQIuV-9T2leBe1QfUhXpcmG4';
const tableName = 'callproperty';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch data and display it in the table
async function fetchData() {
  const { data, error } = await supabaseClient.from(tableName).select('*');
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = '';

  if (error) {
    tableBody.innerHTML = '<tr><td colspan="10">Error loading data.</td></tr>';
    return;
  }

  data.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.phone}</td>
      <td>${row.email}</td>
      <td>${row.location}</td>
      <td>${row.property}</td>
      <td>${row.source}</td>
      <td>${row.followup || ''}</td>
      <td>${row.status}</td>
      <td>${row.notes}</td>
      <td>${row.followup || ''}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Handle form submission for adding a new property
document.getElementById('addForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    location: document.getElementById('location').value,
    property: document.getElementById('property').value,
    source: document.getElementById('source').value,
    followup: document.getElementById('followUp').value,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value
  };

  const { error } = await supabaseClient.from(tableName).insert([data]);

  if (error) {
    alert('❌ Failed to insert: ' + error.message);
  } else {
    alert('✅ Property added!');
    fetchData(); // Refresh the table
    showPage('tablePage'); // Switch to the table page after adding the property
  }
});

// Show and hide pages based on the page ID
function showPage(pageId) {
  // Get all pages
  const pages = document.querySelectorAll('.page');
  
  // Hide all pages
  pages.forEach(page => {
    page.style.display = 'none';
  });
  
  // Show the selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }
}

// Initially load the table page
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  showPage('tablePage'); // Show table page by default
});
