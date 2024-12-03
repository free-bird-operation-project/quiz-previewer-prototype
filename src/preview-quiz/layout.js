import QuizDatabase from '../database/index';
import { createLucideIcons } from '../create-lucide-icons';

class Layout {
	constructor(data) {
		this.data = data;
		this.page = document.querySelector('main');
		this.components = [];
	}

	createNavComponents() {
		const navigation = document.createElement('nav');
		const back = document.createElement('i');

		navigation.className = 'navigation-bar';
		navigation.id = 'navigation-bar-file-details';
		navigation.addEventListener('click', (event) => {
			if (event.target.id === 'back-home') {
				const existingPages = document.querySelectorAll('.file-details-page, .file-preview-page');
				existingPages.forEach((page) => page.remove());
			}
		});

		back.dataset.lucide = 'chevron-left';
		back.id = 'back-home';

		navigation.appendChild(back);

		return navigation;
	}

	async showFileDetails(key) {
		const section = document.createElement('section');
		section.className = 'file-details-page';
		section.id = `file-details-page-${key}`;

		const details = document.createElement('div');
		details.className = 'file-details';

		const header = document.createElement('h1');
		header.textContent = `${key}`;
		details.appendChild(header);

		try {
			const db = new QuizDatabase();
			await db.openDatabase();

			const quizPacks = await db.getAllQuizPacks();
			const pack = quizPacks.find((p) => p.filename === key);

			if (pack) {
				const questionsCount = pack.data.length;
				const questionText = document.createElement('p');
				questionText.innerHTML = `<strong>Questions: </strong>${questionsCount}`;
				details.appendChild(questionText);

				const textarea = document.createElement('textarea');
				textarea.readOnly = true;
				textarea.wrap = 'hard';
				textarea.value = JSON.stringify(pack.data, null, 2);
				details.appendChild(textarea);

				const buttonContainer = document.createElement('div');
				buttonContainer.className = 'button-container';

				const wrapButton = document.createElement('button');
				wrapButton.className = 'file-details-button secondary-button';
				const wrapIcon = document.createElement('i');
				wrapIcon.dataset.lucide = 'wrap-text';
				const wrapText = document.createElement('p');
				wrapText.textContent = 'Wrap Text';
				wrapButton.appendChild(wrapIcon);
				wrapButton.appendChild(wrapText);

				let isWrapped = true;
				wrapButton.addEventListener('click', () => {
					isWrapped = !isWrapped;
					textarea.wrap = isWrapped ? 'hard' : 'off';
					wrapText.textContent = isWrapped ? 'Wrap Text' : 'No Wrap';
				});

				const previewButton = document.createElement('button');
				previewButton.className = 'file-details-button primary-button';
				const previewIcon = document.createElement('i');
				previewIcon.dataset.lucide = 'play';
				const previewText = document.createElement('p');
				previewText.textContent = 'Preview Quiz';
				previewButton.appendChild(previewIcon);
				previewButton.appendChild(previewText);

				previewButton.addEventListener('click', () => {
					const existingPages = document.querySelectorAll('.file-preview-page');

					existingPages.forEach((page) => page.remove());
					this.previewQuiz(key);
					createLucideIcons();
				});

				buttonContainer.appendChild(wrapButton);
				buttonContainer.appendChild(previewButton);

				details.appendChild(buttonContainer);
			} else {
				const errorMsg = document.createElement('p');
				errorMsg.textContent = 'Quiz pack not found.';
				details.appendChild(errorMsg);
			}
		} catch (error) {
			const errorMsg = document.createElement('p');
			errorMsg.textContent = `Error: ${error.message}`;
			details.appendChild(errorMsg);
		}

		section.appendChild(this.createNavComponents());
		section.appendChild(details);
		this.page.appendChild(section);
		createLucideIcons();
	}

