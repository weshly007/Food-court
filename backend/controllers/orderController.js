import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Simulating a frontend URL for redirection
const frontend_url = "http://localhost:5174";

// Placing user order from frontend
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: req.body.payment
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    if (req.body.payment) {
      // Dummy payment simulation
      const dummyPaymentSuccess = true; // Change to `false` to simulate a failed payment

      if (dummyPaymentSuccess) {
        res.json({
          success: true,
          session_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`
        });
      } else {
        res.json({
          success: true,
          session_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });
      }
    } else {
      // Offline payment
      res.json({
        success: true,
        message: "Order placed successfully with offline payment."
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "not paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// user orders for frontend
const userOrders = async(req,res) =>{
  try {
    const orders = await orderModel.find({userId:req.body.userId});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"});
  }
}

// get all orders from all users
const listOrders = async (req,res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
    
  }
}

//api for updating order status
const updateStatus = async (req,res) =>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:"status updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
    
  }

}
const statusHandler = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// Updating payment status
const paymentStatusHandler = async (req, res) => {
  const { orderId, paymentStatus } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, { payment: paymentStatus === "true" });
    res.json({ success: true, message: "Payment status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    
    if (order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "Cannot cancel delivered order." });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order cancelled and deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error cancelling order.", error });
  }
};




export { placeOrder, verifyOrder , userOrders ,listOrders,updateStatus,statusHandler,paymentStatusHandler,cancelOrder};
