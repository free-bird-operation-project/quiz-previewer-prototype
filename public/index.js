if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('./sw.js')
			.then((registration) => {
				console.log('Service Worker registered successfully', registration);
			})
			.catch((error) => {
				console.error('Service Worker registration failed:', error);
			});
	});
}

class QuizDatabase {
	constructor(dbName = 'QuizPackDatabase', dbVersion = 1) {
		this.dbName = dbName;
		this.dbVersion = dbVersion;
		this.db = null;
	}

	async openDatabase() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;

				// Create an object store for quiz packs
				if (!db.objectStoreNames.contains('quizPacks')) {
					db.createObjectStore('quizPacks', {
						keyPath: 'filename'
					});
				}
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
				resolve(this.db);
			};

			request.onerror = (event) => {
				reject(`IndexedDB error: ${event.target.error}`);
			};
		});
	}

	async addQuizPack(file) {
		if (!this.db) await this.openDatabase();

		return new Promise((resolve, reject) => {
			try {
				// Read file content
				const reader = new FileReader();
				reader.onload = async (e) => {
					const content = e.target.result;
					const quizData = JSON.parse(content);

					const transaction = this.db.transaction(['quizPacks'], 'readwrite');
					const store = transaction.objectStore('quizPacks');

					// Store with filename as key and full JSON as value
					const request = store.put({
						filename: file.name,
						data: quizData
					});

					request.onsuccess = () => resolve(file.name);
					request.onerror = (event) => reject(event.target.error);
				};

				reader.onerror = (error) => reject(error);
				reader.readAsText(file);
			} catch (error) {
				reject(error);
			}
		});
	}

	async getAllQuizPacks() {
		if (!this.db) await this.openDatabase();

		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(['quizPacks'], 'readonly');
			const store = transaction.objectStore('quizPacks');
			const request = store.getAll();

			request.onsuccess = (event) => resolve(event.target.result);
			request.onerror = (event) => reject(event.target.error);
		});
	}

	async deleteQuizPack(packId) {
		if (!this.db) await this.openDatabase();

		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(['quizPacks'], 'readwrite');
			const store = transaction.objectStore('quizPacks');
			const request = store.delete(packId);

			request.onsuccess = () => resolve();
			request.onerror = (event) => reject(event.target.error);
		});
	}
}

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const createElement = (tag, attrs, children = []) => {
	const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
	Object.keys(attrs).forEach((name) => {
		element.setAttribute(name, String(attrs[name]));
	});
	if (children.length) {
		children.forEach((child) => {
			const childElement = createElement(...child);
			element.appendChild(childElement);
		});
	}
	return element;
};
var createElement$1 = ([tag, attrs, children]) => createElement(tag, attrs, children);

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const getAttrs = (element) =>
	Array.from(element.attributes).reduce((attrs, attr) => {
		attrs[attr.name] = attr.value;
		return attrs;
	}, {});
