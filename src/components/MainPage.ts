interface IMainPage {
	products: HTMLElement[];
	total: number;
}

export class MainPage {
	protected _products: HTMLElement[];
	protected total: number;
	protected container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	set products(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

	render(data: Partial<IMainPage>) {
		Object.assign(this, data);
		return this.container;
	}
}
