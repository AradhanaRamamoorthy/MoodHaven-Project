const profileForm = document.getElementById('interestForm');

if (profileForm) {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const bioInput = document.getElementById('bio');
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
        try {
            const response = await fetch('/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    bio,
                    interests: selectedInterests,
                }),
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