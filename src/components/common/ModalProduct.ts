//---------------Контент продукта для модалки---------------//

import { IEvents } from '../base/events';
import { IProduct, IActions } from '../../types';
import { Component } from '../base/Component';
import { CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils'

export class FullProduct extends Component<IProduct> {

	protected descriptionProduct: HTMLElement;
	protected imageProduct: HTMLImageElement;
	protected titleProduct: HTMLElement;
	protected categoryProduct: HTMLElement;
	protected priceProduct: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected _text: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		protected actions?: IActions

	) {
		super(container);
		this.descriptionProduct = this.container.querySelector('.card__text');
		this.imageProduct = this.container.querySelector('.card__image');
		this.titleProduct = this.container.querySelector('.card__title');
		this.categoryProduct = this.container.querySelector('.card__category');
		this.priceProduct = this.container.querySelector('.card__price');
		this.basketButton = this.container.querySelector('.card__button');
		if (actions?.onClick) {
			this.basketButton.addEventListener('click', actions.onClick);
		}

		this._text = ensureElement('.card__text', container);
		
	}

	set text(value: string) {
		this.setText(this._text, value);
	} 

	updatePrice(selected: boolean) {
		this.setText(
			this.basketButton,
			selected ? 'Убрать из корзины' : 'В корзину'
		);
	}

	//Устанавливаем цену продукта, проверяем на бесценность
	setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	changeButton(prod: Partial<IProduct>) {
		if (prod.price) {
			return 'Купить';
		} else {
			this.basketButton.setAttribute('disabled', 'true');
			return 'Бесценный товар';
		}
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
	get button() {
		return this.basketButton;
	}
	render(data: Partial<IProduct> | undefined) {
		if (!data) return this.container;
		this.basketButton.textContent = this.changeButton(data);
		return super.render(data);
	}
}
