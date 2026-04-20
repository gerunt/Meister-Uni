// --- DARK MODE LOGIK ---
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Beim Starten den gespeicherten Modus laden
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
}

themeToggle?.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
});


// --- LERNPLAN GENERATOR LOGIK ---
function generateMeisterPlan() {
    const subjectInput = document.getElementById('subject');
    const dateInput = document.getElementById('exam-date');
    const hoursInput = document.getElementById('hours');

    if (!dateInput.value) {
        alert("Bitte wähle ein Datum für deine Prüfung aus!");
        return;
    }

    // Ein neues Plan-Objekt erstellen
    const newPlan = {
        subject: subjectInput.value || "Allgemeines Studium",
        examDate: dateInput.value,
        weeklyHours: hoursInput.value,
        tasks: [
            { title: "Material sammeln & sichten", time: "2h", done: false },
            { title: "Kernkonzepte zusammenfassen", time: "4h", done: false },
            { title: "Übungsfragen beantworten", time: "3h", done: false },
            { title: "Simulation der Prüfung", time: "5h", done: false },
            { title: "Wiederholung Problemthemen", time: "2h", done: false }
        ]
    };

    // Im Browser-Speicher ablegen
    localStorage.setItem('activePlan', JSON.stringify(newPlan));

    // Zum Dashboard wechseln
    window.location.href = 'dashboard.html';
}


// --- DASHBOARD ANZEIGE LOGIK ---
window.addEventListener('DOMContentLoaded', () => {
    // Prüfen, ob wir auf dem Dashboard sind
    const taskContainer = document.getElementById('task-container');
    const subjectDisplay = document.getElementById('display-subject');

    if (taskContainer && subjectDisplay) {
        const savedPlan = JSON.parse(localStorage.getItem('activePlan'));

        if (savedPlan) {
            // Titel setzen
            subjectDisplay.innerText = savedPlan.subject;

            // Aufgaben-Liste bauen
            taskContainer.innerHTML = savedPlan.tasks.map((task, index) => `
                <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl mb-3 border border-transparent hover:border-indigo-400 transition-all group">
                    <div class="flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full border-2 border-indigo-300 dark:border-slate-500 group-hover:border-indigo-500 flex items-center justify-center cursor-pointer">
                            <div class="w-3 h-3 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>
                        <span class="font-medium">${task.title}</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full">${task.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }
});
