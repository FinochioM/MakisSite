document.addEventListener('DOMContentLoaded', function() {    
    const libraries = [
        {
            name: 'S2D',
            repo: 'FinochioM/S2D'
        },
        {
            name: 'MakisDSL',
            repo: 'FinochioM/MakisDSL'
        },
        {
            name: 'S2D CLI',
            repo: 'FinochioM/S2D_CLI'
        }
    ];

    async function fetchLatestRelease(repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
            if (response.ok) {
                const data = await response.json();
                return data.tag_name;
            }
        } catch (error) {
            console.error(`Error fetching release for ${repo}:`, error);
        }
        return null;
    }

    async function updateLibraryVersions() {
        for (const library of libraries) {
            const version = await fetchLatestRelease(library.repo);
            if (version) {
                const cards = document.querySelectorAll('.library-card');
                cards.forEach(card => {
                    const title = card.querySelector('h3');
                    if (title && title.textContent.trim() === library.name) {
                        if (!card.querySelector('.version-badge')) {
                            const versionBadge = document.createElement('span');
                            versionBadge.className = 'version-badge';
                            versionBadge.textContent = version;
                            title.appendChild(versionBadge);
                        }
                    }
                });
            }
        }
    }

    const themeToggle = document.getElementById('theme-switch');
    const html = document.documentElement;

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        if (initialTheme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        } else {
            html.setAttribute('data-theme', 'light');
            themeToggle.checked = false;
        }
    }

    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        themeToggle.checked = newTheme === 'dark';
        
        localStorage.setItem('theme', newTheme);
        
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    themeToggle.addEventListener('change', toggleTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            themeToggle.checked = newTheme === 'dark';
        }
    });

    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.9;
        
        const minHeight = Math.max(40, 100 - (scrolled / window.innerHeight) * 60);
        
        header.style.minHeight = minHeight + 'vh';
        
        header.style.transform = `translateY(${rate}px)`;
    });

    initializeTheme();
    updateLibraryVersions();
});