import {
	IProduct,
	IProductData,
	IBasket,
	TBasketProduct,
	IProductSelect,
} from '../../types';
import { IEvents } from './events';

//Класс наследует два интерфейса. Изначально планировалось делать разные классы
//для продукта и корзины, по стало не совсем понятно как дотянуться до списка
//положенных в корзину товаров, чтобы удалить нужный
export class ProductData implements IProductData {
	products: IProductSelect[];
	product: IProduct;
	preview: string | null;

	constructor(protected events: IEvents) {
		this.products = [];
	}

	//Так как нам нужно установить и получить продукты на странице и в корзине, необходимы set и get
	set _products(_products: IProductSelect[]) {
		this.products = _products;
		this.events.emit('_products:changed');
	}

	get _products() {
		return this.products;
	}

	//По продукту кликнули, сгенерируй событие открытия
	setPreview(product: IProduct) {
		this.product = product;
		this.events.emit('Product:open', product);
	}

	clearSelect() {
		this.products.forEach((product) => (product.selected = false));
	}
}

export class BasketData implements IBasket {
	_list: TBasketProduct[];
	total: number;

	constructor(protected events: IEvents) {
		this._list = [];
	}

	set list(list: TBasketProduct[]) {
		this._list = list;
		this.events.emit('basket:change');
	}

	get list() {
		return this._list;
	}

	get status(): boolean {
		return this._list.length === 0;
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
	deleteProduct(prod: IProductSelect) {
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

	//Очищаем список
	clearBasket() {
		this.list = [];
	}
}
