import { IEvents } from './events';

export interface IOrderData {
	address: string;
	email: string;
	phone: string;
	payment: string;
	products: string[];
	total: number;
	validateOrder(): boolean;
	validateContacts(): boolean;
}

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export class OrderData implements IOrderData {
	address: string;
	email: string;
	phone: string;
	payment: string;
	products: string[];
	total: number;
	formErrors: FormErrors = {};

	// Данные, которые будут приходить сюда по мере заполенения форм
	constructor(protected events: IEvents) {
		this.address = '';
		this.email = '';
		this.phone = '';
		this.payment = '';
		this.products = [];
		this.total = 0;
	}

	setAddress(field: string, value: string) {
		if (field === 'address') {
			this.address = value;
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.getData());
		}
	}

	setEmail(field: string, value: string) {
		if (field === 'email') {
			this.email = value;
		}
		if (this.validateContacts()) {
			this.events.emit('order:ready', this.getData());
		}
	}

	setPhone(field: string, value: string) {
		if (field === 'phone') {
			this.phone = value;
		}
		if (this.validateContacts()) {
			this.events.emit('order:ready', this.getData());
		}
	}

	validateOrder() {
		const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
		const errors: typeof this.formErrors = {};

		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!regexp.test(this.address)) {
			errors.address = 'Укажите настоящий адрес';
		} else if (!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:address', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const regexpPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
		const errors: typeof this.formErrors = {};

		if (!this.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regexpEmail.test(this.email)) {
			errors.email = 'Некорректный адрес электронной почты';
		}

		if (this.phone.startsWith('8')) {
			this.phone = '+7' + this.phone.slice(1);
		}

		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!regexpPhone.test(this.phone)) {
			errors.phone = 'Некорректный формат номера телефона';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:contacts', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getData() {
		return {
			address: this.address,
			email: this.email,
			phone: this.phone,
			payment: this.payment,
			products: this.products,
			total: this.total,
		};
	}
}
