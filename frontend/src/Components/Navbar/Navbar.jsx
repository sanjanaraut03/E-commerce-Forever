import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart-shopping-solid.svg';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import  drop_down from '../Assets/dropdown_icon.svg';


export const Navbar = () => {
    const [menu,setMenu]=useState("shop");
    const {getTotalCartItems}=useContext(ShopContext);
    const menuRef=useRef();

    const dropDown_toggle = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }


  return (
   <div className="navbar">
    <div className="nav-logo">
        <img src={logo} alt="hello" id='main'/>
    </div>
<img className='nav-dropdown' alt='hello' onClick={dropDown_toggle} src={drop_down} />
    <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:'none'}}to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration:'none'}} to='/womens'>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
    </ul>

    <div className='nav-login-cart'>
        {localStorage.getItem('auth-token')
        ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
        :<Link to="/login"><button>Login</button></Link>}
        <Link to="/cart" ><img src={cart_icon} alt="" /></Link>
        <div className="nav-cart-count"> {getTotalCartItems()} </div>
        </div>
    </div>

 
  )
}
