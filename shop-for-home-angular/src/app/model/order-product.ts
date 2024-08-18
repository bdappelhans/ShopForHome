import { Order } from "./order";
import { Product } from "./product";

export interface OrderProduct {
    order: Order,
    product: Product,
    quantity: number
}