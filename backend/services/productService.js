const Product = require('../models/Product');

async function listProducts() {
  return await Product.find();
}

async function createProduct(data) {
  const product = new Product(data);
  await product.save();
  return product;
}

async function updateProduct(id, data) {
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

async function deleteProduct(id) {
  return await Product.findByIdAndDelete(id);
}

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
