// --- GLOBALER STATE (Datenbank-Simulation) ---
const DB = {
    save: (key, data) => localStorage.setItem('meister_' + key, JSON.stringify(data)),
    get: (key) => JSON.parse(localStorage.getItem('meister_' + key)) || null
};

// --- AUTH SYSTEM ---
const Auth = {
    check: () => {
        const user = DB.get('user');
        if (!user && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
        return user;
    },
    login: (username) => {
        DB.save('user', { username, uni: 'Deine Uni', major: 'Dein Fach', joined: new Date().toLocaleDateString() });
        window.location.href = 'dashboard.html';
    },
    logout: () => {
        localStorage.removeItem('meister_user');
        window.location.href = 'index.html';
    }
};

// --- DARK MODE ---
const initTheme = () => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
};

// --- LERNPLAN GENERATOR (Advanced) ---
const Generator = {
    create: () => {
        const plan = {
            id: Date.now(),
            subject: document.getElementById('subject').value,
            uni: document.getElementById('uni').value,
            type: document.getElementById('task-type').value,
            deadline: document.getElementById('exam-date').value,
            hours: document.getElementById('hours').value,
            difficulty: document.getElementById('level').value,
            tasks: [
                { id: 1, title: "Sichtung & Strukturierung", time: "2h", done: false, priority: "hoch" },
                { id: 2, title: "Kernkonzepte erarbeiten", time: "5h", done: false, priority: "hoch" },
                { id: 3, title: "Zusammenfassung schreiben", time: "4h", done: false, priority: "mittel" },
                { id: 4, title: "Anwendung & Übung", time: "6h", done: false, priority: "hoch" },
                { id: 5, title: "Finale Wiederholung", time: "3h", done: false, priority: "mittel" }
            ],
            progress: 0
        };
        const allPlans = DB.get('plans') || [];
        allPlans.push(plan);
        DB.save('plans', allPlans);
        DB.save('activePlan', plan); // Aktuellster Plan
        window.location.href = 'dashboard.html';
    }
};

// --- INITIALISIERUNG BEIM LADEN ---
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const user = Auth.check();
    if(user) {
        const navLink = document.getElementById('user-nav-link');
        if(navLink) navLink.innerHTML = `<span class="flex items-center gap-2"><i data-lucide="user"></i> ${user.username}</span>`;
    }
    if(typeof lucide !== 'undefined') lucide.createIcons();
    
    // Dashboard Daten laden
    if(window.location.pathname.includes('dashboard.html')) {
        const plan = DB.get('activePlan');
        if(plan) {
            document.getElementById('display-subject').innerText = plan.subject;
            renderDashboardTasks(plan);
        }
    }
});

function renderDashboardTasks(plan) {
    const container = document.getElementById('task-container');
    if(!container) return;
    container.innerHTML = plan.tasks.map(t => `
        <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl mb-3 border border-gray-100 dark:border-slate-700 hover:border-indigo-500 transition-all shadow-sm">
            <div class="flex items-center gap-3">
                <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${t.id})" class="w-5 h-5 rounded accent-indigo-600">
                <span class="${t.done ? 'line-through text-gray-400' : 'font-medium'}">${t.title}</span>
            </div>
            <span class="text-xs font-bold text-indigo-600">${t.time}</span>
        </div>
    `).join('');
}

function toggleTask(taskId) {
    let plan = DB.get('activePlan');
    const task = plan.tasks.find(t => t.id === taskId);
    task.done = !task.done;
    const doneCount = plan.tasks.filter(t => t.done).length;
    plan.progress = Math.round((doneCount / plan.tasks.length) * 100);
    DB.save('activePlan', plan);
    renderDashboardTasks(plan);
    document.getElementById('progress-bar').style.width = plan.progress + '%';
    document.getElementById('progress-text').innerText = plan.progress + '%';
}
