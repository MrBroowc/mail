document.addEventListener('DOMContentLoaded', () => {
    const emailOutput = document.getElementById('emailOutput');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const domainSelect = document.getElementById('domainSelect');
    const emailHistory = document.getElementById('emailHistory');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const emailCount = document.getElementById('emailCount');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const maxHistoryItems = 50;

    const generateSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    const clickSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3');
    const trashSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3');
    const copySound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    clickSound.volume = 0.2;
    trashSound.volume = 0.3;

    function updateClearButtonVisibility() {
        clearHistoryBtn.classList.toggle('visible', emailHistory.children.length > 0);
    }

    function clearHistory() {
        emailHistory.innerHTML = '';
        localStorage.removeItem('emailHistory');

        clearHistoryBtn.classList.add('fade-in');
        trashSound.currentTime = 0;
        trashSound.play();
        setTimeout(() => clearHistoryBtn.classList.remove('fade-in'), 500);
        hideConfirmModal();
        updateClearButtonVisibility();
    }

    function showConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.style.display = 'block';
    }

    function hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.style.display = 'none';
    }

    clearHistoryBtn.addEventListener('click', showConfirmModal);
    document.getElementById('confirmYes').addEventListener('click', clearHistory);
    document.getElementById('confirmNo').addEventListener('click', hideConfirmModal);

    document.getElementById('confirmModal').addEventListener('click', (e) => {
        if (e.target.id === 'confirmModal') {
            hideConfirmModal();
        }
    });

    function updateEmailHistory(emails) {
        emails.forEach(email => {
            const li = document.createElement('li');
            li.textContent = email;
            li.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(email);
                    emailOutput.value = email;
                    emailOutput.classList.add('fade-in');
                    copySound.play();
                    li.classList.add('copied');
                    setTimeout(() => {
                        emailOutput.classList.remove('fade-in');
                        li.classList.remove('copied');
                    }, 1000);
                } catch (err) {
                    li.classList.add('shake');
                    setTimeout(() => li.classList.remove('shake'), 300);
                }
            });

            emailHistory.insertBefore(li, emailHistory.firstChild);
        });

        while (emailHistory.children.length > maxHistoryItems) {
            emailHistory.removeChild(emailHistory.lastChild);
        }

        const history = Array.from(emailHistory.children).map(item => item.textContent);
        localStorage.setItem('emailHistory', JSON.stringify(history));
        updateClearButtonVisibility();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggleBtn.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    function generateRandomEmail() {
        let chars = '';
        if (document.getElementById('useLetters').checked) {
            chars += 'abcdefghijklmnopqrstuvwxyz';
        }
        if (document.getElementById('useNumbers').checked) {
            chars += '0123456789';
        }
        if (document.getElementById('useSpecial').checked) {
            chars += '_-.';
        }
        
        if (chars === '') chars = 'abcdefghijklmnopqrstuvwxyz0123456789'; // fallback
        
        const minLength = parseInt(document.getElementById('minLength').value) || 8;
        const maxLength = parseInt(document.getElementById('maxLength').value) || 16;
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        
        let email = '';
        for (let i = 0; i < length; i++) {
            email += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    
        return `${email}@${domainSelect.value}`;
    }
    
    // Add event listeners for the new inputs
    document.getElementById('minLength').addEventListener('input', function() {
        const max = parseInt(document.getElementById('maxLength').value);
        this.value = Math.min(Math.max(parseInt(this.value) || 4, 4), max);
    });
    
    document.getElementById('maxLength').addEventListener('input', function() {
        const min = parseInt(document.getElementById('minLength').value);
        this.value = Math.min(Math.max(parseInt(this.value) || min, min), 20);
    });

    document.getElementById('quickGenerate5').addEventListener('click', () => {
        emailCount.value = 5;
        updateEmail();
    });

    document.getElementById('quickGenerate10').addEventListener('click', () => {
        emailCount.value = 10;
        updateEmail();
    });

    async function updateEmail() {
        const count = Math.min(parseInt(emailCount.value) || 1, 30);
        emailCount.value = count;

        const clickedBtn = document.activeElement;
        if (clickedBtn) {
            clickedBtn.classList.add('loading');
        }
        generateBtn.classList.add('loading');
        generateSound.play();

        const emails = [];
        await new Promise(resolve => setTimeout(resolve, 500));

        for (let i = 0; i < count; i++) {
            emails.push(generateRandomEmail());
        }

        emailOutput.value = emails.join('\n');
        updateEmailHistory(emails);
        emailOutput.classList.add('fade-in');

        if (clickedBtn) {
            clickedBtn.classList.remove('loading');
        }
        generateBtn.classList.remove('loading');
        setTimeout(() => emailOutput.classList.remove('fade-in'), 500);

        localStorage.setItem('currentEmail', emailOutput.value);
        emails.forEach(email => updateStats(email));
    }

    emailCount.addEventListener('input', function () {
        const value = parseInt(this.value) || 1;
        this.value = Math.min(Math.max(value, 1), 30);
    });

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(emailOutput.value);
            copySound.play();
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1500);
        } catch (err) {
            copyBtn.classList.add('shake');
            setTimeout(() => {
                copyBtn.classList.remove('shake');
            }, 300);
        }
    }

    themeToggleBtn.addEventListener('click', toggleTheme);
    generateBtn.addEventListener('click', updateEmail);
    copyBtn.addEventListener('click', copyToClipboard);
    domainSelect.addEventListener('change', updateEmail);

    if (localStorage.getItem('theme') === 'dark') {
        toggleTheme();
    }

    const savedHistory = localStorage.getItem('emailHistory');
    if (savedHistory) {
        JSON.parse(savedHistory).forEach(email => {
            const li = document.createElement('li');
            li.textContent = email;
            li.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(email);
                    emailOutput.value = email;
                    emailOutput.classList.add('fade-in');
                    copySound.play();
                    li.classList.add('copied');
                    setTimeout(() => {
                        emailOutput.classList.remove('fade-in');
                        li.classList.remove('copied');
                    }, 1000);
                } catch (err) {
                    li.classList.add('shake');
                    setTimeout(() => li.classList.remove('shake'), 300);
                }
            });
            emailHistory.appendChild(li);
        });
    }
    updateClearButtonVisibility();

    const savedEmail = localStorage.getItem('currentEmail');
    if (savedEmail) {
        emailOutput.value = savedEmail;
    } else {
        updateEmail();
    }

    function updateStats(email) {
        const today = new Date().toDateString();
        let stats = JSON.parse(localStorage.getItem('emailStats') || '{}');
        
        // Initialize if not exists
        if (!stats.today) {
            stats = {
                today: today,
                todayCount: 0,
                totalCount: 0,
                domains: {}
            };
        }
        
        // Reset daily count if it's a new day
        if (stats.today !== today) {
            stats.today = today;
            stats.todayCount = 0;
        }
        
        // Update counts
        stats.todayCount++;
        stats.totalCount++;
        
        // Update domain statistics
        const domain = email.split('@')[1];
        stats.domains[domain] = (stats.domains[domain] || 0) + 1;
        
        // Save stats
        localStorage.setItem('emailStats', JSON.stringify(stats));
        
        // Update UI
        document.getElementById('todayCount').textContent = stats.todayCount;
        document.getElementById('totalCount').textContent = stats.totalCount;
        
        // Find favorite domain
        const favDomain = Object.entries(stats.domains)
            .sort((a, b) => b[1] - a[1])[0];
        document.getElementById('favDomain').textContent = favDomain ? favDomain[0] : '-';
    }

    // Add this near the start of DOMContentLoaded
    // Load initial stats
    const stats = JSON.parse(localStorage.getItem('emailStats') || '{}');
    if (stats.todayCount) {
        document.getElementById('todayCount').textContent = stats.todayCount;
        document.getElementById('totalCount').textContent = stats.totalCount;
        const favDomain = Object.entries(stats.domains || {})
            .sort((a, b) => b[1] - a[1])[0];
        document.getElementById('favDomain').textContent = favDomain ? favDomain[0] : '-';
    }
});

window.addEventListener('load', () => {
    document.body.classList.remove('preload');
});