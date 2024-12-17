import { IApi, IBasket, IProduct, TBasketProduct } from '../../types';

export class AppApi {
	_baseApi: IApi;
    
	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	//Получение продуктов с сервера
	getProducts(): Promise<IProduct[]> {
		return this._baseApi
			.get<IProduct[]>(`/product`)
			.then((product: IProduct[]) => product);
	}

	//Добавление продуктов в корзину
	addProduct(data: TBasketProduct): Promise<IBasket> {
		return this._baseApi
			.post<IBasket>(`/order`, data)
			.then((list: IBasket) => list);
	}

	//Удаление продуктов из корзины
	deleteProduct(productId: string): Promise<{ message: string }> {
		return this._baseApi
			.post<{ message: string }>(`/product/${productId}`, {}, 'DELETE')
			.then((res: { message: string }) => res);
	}
}
