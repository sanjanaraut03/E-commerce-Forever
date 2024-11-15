import React, { useContext } from 'react';
import "./CartItems.css";
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItem = ({ item, quantity, removeFromCart }) => (
    <div className="cartitems-format cartitems-format-main" key={item.id}>
        <img src={item.image} alt={`${item.name}`} className='carticon-product-icon' />
        <p>{item.name}</p>
        <p>₹{item.new_price}</p>
        <button className='cartitems-quantity'>{quantity}</button>
        <p>₹{item.new_price * quantity}</p>
        <img
            className='cartitems-remove-icon'
            src={remove_icon}
            alt="Remove item"
            aria-label={`Remove ${item.name}`}
            onClick={() => removeFromCart(item.id)}
        />
    </div>
);

export const CartItems = () => {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
    const totalAmount = getTotalCartAmount();

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            
            {all_product.map((item) => {
                const quantity = cartItems[item.id];
                if (quantity > 0) {
                    return (
                        <div key={item.id}>
                            <CartItem item={item} quantity={quantity} removeFromCart={removeFromCart} />
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            
            {totalAmount > 0 ? (
                <div className="cartitems-down">
                    <div className="cartitems-total">
                        <h1>Cart Totals</h1>
                        <div>
                            <div className="cart-total-item">
                                <p>Subtotal</p>
                                <p>₹{totalAmount}</p>
                            </div>
                            <hr />
                            <div className="cartitems-total-item">
                                <p>Shipping Fee</p>
                                <p>Free</p>
                            </div>
                            <hr />
                            <div className="cartitems-total-item">
                                <h3>Total</h3>
                                <h3>₹{totalAmount}</h3>
                            </div>
                        </div>
                        <button>PROCEED TO CHECKOUT</button>
                    </div>
                    
                    <div className="cartitems-promocode">
                        <p>If you have a promo code, enter it here</p>
                        <div className="cartitems-promobox">
                            <input type="text" placeholder='Promo Code' />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Your cart is empty</p>
            )}
        </div>
    );
};
