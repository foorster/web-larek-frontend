//---------------Контент информации о пользователе---------------//
import { TPay, TPaymentMethod, IActions } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';
import { Component } from '../base/Component';

export interface IContact {
	contactForm: HTMLElement;
    formErrors: HTMLElement;
}

export class Contact extends Component<IContact> {
    nextInfo: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(
        container: HTMLElement,
        protected events: IEvents,
        actions?: IActions
    ) {
        super(container);
        this.nextInfo = this.container.querySelector('.contact__button');
        //this.nextInfo.addEventListener('click', () => {
            //this.events.preventDefault();
			//this.events.emit('ModalSuccessful:open');
		//});

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('ModalSuccessful:open');
          });

        this.container.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${field}:changed`, { field, value });
		});
        this.formErrors = this.container.querySelector('.form__errors');
    }

    set valid(value: boolean) {
        this.nextInfo.disabled = !value;
      }}