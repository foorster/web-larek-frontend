import { IActions, IProduct, TBasketProduct } from './../../types';
import { IEvents } from '../base/events';

export interface IBasketProduct {
	basketProduct: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteButton: HTMLButtonElement;
	render(data: IProduct, item: number | null): HTMLElement;
}

export class BasketProduct implements IBasketProduct {
	basketProduct: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
		this.basketProduct = template.content
			.querySelector('.basket__item')
			.cloneNode(true) as HTMLElement;
		this.index = this.basketProduct.querySelector('.basket__item-index');
		this.title = this.basketProduct.querySelector('.card__title');
		this.price = this.basketProduct.querySelector('.card__price');
		this.deleteButton = this.basketProduct.querySelector(
			'.basket__item-delete'
		);
		if (actions?.onClick) {
			this.deleteButton.addEventListener('click', actions.onClick);
		}

		
	}

	protected setPrice(value: number | null) {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	render(data: TBasketProduct, item: number) {
		this.index.textContent = String(item);
		this.title.textContent = data.title;
		this.price.textContent = this.setPrice(data.price);
		return this.basketProduct;
	}
	

}
