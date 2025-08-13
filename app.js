// Screens
const loginScreen = document.getElementById('login-screen');
const homeScreen = document.getElementById('home-screen');
const claimScreen = document.getElementById('claim-screen');
const trackScreen = document.getElementById('track-screen');

// Login / Registration elements
const loginBtn = document.getElementById('login-btn');
const showRegister = document.getElementById('show-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerNext = document.getElementById('register-next');
const registerBack = document.getElementById('register-back');
const registerCancel = document.getElementById('register-cancel');

// Home elements
const newClaimBtn = document.getElementById('new-claim-btn');
const trackClaimsBtn = document.getElementById('track-claims-btn');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');

// Claim elements
const claimForm = document.getElementById('claim-form');
const cancelClaimBtn = document.getElementById('cancel-claim');
const saveDraftBtn = document.getElementById('save-draft');

// Track screen
const claimsList = document.getElementById('claims-list');
const trackBackBtn = document.getElementById('track-back');

// ---------------------- USER AUTH ----------------------
showRegister.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

registerBack.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

registerCancel.addEventListener('click', () => {
  registerForm.reset();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Handle Registration (store in localStorage)
registerNext.addEventListener('click', () => {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const contact = document.getElementById('reg-contact').value.trim();
  const address = document.getElementById('reg-address').value.trim();
  const id = document.getElementById('reg-id').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  if(!name || !email || !contact || !address || !id || !password) {
    alert('Please fill in all fields.');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  if(users.some(u => u.email === email)) {
    alert('Email already registered.');
    return;
  }

  users.push({ name, email, contact, address, id, password });
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful! You can now log in.');
  registerForm.reset();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Handle Login
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    loginScreen.classList.remove('active');
    homeScreen.classList.add('active');
    userNameSpan.textContent = user.name;
  } else {
    alert('Invalid email or password.');
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  homeScreen.classList.remove('active');
  loginScreen.classList.add('active');
});

// ---------------------- CLAIMS ----------------------
// Open New Claim
newClaimBtn.addEventListener('click', () => {
  homeScreen.classList.remove('active');
  claimScreen.classList.add('active');

  const now = new Date();
  document.getElementById('dateTime').value = now.toISOString().slice(0,16);
});

// Cancel Claim
cancelClaimBtn.addEventListener('click', () => {
  claimForm.reset();
  claimScreen.classList.remove('active');
  homeScreen.classList.add('active');
});

// Save Draft
saveDraftBtn.addEventListener('click', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(!currentUser) return;

  const draft = {
    email: currentUser.email,
    photo: document.getElementById('photo').files.length ? document.getElementById('photo').files[0].name : '',
    dateTime: document.getElementById('dateTime').value,
    location: document.getElementById('location').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    otherContact: document.getElementById('otherContact').value.trim(),
    status: 'Draft'
  };

  let claims = JSON.parse(localStorage.getItem('claims')) || [];
  claims.push(draft);
  localStorage.setItem('claims', JSON.stringify(claims));
  alert('Draft saved!');
});

// Submit Claim
claimForm.addEventListener('submit', e => {
  e.preventDefault();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(!currentUser) return;

  const photoInput = document.getElementById('photo');
  if(!photoInput.files.length) {
    alert('Please upload a photo.');
    return;
  }

  const claim = {
    email: currentUser.email,
    photo: photoInput.files[0].name,
    dateTime: document.getElementById('dateTime').value,
    location: document.getElementById('location').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    otherContact: document.getElementById('otherContact').value.trim(),
    status: 'Submitted'
  };

  let claims = JSON.parse(localStorage.getItem('claims')) || [];
  claims.push(claim);
  localStorage.setItem('claims', JSON.stringify(claims));

  alert('Claim submitted successfully!');
  claimForm.reset();
  claimScreen.classList.remove('active');
  homeScreen.classList.add('active');
});

// ---------------------- CLAIM TRACKING ----------------------
trackClaimsBtn.addEventListener('click', () => {
  homeScreen.classList.remove('active');
  trackScreen.classList.add('active');

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  let claims = JSON.parse(localStorage.getItem('claims')) || [];
  claimsList.innerHTML = '';

  claims.filter(c => c.email === currentUser.email).forEach((c, idx) => {
    const li = document.createElement('li');
    li.style.border = '1px solid #ccc';
    li.style.marginBottom = '0.5rem';
    li.style.padding = '0.5rem';
    li.innerHTML = `
      <strong>Claim #${idx+1}</strong><br>
      Date: ${c.dateTime}<br>
      Location: ${c.location || 'N/A'}<br>
      Notes: ${c.notes}<br>
      Status: ${c.status}<br>
      Photo: ${c.photo || 'N/A'}
    `;
    claimsList.appendChild(li);
  });
});

// Back from tracking
trackBackBtn.addEventListener('click', () => {
  trackScreen.classList.remove('active');
  homeScreen.classList.add('active');
});