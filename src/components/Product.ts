import { IProduct, IProductData } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { CDN_URL } from '../utils/constants';
import { Component } from './Component';

export class Product extends Component<IProduct> {
	//IProduct - тип для дженерика компонента
	protected events: IEvents;
	protected descriptionProduct?: HTMLElement;
	protected imageProduct?: HTMLImageElement;
	protected titleProduct: HTMLElement;
	protected categoryProduct?: HTMLElement;
	protected priceProduct: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container); //т.к. наследование, надо передать в родительский
		this.events = events;

		this.descriptionProduct = this.container.querySelector('.card__text');
		this.imageProduct = this.container.querySelector('.card__image');
		this.titleProduct = this.container.querySelector('.card__title');
		this.categoryProduct = this.container.querySelector('.card__category');
		this.priceProduct = this.container.querySelector('.card__price');
		this.basketButton = this.container.querySelector('.card__button');

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

	/*
    set id(id){
        this.productId = id;
    }

    get id(){
        return this.productId
    }*/


}
