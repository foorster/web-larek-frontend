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

// Интерфейс всех продуктов, методы
export interface IProductData {
    products: IProduct[]; // Массив продуктов, полученных с сервера
    preview: string | null; 
    addProduct(product: IProduct): void;
    deleteProduct(productId: string): void;
    updateProduct(product: IProduct): void;
    getProduct(productId: string): void;
    checkProduct(productId: string): boolean; // Проверяет есть ли этот продукт в массиве корзины
}

// Интерфейс корзины
export interface IBasket {
	list: TBasketProduct[];
    total: number; // Сумма всех продуктов
    showListBasket(product: TBasketProduct[], total:number): void // Показываем список товаров
    countProducts(productId: string): number; // Возможно его надо перенести функцией в updateBasket
    clearListBasket(): void // Очищаем корзину
}

// Интерфейс данных пользователя
interface IUserInfo {
	address: string;
	email: string;
	phone: number;
    payment: TPaymentMethod;
}

interface IUserInfoData {
    getUserInfo(): IUserInfo;
    setUserInfo(userData: IUserInfo): void;
}

// Тип для выбора способа оплаты
type TPaymentMethod = 'online' | 'cash';

// Тип для корзины с заказами
export type TBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;


// Тип для модалки с оплатой заказа
type TPay = Pick<IUserInfo, 'address'>;

// Тип для модалки с контактами
type TContact = Pick<IUserInfo, 'email' | 'phone'>;
