document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
if (menuButton && navigation) {
  const closeMenu = () => { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = 'Μενού'; };
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? 'Κλείσιμο' : 'Μενού'; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
  window.matchMedia('(min-width:701px)').addEventListener('change', closeMenu);
}
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }); }, {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
const form = document.querySelector('#enquiry-form');
if (form) {
  const topics = new Set(['poiniko', 'astiko', 'oikogeneiako', 'symvaseis', 'allodapon', 'diamesolavisi', 'allo']);
  const fields = ['name', 'email', 'phone', 'topic', 'message'].map(id => document.getElementById(id));
  const [nameField, emailField, phoneField, topicField, messageField] = fields;
  const preview = document.getElementById('request-preview');
  const previewList = document.getElementById('preview-values');
  const summary = document.getElementById('form-summary');
  const status = document.getElementById('form-status');
  const labels = {name:'Ονοματεπώνυμο', email:'Email', phone:'Τηλέφωνο', topic:'Θέμα', message:'Σύντομη περιγραφή'};
  const queryTopic = new URLSearchParams(location.search).get('thema');
  if (topics.has(queryTopic)) topicField.value = queryTopic;
  const errorFor = field => {
    const value = field.value.trim();
    if (field.id === 'name' && (value.length < 2 || value.length > 80)) return 'Συμπληρώστε ονοματεπώνυμο από 2 έως 80 χαρακτήρες.';
    if (field.id === 'email' && (!value || field.validity.typeMismatch || value.length > 254)) return 'Συμπληρώστε μια έγκυρη διεύθυνση email.';
    if (field.id === 'phone' && value && (!/^[+\d\s().-]{7,24}$/.test(value) || value.replace(/\D/g, '').length < 7 || value.replace(/\D/g, '').length > 15)) return 'Ελέγξτε τον αριθμό τηλεφώνου ή αφήστε το πεδίο κενό.';
    if (field.id === 'topic' && !topics.has(value)) return 'Επιλέξτε το θέμα που ταιριάζει περισσότερο.';
    if (field.id === 'message' && (value.length < 20 || value.length > 1500)) return 'Γράψτε από 20 έως 1.500 χαρακτήρες.';
    return '';
  };
  const showError = (field, error) => { document.getElementById(`${field.id}-error`).textContent = error; field.setAttribute('aria-invalid', String(Boolean(error))); };
  form.addEventListener('submit', event => {
    event.preventDefault(); status.textContent = ''; let firstInvalid;
    fields.forEach(field => { const error = errorFor(field); showError(field, error); if (error && !firstInvalid) firstInvalid = field; });
    if (firstInvalid) { preview.hidden = true; summary.textContent = 'Ελέγξτε τα πεδία που επισημαίνονται.'; firstInvalid.focus(); return; }
    summary.textContent = ''; previewList.replaceChildren();
    fields.forEach(field => { const term = document.createElement('dt'); term.textContent = labels[field.id]; const detail = document.createElement('dd'); detail.textContent = field.id === 'topic' ? field.selectedOptions[0].textContent : field.value.trim() || 'Δεν συμπληρώθηκε'; previewList.append(term, detail); });
    preview.hidden = false; document.getElementById('preview-heading').focus(); status.textContent = 'Η προεπισκόπηση είναι έτοιμη. Το μήνυμα δεν στάλθηκε.';
  });
  fields.forEach(field => { field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') showError(field, errorFor(field)); if (!preview.hidden) { preview.hidden = true; status.textContent = 'Τα στοιχεία άλλαξαν. Δημιουργήστε ξανά την προεπισκόπηση.'; } }); });
  document.getElementById('edit-request').addEventListener('click', () => { preview.hidden = true; status.textContent = 'Μπορείτε να επεξεργαστείτε τα στοιχεία σας.'; nameField.focus(); });
  document.getElementById('clear-request').addEventListener('click', () => { form.reset(); topicField.value = ''; fields.forEach(field => showError(field, '')); previewList.replaceChildren(); preview.hidden = true; summary.textContent = ''; status.textContent = 'Η φόρμα και η προεπισκόπηση καθαρίστηκαν.'; nameField.focus(); });
  document.getElementById('form-fields').disabled = false;
}
