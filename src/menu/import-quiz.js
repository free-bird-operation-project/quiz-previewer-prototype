import QuizDatabase from '../database';
import { Layout } from './layout';
import { createLucideIcons } from '../create-lucide-icons';

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

export { importQuiz };
