window.onload = function () {
    // Show the popup when the page loads
    document.getElementById("popupNotification").style.display = "flex";

    // Attach event listener to close button
    document.querySelector('.close-btn').addEventListener('click', closePopup);

    // Auto-close the popup after 5 seconds
    setTimeout(closePopup, 5000); // Close after 5000ms (5 seconds)
};

function closePopup() {
    // Hide the popup
    document.getElementById("popupNotification").style.display = "none";
}

// Email Validation
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Refresh Email
function refreshMail() {
    const emailInput = document.getElementById("addr").value; 
    if (!validateEmail(emailInput)) {
        document.getElementById("emailFeedback").textContent = "Please enter a valid email address.";
        return;
    }

    document.getElementById("emailFeedback").textContent = "Refreshing email..."; 
    document.getElementById("loadingSpinner").style.display = "block"; 
    setTimeout(() => {
        document.getElementById("loadingSpinner").style.display = "none"; 
        document.getElementById("emailFeedback").textContent = ""; 
    }, 2000);
}

// Copy Email
function copyEmail() {
    const emailInput = document.getElementById("addr");
    emailInput.select();
    emailInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(emailInput.value);

    document.getElementById("copySuccessMessage").style.display = "block";
    setTimeout(() => {
        document.getElementById("copySuccessMessage").style.display = "none";
    }, 2000);
}

async function fetchNewEmail() {
    const response = await fetch(
        "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1",
        { method: "GET" }
    );
    if (!response.ok) {
        throw new Error("Failed to generate email");
    }
    const data = await response.json();
    return data[0]; 
}

async function genEmail() {
    const emailInput = document.getElementById("addr");
    const emailFeedback = document.getElementById("emailFeedback");

    emailFeedback.textContent = "";

    try {
        document.getElementById("loadingSpinner").style.display = "block";

        const newEmail = await fetchNewEmail();
        emailInput.value = newEmail;
    } catch (error) {
        emailFeedback.textContent = "Failed to generate email. Please try again.";
    } finally {
        document.getElementById("loadingSpinner").style.display = "none";
    }
}
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
