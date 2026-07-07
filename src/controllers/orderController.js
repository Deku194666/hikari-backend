import Order from "../models/Order.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// vet ve todas las órdenes de todos los clientes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("owner", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};