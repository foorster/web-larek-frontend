//---------------Продукт, который выводится на главную страницу---------------//

import { IActions, IProduct } from '../types';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';
import { Component } from './base/Component';

export class Product extends Component<IProduct> {
	protected events: IEvents;
	protected imageProduct: HTMLImageElement;
	protected titleProduct: HTMLElement;
	protected categoryProduct: HTMLElement;
	protected priceProduct: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected categoryColor: Record<string, string> = {
		'софт-скил': 'soft',
		'другое': 'other',
		'дополнительное': 'additional',
		'кнопка': 'button',
		'хард-скил': 'hard',
	};
	constructor(
		protected container: HTMLElement,
		events: IEvents,
		actions?: IActions
	) {
		super(container); //т.к. наследование, надо передать в родительский
		this.events = events;
		this.imageProduct = this.container.querySelector('.card__image');
		this.titleProduct = this.container.querySelector('.card__title');
		this.categoryProduct = this.container.querySelector('.card__category');
		this.priceProduct = this.container.querySelector('.card__price');
		this.basketButton = this.container.querySelector('.card__button');

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}
	}

	changeButton() {
		return this.basketButton.classList.contains('');
	}

	//Устанавливаем цену продукта, проверяем на бесценность
	setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	//Устанавливаем изображение
	set image(image: string) {
		this.imageProduct.src = `${CDN_URL}${image}`;
	}

	//Устанавливаем название
	set title(title: string) {
		this.titleProduct.textContent = title;
	}

	//Устанавливаем категорию
	set category(category: string) {
		this.categoryProduct.textContent = category;
		this.categoryProduct.className = `card__category card__category_${this.categoryColor[category]}`
	}

	//Устанавливаем цену
	set price(price: number | null) {
		this.priceProduct.textContent = this.setPrice(price);
	}

	render(data: Partial<IProduct> | undefined) {
		if (!data) return this.container;
		return super.render(data);
	}
}
