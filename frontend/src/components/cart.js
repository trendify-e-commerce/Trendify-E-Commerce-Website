import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/product.css";
import "./CSS/checkout.css";
import { Header, Footer } from "./header_footer";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getSavedCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};
const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));

const ProductCards = ({ cart, editable = false, onQuantityChange }) => {
  if (cart.length === 0) return <p>Your cart is empty.</p>;
  return cart.map(({ product, quantity }) => (
    <div key={product.id} className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      {editable ? (
        <><p>Price: ₹{product.price}</p>
          <div className="quantity-container">
            <button className="quantity-button" onClick={() => onQuantityChange(product.id, "decrease")} > – </button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-button" onClick={() => onQuantityChange(product.id, "increase")} > + </button>
          </div> </>
      ) : (
        <> <p>Quantity: {quantity}</p>
          <p>Total Price: ₹{(product.price * quantity).toFixed(2)}</p> </>
      )}
    </div>
  ));
};

const CartCheckout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("cart");
  const [cart, setCart] = useState(getSavedCart);
  const [searchInput, setSearchInput] = useState("");
	const [billing, setBilling] = useState({
		name: localStorage.getItem("username") || "",
		email: localStorage.getItem("user_email") || "",
		phone: localStorage.getItem("phone") || "",
		address: "",
		special_instructions: "",
		agent_notes: ""
	});
	
  useEffect(() => saveCart(cart), [cart]);

  const filteredCart = cart.filter(({ product }) => product.name.toLowerCase().includes(searchInput.toLowerCase ()));
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity,0);

  const updateQuantity = useCallback((id, action) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === id
            ? {
                ...item,
                quantity: action === "increase" ? item.quantity + 1 : item.quantity - 1,
              }
            : item
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const handleField = (field) => (e) => {setBilling({ ...billing, [field]: e.target.value });};
	
  const placeOrder = async (e) => {
		e.preventDefault();
		const { name, email, phone, address } = billing;
		if (!name || !email || !phone || !address) {
			alert("Please fill out all required fields.");
			return;
		}
		const orderDetails = { ...billing, cart, total };
		try {
			const response = await fetch(`${BASE_URL}/api/order`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderDetails),
			});
			const data = await response.json();
			if (response.status === 409) {
				alert(data.error || 'User already exists.');
			} else if (response.ok) {
				alert('Order placed successfully!');
				setCart([]);
				navigate("/ThankYou");
			} else {
				alert(`Order confirmation failed: ${data.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Order confirmation error:', error);
			alert('An error occurred during order confirmation.');
		}
	};	

  return (
    <><Header />
      {step === "cart" && (
        <section id="cart" className="section">
          <h1>Your Cart</h1>
          <div className="search-bar">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..."/>
            <button className="anchor" disabled={cart.length === 0 && localStorage.getItem("userType") === "user"? true: false} onClick={() => setStep("checkout")}> Checkout</button>
          </div>
          <div id="cart-list" className="product-container"><ProductCards cart={filteredCart} editable onQuantityChange={updateQuantity} /></div>
        </section>
      )}

      {step === "checkout" && (
        <section id="checkout" className="section">
          <h1>Checkout</h1>
          <div className="product-container"><ProductCards cart={cart} /></div>

					{cart.length > 0 && (
						<div className="cart-summary">
							<div id="item-total" className="cart-total"><span className="tag">Total Items</span><span className="price">{cart.length}</span></div>
							<div id="cart-totaler" className="cart-total"><span className="tag">Items</span><span className="price">₹ {total.toFixed(2)}</span></div>
							<div id="delivery-total" className="cart-total"><span className="tag">Delivery</span><span className="price">₹ 40</span></div>
							<br></br><hr></hr>
							<div id="order-total" className="cart-total"><span className="tag">Total</span><span className="price">₹ {(total + 40).toFixed(2)}</span></div>
						</div>
					)}

          <div className="checkout-section">
            <h2>Billing and Payments</h2>
            <form className="checkout-form" onSubmit={placeOrder}>
              <div className="billing-info">
                <input type="text" value={billing.name} onChange={handleField("name")} required />
                <input type="email" value={billing.email} onChange={handleField("email")} required />
                <input type="tel" value={billing.phone} onChange={handleField("phone")} required />
                <textarea placeholder="Shipping Address" value={billing.address} onChange={handleField("address")} required/>
								<textarea placeholder="Special Instructions" value={billing.special_instructions} onChange={handleField("special_instructions")} />
								<textarea placeholder="Agent Notes" value={billing.agent_notes} onChange={handleField("agent_notes")} />
              </div>
              <div className="checkout-buttons">
                <button type="button" onClick={() => setStep("cart")}> Back to Cart</button>
                <button id="confirm-order" type="submit">Place Order</button>
              </div>
            </form>
          </div>
        </section>
      )}
    <Footer /></>
  );
};

export default CartCheckout;