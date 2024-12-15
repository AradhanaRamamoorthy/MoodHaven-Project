const signupForm = document.getElementById('signupForm');

if (signupForm){
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.text-goes-here');

    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');
    const togglePasswordIcon = togglePasswordButton.querySelector('i');
    const toggleConfirmPasswordIcon = toggleConfirmPasswordButton.querySelector('i');

    togglePasswordButton.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

        togglePasswordIcon.classList.toggle('fa-eye');
        togglePasswordIcon.classList.toggle('fa-eye-slash');
    });

    toggleConfirmPasswordButton.addEventListener('click', () => {
        const isConfirmPassword = confirmPasswordInput.getAttribute('type') === 'password';
        confirmPasswordInput.setAttribute('type', isConfirmPassword ? 'text' : 'password');

        toggleConfirmPasswordIcon.classList.toggle('fa-eye');
        toggleConfirmPasswordIcon.classList.toggle('fa-eye-slash');
    });
    
    errorContainer.classList.add('hidden');
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            errorMessage.textContent = 'All fields are required.';
            errorContainer.classList.remove('hidden');
            return;
        }

        if(password !== confirmPassword){
            errorMessage.textContent = 'Passwords are not matching.';
            errorContainer.classList.remove('hidden');
            return;    
        }

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
            });
            if (response.ok) {
                const result = await response.json();
                if (result.redirect) {
                    const hiddenForm = document.createElement('form');
                    hiddenForm.action = result.redirect;
                    hiddenForm.method = 'GET';
                    document.body.appendChild(hiddenForm);
                    hiddenForm.submit();
                }
            } else {
                const errorData = await response.json();
                errorMessage.textContent = errorData.error || 'An error occurred. Please try again.';
                errorContainer.classList.remove('hidden');
                passwordInput.value = '';
                confirmPasswordInput.value = '';
            }
        } catch (error) {
            errorMessage.textContent = 'Unable to connect to the server. Please try again.';
            errorContainer.classList.remove('hidden');
            passwordInput.value = '';
        }
    });
}