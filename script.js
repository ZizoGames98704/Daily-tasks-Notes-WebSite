// State Management with LocalStorage
let state = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    notes: JSON.parse(localStorage.getItem('notes')) || [],
    language: localStorage.getItem('lang') || 'ar',
    theme: localStorage.getItem('theme') || 'light'
};

const translations = {
    ar: {
        appTitle: "منظم الحياة", tasks: "المهام", notes: "الملاحظات",
        themeDark: "المظهر الداكن", themeLight: "المظهر الفاتح", clearText: "مسح الكل",
        taskPh: "ماذا يجب أن تفعل؟", noteSearchPh: "بحث في الملاحظات...", taskSearchPh: "بحث في المهام...",
        addNote: "إضافة ملاحظة", modalTitle: "إضافة ملاحظة", save: "حفظ", cancel: "إلغاء",
        noteTitlePh: "عنوان الملاحظة", noteContentPh: "اكتب مذكراتك هنا...", deleteConfirm: "هل أنت متأكد؟"
    },
    en: {
        appTitle: "Life Organizer", tasks: "Tasks", notes: "Notes",
        themeDark: "Dark Mode", themeLight: "Light Mode", clearText: "Clear All",
        taskPh: "What needs to be done?", noteSearchPh: "Search notes...", taskSearchPh: "Search tasks...",
        addNote: "Add Note", modalTitle: "Add New Note", save: "Save", cancel: "Cancel",
        noteTitlePh: "Note Title", noteContentPh: "Write your thoughts...", deleteConfirm: "Are you sure?"
    }
};

// Elements
const taskList = document.getElementById('tasks-list');
const notesGrid = document.getElementById('notes-grid');
const taskInput = document.getElementById('task-input');
const taskSearch = document.getElementById('task-search');
const noteSearch = document.getElementById('note-search');

// Save to LocalStorage
function save() {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('notes', JSON.stringify(state.notes));
    localStorage.setItem('lang', state.language);
    localStorage.setItem('theme', state.theme);
}

// Render Tasks
function renderTasks(filter = '') {
    taskList.innerHTML = '';
    const filtered = state.tasks.filter(t => t.content.toLowerCase().includes(filter.toLowerCase()));
    
    filtered.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = `item-card ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <button class="check-btn" onclick="toggleTask(${index})"></button>
            <span>${task.content}</span>
            <button class="delete-btn" onclick="deleteTask(${index})"><i data-lucide="trash-2"></i></button>
        `;
        taskList.appendChild(div);
    });
    lucide.createIcons();
}

// Render Notes
function renderNotes(filter = '') {
    notesGrid.innerHTML = '';
    const filtered = state.notes.filter(n => 
        n.title.toLowerCase().includes(filter.toLowerCase()) || 
        n.content.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach((note, index) => {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.onclick = () => openNote(index);
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
        `;
        notesGrid.appendChild(div);
    });
}

// Actions
window.toggleTask = (index) => {
    state.tasks[index].completed = !state.tasks[index].completed;
    save(); renderTasks();
};

window.deleteTask = (index) => {
    state.tasks.splice(index, 1);
    save(); renderTasks();
};

document.getElementById('add-task-btn').onclick = () => {
    if (!taskInput.value.trim()) return;
    state.tasks.unshift({ content: taskInput.value, completed: false });
    taskInput.value = '';
    save(); renderTasks();
};

// Navigation
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.nav-item, .content-section').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.section}-section`).classList.add('active');
    };
});

// Theme Toggle
document.getElementById('theme-toggle').onclick = () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    save();
};

function applyTheme() {
    document.body.className = state.theme === 'dark' ? 'dark-theme' : 'light-theme';
    const icon = state.theme === 'dark' ? 'sun' : 'moon';
    document.getElementById('theme-icon').setAttribute('data-lucide', icon);
    document.getElementById('theme-text').innerText = translations[state.language][state.theme === 'dark' ? 'themeLight' : 'themeDark'];
    lucide.createIcons();
}

// Language Toggle
document.getElementById('lang-toggle').onclick = () => {
    state.language = state.language === 'ar' ? 'en' : 'ar';
    applyLanguage();
    save();
};

function applyLanguage() {
    const lang = state.language;
    const t = translations[lang];
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    document.getElementById('app-title').innerText = t.appTitle;
    document.getElementById('nav-tasks-btn').querySelector('.nav-text').innerText = t.tasks;
    document.getElementById('nav-notes-btn').querySelector('.nav-text').innerText = t.notes;
    document.getElementById('tasks-heading').innerText = t.tasks;
    document.getElementById('notes-heading').innerText = t.notes;
    document.getElementById('task-input').placeholder = t.taskPh;
    document.getElementById('task-search').placeholder = t.taskSearchPh;
    document.getElementById('note-search').placeholder = t.noteSearchPh;
    document.getElementById('add-note-text').innerText = t.addNote;
    document.getElementById('clear-text').innerText = t.clearText;
    document.getElementById('lang-toggle').querySelector('span').innerText = lang === 'ar' ? 'English' : 'العربية';
    
    applyTheme();
    renderTasks();
    renderNotes();
}

// Clear All
document.getElementById('clear-all-btn').onclick = () => {
    if (confirm(translations[state.language].deleteConfirm)) {
        const activeSection = document.querySelector('.content-section.active').id;
        if (activeSection === 'tasks-section') state.tasks = [];
        else state.notes = [];
        save(); renderTasks(); renderNotes();
    }
};

// Modal Logic
const modal = document.getElementById('note-modal');
document.getElementById('open-note-modal').onclick = () => {
    document.getElementById('note-title-input').value = '';
    document.getElementById('note-content-input').value = '';
    modal.style.display = 'flex';
};
document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
document.getElementById('save-note-btn').onclick = () => {
    const title = document.getElementById('note-title-input').value;
    const content = document.getElementById('note-content-input').value;
    if (!title || !content) return;
    state.notes.unshift({ title, content });
    save(); renderNotes();
    modal.style.display = 'none';
};

// Init
taskSearch.oninput = (e) => renderTasks(e.target.value);
noteSearch.oninput = (e) => renderNotes(e.target.value);
applyLanguage();
