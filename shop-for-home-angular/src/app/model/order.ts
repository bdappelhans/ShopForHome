import { Coupon } from "./coupon";
import { User } from "./user";

export interface order {
    id: number,
    userId: number,
    orderDate: string | null,
    coupon: Coupon | null,
    initialTotal: number,
    discount: number,
    finalTotal: number,
    placed: boolean
}