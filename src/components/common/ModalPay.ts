//---------------Контент информации об оплате---------------//

import { IActions, IPay } from '../../types';
import { IEvents } from '../base/events';
import { Component } from '../base/Component';

export class Pay extends Component<IPay> {
	buttonPayMethod: HTMLButtonElement[];
	nextPay: HTMLButtonElement;
	formErrors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.buttonPayMethod = Array.from(
			this.container.querySelectorAll('.button_alt')
		);
		this.nextPay = this.container.querySelector('.order__button');
		this.nextPay.addEventListener('click', () => {
			this.events.emit('ModalInfo:open');
		});
		this.buttonPayMethod.forEach((button) => {
			button.addEventListener('click', () => {
				this.payInfo = button.name;
				events.emit('payMetod: changed', button);
			});
		});
		this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`adress:changed`, { field, value });
		});
		this.formErrors = this.container.querySelector('.form__errors');
	}

	set payInfo(payMethod: string) {
		this.buttonPayMethod.forEach((button) => {
			button.classList.toggle('button_alt-active', button.name === payMethod);
		});
	}

	set valid(value: boolean) {
		this.nextPay.disabled = !value;
	}
}
