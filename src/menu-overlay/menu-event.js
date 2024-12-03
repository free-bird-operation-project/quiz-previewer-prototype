import { createLucideIcons } from '../create-lucide-icons';
import { showAbout } from './show-about';

function menuEvent() {
	const PHI = (1 + Math.sqrt(5)) / 2;
	const width = window.innerWidth / PHI;

	const containerWrapper = document.createElement('div');
	containerWrapper.id = 'menu-container-wrapper';
	containerWrapper.style.width = '100%';
	containerWrapper.style.zIndex = '999';
	containerWrapper.style.boxSizing = 'border-box';
	containerWrapper.addEventListener('click', (event) => {
		if (event.target.id === 'menu-container-wrapper') {
			containerWrapper.style.display = 'none';
		}
	});
	containerWrapper.style.display = 'flex';

	const container = document.createElement('div');
	container.id = 'menu-container';
	container.style.width = `${width}px`;
	containerWrapper.appendChild(container);

	const title = document.createElement('p');
	title.id = 'title-quiz';
	title.textContent = 'Quiz Preview (Prototype)';

	const moreRow = document.createElement('div');
	moreRow.id = 'more-row';

	const aboutIcon = document.createElement('i');
	aboutIcon.dataset.lucide = 'info';

	const about = document.createElement('div');
	about.className = 'more-text-row';
	about.id = 'more-about';
	about.addEventListener('click', showAbout);

	const aboutText = document.createElement('p');
	aboutText.textContent = 'About';
	about.appendChild(aboutIcon);
	about.appendChild(aboutText);

	moreRow.appendChild(about);

	const image = document.createElement('img');
	image.src = './assets/33.png';

	container.appendChild(title);
	container.appendChild(moreRow);
	container.appendChild(image);

	const main = document.querySelector('main');
	main.appendChild(containerWrapper);
	createLucideIcons();
}

export { menuEvent };
