import { Address } from "./address";
import { Coupon } from "./coupon";
import { WishList } from "./wish-list";

export interface User {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    admin: boolean,
    address: Address | null,
    coupon: Coupon | null,
    active: boolean
}