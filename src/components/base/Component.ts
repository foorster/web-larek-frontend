//В классе используем дженерик чтобы можно было как аргументы
//передавть данные разных типов
export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}
	//Параметр data необязателен, т.к. предусмотрена ситуация
	//что в рендер могут не передаваться данные
	render(data?: Partial<T>): HTMLElement {
		Object.assign(
			this as object,
			data ?? {} //Если в data undefined, то выполнится то, что в {}
		);
		return this.container;
	}


}
