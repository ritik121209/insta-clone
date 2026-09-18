const user = document.getElementById('username');
const pass = document.getElementById('password');
const btn = document.getElementById('loginBtn');
const toggle = document.getElementById('toggleBtn');
const form = document.getElementById('loginForm');
const signupLink = document.querySelector('.signup-card a');

const redirectIfLoggedIn = async () => {
  try {
    const response = await fetch('/api/session');
    const data = await response.json();
    if (data.loggedIn) {
      window.location.href = '/dashboard';
    }

    const params = new URLSearchParams(window.location.search);
    const usernameFromSignup = params.get('username');
    if (usernameFromSignup && user) {
      user.value = usernameFromSignup;
      refreshState(user);
      checkFormValid();
      pass.focus();
    }
  } catch (error) {
    console.error('Session check failed:', error);
  }
};

if (!user || !pass || !btn || !toggle || !form) {
  console.warn('Login form elements are missing.');
} else {
  function refreshState(el) {
    if (el.value.length > 0) {
      el.classList.add('filled');
    } else {
      el.classList.remove('filled');
    }
  }

  function checkFormValid() {
    btn.disabled = !(user.value.trim().length > 0 && pass.value.length > 0);
  }

  const updateFormState = () => {
    refreshState(user);
    refreshState(pass);
    checkFormValid();
  };

  [user, pass].forEach((el) => {
    el.addEventListener('input', updateFormState);
    el.addEventListener('change', updateFormState);
  });

  toggle.addEventListener('click', () => {
    const isPassword = pass.type === 'password';
    pass.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? 'Hide' : 'Show';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = user.value.trim();
    const password = pass.value;

    if (!username || !password) {
      console.warn('Please enter your username and password.');
      return;
    }

    btn.textContent = 'Logging in…';
    btn.disabled = true;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        console.warn(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login failed. Please try again.', error);
    } finally {
      btn.textContent = 'Log in';
      checkFormValid();
    }
  });

  updateFormState();
  redirectIfLoggedIn();
}
