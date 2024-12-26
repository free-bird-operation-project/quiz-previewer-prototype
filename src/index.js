import { App } from './app';
import { loadClarity } from './script/clarity';
import { isSW } from './script/service-worker';
import { createLucideIcons } from './create-lucide-icons';

window.addEventListener('DOMContentLoaded', async () => {
	loadClarity('peph7az7f9');
	isSW();

	const main = document.querySelector('main');
	main.innerHTML = '';
	const app = await new App().render();
	main.appendChild(app);
	createLucideIcons();
});
