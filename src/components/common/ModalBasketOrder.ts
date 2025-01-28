import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { createElement, ensureElement } from '../../utils/utils'

interface IBasketList {
	products: HTMLElement[];
	total: HTMLElement;
}

export class BasketList extends Component<IBasketList> {

	_list: HTMLElement;
	arrangeButton: HTMLElement;
	total: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._list = ensureElement('.basket__list', this.container);
		this.arrangeButton = ensureElement('.basket__button', this.container);
		this.total = ensureElement('.basket__price', this.container);
		this.products = [];
		this.arrangeButton.addEventListener('click', () => { this.events.emit('ModalPay:open') });
	}

	emptyBasket() {
		const emptyContent = createElement<HTMLParagraphElement>('p', {
			textContent: 'Продукты в корзине отсуствуют',
		});
		this._list.replaceChildren(emptyContent);
	}

	totalSum(sum: number) {
		return this.total.textContent = String(sum + ' синапсов');
	}

	set products(products: HTMLElement[]) {
		if (products.length) {
			//Проверяем массив на наличие элементов, если есть, то кнопка активна
			this._list.replaceChildren(...products);
			this.arrangeButton.removeAttribute('disabled');
		} else {
			this.emptyBasket()
			this.arrangeButton.setAttribute('disabled', 'disabled');
		}
	}


}
