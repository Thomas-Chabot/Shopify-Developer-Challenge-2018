/*
  This is the base module for intiializing data in the Database.
  It creates a single shop, three products, three orders & three line items.
*/

const Promises = require ("../Promises.js").Promises;

function init (db) {
  /*
   *  Process here:
   *   1) Create the shop.
   *   2) Create some products, orders, and line items.
   *   3) Set up the data so that everything links to each other;
   *   4) ??
   */

 return new Promise((fulfill, reject) => {

   Promises.chain({
     shop: ()=>db.createShop("Wiggles Lair"),

     product1: ()=>db.createProduct ("The First Product", 25),
     product2: ()=>db.createProduct ("The Second Product", 50),
     product3: ()=>db.createProduct ("The Third Product", 75),
     product4: ()=>db.createProduct ("Bag o Wig", 999),

     order1: ()=>db.createOrder (),
     order2: ()=>db.createOrder (),
     order3: ()=>db.createOrder (),

     lineItem1: (data)=>db.createLineItem(data.product1, data.order1, 5),
     lineItem2: (data)=>db.createLineItem(data.product1, data.order1, 2),
     lineItem3: (data)=>db.createLineItem(data.product2, data.order2, 14),

     shopProduct1: (data)=>db.addProductToShop(data.shop, data.product1),
     shopProduct2: (data)=>db.addProductToShop(data.shop, data.product2),
     shopProduct3: (data)=>db.addProductToShop(data.shop, data.product3),
     shopProduct4: (data)=>db.addProductToShop(data.shop, data.product4),

     shopOrder1: (data)=>db.addOrderToShop(data.shop, data.order1),
     shopOrder2: (data)=>db.addOrderToShop(data.shop, data.order2),
     shopOrder3: (data)=>db.addOrderToShop(data.shop, data.order3),
   }).then ((data) => {
     fulfill ();
  }).catch (([_, error]) => {
    reject (error);
  });
 });
}

module.exports.Init = init;
