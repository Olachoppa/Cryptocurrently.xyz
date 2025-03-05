// Theme handling module
export class ThemeManager {
    constructor() {
        this.body = document.body;
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
    }

    loadSavedTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            this.body.classList.add('dark-mode');
        }
    }

    setupEventListeners() {
        this.themeToggle.addEventListener('click', () => {
            this.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', this.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }
}