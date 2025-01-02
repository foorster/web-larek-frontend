import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IBasketList {
	container: HTMLElement;
	title: HTMLElement;
	list: HTMLElement;
	arrange: HTMLButtonElement;
	total: HTMLElement;
}

export class BasketList extends Component<IBasketList> {
	container: HTMLElement;
	title: HTMLElement;
	_list: HTMLElement;
	arrange: HTMLButtonElement;
	total: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template);
		this.container = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.title = this.container.querySelector('.modal__title');
		this._list = this.container.querySelector('.basket__list');
		this.arrange = this.container.querySelector('.basket__button');
		this.total = this.container.querySelector('.basket__price');
        this.products = [];
	}

    set products(products: HTMLElement[]) { 
        if (products.length) { //Проверяем массив на наличие элементов, если есть, то кнопка активна
          this._list.replaceChildren(...products);
          this.arrange.removeAttribute('disabled');
        } else {
          this.arrange.setAttribute('disabled', 'disabled');
        }
      }

}

