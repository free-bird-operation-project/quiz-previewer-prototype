import { createLucideIcons } from '../create-lucide-icons';

function showAbout() {
	const PHI = (1 + Math.sqrt(5)) / 2;
	const height = window.innerHeight / PHI / PHI;

	const containerWrapper = document.createElement('div');
	containerWrapper.id = 'about-container-wrapper';
	containerWrapper.style.height = height;
	containerWrapper.style.zIndex = '9999';
	containerWrapper.style.boxSizing = 'border-box';
	containerWrapper.addEventListener('click', (event) => {
		if (event.target.id === 'about-container-wrapper') {
			containerWrapper.style.display = 'none';
		}
	});
	containerWrapper.style.display = 'flex';

	const container = document.createElement('div');
	container.id = 'about-container';
	container.style.height = `${height}px`;
	containerWrapper.appendChild(container);

	const image = document.createElement('img');
	image.src = './assets/120.png';

	const copy = document.createElement('p');
	copy.innerHTML = `
        <strong>App Name:</strong> Quiz Preview Prototype<br>
        <strong>Description:</strong> A prototype application designed to preview quiz packs in an engaging and intuitive layout.<br>
        <strong>Developer:</strong> <a href="https://github.com/chessurisme" target="_blank" rel="noopener noreferrer">Chessurisme</a><br>
        <strong>Created Last:</strong> December 2, 2024
        `;

	container.appendChild(image);
	container.appendChild(copy);

	const main = document.querySelector('main');
	main.appendChild(containerWrapper);
	createLucideIcons();
}

export { showAbout };
