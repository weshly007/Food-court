import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });
  const [paymentMode, setPaymentMode] = useState('online');

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onPaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 5,
    };

    // Show alert box
    if (window.confirm(`Confirm Order:
Items: ${orderItems.map(item => `${item.name} x ${item.quantity}`).join(', ')}
Total: $${getTotalCartAmount() + 5}`)) {
      if (paymentMode === 'offline') {
        // Offline payment: set payment status to false and redirect to orders page
        orderData.payment = false;
        const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
          alert('Order placed successfully with offline payment.');
          setCartItems({});
          navigate('/MyOrders');
        } else {
          alert('Error placing order.');
        }
      } else {
        // Online payment: proceed with dummy payment logic
        orderData.payment=true;
        const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
          setCartItems({});
          navigate('/MyOrders')
          
        } else {
          alert('Error placing order.');
        }
      }
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  return (
    <div>
      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
            <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
          </div>
          <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
          <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
          <div className="multi-fields">
            <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
            <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
          </div>
          <div className="multi-fields">
            <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
            <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
          </div>
          <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number' />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>SubTotal</p>
                <p>₹{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
              </div>
            </div>
            <div className="payment-mode">
              <p>Select Payment Mode:</p>
              <input type="radio" id="online" name="paymentMode" value="online" checked={paymentMode === 'online'} onChange={onPaymentModeChange} />
              <label htmlFor="online">Online</label>
              <input type="radio" id="offline" name="paymentMode" value="offline" checked={paymentMode === 'offline'} onChange={onPaymentModeChange} />
              <label htmlFor="offline">Offline</label>
            </div>
            <button type='submit'>PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
