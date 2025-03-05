// DOM Elements
const emailDisplay = document.getElementById('emailDisplay');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const exitlagBtn = document.getElementById('exitlagBtn');
const notification = document.getElementById('notification');

// Function to generate random string of alphabets and numbers
function generateRandomString(minLength = 3, maxLength = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const length = getRandomInt(minLength, maxLength);
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

const domains = ['bndts.com'];

// Separators for email names
const separators = ['', '-'];

// Function to generate a random number between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to generate a random email
function generateRandomEmail() {
    const firstPart = generateRandomString(3, 8);
    const secondPart = generateRandomString(3, 8);
    const domain = getRandomItem(domains);
    const separator = getRandomItem(separators);
    const useNumber = Math.random() > 0.3; // 70% chance to add a number
    
    let email = '';
    
    // Decide email format (50% chance for each format)
    if (Math.random() > 0.5) {
        email = firstPart + separator + secondPart;
    } else {
        email = secondPart + separator + firstPart;
    }
    
    // Add random numbers if needed
    if (useNumber) {
        email += getRandomInt(1, 999);
    }
    
    // Complete the email with @ and domain
    email += '@' + domain;
    
    return email;
}

// Function to display the generated email with animation
function displayEmail(email) {
    emailDisplay.classList.remove('fade-in');
    // Trigger reflow to restart animation
    void emailDisplay.offsetWidth;
    emailDisplay.textContent = email;
    emailDisplay.classList.add('fade-in');
}

// Function to copy email to clipboard
function copyToClipboard() {
    const email = emailDisplay.textContent;
    if (email === 'Click generate to create an email') {
        showNotification('Generate an email first!');
        return;
    }
    
    navigator.clipboard.writeText(email)
        .then(() => {
            showNotification('Email copied to clipboard!');
        })
        .catch(err => {
            showNotification('Failed to copy email!');
            console.error('Could not copy text: ', err);
        });
}

// Function to show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Event Listeners
generateBtn.addEventListener('click', () => {
    const email = generateRandomEmail();
    displayEmail(email);
});

copyBtn.addEventListener('click', copyToClipboard);

exitlagBtn.addEventListener('click', () => {
    const newWindow = window.open('https://exitlag.com/register', '_blank');
    
    if (newWindow) {
        showNotification('Opening ExitLag registration...');
    } else {
        showNotification('Popup blocked! Please allow popups for this site.');
    }
});

// Generate an email on page load
window.addEventListener('load', () => {
    const email = generateRandomEmail();
    displayEmail(email);
});
