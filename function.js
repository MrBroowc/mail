window.onload = loadStoredEmail;

// Generates a random email and stores it in localStorage
function generateEmail() {
    const emailInput = document.getElementById('emailInput');
    const email = `${Math.random().toString(36).substring(2, 11)}@1secmail.com`;
    emailInput.value = email;
    emailInput.disabled = true;
    localStorage.setItem('generatedEmail', email);
}

// Loads the stored email from localStorage or generates a new one
function loadStoredEmail() {
    const storedEmail = localStorage.getItem('generatedEmail');
    const emailInput = document.getElementById('emailInput');
    if (storedEmail) {
        emailInput.value = storedEmail;
    } else {
        generateEmail();
    }
    emailInput.disabled = true;
}

// Copies the generated email to the clipboard
function copyEmail() {
    const emailInput = document.getElementById('emailInput');
    emailInput.disabled = false;
    emailInput.select();
    emailInput.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(emailInput.value)
        .catch(() => {
            document.execCommand('copy');
        })
        .finally(() => emailInput.disabled = true);
}

// Displays a notification message
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.setAttribute('aria-live', 'assertive');
    setTimeout(() => notification.style.display = 'none', 2000);
}

// Loads emails for the generated email address
async function loadEmails() {
    const emailInput = document.getElementById('emailInput').value;
    if (!emailInput) {
        showNotification('Please enter or generate an email address first.');
        return;
    }

    const [login, domain] = emailInput.split('@');
    const apiUrl = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const emails = await response.json();

        const emailTableBody = document.getElementById('emailTableBody');
        emailTableBody.innerHTML = emails.length ? '' : '<tr><td colspan="3" style="text-align: center;">Wait for 5s and try to load emails.</td></tr>';

        emails.forEach(email => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${email.from}</td>
                <td class="button-cell">
                    <button class="open-email-button" onclick="openEmail(${email.id})">Open</button>
                </td>
                <td>${new Date(email.date).toLocaleString()}</td>
            `;
            emailTableBody.appendChild(row);
        });

        showNotification('Emails loaded successfully!');
    } catch (error) {
        showNotification('Failed to load emails: ' + error.message);
    }
}

// Opens the selected email and displays its details
async function openEmail(emailId) {
    const emailInput = document.getElementById('emailInput').value;
    if (!emailInput) {
        showNotification('Please enter or generate an email address first.');
        return;
    }

    const [login, domain] = emailInput.split('@');
    const apiUrl = `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${emailId}`;

    try {
        const response = await fetch(apiUrl);
        const emailDetails = await response.json();

        document.getElementById('emailFrom').textContent = emailDetails.from;
        document.getElementById('emailSubject').textContent = emailDetails.subject;
        document.getElementById('emailDate').textContent = new Date(emailDetails.date).toLocaleString();
        document.getElementById('emailBody').innerHTML = emailDetails.body;

        document.getElementById('emailDetails').style.display = 'block';
        document.getElementById('emailDetails').setAttribute('aria-live', 'polite');
    } catch (error) {
        showNotification('Failed to open email: ' + error.message);
    }
}