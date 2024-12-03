import { Layout as MenuLayout } from './menu/layout';

class App {
	async render() {
		const menuLayout = await new MenuLayout().render();
		return menuLayout;
	}
}

export { App };
