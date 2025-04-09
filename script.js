// Supabase Initialization
const SUPABASE_URL = 'https://erabbaphqueanoddsoqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYWJiYXBocXVlYW5vZGRzb3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDQ5MTMsImV4cCI6MjA1OTQyMDkxM30._o0s404jR_FrJcEEC-7kQIuV-9T2leBe1QfUhXpcmG4';
const tableName = 'callproperty';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let currentEditingId = null; // Track the current editing ID

// Fetch data from Supabase and populate the table
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

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="10">No matching properties found.</td></tr>';
    return;
  }

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD

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

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="10">No matching properties found.</td></tr>';
    return;
  }

  data.forEach((row) => {
    const isFollowUpToday = row.followup === today; // Check if follow-up date is today
    const tr = document.createElement('tr');
    tr.style.backgroundColor = isFollowUpToday ? '#fff3cd' : 'transparent'; // Highlight if today

    if (isFollowUpToday) {
      showFollowUpNotification(row); // Show notification if follow-up is today
    }

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

// Show follow-up notification if it's today's date
function showFollowUpNotification(row) {
  if (Notification.permission === 'granted') {
    new Notification(`📌 Follow-up Today`, {
      body: `${row.name} (${row.phone}) - ${row.notes || 'No notes'}`,
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(`📌 Follow-up Today`, {
          body: `${row.name} (${row.phone}) - ${row.notes || 'No notes'}`,
        });
      }
    });
  }
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
    const { error } = await supabaseClient.from(tableName).update(formData).eq('id', currentEditingId);
    if (error) {
      alert('❌ Failed to update: ' + error.message);
    } else {
      alert('✅ Property updated!');
    }
    currentEditingId = null;
  } else {
    const { error } = await supabaseClient.from(tableName).insert([formData]);
    if (error) {
      alert('❌ Failed to insert: ' + error.message);
    } else {
      alert('✅ Property added!');
    }
  }

  resetForm();
  fetchData();
  showPage('tablePage');
});

// Reset form fields
function resetForm() {
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  document.getElementById('location').value = '';
  document.getElementById('property').value = '';
  document.getElementById('source').value = '';
  document.getElementById('followUp').value = '';
  document.getElementById('status').value = '';
  document.getElementById('notes').value = '';
}

// Edit property
async function editProperty(id) {
  const { data, error } = await supabaseClient.from(tableName).select('*').eq('id', id).single();

  if (error) {
    alert('Error loading data for editing: ' + error.message);
    return;
  }

  document.getElementById('name').value = data.name;
  document.getElementById('phone').value = data.phone;
  document.getElementById('email').value = data.email;
  document.getElementById('location').value = data.location;
  document.getElementById('property').value = data.property;
  document.getElementById('source').value = data.source;
  document.getElementById('followUp').value = data.followup;
  document.getElementById('status').value = data.status;
  document.getElementById('notes').value = data.notes;

  currentEditingId = id;
  showPage('formPage');
}

// Delete property
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

// Search properties
function searchProperties() {
  const query = document.getElementById('searchInput').value;
  fetchData(query);
}

// Show correct page
function showPage(pageId) {
  document.querySelectorAll('.page').forEach((page) => {
    page.style.display = 'none';
  });
  document.getElementById(pageId).style.display = 'block';
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  showPage('tablePage');
});