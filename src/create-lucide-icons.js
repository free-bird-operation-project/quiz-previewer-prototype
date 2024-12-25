import {
	ArrowLeft,
	ArrowRight,
	ChevronLeft,
	Clipboard,
	createIcons,
	Download,
	EllipsisVertical,
	FileQuestion,
	FileText,
	Import,
	Info,
	Menu,
	NotebookText,
	Play,
	RefreshCcw,
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
			Clipboard,
			FileQuestion,
			FileText,
			RefreshCcw
		}
	});
}

export { createLucideIcons };
