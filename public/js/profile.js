const profileForm = document.getElementById('interestForm');

if (profileForm) {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const bioInput = document.getElementById('bio');
    const profilePicInput = document.getElementById('profilePic'); 
    const interestsCheckboxes = document.querySelectorAll('input[name="interests[]"]');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.text-goes-here');

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Reset Error State
        errorContainer.classList.add('hidden');
        errorMessage.textContent = '';

        // Retrieve Input Values
        const firstName = firstNameInput?.value.trim();
        const lastName = lastNameInput?.value.trim();
        const bio = bioInput?.value.trim();
        const selectedInterests = Array.from(interestsCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const profilePic = profilePicInput.files[0];
        // Client-Side Validations
        if (!firstName || !lastName) {
            errorMessage.textContent = 'First name and last name are required.';
            errorContainer.classList.remove('hidden');
            return;
        }

        if (selectedInterests.length === 0) {
            errorMessage.textContent = 'Please select atleast one interest.';
            errorContainer.classList.remove('hidden');
            return;
        }

        if (selectedInterests.length > 5) {
            errorMessage.textContent = 'Please select not more than 5 interests.';
            errorContainer.classList.remove('hidden');
            return;
        }
        // Send Data to Server
       const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('bio', bio);
        selectedInterests.forEach(interest => formData.append('interests[]', interest));
        if (profilePicInput.files[0]) {
            formData.append('profilePic', profilePicInput.files[0]); // Append the file
        } 

        try {
            const response = await fetch('/updateProfile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile.');
            }

            const result = await response.json();
            if (result.redirect) {
                window.location.href = result.redirect;
            } else {
                errorMessage.textContent = 'Profile updated successfully!';
                errorContainer.classList.remove('hidden');
                errorContainer.classList.add('success');
            }
        } catch (error) {
            errorMessage.textContent = error.message || 'An unexpected error occurred.';
            errorContainer.classList.remove('hidden');
        }
    });
}