import { App } from './app';
import { createLucideIcons } from './create-lucide-icons';

window.addEventListener('DOMContentLoaded', async () => {
	const main = document.querySelector('main');
	main.innerHTML = '';
	const app = await new App().render();
	main.appendChild(app);
	createLucideIcons();
});
