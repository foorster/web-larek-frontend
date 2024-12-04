// Взяли данные из постмана
// Интерфейс продукта
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
    inbasket: boolean // Информация о том, находится ли товар в корзине
}

// Интерфейс всех продуктов, методы
interface IProductData {
    products: IProduct[]; // Массив продуктов, полученных с сервера
    preview: string | null; 
    addProduct(product: IProduct): void;
    deleteProduct(productId: string): void;
    updateProduct(product: IProduct): void;
    getProduct(productId: string): IProduct;
    checkProduct(productId: string): boolean; // Проверяет есть ли этот продукт в массиве корзины
}

// Интерфейс корзины
interface IBasket {
	list: TBasketProduct[];
    total: number; // Сумма всех продуктов
    showListBasket(product: TBasketProduct[], total:number): void // Показываем список товаров
    addProductBasket(productId: string): IProduct;
    deleteProductBasket(productId: string): void;
    updateBasket(productId: string): boolean;
    countProducts(productId: string): number; // Возможно его надо перенести функцией в updateBasket
    clearListBasket(): void // Очищаем корзину
}

// Интерфейс данных пользователя
interface IUserInfo {
	address: string;
	email: string;
	phone: number;
}

interface IUserInfoData {
    getUserInfo(): IUserInfo;
    setUserInfo(userData: IUserInfo): void;
}


// Тип для корзины с заказами
type TBasketProduct = Pick<IProduct, 'id' | 'title' | 'price'>;


// Тип для модалки с оплатой заказа
type TPay = Pick<IUserInfo, 'address'>;

// Тип для модалки с контактами
type TContact = Pick<IUserInfo, 'email' | 'phone'>;

// Тип для модалки успешного оформления заказа
type TSucсess = Pick<IOrder, 'total'>;



-----------------------------------------------------------------

export type CategoryType = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';

export interface ICard {
  id: string;
  title: string;
  description: string;
  image: string;
  category: CategoryType;
  price: number | null; 
  selected: boolean;
}

export interface IPlace {
	isOrdered: boolean;
}

export type ICardItem = ICard & IPlace;

export interface IBasket { list: IBasketItem[]; 
    price: number;
  }
  
  export type IBasketItem = Pick<ICardItem, 'id' | 'title' | 'price'>;
  
  export interface IBasketView {
    render(items: IBasketItem[], total: number): void;
    updateItem(itemId: string, selected: boolean): void;
    clearView(): void;
  }
  
  export type CashType = 'cash' | 'card' | null;
  
  export interface IOrder {
      payment: CashType;
      address: string;
      email: string;
      phone: string;items: string[];
    }
    
    export interface IPage {
        counter: number;
        store: HTMLElement[];
        locked: boolean;
    }
    
    export interface IPageElements {
        counter: HTMLElement;
        wrapper: HTMLElement;
        basket: HTMLElement;
        store: HTMLElement;
    }

    export interface IAppState {
        catalog: ICardItem[];
        basket: ICardItem[];
        order: IOrder;
        preview: ICardItem;
	addToBasket(item: ICardItem): void
	removeFromBasket(itemId: number): void
	clearBasket(): void;
	isLotInBasket(item: ICardItem): boolean;
	getTotalAmount(): number;
	getBasketIds(): number;
    getBasketLength(): number[];
	clearOrder(): void;
	updateFormState(valid: boolean, errors: string[]): void
}

export interface ModalView{
	 content: HTMLElement;
	 open(content: HTMLElement): void ;
	 close(): void;
     clearContent(): void;
}
export interface FormOrderView {
	formContainer: HTMLElement ;
	inputs: { [key: string]: HTMLInputElement };
	errorsContainer: HTMLElement;
	renderForm(orderData?: IOrder): void; 
	updateErrors(errors: string[]): void;
	clearForm(): void;
	getFormData(): IOrder;
	disableForm(): void;
	enableForm(): void
}