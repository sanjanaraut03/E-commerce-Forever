import React, { createContext, useEffect, useState } from "react";
import all_product from '../Components/Assets/all_product';
export const ShopContext = createContext(null);
const getDefaultCart = ()=>{
    let cart ={}
    for (let index = 0; index < 300+1; index++) {
        cart[index]=0;
        
    }
    return cart;

}
const ShopContextProvider = (props) => {

    // const [all_product,setAll_Product]=useState([]);
    const[cartItems,setCartItems] = useState(getDefaultCart());

useEffect(() => {
    // Check if auth-token exists in localStorage
    const token = localStorage.getItem('auth-token');
    
    if (token) {
        // If token exists, fetch the cart data
        fetch('http://localhost:4000/getcart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': token,
                'Content-Type': 'application/json',
            },
            // No body needed here if you're just retrieving data
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Assuming setCartItems is a state setter function
            setCartItems(data);
        })
        .catch((error) => {
            console.error('Error fetching cart data:', error);
        });
    }
}, []); // Empty dependency array ensures this effect runs once when the component mounts

   

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => console.log(data))
            .catch((error) => console.error('Error adding item to cart:', error));
        }
    };
    
    

    const removeFromCart =(itemId)  =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId }),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => console.log(data))
            .catch((error) => console.error('Error removing item to cart:', error));
        }
    }

const getTotalCartAmount = () =>{
    let totalAmount = 0;
    for(const item in cartItems)
    {
        if(cartItems[item]>0)
        {
            let itemInfo = all_product.find((product)=>product.id===Number(item));
            totalAmount += itemInfo.new_price * cartItems[item];
        }
       
    } 
    return totalAmount;
}

const getTotalCartItems = () =>{
    let totalItem = 0 ;
    for (const item in cartItems){
        if (cartItems[item]>0){
           totalItem += cartItems[item]; 
        }
    }

    return totalItem;
}

    const contextValue ={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}

        </ShopContext.Provider>

    )
}

export default ShopContextProvider;