const getClassNames = (attrs) => {
	if (typeof attrs === 'string') return attrs;
	if (!attrs || !attrs.class) return '';
	if (attrs.class && typeof attrs.class === 'string') {
		return attrs.class.split(' ');
	}
	if (attrs.class && Array.isArray(attrs.class)) {
		return attrs.class;
	}
	return '';
};
const combineClassNames = (arrayOfClassnames) => {
	const classNameArray = arrayOfClassnames.flatMap(getClassNames);
	return classNameArray
		.map((classItem) => classItem.trim())
		.filter(Boolean)
		.filter((value, index, self) => self.indexOf(value) === index)
		.join(' ');
};
const toPascalCase = (string) => string.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
const replaceElement = (element, { nameAttr, icons, attrs }) => {
	const iconName = element.getAttribute(nameAttr);
	if (iconName == null) return;
	const ComponentName = toPascalCase(iconName);
	const iconNode = icons[ComponentName];
	if (!iconNode) {
		return console.warn(`${element.outerHTML} icon name was not found in the provided icons object.`);
	}
	const elementAttrs = getAttrs(element);
	const [tag, iconAttributes, children] = iconNode;
	const iconAttrs = {
		...iconAttributes,
		'data-lucide': iconName,
		...attrs,
		...elementAttrs
	};
	const classNames = combineClassNames(['lucide', `lucide-${iconName}`, elementAttrs, attrs]);
	if (classNames) {
		Object.assign(iconAttrs, {
			class: classNames
		});
	}
	const svgElement = createElement$1([tag, iconAttrs, children]);
	return element.parentNode?.replaceChild(svgElement, element);
};

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const defaultAttributes = {
	'xmlns': 'http://www.w3.org/2000/svg',
	'width': 24,
	'height': 24,
	'viewBox': '0 0 24 24',
	'fill': 'none',
	'stroke': 'currentColor',
	'stroke-width': 2,
	'stroke-linecap': 'round',
	'stroke-linejoin': 'round'
};

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ArrowLeft = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'm12 19-7-7 7-7' }],
		['path', { d: 'M19 12H5' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ArrowRight = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'M5 12h14' }],
		['path', { d: 'm12 5 7 7-7 7' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const ChevronLeft = ['svg', defaultAttributes, [['path', { d: 'm15 18-6-6 6-6' }]]];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Clipboard = [
	'svg',
	defaultAttributes,
	[
		['rect', { width: '8', height: '4', x: '8', y: '2', rx: '1', ry: '1' }],
		['path', { d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Download = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
		['polyline', { points: '7 10 12 15 17 10' }],
		['line', { x1: '12', x2: '12', y1: '15', y2: '3' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const EllipsisVertical = [
	'svg',
	defaultAttributes,
	[
		['circle', { cx: '12', cy: '12', r: '1' }],
		['circle', { cx: '12', cy: '5', r: '1' }],
		['circle', { cx: '12', cy: '19', r: '1' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Import = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'M12 3v12' }],
		['path', { d: 'm8 11 4 4 4-4' }],
		['path', { d: 'M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Info = [
	'svg',
	defaultAttributes,
	[
		['circle', { cx: '12', cy: '12', r: '10' }],
		['path', { d: 'M12 16v-4' }],
		['path', { d: 'M12 8h.01' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Menu = [
	'svg',
	defaultAttributes,
	[
		['line', { x1: '4', x2: '20', y1: '12', y2: '12' }],
		['line', { x1: '4', x2: '20', y1: '6', y2: '6' }],
		['line', { x1: '4', x2: '20', y1: '18', y2: '18' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const NotebookText = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'M2 6h4' }],
		['path', { d: 'M2 10h4' }],
		['path', { d: 'M2 14h4' }],
		['path', { d: 'M2 18h4' }],
		['rect', { width: '16', height: '20', x: '4', y: '2', rx: '2' }],
		['path', { d: 'M9.5 8h5' }],
		['path', { d: 'M9.5 12H16' }],
		['path', { d: 'M9.5 16H14' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Play = ['svg', defaultAttributes, [['polygon', { points: '6 3 20 12 6 21 6 3' }]]];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Share = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' }],
		['polyline', { points: '16 6 12 2 8 6' }],
		['line', { x1: '12', x2: '12', y1: '2', y2: '15' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const SquareLibrary = [
	'svg',
	defaultAttributes,
	[
		['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
		['path', { d: 'M7 7v10' }],
		['path', { d: 'M11 7v10' }],
		['path', { d: 'm15 7 2 10' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const Trash2 = [
	'svg',
	defaultAttributes,
	[
		['path', { d: 'M3 6h18' }],
		['path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }],
		['path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }],
		['line', { x1: '10', x2: '10', y1: '11', y2: '17' }],
		['line', { x1: '14', x2: '14', y1: '11', y2: '17' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const UserRound = [
	'svg',
	defaultAttributes,
	[
		['circle', { cx: '12', cy: '8', r: '5' }],
		['path', { d: 'M20 21a8 8 0 0 0-16 0' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const WrapText = [
	'svg',
	defaultAttributes,
	[
		['line', { x1: '3', x2: '21', y1: '6', y2: '6' }],
		['path', { d: 'M3 12h15a3 3 0 1 1 0 6h-4' }],
		['polyline', { points: '16 16 14 18 16 20' }],
		['line', { x1: '3', x2: '10', y1: '18', y2: '18' }]
	]
];

/**
 * @license lucide v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const createIcons = ({ icons = {}, nameAttr = 'data-lucide', attrs = {} } = {}) => {
	if (!Object.values(icons).length) {
		throw new Error(
			"Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`"
		);
	}
	if (typeof document === 'undefined') {
		throw new Error('`createIcons()` only works in a browser environment.');
	}
	const elementsToReplace = document.querySelectorAll(`[${nameAttr}]`);
	Array.from(elementsToReplace).forEach((element) => replaceElement(element, { nameAttr, icons, attrs }));
	if (nameAttr === 'data-lucide') {
		const deprecatedElements = document.querySelectorAll('[icon-name]');
		if (deprecatedElements.length > 0) {
			console.warn(
				'[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide'
			);
			Array.from(deprecatedElements).forEach((element) => replaceElement(element, { nameAttr: 'icon-name', icons, attrs }));
		}
	}
};

function createLucideIcons() {
	createIcons({
		icons: {
			Menu,
			Play,
			Import,
			UserRound,
			SquareLibrary,
			Trash2,
			EllipsisVertical,
			Info,
			Download,
			ChevronLeft,
			WrapText,
			ArrowRight,
			ArrowLeft,
			NotebookText,
			Share,
			Clipboard
		}
	});
}

async function importQuiz() {
	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.accept = '.json';

	fileInput.onchange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		try {
			const quizDatabase = new QuizDatabase();
			await quizDatabase.addQuizPack(file);

			console.log(`Quiz pack ${file.name} imported successfully`);

			const main = document.querySelector('main');
			main.innerHTML = '';
			const app = await new Layout().render();
			main.appendChild(app);

			createLucideIcons();
		} catch (error) {
			console.error('Error importing quiz pack:', error);
			alert(`Error importing quiz pack: ${error.message}`);
		}
	};

	fileInput.click();
}

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

let Layout$1 = class Layout {
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
};

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
				new Layout$1().showFileDetails(pack.filename);
				createLucideIcons();
			});

			const playButton = document.createElement('button');
			playButton.className = 'file-row-button';
			const playIcon = document.createElement('i');
			playIcon.dataset.lucide = 'play';
			playButton.appendChild(playIcon);

			playButton.addEventListener('click', () => {
				new Layout$1().previewQuiz(pack.filename);
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
			new Layout$1().previewAllQuizzes();
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

class App {
	async render() {
		const menuLayout = await new Layout().render();
		return menuLayout;
	}
}

window.addEventListener('DOMContentLoaded', async () => {
	const main = document.querySelector('main');
	main.innerHTML = '';
	const app = await new App().render();
	main.appendChild(app);
	createLucideIcons();
});
