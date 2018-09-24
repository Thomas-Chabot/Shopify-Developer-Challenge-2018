// This controls all paths for the API & routes them to data from the database.
const Methods = require ("./methods.js").Methods;

const express = require ("express");
const bodyParser = require ("body-parser");
const prettify = require ("express-prettify");

const app = express();
const port = 8080;

// body parsing - accepts url encoded & json body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(prettify({ query: "pretty" }));

class API {
  constructor(database){
    this._methods = new Methods (database);
  }

  start(){
    return new Promise ((fulfill, reject) => {
      this._addApiPaths();

      app.listen (port, ()=>{
        fulfill ({port});
      });
    });
  }

  _addApiPaths () {
    // Getters
    app.get('/products', (req, res)=>{
      this._resolve (this._methods.getProducts(), res);
    })
    app.get('/orders', (req, res) => {
      this._resolve (this._methods.getOrders(), res);
    })
    app.get('/lineItems', (req, res) => {
      this._resolve (this._methods.getLineItems(), res);
    })
    app.get('/shops', (req, res) => {
      this._resolve (this._methods.getShops(), res);
    })

    // Get by ID
    app.get('/product/:id', (req, res)=>{
      let id = req.params.id;
      this._resolve (this._methods.getProductById(id), res);
    });
    app.get('/order/:id', (req, res) => {
      let id = req.params.id;
      this._resolve (this._methods.getOrderById(id), res);
    })
    app.get('/shop/:id', (req, res) => {
      let id = req.params.id;
      this._resolve (this._methods.getShopById(id), res);
    })

    // Creations
    app.post('/product', (req, res) => {
      let name = req.body.name;
      let price = req.body.price;
      let shopId = req.body.shopId;

      this._resolve (this._methods.createProduct (name, price, shopId), res);
    });
    app.post('/order', (req, res) => {
      let shopId = req.body.shopId;
      this._resolve (this._methods.createOrder (shopId), res);
    })
    app.post('/lineItem', (req, res) => {
      let productId = req.body.productId;
      let orderId = req.body.orderId;
      let quantity = req.body.quantity;

      this._resolve (this._methods.createLineItem(productId, orderId, quantity), res);
    });
    app.post('/shop', (req, res) => {
      let shopName = req.body.name;
      this._resolve (this._methods.createShop (shopName), res);
    });
  }

  _resolve (promise, res) {
    promise.then ((result) => {
      res.json(result);
    });
  }
}

module.exports.api = API;
