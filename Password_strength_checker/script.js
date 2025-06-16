document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('strength-meter-fill');
    const strengthText = document.getElementById('strength-text');
    const entropyText = document.getElementById('entropy');
    const requirements = document.querySelectorAll('.requirement');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const copyBtn = document.getElementById('copy-btn');
    const generateBtn = document.getElementById('generate-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggleBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            togglePasswordBtn.innerHTML = '<i class="far fa-eye"></i>';
        }
    });

    // Copy password to clipboard
    copyBtn.addEventListener('click', function() {
        if (passwordInput.value.length > 0) {
            navigator.clipboard.writeText(passwordInput.value)
                .then(() => {
                    copyBtn.classList.add('copied');
                    setTimeout(() => copyBtn.classList.remove('copied'), 300);
                    
                    // Show temporary feedback
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => copyBtn.innerHTML = originalHTML, 1000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    });

    // Generate strong password
    generateBtn.addEventListener('click', function() {
        const password = generateStrongPassword();
        passwordInput.value = password;
        passwordInput.dispatchEvent(new Event('input'));
    });

    // Check password strength on input
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const { score, entropy } = checkPasswordStrength(password);
        
        // Update strength meter
        strengthMeter.style.width = `${score * 25}%`;
        updateStrengthMeterColor(score);
        
        // Update texts
        updateStrengthText(score);
        entropyText.textContent = `Entropy: ${entropy.toFixed(1)} bits`;
        
        // Check requirements
        checkPasswordRequirements(password);
    });

    // Function to check password strength
    function checkPasswordStrength(password) {
        if (!password.length) {
            return { score: 0, entropy: 0 };
        }

        // Check the requirements
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        
        // Calculate base score (0-4)
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Add points for character variety
        const varieties = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(Boolean).length;
        score += varieties >= 3 ? 1 : 0;
        score += varieties === 4 ? 1 : 0;
        
        // Penalize for common patterns
        if (/^(?:123456|password|qwerty|admin|welcome|abc123)$/i.test(password)) {
            score = Math.max(1, score - 2);
        }
        
        // Calculate entropy
        let charPoolSize = 0;
        if (hasLowercase) charPoolSize += 26;
        if (hasUppercase) charPoolSize += 26;
        if (hasNumbers) charPoolSize += 10;
        if (hasSpecial) charPoolSize += 33;
        
        const entropy = charPoolSize ? password.length * Math.log2(charPoolSize) : 0;
        
        return { score, entropy };
    }

    // Update the strength meter color based on score
    function updateStrengthMeterColor(score) {
        const colors = [
            'var(--strength-very-weak)',   // 0: Very Weak (red)
            'var(--strength-weak)',        // 1: Weak (orange)
            'var(--strength-medium)',      // 2: Medium (yellow)
            'var(--strength-strong)',      // 3: Strong (light green)
            'var(--strength-very-strong)'  // 4: Very Strong (green)
        ];
        
        strengthMeter.style.backgroundColor = colors[score];
    }

    // Update the strength text based on score
    function updateStrengthText(score) {
        const strengthLabels = [
            'Very Weak',
            'Weak',
            'Medium',
            'Strong',
            'Very Strong'
        ];
        
        strengthText.textContent = `Strength: ${strengthLabels[score]}`;
        strengthText.style.color = strengthMeter.style.backgroundColor;
    }

    // Check password requirements
    function checkPasswordRequirements(password) {
        const requirementTests = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /[0-9]/.test(password),
            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        ];
        
        requirements.forEach((req, index) => {
            const icon = req.querySelector('i');
            if (requirementTests[index]) {
                icon.className = 'fas fa-check';
            } else {
                icon.className = 'fas fa-times';
            }
        });
    }

    // Generate a strong password
    function generateStrongPassword(length = 16) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_-+=<>?';
        
        const allChars = lowercase + uppercase + numbers + special;
        
        // Ensure at least one character from each category
        let password = 
            lowercase.charAt(Math.floor(Math.random() * lowercase.length)) +
            uppercase.charAt(Math.floor(Math.random() * uppercase.length)) +
            numbers.charAt(Math.floor(Math.random() * numbers.length)) +
            special.charAt(Math.floor(Math.random() * special.length));
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        
        // Shuffle the password
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    }
});