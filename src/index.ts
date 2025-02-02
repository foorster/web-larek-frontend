import { EventEmitter } from './components/base/events';
import { ProductData } from './components/base/ProductsData';
import { BasketData } from './components/base/ProductsData';
import { OrderData } from './components/base/OrdersData';
import './scss/styles.scss';
import { IProductSelect, IOrderFormData } from './types';
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
import { Pay } from './components/common/ModalPay';
import { Contact } from './components/common/ModalContact';
import { Success } from './components/common/ModalSuccessfulOrder';

const events = new EventEmitter();
//Для проверки работы компонентов (например: тык на фотку -> Product:select)
//Чтобы консолька была чистой от всех events.on, надо удалить events.onAll
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//*********************************************************************************//
//*********************************************************************************//
//*********************************** ТЕМПЛЕЙТЫ ***********************************//
//*********************************************************************************//
//*********************************************************************************//
const productTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog'); //Темплейт одного продукта из каталога
const basketTemplate: HTMLTemplateElement = document.querySelector('#basket'); //Темплейт всей корзины
const basketTemplateProduct: HTMLTemplateElement =
	document.querySelector('#card-basket'); //Темплейт одного продукта из корзины
const productFullTemplate: HTMLTemplateElement = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement; //Темплейт полной версии продукта
const payTemplate: HTMLTemplateElement = document.querySelector('#order'); //Темплейт способа оплаты и адреса
const contactsTemplate: HTMLTemplateElement =
	document.querySelector('#contacts'); //Темплейт контактов пользователя
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

//*********************************************************************************//
//*********************************************************************************//
//**************************** ЭКЗЕМПЛЯРЫ КЛАССОВ *********************************//
//*********************************************************************************//
//*********************************************************************************//
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); //Экземляр пустой модалки
const basket = new BasketList(cloneTemplate(basketTemplate), events); //Экземляр корзины
const pay = new Pay(cloneTemplate(payTemplate), events); //Экземляр оплаты
const contact = new Contact(cloneTemplate(contactsTemplate), events); //Экземляр оплаты
const productsGallery = new MainPage(
	document.querySelector('.gallery'),
	events
); //Обертка галереи с продуктами

//*********************************************************************************//
//*********************************************************************************//
//****************************** МОДЕЛИ И ДАННЫЕ **********************************//
//*********************************************************************************//
//*********************************************************************************//
const appApi = new AppApi(API_URL); //Класс для вытягивания продуктов с сервера
const productData = new ProductData(events); //Класс с данными продукта
const basketListData = new BasketData(events); //Класс с данными в корзине
const orderData = new OrderData(events); //Класс с данными заказа

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
		}); //При клике на продукт передаем его данные
		return productInstant.render(product);
	});
	productsGallery.render({ products: productsArray });
});

//Выбрали продукт
events.on('Product:select', (fullProduct: IProductSelect) => {
	productData.setPreview(fullProduct); //Передаем в модель данные о том, что по продукту кликнули
});

//В МОДЕЛИ данных продукта сгенерировано событие открытия, отрендери контент
events.on('Product:open', (fullProduct: IProductSelect) => {
	const product = new FullProduct(cloneTemplate(productFullTemplate), events, {
		onClick: () => {
			fullProduct.selected
				? events.emit('basket:productRemove', fullProduct)
				: events.emit('product:inBasket', fullProduct);
			product.updatePrice(fullProduct.selected);
		},
	}); //Создан экземпляр полной версии продукта, повешен переключающийся слушатель на кнопку корзины в зависимости от того, в корзине продукт или нет
	product.updatePrice(fullProduct.selected); //Обновим надпись на кнопке в превьюшке
	modal.content = product.render(fullProduct); //Кладем контент продукта в модалку
	modal.render(); //Отрисовываем модалку
});

//Добавили карточку товара в корзину
events.on('product:inBasket', (product: IProductSelect) => {
	//Проверяет, есть ли этот продукт в корзине
	const status = basketListData.checkProduct(product.id);
	if (!status) {
		basketListData.setSelectedСard(product); //Передаем в модель данные о том, что продукт добавлен в корзину
	}
	product.selected = true; //Меняем значение selected, означающее, что продукт в корзине
});

