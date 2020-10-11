import { CartItemsModel } from "./cart-Items.model"

export interface CartModel {
    /**
     * Indica se o pedido realizado pelo comprador é para presente
    */
    isGift?: boolean,
    /**
     * Indica se o pedido realizado pelo comprador pode ser devolvido a loja
     * Possíveis valores: true / false (default)
    */
    returnsAccepted: true,
    items?: Array<CartItemsModel>
}