import { IProduct, IProductData } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';

export class Product {
	protected element: HTMLElement;
	protected events: IEvents;
	protected descriptionProduct?: HTMLElement;
	protected imageProduct?: HTMLImageElement;
	protected titleProduct: HTMLElement;
	protected categoryProduct?: HTMLElement;
	protected priceProduct: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		this.events = events;
		this.element = cloneTemplate(template);

		this.descriptionProduct = this.element.querySelector('.card__text');
		this.imageProduct = this.element.querySelector('.card__image');
		this.titleProduct = this.element.querySelector('.card__title');
		this.categoryProduct = this.element.querySelector('.card__category');
		this.priceProduct = this.element.querySelector('.card__price');
		this.basketButton = this.element.querySelector('.card__button');

		//При клике на картинку товара выводим Product:select с помощью events.onAll в консоль
		this.imageProduct.addEventListener('click', () => {
			this.events.emit('Product:select', { product: this });
		});

		/*this.basketButton.addEventListener('click', () => {
			this.events.emit('basketButton:select', {
				product: this,
				isInBasket: this.changeButton(),
			});
		});*/
	}

	changeButton() {
		return this.basketButton.classList.contains('');
	}
	disableButton() {}

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
	}
	//Устанавливаем цену
	set price(price: number | null) {
		this.priceProduct.textContent = this.setPrice(price);
	}

	//Рендерим продукт
	render(productData: Partial<IProduct>) {
		Object.assign(this, productData); //Перезаписываются необходимые свойства из сеттеров-
		return this.element;
	}
}
