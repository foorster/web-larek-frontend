//---------------Контент информации об успешном заказе---------------//
import { IEvents } from '../base/events';
import { Component } from '../base/Component';

export interface ISuccessful {
	successfulForm: HTMLElement;
	description: HTMLElement;
	nextOrder: HTMLButtonElement;
}

export class Success extends Component<ISuccessful> {
	container: HTMLElement;
	description: HTMLElement;
	nextOrder: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.description = this.container.querySelector(
			'.order-success__description'
		);
		this.nextOrder = this.container.querySelector('.order-success__close');

		this.nextOrder.addEventListener('click', () => {
			events.emit('successfulModal:close');
		});
	}
}
