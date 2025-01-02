import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IMainPage {
	products: HTMLElement[];
	total: number;
}

export class MainPage extends Component<IMainPage> {
	protected _products: HTMLElement[];
	protected total: number;
	protected basketButton: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.container = container;
		this.basketButton = ensureElement<HTMLElement>('.header__basket');

		this.basketButton.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	set products(products: HTMLElement[]) {
		this.container.replaceChildren(...products);
	}
}
