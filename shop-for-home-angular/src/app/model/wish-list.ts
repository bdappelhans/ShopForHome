export interface WishList {
    id: WishListId
}

interface WishListId {
    userId: number,
    productId: number
}