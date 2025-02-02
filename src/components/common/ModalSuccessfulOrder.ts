//---------------Контент информации об успешном заказе---------------//
import { IEvents } from '../base/events';

export class Success {
	container: HTMLElement;
	nextOrder: HTMLButtonElement;
	totalSum: HTMLElement;
	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.container = template.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.nextOrder = this.container.querySelector('.order-success__close');
		this.totalSum = this.container.querySelector('.order-success__description');
		this.nextOrder.addEventListener('click', () => {
			events.emit('successfulModal:close');
		});
	}

	render(total: number) {
		this.totalSum.textContent = String(`Списано ${total} синапсов`);
		return this.container;
	}
}
