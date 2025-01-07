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
    })
    .catch(error => {
        console.error('Error fetching GitHub profile:', error);
    });
