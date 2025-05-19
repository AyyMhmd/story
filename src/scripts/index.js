// src/scripts/index.js
// CSS imports
import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Update auth menu
  updateAuthMenu();
});

function updateAuthMenu() {
  const authMenu = document.getElementById('auth-menu');
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  if (token) {
    authMenu.innerHTML = `
            <a href="#/" id="logout-button">
                <i class="fas fa-sign-out-alt"></i> Logout (${name || 'User'})
            </a>
        `;

    document.getElementById('logout-button').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      window.location.hash = '#/';
      updateAuthMenu();
    });
  } else {
    authMenu.innerHTML = `
            <a href="#/login">
                <i class="fas fa-sign-in-alt"></i> Login
            </a>
        `;
  }
}