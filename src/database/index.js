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

export default QuizDatabase;
