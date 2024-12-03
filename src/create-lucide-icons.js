import {
	ArrowLeft,
	ArrowRight,
	ChevronLeft,
	Clipboard,
	createIcons,
	Download,
	EllipsisVertical,
	Import,
	Info,
	Menu,
	NotebookText,
	Play,
	Share,
	SquareLibrary,
	Trash2,
	UserRound,
	WrapText
} from 'lucide';

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

export { createLucideIcons };
