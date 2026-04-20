// 1. DARK MODE LOGIC
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
}

themeToggle?.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
});

// 2. LERNPLAN GENERATOR LOGIC
// Diese Funktion simuliert die Berechnung eines Plans
function generateMeisterPlan() {
    const subject = document.getElementById('subject')?.value || "Dein Fach";
    const date = document.getElementById('exam-date')?.value;
    const hours = document.getElementById('hours')?.value || 5;

    if(!date) {
        alert("Bitte gib ein Prüfungsdatum an!");
        return;
    }

    // Wir erstellen ein einfaches Objekt für den Plan
    const newPlan = {
        id: Date.now(),
        subject: subject,
        deadline: date,
        weeklyHours: hours,
        progress: 0,
        tasks: [
            { id: 1, title: "Grundlagen & Skript sichten", done: false, time: "2h" },
            { id: 2, title: "Zusammenfassung Kapitel 1-3", done: false, time: "4h" },
            { id: 3, title: "Übungsaufgaben Set A", done: false, time: "3h" },
            { id: 4, title: "Altklausur Simulation", done: false, time: "5h" }
        ]
    };

    // Im LocalStorage speichern, damit das Dashboard darauf zugreifen kann
    localStorage.setItem('activePlan', JSON.stringify(newPlan));
    
    // Weiterleitung zum Dashboard
    window.location.href = 'dashboard.html';
}

// 3. DASHBOARD LOGIC (Wird nur ausgeführt, wenn wir auf dashboard.html sind)
if (window.location.pathname.includes('dashboard.html')) {
    const planData = JSON.parse(localStorage.getItem('activePlan'));
    const container = document.getElementById('task-container');

    if (planData && container) {
        document.getElementById('display-subject').innerText = planData.subject;
        
        container.innerHTML = planData.tasks.map(task => `
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl mb-3 border border-transparent hover:border-indigo-500 transition-all cursor-pointer">
                <div class="flex items-center gap-3">
                    <input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                    <span class="font-medium">${task.title}</span>
                </div>
                <span class="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded">${task.time}</span>
            </div>
        `).join('');
    }
}
