const loginForm = document.getElementById('loginForm');

if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.text-goes-here');

    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleIcon = togglePasswordButton.querySelector('i');

    togglePasswordButton.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        toggleIcon.classList.toggle('fa-eye');
        toggleIcon.classList.toggle('fa-eye-slash');
    });
    
    errorContainer.classList.add('hidden');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            errorMessage.textContent = 'Both email and password are required.';
            errorContainer.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
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
            }
        } catch (error) {
            errorMessage.textContent = 'Unable to connect to the server. Please try again.';
            errorContainer.classList.remove('hidden');
            passwordInput.value = '';
        }
    });
}
