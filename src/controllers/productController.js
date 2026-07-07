import Product from "../models/Product.js";
import Order from "../models/Order.js";


export const createProduct = async (req, res) => {
  try {
    const { name, category, species, quantity, minStock, price, description, image } = req.body;

    const product = await Product.create({
      name,
      category,
      species,
      quantity,
      minStock,
      price,
      description,
      image
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });

    const { name, category, species, quantity, minStock, price, description, image } = req.body;

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (species !== undefined) product.species = species;
    if (quantity !== undefined) product.quantity = quantity;
    if (minStock !== undefined) product.minStock = minStock;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });

    await product.deleteOne();
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// cliente confirma una compra: valida stock y lo descuenta de verdad
export const purchaseProducts = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "El carrito está vacío" });
    }

    const results = [];
    const successfulItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        results.push({ productId: item.productId, ok: false, msg: "Producto no encontrado" });
        continue;
      }

      if (product.quantity < item.quantity) {
        results.push({
          productId: item.productId,
          ok: false,
          msg: `Solo quedan ${product.quantity} unidades de "${product.name}"`
        });
        continue;
      }

      product.quantity -= item.quantity;
      await product.save();

      successfulItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

      results.push({ productId: item.productId, ok: true, remaining: product.quantity });
    }

    let order = null;
    if (successfulItems.length > 0) {
      const total = successfulItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      order = await Order.create({
        owner: req.user._id,
        items: successfulItems,
        total
      });
    }

    const hasFailures = results.some((r) => !r.ok);
    res.json({ success: !hasFailures, results, order });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};