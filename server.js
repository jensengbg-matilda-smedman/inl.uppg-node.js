/* Database */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

/* Products db */
const adapter1 = new FileSync('products.json');
const products = low(adapter1);
const product = products.get('products').value();

/* Cart db */
const adapter2 = new FileSync('cart.json');
const cart = low(adapter2);
let carts = cart.get('cart').value();

/* Express */
const express = require('express');
const app = express();
app.use(express.json());

/* .json defaults */
products.defaults({ products: [] }).write();
cart.defaults({ cart: [] }).write();

/* Show all products */
app.get('/products', async (req, res) => {
    let data = await products.get('products');
    res.send(data);
});

/* Show products in cart */
app.get('/cart', async (req, res) => {
    let data = await cart.get('cart');
    res.send(data);
});


/* Add a product to cart */
function addItem(item) {
    cart.get('cart').push(item).write();
}

app.post('/cart/additem/:id', (req, res) => {
    let IDs = parseInt(req.params.id);
    let carts = cart.get('cart').value();
    const products = product.filter(products => products.id === parseInt(req.params.id));

    if(products.length === 0) {
        res.send('This product is not in our system');
    } else {
        let cartItem = carts.filter(item => item.id === parseInt(req.params.id));
        if(cartItem.length === 0) {
            addItem(products[0]);
            res.send('Product is now added in cart!');
        } else if(IDs === cartItem[0].id) {
            res.send('This product is already in your cart and will not be added again');
        }
    }
});

/* Delete product from cart */
function deleteProduct(item) {
    cart.get('cart').remove(item).write();
}

app.delete('/cart/deletitem/:id', (req, res) => {
    let IDs = parseInt(req.params.id);
    let cartItem = carts.filter(item => item.id === parseInt(req.params.id));

    if (cartItem.length === 0) {
        res.send('This product is not in your cart');
    } else {
        if (IDs === cartItem[0].id) {
        deleteProduct(cartItem[0]);
        res.send('You have removed this item from your cart');
        }
    }
});

/* Server listen */
app.listen(3000, () => {
    console.log('Server is running');
});