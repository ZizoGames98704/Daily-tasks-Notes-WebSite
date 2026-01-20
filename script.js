// Translations
const translations = {
    en: {
        appTitle: "",
        langText: "عربي",
        searchPlaceholder: "Search tasks or notes...",
        clearText: "Clear All",
        tabTasks: "Tasks",
        tabNotes: "Notes",
        taskPlaceholder: "What needs to be done?",
        addTask: "Add Task",
        addNote: "Add Note",
        noteTitlePlaceholder: "Note title",
        noteContentPlaceholder: "Write your thoughts...",
        cancel: "Cancel",
        save: "Save",
        noTasks: "No tasks yet.",
        noNotes: "No notes yet.",
        confirmClear: "Are you sure you want to clear all data?",
        untitledNote: "Untitled Note"
    },
    ar: {
        appTitle:  "مهام ومذكرات",
        langText: "English",
        searchPlaceholder: "بحث في المهام أو الملاحظات...",
        clearText: "مسح الكل",
        tabTasks: "المهام",
        tabNotes: "الملاحظات",
        taskPlaceholder: "ما الذي يجب القيام به؟",
        addTask: "أضف مهمة",
        addNote: "أضف ملاحظة",
        noteTitlePlaceholder: "عنوان الملاحظة",
        noteContentPlaceholder: "اكتب أفكارك...",
        cancel: "إلغاء",
        save: "حفظ",
        noTasks: "لا توجد مهام حتى الآن.",
        noNotes: "لا توجد ملاحظات حتى الآن.",
        confirmClear: "هل أنت متأكد من مسح كل البيانات؟",
        untitledNote: "ملاحظة بدون عنوان"
    }
};

// State
let lang = localStorage.getItem('lang') || 'ar';
let theme = localStorage.getItem('theme') || 'light';
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentTab = 'tasks';
let searchQuery = '';

// Elements
const body = document.body;
const langToggle = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const appTitle = document.getElementById('app-title');
const searchInput = document.getElementById('search-input');
const clearAllBtn = document.getElementById('clear-all');
const clearText = document.getElementById('clear-text');
const tabTasks = document.getElementById('tab-tasks');
const tabNotes = document.getElementById('tab-notes');
const tasksSection = document.getElementById('tasks-section');
const notesSection = document.getElementById('notes-section');
const addTaskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const addNoteCard = document.getElementById('add-note-card');
const addNotePlaceholder = addNoteCard.querySelector('.add-note-placeholder');
const addNoteForm = addNoteCard.querySelector('.add-note-form');
const noteTitleInput = document.getElementById('note-title-input');
const noteContentInput = document.getElementById('note-content-input');
const cancelNoteBtn = document.getElementById('cancel-note');
const saveNoteBtn = document.getElementById('save-note');
const notesList = document.getElementById('notes-list');

// Initial Setup
function init() {
    updateTheme();
    updateLang();
    render();
}

// Handlers
langToggle.addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', lang);
    updateLang();
    render();
});

themeToggle.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateTheme();
});

function updateTheme() {
    body.className = theme;
    themeIcon.setAttribute('data-lucide', theme === 'light' ? 'moon' : 'sun');
    lucide.createIcons();
}

function updateLang() {
    const t = translations[lang];
    body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    appTitle.textContent = t.appTitle;
    langText.textContent = t.langText;
    searchInput.placeholder = t.searchPlaceholder;
    clearText.textContent = t.clearText;
    document.getElementById('tab-tasks-text').textContent = t.tabTasks;
    document.getElementById('tab-notes-text').textContent = t.tabNotes;
    taskInput.placeholder = t.taskPlaceholder;
    addTaskBtn.textContent = t.addTask;
    document.getElementById('add-note-text').textContent = t.addNote;
    noteTitleInput.placeholder = t.noteTitlePlaceholder;
    noteContentInput.placeholder = t.noteContentPlaceholder;
    cancelNoteBtn.textContent = t.cancel;
    saveNoteBtn.textContent = t.save;
}

// Tabs
tabTasks.addEventListener('click', () => {
    currentTab = 'tasks';
    tabTasks.classList.add('active');
    tabNotes.classList.remove('active');
    tasksSection.classList.remove('hidden');
    notesSection.classList.add('hidden');
});

tabNotes.addEventListener('click', () => {
    currentTab = 'notes';
    tabNotes.classList.add('active');
    tabTasks.classList.remove('active');
    notesSection.classList.remove('hidden');
    tasksSection.classList.add('hidden');
});

// Search
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
});

// Clear All
clearAllBtn.addEventListener('click', () => {
    if (confirm(translations[lang].confirmClear)) {
        tasks = [];
        notes = [];
        saveToLocal();
        render();
    }
});

// Tasks
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    
    tasks.unshift({
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: Date.now()
    });
    
    taskInput.value = '';
    saveToLocal();
    render();
});

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveToLocal();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveToLocal();
    render();
}

// Notes
addNoteCard.addEventListener('click', (e) => {
    if (addNoteForm.classList.contains('hidden')) {
        addNotePlaceholder.classList.add('hidden');
        addNoteForm.classList.remove('hidden');
        noteTitleInput.focus();
    }
});

cancelNoteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeNoteForm();
});

function closeNoteForm() {
    addNoteForm.classList.add('hidden');
    addNotePlaceholder.classList.remove('hidden');
    noteTitleInput.value = '';
    noteContentInput.value = '';
}

saveNoteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title && !content) return;
    
    notes.unshift({
        id: Date.now().toString(),
        title: title || translations[lang].untitledNote,
        content,
        createdAt: Date.now()
    });
    
    saveToLocal();
    closeNoteForm();
    render();
});

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveToLocal();
    render();
}

// Storage
function saveToLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Rendering
function render() {
    renderTasks();
    renderNotes();
    lucide.createIcons();
}

function renderTasks() {
    const filteredTasks = tasks.filter(t => t.text.toLowerCase().includes(searchQuery));
    tasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `<p class="muted-text" style="text-align:center; padding: 2rem;">${translations[lang].noTasks}</p>`;
        return;
    }
    
    filteredTasks.forEach(task => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="checkbox" onclick="toggleTask('${task.id}')">
                ${task.completed ? '<i data-lucide="check"></i>' : ''}
            </div>
            <span class="task-text">${task.text}</span>
            <button class="btn-delete" onclick="deleteTask('${task.id}')">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        tasksList.appendChild(div);
    });
}

function renderNotes() {
    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchQuery) || 
        n.content.toLowerCase().includes(searchQuery)
    );
    notesList.innerHTML = '';
    
    if (filteredNotes.length === 0) {
        notesList.innerHTML = `<p class="muted-text" style="text-align:center; padding: 2rem; grid-column: 1/-1;">${translations[lang].noNotes}</p>`;
        return;
    }
    
    filteredNotes.forEach(note => {
        const date = new Date(note.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US');
        const div = document.createElement('div');
        div.className = 'note-card';
        div.innerHTML = `
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-footer">
                <span>${date}</span>
                <button class="btn-delete" onclick="deleteNote('${note.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        notesList.appendChild(div);
    });
}

init();
