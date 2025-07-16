import React, { useContext, useEffect, useState } from 'react';
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    const response = await axios.post(`${url}/api/order/userOrders`, {}, { headers: { token } });
    setData(response.data.data);
  };

  const cancelOrder = async (orderId, status) => {
    try {
      if (status === "Delivered") {
        alert('Cannot cancel delivered order.');
        return;
      }

      const response = await axios.post(`${url}/api/order/cancel`, { orderId }, { headers: { token } });
      if (response.data.success) {
        alert('Order canceled successfully.');
        fetchOrders();
      } else {
        alert('Failed to cancel order.');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>{order.items.map((item, idx) => (
              <span key={idx}>
                {item.name} x {item.quantity}{idx !== order.items.length - 1 ? ', ' : ''}
              </span>
            ))}</p>
            <p>₹{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span><b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
            <button onClick={() => cancelOrder(order._id, order.status)}>Cancel Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
