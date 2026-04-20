// --- MEISTER UNI STATE MANAGEMENT ---
const App = {
    state: {
        user: JSON.parse(localStorage.getItem('mu_user')),
        activePlan: JSON.parse(localStorage.getItem('mu_plan'))
    },

    init() {
        this.initTheme();
        this.renderUser();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    initTheme() {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
        });
    },

    login(username) {
        if(!username) return alert("Bitte wähle einen Usernamen.");
        const user = { name: username, avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${username}`, joined: new Date().toLocaleDateString() };
        localStorage.setItem('mu_user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    },

    generatePlan() {
        const plan = {
            subject: document.getElementById('subject').value || "Allgemeines Modul",
            uni: document.getElementById('uni').value || "Deine Universität",
            deadline: document.getElementById('deadline').value,
            type: document.getElementById('type').value,
            tasks: this.calculateTasks(document.getElementById('type').value),
            progress: 0
        };
        localStorage.setItem('mu_plan', JSON.stringify(plan));
        window.location.href = 'dashboard.html';
    },

    calculateTasks(type) {
        const templates = {
            exam: [{t: "Skript zusammenfassen", d: "4h"}, {t: "Lernkarten erstellen", d: "6h"}, {t: "Altklausur-Check", d: "3h"}],
            paper: [{t: "Literaturrecherche", d: "8h"}, {t: "Gliederung erstellen", d: "2h"}, {t: "Schreibphase 1", d: "10h"}],
            present: [{t: "Folien-Design", d: "4h"}, {t: "Vortrag üben", d: "2h"}]
        };
        return (templates[type] || templates.exam).map((item, i) => ({ id: i, title: item.t, time: item.d, done: false }));
    },

    renderUser() {
        const display = document.getElementById('nav-user');
        if(display && this.state.user) {
            display.innerHTML = `
                <div class="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 p-1 pr-4 rounded-full">
                    <img src="${this.state.user.avatar}" class="w-8 h-8 rounded-full">
                    <span class="text-xs font-bold">${this.state.user.name}</span>
                </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
