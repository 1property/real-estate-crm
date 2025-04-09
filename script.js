// Supabase Initialization
const SUPABASE_URL = 'https://erabbaphqueanoddsoqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYWJiYXBocXVlYW5vZGRzb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDQ5MTMsImV4cCI6MjA1OTQyMDkxM30._o0s404jR_FrJcEEC-7kQIuV-9T2leBe1QfUhXpcmG4';
const tableName = 'callproperty';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let currentEditingId = null; // Track the current editing ID

// Fetch data from Supabase and populate the table
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
      <td>
        <button class="edit" onclick="editProperty(${row.id})">Edit</button>
        <button class="delete" onclick="deleteProperty(${row.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Handle form submission for both adding and updating properties
document.getElementById('addForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
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

  if (currentEditingId) {
    // Update the existing record
    const { error } = await supabaseClient.from(tableName).update(formData).eq('id', currentEditingId);
    if (error) {
      alert('❌ Failed to update: ' + error.message);
    } else {
      alert('✅ Property updated!');
    }
    currentEditingId = null; // Reset the current editing ID after update
  } else {
    // Insert a new property
    const { error } = await supabaseClient.from(tableName).insert([formData]);
    if (error) {
      alert('❌ Failed to insert: ' + error.message);
    } else {
      alert('✅ Property added!');
    }
  }

  fetchData();
  showPage('tablePage');
});

// Edit property function
async function editProperty(id) {
  const { data, error } = await supabaseClient.from(tableName).select('*').eq('id', id).single();

  if (error) {
    alert('Error loading data for editing: ' + error.message);
    return;
  }

  // Populate form fields with the existing data
  document.getElementById('name').value = data.name;
  document.getElementById('phone').value = data.phone;
  document.getElementById('email').value = data.email;
  document.getElementById('location').value = data.location;
  document.getElementById('property').value = data.property;
  document.getElementById('source').value = data.source;
  document.getElementById('followUp').value = data.followup;
  document.getElementById('status').value = data.status;
  document.getElementById('notes').value = data.notes;

  currentEditingId = id; // Set the currentEditingId to the property being edited
  showPage('formPage');
}

// Delete property function
async function deleteProperty(id) {
  const confirmDelete = confirm('Are you sure you want to delete this property?');
  if (confirmDelete) {
    const { error } = await supabaseClient.from(tableName).delete().eq('id', id);
    if (error) {
      alert('❌ Failed to delete: ' + error.message);
    } else {
      alert('✅ Property deleted!');
      fetchData();
    }
  }
}

// Show the correct page (form or table)
function showPage(pageId) {
  document.querySelectorAll('.page').forEach((page) => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

// Initialize the page on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  showPage('tablePage');
});
