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
const productFullTemplate: HTMLTemplateElement = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement; //Темплейт полной версии продукта

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
	modal.content = basket.render(); //Кладем контент корзины в модалку
	modal.render(); //Отрисовываем модалку
});

//Если нажали на крестик модалки, закрой её
events.on('modal:close', () => {
	modal.close();
});

//Выбрали продукт
events.on('Product:select', (fullProduct: IProduct) => {
	productData.setPreview(fullProduct);
});

//Открыли продукт
events.on('Product:open', (fullProduct: IProduct) => {
	const product = new FullProduct(cloneTemplate(productFullTemplate), events);
	modal.content = product.render(fullProduct); //Кладем контент продукта в модалку
	modal.render(); //Отрисовываем модалку
});

//Блокируем прокрутку при открытии модалки
events.on('Product:open', () => {
	modal.block = true;
});
events.on('modal:close', () => {
	modal.block = false;
});

//Добавили карточку товара в корзину
events.on('product:inBasket', () => {
	basketListData.setSelectedСard(productData.product);
	let i = 0; //Счетчик продуктов в корзине
	basket.totalSum(basketListData.getSumProducts()); // отобразить сумма всех продуктов в корзине
	//Рендерим данные о товарах и сумме сразу, при добавлении товара в корзину
	basket.products = basketListData._list.map((product) => {
		const basketProduct = new BasketProduct(basketTemplateProduct, events, { onClick: () => events.emit('basket:productRemove', product) }); //Для каждого продукта в списке создаем класс и передаем туда темплейт одного продукта
		i++;
		return basketProduct.render(product, i); //Отрисовываем один продукт
	});
	basket.setBasketCounter(i); //Кладем количество товаров  в иконку корзины
	modal.block = true;
});


//Удалили карточку товара из корзины
events.on('basket:productRemove', (product: IProduct) => {
	basketListData.deleteProduct(product);
	basket.totalSum(basketListData.getSumProducts()); // Отобразили сумму всех продуктов в корзине
	let i = 0;
	basket.products = basketListData._list.map((product) => {
		const basketProduct = new BasketProduct(basketTemplateProduct, events, { onClick: () => events.emit('basket:productRemove', product) }); //Для каждого продукта в списке создаем класс и передаем туда темплейт одного продукта
		i++;
		return basketProduct.render(product, i); //Отрисовываем один продукт
	});
	basket.setBasketCounter(i); //Кладем количество товаров  в иконку корзины
	modal.block = true;
  });