import { importQuiz } from './import-quiz';
import QuizDatabase from '../database';
import { menuEvent } from '../menu-overlay/menu-event';
import { createLucideIcons } from '../create-lucide-icons';
import { Layout as PreviewQuizLayout } from '../preview-quiz/layout';
import { Notes } from '../notes/notes';

class Layout {
	constructor() {
		this.page = document.createElement('section');
		this.quizDatabase = new QuizDatabase();
	}

	createNavComponents() {
		const navigation = document.createElement('nav');
		const menu = document.createElement('i');
		const messageSquare = document.createElement('i');

		navigation.className = 'navigation-bar';
		navigation.id = 'navigation-bar';
		navigation.addEventListener('click', (event) => {
			if (event.target.id === 'menu-home') {
				menuEvent();
			}

			if (event.target.id === 'notes') {
				createLucideIcons();
				new Notes().showNotes();
				createLucideIcons();
			}
		});

		menu.dataset.lucide = 'menu';
		menu.id = 'menu-home';
		messageSquare.dataset.lucide = 'notebook-text';
		messageSquare.title = 'Notes';
		messageSquare.id = 'notes';

		navigation.appendChild(menu);
		navigation.appendChild(messageSquare);

		return navigation;
	}

	createEmptyField() {
		const emptySection = document.createElement('section');
		emptySection.id = 'empty-section';
		emptySection.className = 'quiz-section';

		const image = document.createElement('img');
		image.src = './assets/01.png';

		const messageNode = document.createElement('p');
		messageNode.id = 'empty-message';
		messageNode.innerHTML = `<p>Feels empty here, Man,<br/>add your quizzes here.</p>`;

		const importButton = document.createElement('button');
		const importIcon = document.createElement('i');
		const importText = document.createElement('p');
		importButton.id = 'import-button';
		importIcon.dataset.lucide = 'import';
		importText.textContent = 'Import JSON';
		importButton.appendChild(importIcon);
		importButton.appendChild(importText);
		importButton.className = 'primary-button';
		importButton.addEventListener('click', importQuiz);

		emptySection.appendChild(image);
		emptySection.appendChild(messageNode);
		emptySection.appendChild(importButton);

		return emptySection;
	}

