//---------------Главная страница со всеми продуктами и корзиной---------------//
import { Component } from './base/Component';
import { ensureElement } from './../utils/utils';
import { IEvents } from './base/events';

interface IMainPage {
	products: HTMLElement[];
	total: number;
}

export class MainPage extends Component<IMainPage> {
	protected _products: HTMLElement[];
	protected total: HTMLElement;
	protected basketButton: HTMLElement;


	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.container = container;

		this.basketButton = ensureElement<HTMLElement>('.header__basket');
		this.total = document.querySelector(
			'.header__basket-counter'
		);
		this.basketButton.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
		
	}



	setTotal(value: number) {
		this.total.textContent = String(value);
	  }

	set products(products: HTMLElement[]) {
		this.container.replaceChildren(...products);
	}
}
