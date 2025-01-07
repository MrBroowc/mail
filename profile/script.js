const username = 'MrBroowc'; // Replace with your GitHub username

fetch(`https://api.github.com/users/${username}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Update profile image, name, and bio
        document.getElementById('profileImage').src = data.avatar_url;
        document.getElementById('profileName').textContent = data.name || username; // Fallback to username if name is not set
        document.getElementById('profileBio').textContent = data.bio || 'No bio available.'; // Fallback if bio is not set

        // Start typing animation after data is loaded
        startTypingAnimation(data.name || username);
    })
    .catch(error => {
        console.error('Error fetching GitHub profile:', error);
    });

function startTypingAnimation(text) {
    const nameElement = document.getElementById('profileName');
    nameElement.textContent = ''; // Clear the text

    let index = 0;

    function type() {
        if (index < text.length) {
            nameElement.textContent += text.charAt(index); // Add one character
            index++;
            setTimeout(type, 300); // Adjust typing speed (100ms)
        } else {
            setTimeout(() => {
                nameElement.textContent = ''; // Clear the text
                index = 0;
                type(); // Restart typing animation
            }, 2000); // Wait 2 seconds before restarting
        }
    }

    type(); // Start typing animation
}
