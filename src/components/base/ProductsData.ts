import {
	IProduct,
	IProductData,
	IBasket,
	TBasketProduct,
} from '../../types';
import { IEvents } from './events';

//Класс наследует два интерфейса. Изначально планировалось делать разные классы
//для продукта и корзины, по стало не совсем понятно как дотянуться до списка
//положенных в корзину товаров, чтобы удалить нужный
export class ProductData implements IProductData, IBasket {

	products: IProduct[];
	product: IProduct;
	preview: string | null;
	_list: TBasketProduct[];
	total: number;

	constructor(protected events: IEvents) {
		this.products = [];
		this._list = [];
	}

	//Так как нам нужно установить и получить продукты на странице и в корзине, необходимы set и get
	set _products(_products: IProduct[]) {
		this.products = _products;
		this.events.emit('_products:changed');
	}

	get _products() {
		return this.products;
	}

	set list(list: TBasketProduct[]) {
		this._list = this.list;
		this.events.emit('_list:changed');
	}
	get list() {
		return this._list;
	  }

	//Кладем товар в корзину (в массив list)
	addProduct(product: IProduct) {
		this.events.emit('list:changed');
		return (this.list = [product, ...this.list]);
	}

	//Если вызывается функция удаления, то фильтруем массив list, который в
	//корзине и убираем из него элемент с заданным айди
	deleteProduct(productId: string) {
		return (this.list = this.list.filter((prod) => prod.id !== productId));
	}

	updateProduct(product: IProduct) {}

	setPreview(item: IProduct) {
		this.product = item;
		this.events.emit('Product:open', item)
	  }

	//Вернет продукт по айди, если такой есть, если нет, вернёт undefined
	getProduct(productId: string) {
		return this.products.find((prod) => {
			return prod.id === productId;
		});
	}

	//Будет искать продукт с заданным айди в массиве корзины
	checkProduct(productId: string) {
		if (this.list) {
			return Boolean(this.list.find((prod) => prod.id === productId));
		} else return false;
	}

	//Показывает сумму всех товаров в корзине
	showTotal() {
		let total = 0;
		this.list.forEach((prod) => {
			total += prod.price;
		});
		return total;
	}

	clearListBasket() {}
}
