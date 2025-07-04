document.addEventListener('DOMContentLoaded', function() {
    console.log('Scala Libraries page loaded');
    
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

    updateLibraryVersions();
});