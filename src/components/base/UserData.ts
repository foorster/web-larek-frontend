import {IUserInfo, IUserInfoData, TPaymentMethod, TPay, TContact} from '../../types';
import { IEvents } from './events';

export class UserData implements IUserInfoData{
    address: string;
	email: string;
	phone: number;
    payment: TPaymentMethod;
    events: IEvents;

    constructor(events: IEvents) {
		this.events = events;
	}

    getUserInfo(): IUserInfo{ 
        return {address: this.address, email: this.email, phone: this.phone, payment:this.payment}
    };

    setUserInfo(userData: IUserInfo){
        this.address = userData.address;
        this.email = userData.email;
        this.phone = userData.phone;
        this.payment = userData.payment;
        this.events.emit('user:changed')
    };
}