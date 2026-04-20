// Dark Mode Toggle Logik
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Beim Laden prüfen, ob Dark Mode bereits aktiv war
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});

// Beispiel-Funktion für den Lernplan-Generator
function generatePlan(data) {
    console.log("Generiere Lernplan für:", data.subject);
    // Hier würde später die Logik hinkommen
}
