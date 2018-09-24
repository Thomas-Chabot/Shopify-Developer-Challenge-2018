/*
  These are the longer SQL code used to query the database.
  It features code for:
    - Getting Products
    - Getting Orders
    - Getting Line Items
    - Getting Shops
    - Getting a list of a Shop's Products
    - Getting a list of a Shop's Orders
*/

const PRODUCTS_TABLE = "Product";
const ORDERS_TABLE = "Orders";
const LINE_ITEMS_TABLE = "LineItem";

const PRODUCT_LINE_ITEMS = "ProductLineItems";
const ORDER_LINE_ITEMS = "OrderLineItems";

const SHOPS_TABLE = "Shops";
const SHOP_PRODUCTS_GROUP = "ShopProducts";
const SHOP_ORDERS_GROUP = "ShopOrders";

/* Queries */
// Getters
const GetProducts = `
  SELECT ${PRODUCTS_TABLE}.Id, ProductName As Name, Price, group_concat(${LINE_ITEMS_TABLE}.Id) As LineItemIds
    FROM ${PRODUCTS_TABLE}
    LEFT JOIN ${LINE_ITEMS_TABLE}
    ON ${PRODUCTS_TABLE}.Id = ${LINE_ITEMS_TABLE}.ProductId
`;

const GetOrders = `
  SELECT ${ORDERS_TABLE}.Id, Sum(Price * Quantity) As Value
    FROM ${ORDERS_TABLE}
      LEFT JOIN ${LINE_ITEMS_TABLE}
        ON ${ORDERS_TABLE}.Id = ${LINE_ITEMS_TABLE}.OrderId
    LEFT JOIN ${PRODUCTS_TABLE}
    ON ${LINE_ITEMS_TABLE}.ProductId = ${PRODUCTS_TABLE}.Id
`

const GetLineItems = `
  SELECT ${LINE_ITEMS_TABLE}.Id, OrderId, ProductId, Quantity, SUM(Price * Quantity) As Value
      FROM ${LINE_ITEMS_TABLE} LEFT JOIN ${PRODUCTS_TABLE}
      ON ${LINE_ITEMS_TABLE}.ProductId = ${PRODUCTS_TABLE}.Id
`

const GetShops = `
  SELECT Id,
         ShopName As Name,
         Products,
         group_concat(OrderId) As Orders
  FROM (SELECT Id,
               ShopName,
               group_concat(ProductId) As Products
        FROM ${SHOPS_TABLE}
        LEFT JOIN ${SHOP_PRODUCTS_GROUP}
        ON Id = ${SHOP_PRODUCTS_GROUP}.ShopId
        GROUP BY Id)
  LEFT JOIN ${SHOP_ORDERS_GROUP}
  ON Id = ${SHOP_ORDERS_GROUP}.ShopId
`;

const GetShopProducts = `
  SELECT ${SHOPS_TABLE}.Id As ShopId,
    group_concat(ProductId) As ProductIds
  FROM ${SHOPS_TABLE}
    LEFT JOIN ${SHOP_PRODUCTS_GROUP}
      ON ${SHOPS_TABLE}.Id = ${SHOP_PRODUCTS_GROUP}.ShopId
`

const GetShopOrders = `
  SELECT ${SHOPS_TABLE}.Id As ShopId,
    group_concat(OrderId) As OrderIds
  FROM ${SHOPS_TABLE}
    LEFT JOIN ${SHOP_ORDERS_GROUP}
      ON ${SHOPS_TABLE}.Id = ${SHOP_ORDERS_GROUP}.ShopId
`

const queryStrings = {
  GetProducts,
  GetOrders,
  GetLineItems,
  GetShops,
  GetShopProducts,
  GetShopOrders
};

module.exports = queryStrings;
