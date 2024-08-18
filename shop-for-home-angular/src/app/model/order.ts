import { Coupon } from "./coupon";
import { OrderProduct } from "./order-product";
import { User } from "./user";

export interface Order {
    id: number,
    userId: number,
    orderDate: string | null,
    coupon: Coupon | null,
    initialTotal: number,
    discount: number,
    finalTotal: number,
    placed: boolean,
    orderProducts: OrderProduct[]
}