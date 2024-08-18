import { Order } from "./order";
import { Product } from "./product";

export interface OrderProduct {
    id: OrderProductId,
    quantity: number
}

interface OrderProductId {
    orderId: number,
    productId: number
}