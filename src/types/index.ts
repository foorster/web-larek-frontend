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

export interface IProductSelect {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean;
}


// Интерфейс всех продуктов, методы
export interface IProductData {
	product:IProduct
	products: IProduct[]; // Массив продуктов, полученных с сервера
	preview: string | null;
//	addProduct(product: IProduct): void;
//	deleteProduct(productId: string): void;
//	updateProduct(product: IProduct): void;
//	getProductById(productId: string): void;
//	checkProduct(productId: string): boolean; // Проверяет есть ли этот продукт в массиве корзины
}

// Интерфейс корзины
export interface IBasket {
	_list: TBasketProduct[];
	total: number; // Сумма всех продуктов
//	showTotal(): number; // Показываем cумму товаров в корзине
//	clearListBasket(): void; // Очищаем корзину
}

// Интерфейс данных пользователя
export interface IUserInfo {
	address: string;
	email: string;
	phone: number;
	payment: TPaymentMethod;
}

export interface IUserInfoData {
	getUserInfo(): IUserInfo;
	setUserInfo(userData: IUserInfo): void;
}

// Тип для выбора способа оплаты
export type TPaymentMethod = 'online' | 'cash';

// Тип для корзины с заказами
export type TBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;

// Тип для модалки с оплатой заказа
export type TPay = Pick<IUserInfo, 'address'>;

// Тип для модалки с контактами
export type TContact = Pick<IUserInfo, 'email' | 'phone'>;

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

  export interface OrderFormData {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
	total?: string | number;
}

export interface Order extends OrderFormData {
	items: string[];
}