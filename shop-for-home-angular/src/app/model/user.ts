import { Address } from "./address";
import { Coupon } from "./coupon";

export interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    isAdmin: boolean,
    address: Address | null,
    coupon: Coupon | null
}