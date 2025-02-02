import {  IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';
import {  IOrderResult, IOrder } from '../types';
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


//Отправка заказа
	sendOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}

}
