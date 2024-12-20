import { IProduct, IProductData } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import {CDN_URL} from '../utils/constants'

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

	setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	setData(productData: IProduct) {
		this.imageProduct.src = `${CDN_URL}${productData.image}`;
		this.titleProduct.textContent = productData.title;
		this.categoryProduct.textContent = productData.category;
		this.priceProduct.textContent = this.setPrice(productData.price);
	}

	render() {
		return this.element;
	}
}