	createFilledSection(quizPacks) {
		const filledSection = document.createElement('section');
		filledSection.className = 'quiz-section';
		filledSection.id = 'filled-section';

		const label = document.createElement('p');
		label.textContent = 'Quiz Packs';
		label.id = 'quiz-pack-label';
		filledSection.appendChild(label);

		quizPacks.forEach((pack) => {
			const fileRow = document.createElement('div');
			fileRow.id = `file-row-${pack.filename}`;
			fileRow.className = 'file-row';

			const fileDetails = document.createElement('div');
			fileDetails.className = 'file-details';
			fileDetails.dataset.filename = pack.filename;
			const fileIcon = document.createElement('i');
			fileIcon.dataset.lucide = 'square-library';
			fileDetails.appendChild(fileIcon);
			const fileName = document.createElement('p');
			fileName.textContent = pack.filename;
			fileDetails.appendChild(fileName);
			fileDetails.addEventListener('click', () => {
				new PreviewQuizLayout().showFileDetails(pack.filename);
				createLucideIcons();
			});

			const playButton = document.createElement('button');
			playButton.className = 'file-row-button';
			const playIcon = document.createElement('i');
			playIcon.dataset.lucide = 'play';
			playButton.appendChild(playIcon);

			playButton.addEventListener('click', () => {
				new PreviewQuizLayout().previewQuiz(pack.filename);
			});

			const moreButton = document.createElement('button');
			moreButton.className = 'file-row-button';
			const moreIcon = document.createElement('i');
			moreIcon.dataset.lucide = 'ellipsis-vertical';
			moreButton.appendChild(moreIcon);

			const tooltip = document.createElement('div');
			tooltip.className = 'tooltip';
			tooltip.style.display = 'none';
			tooltip.style.position = 'absolute';
			tooltip.style.backgroundColor = 'var(--grey-300)';
			tooltip.style.padding = '16px';
			tooltip.style.borderRadius = '10px';
			tooltip.style.zIndex = '1000';

			const downloadOption = document.createElement('div');
			const downloadIcon = document.createElement('i');
			downloadIcon.dataset.lucide = 'download';
			downloadOption.appendChild(downloadIcon);
			downloadOption.textContent = 'Download';
			downloadOption.style.cursor = 'pointer';
			downloadOption.style.marginBottom = '10px';
			downloadOption.addEventListener('click', () => {
				const jsonString = JSON.stringify(pack.data, null, 2);
				const blob = new Blob([jsonString], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = pack.filename;
				a.click();
				URL.revokeObjectURL(url);
			});

			const deleteOption = document.createElement('div');
			const trashIcon = document.createElement('i');
			trashIcon.dataset.lucide = 'trash-2';
			deleteOption.appendChild(trashIcon);
			deleteOption.textContent = 'Delete';
			deleteOption.style.cursor = 'pointer';
			deleteOption.style.color = 'var(--red-300)';
			deleteOption.addEventListener('click', async () => {
				const confirmDelete = confirm(`Are you sure you want to delete ${pack.filename}?`);
				if (confirmDelete) {
					await this.quizDatabase.deleteQuizPack(pack.filename);
					// Refresh the page
					const main = document.querySelector('main');
					main.innerHTML = '';
					const app = await new Layout().render();
					main.appendChild(app);
					createLucideIcons();
				}
			});

			tooltip.appendChild(downloadOption);
			tooltip.appendChild(deleteOption);

			moreButton.addEventListener('click', (event) => {
				event.stopPropagation();

				Layout.hideAllTooltips();

				const tooltip = document.createElement('div');
				tooltip.className = 'tooltip';

				const downloadOption = document.createElement('div');
				const downloadIcon = document.createElement('i');
				downloadIcon.dataset.lucide = 'download';
				downloadOption.appendChild(downloadIcon);
				const downloadText = document.createElement('p');
				downloadText.textContent = 'Download';
				downloadOption.appendChild(downloadText);
				downloadOption.style.cursor = 'pointer';
				downloadOption.addEventListener('click', () => {
					const jsonString = JSON.stringify(pack.data, null, 2);
					const blob = new Blob([jsonString], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = pack.filename;
					a.click();
					URL.revokeObjectURL(url);
				});

				const deleteOption = document.createElement('div');
				const trashIcon = document.createElement('i');
				trashIcon.dataset.lucide = 'trash-2';
				deleteOption.appendChild(trashIcon);
				const deleteText = document.createElement('p');
				deleteText.textContent = 'Delete';
				deleteOption.appendChild(deleteText);
				deleteOption.style.cursor = 'pointer';
				deleteOption.style.color = 'var(--red-300)';
				deleteOption.addEventListener('click', async () => {
					const confirmDelete = confirm(`Are you sure you want to delete ${pack.filename}?`);
					if (confirmDelete) {
						await this.quizDatabase.deleteQuizPack(pack.filename);

						Layout.hideAllTooltips();

						const main = document.querySelector('main');
						main.innerHTML = '';
						const app = await new Layout().render();
						main.appendChild(app);
						createLucideIcons();
					}
				});
				tooltip.appendChild(downloadOption);
				tooltip.appendChild(deleteOption);

				const rect = moreButton.getBoundingClientRect();
				let left = rect.left;
				let top = rect.bottom;

				const tooltipWidth = 150;
				if (left + tooltipWidth > window.innerWidth) {
					left = window.innerWidth - tooltipWidth - 8;
				}

				const tooltipHeight = 100;
				if (top + tooltipHeight > window.innerHeight) {
					top = rect.top - tooltipHeight - 10;
				}

				tooltip.style.top = `${top}px`;
				tooltip.style.left = `${left}px`;

				document.body.appendChild(tooltip);

				const closeTooltip = (e) => {
					if (!tooltip.contains(e.target) && e.target !== moreButton) {
						tooltip.remove();
						document.removeEventListener('click', closeTooltip);
					}
				};

				setTimeout(() => {
					document.addEventListener('click', closeTooltip);
				}, 0);

				createLucideIcons();
			});

			fileRow.appendChild(fileDetails);
			fileRow.appendChild(playButton);
			fileRow.appendChild(moreButton);
			filledSection.appendChild(fileRow);
		});

		const buttonsContainer = document.createElement('div');
		buttonsContainer.className = 'buttons-container';
		buttonsContainer.id = 'buttons-container';

		const importButton = document.createElement('button');
		const importIcon = document.createElement('i');
		importButton.id = 'import-button';
		importIcon.dataset.lucide = 'import';
		importButton.appendChild(importIcon);
		importButton.className = 'secondary-button';
		importButton.title = 'Import JSON Files';
		importButton.addEventListener('click', importQuiz);

		const previewButton = document.createElement('button');
		const previewIcon = document.createElement('i');
		const previewText = document.createElement('p');
		previewButton.id = 'preview-button';
		previewIcon.dataset.lucide = 'play';
		previewText.textContent = 'Preview All Quiz';
		previewButton.appendChild(previewIcon);
		previewButton.appendChild(previewText);
		previewButton.className = 'primary-button';
		previewButton.addEventListener('click', () => {
			new PreviewQuizLayout().previewAllQuizzes();
		});

		buttonsContainer.appendChild(importButton);
		buttonsContainer.appendChild(previewButton);
		filledSection.appendChild(buttonsContainer);

		return filledSection;
	}

	static hideAllTooltips() {
		document.querySelectorAll('.tooltip').forEach((tooltip) => {
			tooltip.remove();
		});
	}

	async render() {
		// Clear existing content
		while (this.page.firstChild) {
			this.page.removeChild(this.page.firstChild);
		}

		// Add navigation
		const navigation = this.createNavComponents();
		this.page.appendChild(navigation);

		// Determine which section to show
		try {
			const quizPacks = await this.quizDatabase.getAllQuizPacks();

			// Choose section based on quiz pack existence
			const quizSection = quizPacks.length > 0 ? this.createFilledSection(quizPacks) : this.createEmptyField();

			this.page.appendChild(quizSection);
		} catch (error) {
			console.error('Error loading quiz packs:', error);

			// Fallback to empty section if there's an error
			const emptySection = this.createEmptyField();
			this.page.appendChild(emptySection);
		}

		return this.page;
	}
}

export { Layout };