//Удалили карточку товара из корзины
events.on('basket:productRemove', (product: IProductSelect) => {
	basketListData.deleteProduct(product); //Передаем в модель данные о том, что продукт удален из корзины
	product.selected = false;
});

//Данные корзины изменились, отрендери
events.on('basket:change', () => {
	basket.totalSum(basketListData.getSumProducts()); // Отобразили сумму всех продуктов в корзине
	//Отрисовываем
	let i = 0;
	basket.products = basketListData.list.map((product) => {
		const basketProduct = new BasketProduct(basketTemplateProduct, events, {
			onClick: () => {
				events.emit('basket:productRemove', product);
			},
		}); //Для каждого продукта в списке создаем класс и передаем туда темплейт одного продукта
		i++;
		return basketProduct.render(product, i); //Отрисовываем один продукт
	});
	productsGallery._total = basketListData.list.length; //Установка счетчика товаров на значок корзины
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

//*********************************************************************************//
//*********************************************************************************//
//**************************** Работа с МОДЕЛЬЮ заказа ****************************//
//*********************************************************************************//
//*********************************************************************************//

//Сработало событие открытия модалки оплаты
events.on('ModalPay:open', () => {
	modal.content = pay.render(); //Кладем контент оплаты в модалку
	modal.render(); //Отрисовываем модалку
	orderData.items = basketListData.list.map((item) => item.id); //Кладем в МОДЕЛЬ заказа id товаров из корзины
	orderData.total = basketListData.getSumProducts(); //Кладем в МОДЕЛЬ заказа общую сумму товаров
});

//Сработало событие изменения в инпуте address
events.on(`adress:changed`, (data: { field: string; value: string }) => {
	orderData.setAddress(data.field, data.value); //Кладем в МОДЕЛЬ заказа данные адреса
});

//Сработало событие изменения способа оплаты
events.on('payMetod: changed', (button: HTMLButtonElement) => {
	orderData.payment = button.name; //Кладем в МОДЕЛЬ заказа название способа оплаты
});

//Сработало событие открытия модалки контактов
events.on('ModalInfo:open', () => {
	modal.content = contact.render(); //Кладем контент контактов в модалку
	modal.render(); //Отрисовываем модалку
});

//Сработало событие изменения в инпуте email
events.on(`email:changed`, (data: { field: string; value: string }) => {
	orderData.setEmail(data.field, data.value); //Кладем в МОДЕЛЬ заказа данные почты
});

//Сработало событие изменения в инпуте phone
events.on(`phone:changed`, (data: { field: string; value: string }) => {
	orderData.setPhone(data.field, data.value); //Кладем в МОДЕЛЬ заказа данные номера
});

//Сработало событие отправки заказа на сервер
events.on('ModalSuccessful:open', () => {
	const totalSum = orderData.total;
	appApi
		.sendOrder(orderData.getData())
		.then(() => {
			const success = new Success(successTemplate, events);
			basketListData.clearBasket();
			productData.clearSelect();
			modal.content = success.render(totalSum);
			orderData.total = basketListData.getSumProducts();
			modal.render();
		})
		.catch((error) => console.log(error));
});

//*********************************************************************************//
//*********************************************************************************//
//**************************** Работа с ошибками форм *****************************//
//*********************************************************************************//
//*********************************************************************************//

//Сработало событие ошибок формы оплаты
events.on('formErrors:address', (errors: Partial<IOrderFormData>) => {
	const { address, payment } = errors;
	pay.valid = !address && !payment;
	pay.formErrors.textContent = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:contacts', (errors: Partial<IOrderFormData>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.formErrors.textContent = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//Блокируем прокрутку при открытии модалки продукта
events.on('Product:open', () => {
	modal.block = true;
});

//Блокируем прокрутку при открытии модалки корзины
events.on('basket:open', () => {
	modal.block = true;
});

events.on('modal:close', () => {
	modal.block = false;
});

events.on('successfulModal:close', () => modal.close());
