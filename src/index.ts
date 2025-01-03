import { EventEmitter } from './components/base/events';
import { ProductData } from './components/base/ProductsData';
import './scss/styles.scss';
import { IProduct } from './types';
import { AppApi } from './components/AppApi';
import { API_URL } from './utils/constants';
import { Product } from './components/Product';
import { MainPage } from './components/MainPage';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { BasketList } from './components/common/ModalBasketOrder';
import { BasketProduct } from './components/common/ModalBasketProduct';
import { ensureElement } from './utils/utils';
import { FullProduct } from './components/common/ModalProduct';

const events = new EventEmitter();

const productsGallery = new MainPage(
	document.querySelector('.gallery'),
	events
); //Обертка галереи с продуктами
const productTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog'); //Темплейт одного продукта

const basketTemplate: HTMLTemplateElement = document.querySelector('#basket'); //Темплейт всей корзины
const basketTemplateProduct: HTMLTemplateElement =
	document.querySelector('#card-basket'); //Темплейт одного продукта из корзины

const appApi = new AppApi(API_URL); //Класс для вытягивания продуктов с сервера
const productData = new ProductData(events); //Класс с данными продукта

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new BasketList(basketTemplate, events);

const basketListData = new ProductData(events); //Класс с данными в корзине

//Для проверки работы компонентов (например: тык на фотку -> Product:select)
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//Подгружаем данные с сервера
appApi
	.getListProducts()
	.then(function (_products: IProduct[]) {
		productData._products = _products;
		events.emit('initialData: loaded');
	})
	.catch((error) => console.log(error));

//Если данные подгружены, то рендерим продукты на страницу
events.on('initialData: loaded', () => {
	const productsArray = productData._products.map((product) => {
		const productInstant = new Product(cloneTemplate(productTemplate), events, {
			onClick: () => events.emit('Product:select', product),
		});

		return productInstant.render(product);
	});
	productsGallery.render({ products: productsArray });
});

//Если нажали на иконку корзины, отрендери данные
events.on('basket:open', () => {
	//!!!!!!!!!!!!!!!!!!!!!!!!!ТЕСТ!!!!!!!!!!!!!!!!!!!!! ПОТОМ УДАЛИТЬ!!!!!!!!!!!!!!!!!!!!!!!
	basketListData._list = [
		{
			id: '854cef69-976d-4c2a-a18c-2aa45046c390',
			title: '+1 час в сутках',
			price: 750,
		},
		{
			id: 'b06cde61-912f-4663-9751-09956c0eed67',
			title: 'Мамка-таймер',
			price: null,
		},
		{
			id: '854cef69-976d-4c2a-a18c-2aa45046c390',
			title: '+1 час в сутках',
			price: 750,
		},
	];

	let i = 0; //Счетчик продуктов в корзине
	let sum = 0;
	basket.products = basketListData.list.map((product) => {
		const basketProduct = new BasketProduct(basketTemplateProduct, events); //Для каждого продукта в списке создаем класс и передаем туда темплейт одного продукта
		sum += product.price;
		i++;
		return basketProduct.render(product, i); //Отрисовываем один продукт
	});
	basket.totalSum(sum); //Кладем итоговую сумму товаров в модалку корзины
	modal.content = basket.render(); //Кладем контент корзины в модалку
	modal.render(); //Отрисовываем модалку
});

//Если нажали на крестик модалки, закрой её
events.on('modal:close', () => {
	modal.close();
});

const productFullTemplate: HTMLTemplateElement = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement; //Темплейт всей корзины
events.on('Product:select', (fullProduct: IProduct) => {
	productData.setPreview(fullProduct);
});

events.on('Product:open', (fullProduct: IProduct) => {
	const product = new FullProduct(productFullTemplate, events);
	modal.content = product.render(fullProduct); //Кладем контент корзины в модалку
	modal.render(); //Отрисовываем модалку
});

//Блокируем прокрутку при открытии модалки
events.on('Product:open', () => {
	modal.block = true;
});

events.on('modal:close', () => {
	modal.block = false;
});
