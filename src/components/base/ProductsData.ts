import { Order, IProduct, IProductData, IBasket, TBasketProduct } from '../../types';
import { IEvents } from './events';

//Класс наследует два интерфейса. Изначально планировалось делать разные классы
//для продукта и корзины, по стало не совсем понятно как дотянуться до списка
//положенных в корзину товаров, чтобы удалить нужный
export class ProductData implements IProductData, IBasket {
	products: IProduct[];
	product: IProduct;
	preview: string | null;
	_list: TBasketProduct[];
	order: Order = {
		address: '',
		email: '',
		phone: '',
		payment: 'card',
		items: [],
		total: 0,
	};
	total: number;

	constructor(protected events: IEvents) {
		this.products = [];
		this.list = [];
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
		this._list = [];
		this.events.emit('list:changed');
	}

	get list() {
		return this._list;
	}

	get status(): boolean {
		return this._list.length === 0;
	}

//По продукту кликнули, сгенерируй событие открытия
	setPreview(product: IProduct) {
		this.product = product;
		this.events.emit('Product:open', product);
	}

//По кнопке корзины кликнули, сгенерируй событие добавления
	setSelectedСard(data: IProduct) {
		this.list.push(data);
		this.events.emit('basket:change');
	}

	//Будет искать продукт с заданным айди в массиве корзины
	checkProduct(productId: string) {
		if (this.list) {
			return Boolean(this.list.find((prod) => prod.id === productId));
		} else return false;
	}
	//Удаление продукта из массива. Берем индекс этого продукта в массиве и если он больше нуля режем массив
	//По кнопке корзины кликнули, удали и обнови внешний вид корзины
	deleteProduct(prod: IProduct) {
		const index = this.list.indexOf(prod);
		if (index >= 0) {
			this.list.splice(index, 1);
			this.events.emit('basket:change');
		}
	}

	//Cумма всех товаров в корзине
	getSumProducts() {
		let sum = 0;
		this.list.forEach((prod) => {
			sum = sum + prod.price;
		});
		return sum;
	}

	getTotal() {
		return this.order.items.reduce((total, productId) => {
			const product = this.list.find((prod) => prod.id === productId);
			return product ? total + (product.price || 0) : total;
		}, 0);
	}


	/*


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



	//Вернет продукт по айди, если такой есть, если нет, вернёт undefined
	getProductById(productId: string) {
		return this.products.find((prod) => {
			return prod.id === productId;
		});
	}



	//Показывает сумму всех товаров в корзине
	showTotal() {
		let total = 0;
		this.list.forEach((prod) => {
			total += prod.price;
		});
		return total;
	}

	clearListBasket() {}*/
}
