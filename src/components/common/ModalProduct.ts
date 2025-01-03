//---------------Контент продукта для модалки---------------//

import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { Component } from '../base/Component';
import { CDN_URL } from '../../utils/constants';

export class FullProduct extends Component<IProduct> {
	protected container: HTMLElement;
	protected descriptionProduct: HTMLElement;
	protected imageProduct: HTMLImageElement;
	protected titleProduct: HTMLElement;
	protected categoryProduct: HTMLElement;
	protected priceProduct: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(container: HTMLTemplateElement, protected events: IEvents) {
		super(container);
		this.container = container.content
			.querySelector('.card_full')
			.cloneNode(true) as HTMLElement;
		this.descriptionProduct = this.container.querySelector('.card__text');
		this.imageProduct = this.container.querySelector('.card__image');
		this.titleProduct = this.container.querySelector('.card__title');
		this.categoryProduct = this.container.querySelector('.card__category');
		this.priceProduct = this.container.querySelector('.card__price');
		this.basketButton = this.container.querySelector('.card__button');
	}
	//Устанавливаем цену продукта, проверяем на бесценность
	setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}
	//Устанавливаем описание
	set description(description: string) {
		this.descriptionProduct.textContent = description;
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
