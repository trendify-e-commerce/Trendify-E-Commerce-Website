import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header, Footer } from "./header_footer";
import './CSS/orders.css'
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

const CusAgentOrder = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [accessLevel, setAccessLevel] = useState("public");
  const [order_id, setOrder_ID] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("order_id");
    const pass = params.get("password");
    setAccessLevel(pass ? "protected" : "public");
    setOrder_ID(id);
  }, [location.search]);
  
  useEffect(() => {
    if (!order_id) return;
    const abort = new AbortController();
    const fetchData = async () => {     
      setLoading(true); setError(null);
      try {
        const path = accessLevel === "protected"? "/api/getOrderData": "/api/getOrderQR";
        const url = `${BASE_URL}${path}?encodedContent=${encodeURIComponent(order_id)}`;
        const res = await fetch(url, { signal: abort.signal });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Unknown error");
        setResult(json);
      } catch (err) {if (err.name !== "AbortError") setError(err.message);}
      finally {setLoading(false);}
   };
   fetchData(); return () => abort.abort();
  }, [accessLevel, order_id]);  

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{color:"red"}}>{error}</p>;
  if (!result) return null;
  return (
    <><Header />
    <div className="section order-section">
      <div className="orderSection">
        <div className="user-details">
          <h2>Order Details</h2> <hr></hr>
          <span style={{ fontWeight: "bold", fontSize: "20px", textAlign: "center", marginBottom: "20px" }}>{result?.data?.order_id}</span>
          <div class="cart-total"><span>User ID:</span><span>{result?.data?.user_id}</span></div>
          <div class="cart-total"><span>Agent ID:</span><span>{result?.data?.agent_id}</span></div>
          <span style={{ display: "block", textAlign: "center", marginTop: "20px", fontWeight: "bold", fontSize: "20px" }}>{result?.data?.status}</span>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-icon">&#10003;</div>
              <div className="timeline-content">Order Confirmed, {new Date(result?.data?.order_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</div>
            </div>
            <div className="timeline-line"></div>
            <div className="timeline-item">
              <div className="timeline-icon">&#10003;</div>
              <div className="timeline-content">Delivered, {new Date(result?.data?.delivery_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</div>
            </div>
          </div>
        </div>
        <div className = "sensitive-details">
        {accessLevel === "public" ? (<img className="qr-img" src={`data:image/png;base64,${result?.qr_image_b64}`} alt="Secure order QR" />) : (<>
          <div className="cart-total"><span>User Name:</span><span>{result?.sensitive_data?.username}</span></div>
          <div className="cart-total"><span>User Email:</span><span>{result?.sensitive_data?.user_email}</span></div>
          <div className="cart-total"><span>User Phone:</span><span>{result?.sensitive_data?.phone}</span></div>
        {result?.sensitive_data?.userType === "users" && (<>
          <div className="cart-total"><span>Transaction ID:</span><span>{result?.sensitive_data?.transaction_id}</span></div>
          <div className="cart-total"><span>OTP:</span><span>{result?.sensitive_data?.OTP}</span></div>
        </>)}
          <div className="cart-total"><span>Agent Notes:</span><span>{result?.sensitive_data?.agent_notes}</span></div>
          <div className="cart-total"><span>Special Instructions:</span><span>{result?.sensitive_data?.special_instructions}</span></div>
          <div className="cart-total"><span>Return Policy:</span><span>{result?.sensitive_data?.return_policy}</span></div>
        </>)}</div></div>
      <div className = "userSection">
        <div className="user-details">
          <h2>User Details</h2> <hr></hr>
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>{result?.userDetails?.username}</span>
          <span>{result?.userDetails?.user_id}</span>
          <span>{result?.userDetails?.email}</span>
          <span>{result?.userDetails?.phone}</span>
        </div>
        <div className="transactions-details">
          <h2>Price Details</h2> <hr />
          <div className="cart-total"><span>Cart Total</span><span>₹ {result.data.total_amount - DELIVERY_CHARGE}</span></div>
          <div className="cart-total"><span>Delivery Charges</span><span>₹ {DELIVERY_CHARGE}</span></div><hr />
          <div className="cart-total"><span>Order Total</span><span>₹ {result.data.total_amount}</span></div>
          <div className="payment-status"><span>Payment Status</span><span>Paid</span></div>
        </div>
      </div>
      <div></div>
    </div>
    {accessLevel === "protected" && (<><section id="cart" className="section">
      <h1>Items Ordered</h1>
      <div id="cart-list" className="product-container"><ProductCards cart={result.sensitive_data.cart}/></div> 
    </section></>)}
    <Footer /></>
  )
}

export default CusAgentOrder;
const DELIVERY_CHARGE = 40;