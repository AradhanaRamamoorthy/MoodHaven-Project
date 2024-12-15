const passwordResetForm = document.getElementById('passwordResetForm');

if(passwordResetForm){
    const passwordInput = document.getElementById('passwordReset');
    const confirmPasswordInput = document.getElementById('confirmPasswordReset');
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
    passwordResetForm.addEventListener('submit', async(event) => {
        event.preventDefault();

        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if(!password || !confirmPassword){
            errorMessage.textContent = 'Both fields are required.';
            errorContainer.classList.remove('hidden');
            passwordInput.value = '';
            confirmPasswordInput.value = '';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords are not matching.';
            errorContainer.classList.remove('hidden');
            passwordInput.value = '';
            confirmPasswordInput.value = '';
            return;
        }

        try{
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            if(response.ok){
                const result = await response.json();

                if (result.redirect) {
                    const hiddenForm = document.createElement('form');
                    hiddenForm.action = result.redirect;
                    hiddenForm.method = 'POST';

                    hiddenForm.innerHTML = `
                        <input type="hidden" name="msg" value="${result.data.msg}">
                        <input type="hidden" name="hasResponse" value="${result.data.hasResponse}">
                    `;

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
        } catch(error){
            errorMessage.textContent = `Error: ${error}`;
            errorContainer.classList.remove('hidden');
            passwordInput.value = '';
            confirmPasswordInput.value = '';
        }
    })
}

const resetForm = document.getElementById('resetForm');

if(resetForm){
    const emailInput = document.getElementById('email');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = errorContainer.querySelector('.text-goes-here');

    errorContainer.classList.add('hidden');
    resetForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const email = emailInput.value.trim();

        if(!email){
            errorMessage.textContent = 'Please enter your email address.';
            errorContainer.classList.remove('hidden');
            return;
        }

        try{
            const response = await fetch('/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if(response.ok){
                const result = await response.json();

                if (result.redirect) {
                    const hiddenForm = document.createElement('form');
                    hiddenForm.action = result.redirect;
                    hiddenForm.method = 'POST';

                    hiddenForm.innerHTML = `
                        <input type="hidden" name="msg" value="${result.data.msg}">
                    `;

                    document.body.appendChild(hiddenForm);
                    hiddenForm.submit();
                }
                
            } else {
                const errorData = await response.json();
                errorMessage.textContent = errorData.error || 'An error occurred. Please try again.';
                errorContainer.classList.remove('hidden');
            }
        } catch(error){
            errorMessage.textContent = `Error: ${error}`;
            errorContainer.classList.remove('hidden');
        }
    });
}

// const responsePage = document.getElementById("response");
// if(responsePage){
    
// } 
