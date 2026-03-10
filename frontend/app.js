const loginForm = document.getElementById('login-form');
const tokenField = document.getElementById('token');
const sessionOutput = document.getElementById('session-output');
const apiOutput = document.getElementById('api-output');
const clearOutputButton = document.getElementById('clear-output');
const actionButtons = document.querySelectorAll('[data-endpoint]');

const state = {
  token: localStorage.getItem('erp_token') || '',
};

const pretty = (value) => JSON.stringify(value, null, 2);

const renderToken = () => {
  tokenField.value = state.token;
};

const request = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(pretty(data || { status: response.status }));
  }

  return data;
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());
    const session = await request('/api/v1/administracao/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    state.token = session.token;
    localStorage.setItem('erp_token', state.token);
    renderToken();
    sessionOutput.textContent = pretty(session);
  } catch (error) {
    sessionOutput.textContent = error.message;
  }
});

actionButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    apiOutput.textContent = `Consultando ${button.dataset.endpoint}...`;

    try {
      const data = await request(button.dataset.endpoint);
      apiOutput.textContent = pretty(data);
    } catch (error) {
      apiOutput.textContent = error.message;
    }
  });
});

clearOutputButton.addEventListener('click', () => {
  apiOutput.textContent = '';
  sessionOutput.textContent = '';
});

renderToken();