	async previewQuiz(key = null) {
		const section = document.createElement('section');
		section.className = 'file-preview-page';
		section.id = `file-preview-page-${key}`;

		const wrapper = document.createElement('div');
		wrapper.className = 'quiz-wrapper';
		wrapper.id = 'quiz-wrapper';

		try {
			const db = new QuizDatabase();
			await db.openDatabase();

			let quizPacks = await db.getAllQuizPacks();
			let currentQuizPack;

			if (key) {
				currentQuizPack = quizPacks.find((p) => p.filename === key);
				if (!currentQuizPack) {
					throw new Error('Quiz pack not found');
				}
				quizPacks = [currentQuizPack];
			}

			if (quizPacks.length === 0) {
				const noQuizMessage = document.createElement('p');
				noQuizMessage.textContent = 'No quiz packs available.';
				section.appendChild(noQuizMessage);
				this.page.appendChild(section);
				return;
			}

			const allQuestions = quizPacks.flatMap((pack) => pack.data);
			let currentQuestionIndex = 0;

			const helperText = document.createElement('p');
			helperText.className = 'helper-text';
			const question = document.createElement('div');
			question.className = 'question-container';
			const reference = document.createElement('div');
			reference.className = 'reference-container';

			const choiceContainers = ['A', 'B', 'C', 'D'].map((letter) => {
				const container = document.createElement('div');
				container.className = `choice-container choice-${letter.toLowerCase()}`;
				return container;
			});

			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'button-container';

			const previousButton = document.createElement('button');
			previousButton.className = 'file-preview-button secondary-button';
			const previousIcon = document.createElement('i');
			previousIcon.dataset.lucide = 'arrow-left';
			const previousText = document.createElement('p');
			previousText.textContent = 'Previous Item';
			previousButton.appendChild(previousIcon);
			previousButton.appendChild(previousText);

			const nextButton = document.createElement('button');
			nextButton.className = 'file-preview-button secondary-button';
			const nextIcon = document.createElement('i');
			nextIcon.dataset.lucide = 'arrow-right';
			const nextText = document.createElement('p');
			nextText.textContent = 'Next Item';
			nextButton.appendChild(nextText);
			nextButton.appendChild(nextIcon);

			const shuffleArray = (array) => {
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
				return array;
			};

			const renderQuestion = (index) => {
				const currentQuestion = allQuestions[index];

				helperText.innerHTML = `Question ${index + 1} of ${allQuestions.length}`;
				question.innerHTML = `<h2>${currentQuestion.question || 'No question text'}</h2>`;
				reference.innerHTML = currentQuestion.references ? `<i>${currentQuestion.references}</i>` : '';

				const choices = currentQuestion.choices.map((choiceText, i) => ({
					text: choiceText,
					letter: String.fromCharCode(65 + i),
					isCorrect: choiceText === currentQuestion.choices[0]
				}));

				const shuffledChoices = shuffleArray(choices);

				shuffledChoices.forEach((choice, i) => {
					const container = choiceContainers[i];
					container.style.border = 'var(--grey-400) 3px solid';
					container.innerHTML = `
                    <input type="radio" id="choice-${choice.letter}" 
                           name="question-choices" 
                           value="${choice.letter}"
                           data-answer="${choice.isCorrect}">
                    <label for="choice-${choice.letter}">${choice.text}</label>
                    `;

					if (choice.isCorrect) {
						container.style.border = 'var(--green-500) 3px solid';
					}
				});

				previousButton.disabled = index === 0;
				nextButton.disabled = index === allQuestions.length - 1;

				// Add style changes for disabled state
				if (previousButton.disabled) {
					previousButton.style.backgroundColor = 'var(--grey-200)';
					previousButton.style.cursor = 'not-allowed';
				} else {
					previousButton.style.backgroundColor = '';
					previousButton.style.cursor = 'pointer';
				}

				if (nextButton.disabled) {
					nextButton.style.backgroundColor = 'var(--grey-200)';
					nextButton.style.cursor = 'not-allowed';
				} else {
					nextButton.style.backgroundColor = '';
					nextButton.style.cursor = 'pointer';
				}
			};

			renderQuestion(currentQuestionIndex);

			previousButton.addEventListener('click', () => {
				if (currentQuestionIndex > 0) {
					currentQuestionIndex--;
					renderQuestion(currentQuestionIndex);
				}
				createLucideIcons();
			});

			nextButton.addEventListener('click', () => {
				if (currentQuestionIndex < allQuestions.length - 1) {
					currentQuestionIndex++;
					renderQuestion(currentQuestionIndex);
				}
				createLucideIcons();
			});

			section.appendChild(this.createNavComponents());
			wrapper.appendChild(helperText);
			wrapper.appendChild(question);
			wrapper.appendChild(reference);
			choiceContainers.forEach((container) => wrapper.appendChild(container));
			buttonContainer.appendChild(previousButton);
			buttonContainer.appendChild(nextButton);
			wrapper.appendChild(buttonContainer);
			section.appendChild(wrapper);
			this.page.appendChild(section);
			createLucideIcons();
		} catch (error) {
			console.error('Error in previewQuiz:', error);
			const errorMsg = document.createElement('p');
			errorMsg.textContent = `Error: ${error.message}`;
			section.appendChild(errorMsg);
			this.page.appendChild(section);
		}
	}

