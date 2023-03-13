const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch((err) => {
        console.log("Mongo Error")
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/products', async (req, res) => {
    const { category } = req.query;
    console.log(req.query);
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category })
    }
    else {
        const products = await Product.find({});
        res.render('products/index', { products, category: 'All' })
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new');
})

app.post('/products', async (req, res) => {
    //console.log(req.body);
    const newProduct = new Product(req.body);
    await newProduct.save();
    //console.log(newProduct);
    //res.send("Working");
    res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const editedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect(`/products/${editedProduct._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
})
app.listen(3000, () => {
    console.log("On port 3000");
})