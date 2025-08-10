const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

let tasks = load();
let currentFilter = 'all';

const form = $('#task-form');
const list = $('#task-list');
const empty = $('#empty');
const filters = $('#filters');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('#title').value.trim();
  const due = $('#due').value || null;
  const notes = $('#notes').value.trim() || null;
  if (!title) return;

  tasks.push({
    id: crypto.randomUUID(),
    title, due, notes,
    completed: false,
    createdAt: Date.now()
  });

  form.reset();
  save(); render();
});

filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;
  $$('#filters button').forEach(b => b.classList.toggle('active', b === e.target));
  render();
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.matches('input[type="checkbox"]')) {
    toggle(id);
  } else if (e.target.matches('[data-action="delete"]')) {
    remove(id);
  } else if (e.target.matches('[data-action="edit"]')) {
    startEdit(li, id);
  }
});

function startEdit(li, id) {
  const t = tasks.find(t => t.id === id);
  const input = document.createElement('input');
  input.value = t.title;
  input.setAttribute('aria-label', 'Edit title');
  const saveBtn = document.createElement('button'); saveBtn.textContent = 'Save';
  const cancelBtn = document.createElement('button'); cancelBtn.textContent = 'Cancel';
  const row = li.querySelector('.row');
  const prev = row.innerHTML;
  row.innerHTML = '';
  row.append(input, saveBtn, cancelBtn);
  input.focus();

  const cancel = () => { row.innerHTML = prev; };
  cancelBtn.addEventListener('click', cancel);
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') cancel(); });

  saveBtn.addEventListener('click', () => {
    const v = input.value.trim();
    if (v) { t.title = v; save(); render(); }
    else cancel();
  });
}

function toggle(id) {
  const t = tasks.find(t => t.id === id);
  t.completed = !t.completed;
  save(); render();
}

function remove(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

function render() {
  const filtered = tasks.filter(t =>
    currentFilter === 'all' ? true :
    currentFilter === 'active' ? !t.completed : t.completed
  );

  list.innerHTML = '';
  if (filtered.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for (const t of filtered) {
    const li = document.createElement('li');
    li.dataset.id = t.id;
    li.innerHTML = `
      <label class="row">
        <input type="checkbox" ${t.completed ? 'checked' : ''} />
        <span class="title ${t.completed ? 'done' : ''}">${escapeHtml(t.title)}</span>
        ${t.due ? `<time datetime="${t.due}">${t.due}</time>` : ''}
        <div class="actions">
          <button data-action="edit">Edit</button>
          <button data-action="delete">Delete</button>
        </div>
      </label>
      ${t.notes ? `<p class="notes">${escapeHtml(t.notes)}</p>` : ''}
    `;
    list.appendChild(li);
  }
}

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function load() {
  try { return JSON.parse(localStorage.getItem('tasks')) || []; }
  catch { return []; }
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

render();