	async previewAllQuizzes() {
		const section = document.createElement('section');
		section.className = 'file-preview-page';
		section.id = 'file-preview-page-all-quizzes';

		const wrapper = document.createElement('div');
		wrapper.className = 'quiz-wrapper';
		wrapper.id = 'quiz-wrapper';

		try {
			const db = new QuizDatabase();
			await db.openDatabase();

			const quizPacks = await db.getAllQuizPacks();
			const allQuestions = quizPacks.flatMap((pack) => pack.data);

			if (allQuestions.length === 0) {
				const noQuizMessage = document.createElement('p');
				noQuizMessage.textContent = 'No quiz packs available.';
				section.appendChild(noQuizMessage);
				this.page.appendChild(section);
				return;
			}

			let currentQuestionIndex = 0;

			const helperText = document.createElement('p');
			helperText.className = 'helper-text';

			const question = document.createElement('div');
			question.className = 'question-container';

			const reference = document.createElement('div');
			reference.className = 'reference-container';

			const choiceContainers = ['A', 'B', 'C', 'D'].map((letter) => {
				const container = document.createElement('div');
				container.className = `choice-container choice-${letter.toLowerCase()}`;
				return container;
			});

			const buttonContainer = document.createElement('div');
			buttonContainer.className = 'button-container';

			const previousButton = document.createElement('button');
			previousButton.className = 'file-preview-button secondary-button';
			const previousIcon = document.createElement('i');
			previousIcon.dataset.lucide = 'arrow-left';
			const previousText = document.createElement('p');
			previousText.textContent = 'Previous Item';
			previousButton.appendChild(previousIcon);
			previousButton.appendChild(previousText);

			const nextButton = document.createElement('button');
			nextButton.className = 'file-preview-button secondary-button';
			const nextIcon = document.createElement('i');
			nextIcon.dataset.lucide = 'arrow-right';
			const nextText = document.createElement('p');
			nextText.textContent = 'Next Item';
			nextButton.appendChild(nextText);
			nextButton.appendChild(nextIcon);

			const shuffleArray = (array) => {
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
				return array;
			};

			const renderQuestion = (index) => {
				const currentQuestion = allQuestions[index];

				helperText.innerHTML = `Question ${index + 1} of ${allQuestions.length}`;
				question.innerHTML = `<h2>${currentQuestion.question || 'No question text'}</h2>`;
				reference.innerHTML = currentQuestion.references ? `<i>${currentQuestion.references}</i>` : '';

				const choices = currentQuestion.choices.map((choiceText, i) => ({
					text: choiceText,
					letter: String.fromCharCode(65 + i),
					isCorrect: choiceText === currentQuestion.choices[0]
				}));

				const shuffledChoices = shuffleArray(choices);

				shuffledChoices.forEach((choice, i) => {
					const container = choiceContainers[i];
					container.style.border = 'var(--grey-400) 3px solid';
					container.innerHTML = `
                    <input type="radio" id="choice-${choice.letter}" 
                           name="question-choices" 
                           value="${choice.letter}"
                           data-answer="${choice.isCorrect}">
                    <label for="choice-${choice.letter}">${choice.text}</label>
                    `;

					if (choice.isCorrect) {
						container.style.border = 'var(--green-500) 3px solid';
					}
				});

				previousButton.disabled = index === 0;
				nextButton.disabled = index === allQuestions.length - 1;

				// Add style changes for disabled state
				if (previousButton.disabled) {
					previousButton.style.backgroundColor = 'var(--grey-200)';
					previousButton.style.cursor = 'not-allowed';
				} else {
					previousButton.style.backgroundColor = '';
					previousButton.style.cursor = 'pointer';
				}

				if (nextButton.disabled) {
					nextButton.style.backgroundColor = 'var(--grey-200)';
					nextButton.style.cursor = 'not-allowed';
				} else {
					nextButton.style.backgroundColor = '';
					nextButton.style.cursor = 'pointer';
				}
			};

			renderQuestion(currentQuestionIndex);

			previousButton.addEventListener('click', () => {
				if (currentQuestionIndex > 0) {
					currentQuestionIndex--;
					renderQuestion(currentQuestionIndex);
				}
				createLucideIcons();
			});

			nextButton.addEventListener('click', () => {
				if (currentQuestionIndex < allQuestions.length - 1) {
					currentQuestionIndex++;
					renderQuestion(currentQuestionIndex);
				}
				createLucideIcons();
			});

			section.appendChild(this.createNavComponents());
			wrapper.appendChild(helperText);
			wrapper.appendChild(question);
			wrapper.appendChild(reference);
			choiceContainers.forEach((container) => wrapper.appendChild(container));
			buttonContainer.appendChild(previousButton);
			buttonContainer.appendChild(nextButton);
			wrapper.appendChild(buttonContainer);
			section.appendChild(wrapper);
			this.page.appendChild(section);
			createLucideIcons();
		} catch (error) {
			console.error('Error in previewAllQuizzes:', error);
			const errorMsg = document.createElement('p');
			errorMsg.textContent = `Error: ${error.message}`;
			section.appendChild(errorMsg);
			this.page.appendChild(section);
		}
	}
}

export { Layout };
