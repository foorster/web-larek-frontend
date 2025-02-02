// Взяли данные из постмана
// Интерфейс продукта
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Интерфейс продукта, добавили статус выбранности для смены кнопки
export interface IProductSelect {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean;
}

// Интерфейс списка продуктов в корзине
export interface IBasketList {
	products: HTMLElement[];
	total: HTMLElement;
}

// Интерфейс одного продукта в списке в корзине
export interface IBasketProduct {
	basketProduct: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteButton: HTMLButtonElement;
	render(data: IProduct, item: number | null): HTMLElement;
}

// Интерфейс всех продуктов, методы
export interface IProductData {
	product: IProduct;
	products: IProduct[]; // Массив продуктов, полученных с сервера
	preview: string | null;
	setPreview(product: IProduct): void; //По продукту кликнули, сгенерируй событие открытия
	clearSelect(): void; // Очистка выделенности продукта
}

// Интерфейс корзины
export interface IBasket {
	_list: TBasketProduct[];
	total: number; // Сумма всех продуктов
	setSelectedСard(data: IProduct): void; // Добавляем товар в список
	checkProduct(productId: string): Boolean; //Будет искать продукт с заданным айди в массиве корзины
	deleteProduct(prod: IProductSelect): void; //Удаление продукта из списка
	getSumProducts(): void; //Cумма всех товаров в корзине
	clearBasket(): void; //Очищаем список
}

// Тип для корзины с заказами
export type TBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

// Тип для выбора способа оплаты
export type TPaymentMethod = 'online' | 'offline';

//Выносим нужные методы
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

//Интерфейс апи
export interface IApi {
	baseUrl: string;
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

//Интерфейс данных заказа
export interface IOrderFormData {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
	total?: string | number;
}

//Интерфейс данных заказа + список продуктов с корзины
export interface IOrder extends IOrderFormData {
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IOrderData {
	address: string;
	email: string;
	phone: string;
	payment: string;
	items: string[];
	total: number;
	validateOrder(): boolean;
	validateContacts(): boolean;
}

export type TFormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IMainPage {
	products: HTMLElement[];
	total: number;
}

export interface IPay {
	payForm: HTMLElement;
	formErrors: HTMLElement;
}

export interface IContact {
	contactForm: HTMLElement;
	formErrors: HTMLElement;
}

export interface ISuccessful {
	successfulForm: HTMLElement;
	nextOrder: HTMLButtonElement;
	//render(total: number):HTMLElement;
}
