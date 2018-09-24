// This houses the logic for converting database results into the expected output
//  for the API.
const express = require ("express");

class Methods {
  constructor (database) {
    this._database = database;
  }

  getProducts(){ return this._parse (this._database.getProducts(), ["LineItemIds"]); }
  getOrders(){ return this._database.getOrders(); }
  getLineItems(){ return this._database.getLineItems(); }
  getShops(){ return this._parse(this._database.getShops(), ["Products", "Orders"]); }

  getProductById(id){ return this._database.getProductById(id); }
  getOrderById(id){ return this._database.getOrderById(id); }
  getShopById(id){ return this._database.getShopById(id); }

  createProduct(name, price, shopId){
    return new Promise ((fulfill, reject) => {
      this._database.createProduct(name, price).then ((productId) => {
        this._database.addProductToShop(shopId, productId).then (fulfill, reject);
      }).catch (reject);
    });
  }
  createOrder(shopId){
    return new Promise ((fulfill, reject) => {
      this._database.createOrder().then ((orderId) => {
        this._database.addOrderToShop (shopId, orderId).then (fulfill, reject);
      }).catch (reject);
    });
  }
  createLineItem(productId, orderId, quantity){
    return this._database.createLineItem(productId, orderId, quantity);
  }
  createShop(name){ return this._database.createShop(name); }

  _parse (promise, groups) {
    // Waits on the promise to resolve, converts the groups into arrays,
    //  Then returns the new result
    return new Promise ((fulfill, reject) => {
      promise.then ((results) => {
        for (let result of results) {
          this._fixGroups (result, groups);
        }

        fulfill (results);
      }).catch (reject);
    });
  }
  _fixGroups (result, groups) {
    for (var key of groups) {
      if (!result[key]) result[key] = [ ];
      else result[key] = result[key].split(',');

    //  result[key] = JSON.stringify (result [key])
    }
  }
}

module.exports.Methods = Methods;
