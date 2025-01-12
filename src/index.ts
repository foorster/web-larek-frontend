import { EventEmitter } from './components/base/events';
import { ProductData } from './components/base/ProductsData';
import './scss/styles.scss';
import { IProduct, IProductSelect } from './types';
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
const basket = new BasketList(cloneTemplate(basketTemplate), events);

const basketListData = new ProductData(events); //Класс с данными в корзине

//Для проверки работы компонентов (например: тык на фотку -> Product:select)
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//Подгружаем данные с сервера
appApi
	.getListProducts()
	.then(function (_products: IProductSelect[]) {
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

//Добавили карточку товара в корзину
events.on('product:inBasket', (product: IProductSelect) => {
	//Проверяет, есть ли этот продукт в корзине
	const status = basketListData.checkProduct(product.id);
	if (!status) {
		basketListData.setSelectedСard(product);
		events.emit('basket:change');
	}
	product.selected = true
});

//Удалили карточку товара из корзины
events.on('basket:productRemove', (product: IProductSelect) => {
	product.selected = false
	basketListData.deleteProduct(product);
	events.emit('basket:change');
});

events.on('basket:change', () => {
	basket.totalSum(basketListData.getSumProducts()); // Отобразили сумму всех продуктов в корзине
	//Отрисовываем
	let i = 0;
	basket.products = basketListData.list.map((product) => {
		const basketProduct = new BasketProduct(basketTemplateProduct, events, {
			onClick: () => {
				events.emit('basket:productRemove', product);
				//events.emit('productButton:change', product);
			},
		}); //Для каждого продукта в списке создаем класс и передаем туда темплейт одного продукта
		i++;
		return basketProduct.render(product, i); //Отрисовываем один продукт
	});
	modal.block = true;
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
events.on('Product:select', (fullProduct: IProductSelect) => {
	productData.setPreview(fullProduct);
});

events.on('Product:open', (fullProduct: IProductSelect) => {
	
	const product = new FullProduct(cloneTemplate(productFullTemplate), events, {
		onClick: () => {
			fullProduct.selected
				? events.emit('basket:productRemove', fullProduct)
				: events.emit('product:inBasket', fullProduct);
			product.updatePrice(fullProduct.selected)
		},
	});
	console.log(fullProduct.selected)
	product.updatePrice(fullProduct.selected)
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
