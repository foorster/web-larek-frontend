import { IProduct, IProductData, IBasket, TBasketProduct } from '../../types';
import { IEvents } from './events';

//Класс наследует два интерфейса. Изначально планировалось делать разные классы
//для продукта и корзины, по стало не совсем понятно как дотянуться до списка
//положенных в корзину товаров, чтобы удалить нужный
export class ProductData implements IProductData, IBasket {
	products: IProduct[];
	preview: string | null;
	list: TBasketProduct[];
	total: number;
	events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	//Кладем товар в корзину (в массив list)
	addProduct(product: IProduct) {
		this.list = [product, ...this.list];
		this.events.emit('list:changed');
	}

	//Если вызывается функция удаления, то фильтруем массив list, который в
	//корзине и убираем из него элемент с заданным айди
	deleteProduct(productId: string) {
		this.list = this.list.filter((prod) => prod.id !== productId);
	}

	updateProduct(product: IProduct) {}

	//Вернет продукт по айди
	getProduct(productId: string) {
		this.products.forEach((prod: IProduct) => {
			if (prod.id === productId) {
				return prod;
			}
		});
	}

	//Будет искать продукт с заданным айди в массиве корзины
	checkProduct(productId: string) {
		return Boolean(this.list.find((prod) => prod.id === productId));
	}

	showListBasket(product: TBasketProduct[], total: number) {}

	countProducts(productId: string) {
		return this.total;
	}
	clearListBasket() {}
}
