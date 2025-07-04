document.addEventListener('DOMContentLoaded', function() {
    const navIcon = document.getElementById('nav-icon');
    const sidebar = document.getElementById('sidebar');
    
    if (navIcon && sidebar) {
        navIcon.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('open');
        });
        
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !navIcon.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = 60;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                }
            }
        });
    });
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('h2[id]');
        const navLinks = document.querySelectorAll('#page-nav a[href^="#"]');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveSection, 50);
    });
    
    updateActiveSection();
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
        }
    });
    
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #667eea;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        
        pre.style.position = 'relative';
        
        pre.addEventListener('mouseenter', () => {
            copyButton.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            copyButton.style.opacity = '0';
        });
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.textContent = 'Copied!';
                copyButton.style.background = '#28a745';
                
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.style.background = '#667eea';
                }, 1500);
            } catch (err) {
                console.error('Failed to copy code:', err);
                copyButton.textContent = 'Failed';
                copyButton.style.background = '#dc3545';
                
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.style.background = '#667eea';
                }, 1500);
            }
        });
        
        pre.appendChild(copyButton);
    });
});