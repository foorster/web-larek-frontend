import { Component } from "./Component";

interface IMainPage {
	products: HTMLElement[];
	total: number;
}

export class MainPage extends Component<IMainPage>{
	protected _products: HTMLElement[];
	protected total: number;

	constructor(protected container: HTMLElement) {
        super(container)
		this.container = container;
	}

	set products(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}

}
