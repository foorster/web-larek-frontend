import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Modal<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._content = container.querySelector('.modal__content');
		const closeButtonElement = this.container.querySelector('.modal__close');
	}
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
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
        return this.container
      }
}
