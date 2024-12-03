import { createLucideIcons } from '../create-lucide-icons';

class Notes {
	constructor(data) {
		this.data = data;
		this.page = document.querySelector('main');
	}

	createNavComponents() {
		const navigation = document.createElement('nav');
		const back = document.createElement('i');

		navigation.className = 'navigation-bar';
		navigation.id = 'navigation-bar-notes';
		navigation.addEventListener('click', (event) => {
			if (event.target.id === 'back-home') {
				const existingPages = document.querySelectorAll('.notes-page');
				existingPages.forEach((page) => page.remove());
			}
		});

		back.dataset.lucide = 'chevron-left';
		back.id = 'back-home';

		navigation.appendChild(back);

		return navigation;
	}

	createPage() {
		if (document.querySelector('.notes-page')) return;

		const page = document.createElement('section');
		page.className = 'notes-page';
		page.id = 'notes-page';

		const wrapper = document.createElement('div');
		wrapper.className = 'notes-wrapper';
		wrapper.id = 'notes-wrapper';

		const h1 = document.createElement('h1');
		h1.textContent = 'Notes';
		wrapper.appendChild(h1);

		const p = document.createElement('p');
		p.textContent = 'Add your wishlist, thoughts, or notes here about the app...';
		wrapper.appendChild(p);

		const textarea = this.createTextarea();
		wrapper.appendChild(textarea);

		page.appendChild(wrapper);

		const navigation = this.createNavComponents();
		page.appendChild(navigation);

		const buttonsContainer = this.createButtonsContainer();
		page.appendChild(buttonsContainer);

		return page;
	}

	createButtonsContainer() {
		const buttonsContainer = document.createElement('div');
		buttonsContainer.className = 'notes-buttons-container';
		buttonsContainer.id = 'notes-buttons-container';

		const shareButton = document.createElement('button');
		shareButton.className = 'notes-button secondary-button';
		const shareIcon = document.createElement('i');
		const shareText = document.createElement('p');
		shareText.textContent = 'Share';
		shareIcon.dataset.lucide = 'share';
		shareButton.appendChild(shareIcon);
		shareButton.appendChild(shareText);
		buttonsContainer.appendChild(shareButton);

		const copyButton = document.createElement('button');
		copyButton.className = 'notes-button primary-button';
		const copyIcon = document.createElement('i');
		const copyText = document.createElement('p');
		copyText.textContent = 'Copy';
		copyIcon.dataset.lucide = 'clipboard';
		copyButton.appendChild(copyIcon);
		copyButton.appendChild(copyText);
		buttonsContainer.appendChild(copyButton);

		copyButton.addEventListener('click', () => {
			this.copyNotes.bind(this);
			copyText.textContent = 'Copied';
		});
		shareButton.addEventListener('click', this.shareNotes.bind(this));

		return buttonsContainer;
	}

	copyNotes() {
		const textarea = document.getElementById('notes-textarea');
		textarea.select();
		document.execCommand('copy');
	}

	async shareNotes() {
		const shareData = {
			title: 'Notes',
			text: document.getElementById('notes-textarea').value
		};

		try {
			await navigator.share(shareData);
			console.log('Content shared successfully');
		} catch (err) {
			console.error('Error sharing content:', err);
		}
	}

	saveInLocalStorage() {
		const textarea = document.getElementById('notes-textarea');
		localStorage.setItem('notes', textarea.value);
	}

	retrieveInLocalStorage() {
		const textarea = document.getElementById('notes-textarea');
		textarea.value = localStorage.getItem('notes');
	}

	createTextarea() {
		const textarea = document.createElement('textarea');
		textarea.id = 'notes-textarea';
		textarea.placeholder = 'Add a note...';

		textarea.addEventListener('input', this.saveInLocalStorage.bind(this));

		return textarea;
	}

	showNotes() {
		const page = this.createPage();
		this.page.appendChild(page);
		this.retrieveInLocalStorage();
	}
}

export { Notes };
