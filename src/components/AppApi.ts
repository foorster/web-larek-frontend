import { IBasket, IProduct, TBasketProduct } from '../types';
import { Api, ApiListResponse } from './base/api';
import { Order, OrderResult, IOrderLot } from '../types';
export interface IApiModel {
	items: IProduct[];
	getListProducts: () => Promise<IProduct[]>;
}

export class AppApi extends Api {
	items: IProduct[];

	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

	//Получение продуктов с сервера
	getListProducts(): Promise<IProduct[]> {
		return this.get(`/product`).then(
			(data: ApiListResponse<IProduct>) => data.items
		);
	}

	//Добавление продуктов в корзину
	addProduct(data: TBasketProduct): Promise<IBasket> {
		return this.post<IBasket>(`/order`, data)
			.then((list: IBasket) => list);
	}

//Отправка заказа
	sendOrder(order: IOrderLot): Promise<OrderResult> {
		return this.post('/order', order).then((data: OrderResult) => data);
	}
/*
	//Удаление продуктов из корзины
	deleteProduct(productId: string): Promise<{ message: string }> {
		return this._baseApi
			.post<{ message: string }>(`/product/${productId}`, {}, 'DELETE')
			.then((res: { message: string }) => res);
	}*/
}
