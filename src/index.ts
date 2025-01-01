import { EventEmitter } from './components/base/events';
import { ProductData } from './components/base/ProductsData';
import './scss/styles.scss';
import { IProduct } from './types';
import { AppApi } from './components/base/AppApi';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import { Product } from './components/Product';
import { MainPage } from './components/MainPage';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const productTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog'); //Темплейт одного продукта
const productsGallery = new MainPage(
	document.querySelector('.gallery'),
	events //Обертка галереи с продуктами
);
const appApi = new AppApi(API_URL);
const productData = new ProductData(events);

//Для проверки работы компонентов (например: тык на фотку -> Product:select)
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

appApi
	.getListProducts()
	.then(function (_products: IProduct[]) {
		productData._products = _products;
		events.emit('initialData: loaded');
	})
	.catch((error) => console.log(error));

events.on('initialData: loaded', () => {
	const productsArray = productData._products.map((product) => {
		const productInstant = new Product(cloneTemplate(productTemplate), events);
		return productInstant.render(product);
	});
	productsGallery.render({ products: productsArray });
});