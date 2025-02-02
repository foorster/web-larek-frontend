//---------------Модалка, куда зарисовывается контент---------------//

import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Modal<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;
	protected _content: HTMLElement;
	protected page: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._content = container.querySelector('.modal__content');
		this.page = document.querySelector('.page__wrapper');
		const closeButtonElement = this.container.querySelector('.modal__close');
		//При нажатии на кнопку крестик генерируем modal:close
		closeButtonElement.addEventListener('click', () =>
			this.events.emit('modal:close')
		);
	}

	//Установка контента в модалку
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	//Установка блокировки прокрутки страницы, если открыта модалка
	set block(status: boolean) {
		if (status) {
			this.page.classList.add('page__wrapper_locked');
		} else {
			this.page.classList.remove('page__wrapper_locked');
		}
	}

	open() {
		this.container.classList.add('modal_active');
	}

	close() {
		this.container.classList.remove('modal_active');
	}

	render(): HTMLElement {
		this._content;
		this.open();
		return this.container;
	}
}
