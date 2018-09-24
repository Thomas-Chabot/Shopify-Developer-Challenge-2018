/*
  This module controls working with the database. It features methods for
    inserting data, fetching data & recreating the database.

  The module exports a single value, through module.Database, which exports
   the Database object.

  Before the module can be used, it has to be constructed & the connect() method
   must be called. See more details below.

  CONSTRUCTOR ()
    Takes no arguments. Returns a Database object, capable of controlling the database.

  DATABASE SETUP - Main methods, database setup
    connect (databaseUrl : String) : Promise()
      Purpose: Connects the Database object to the database.
               Must be called before any other methods.
      Arguments:
        databaseUrl : The URL of the database to connect to. Defaults to internal memory;
                        otherwise, supports a path to a file to be used.
      Return Value:
        A Promise. The calling code should wait for this promise to complete before
          running any methods; this will confirm the database has been connected.

    release() : Promise()
      Purpose: Should be called when the database is to be removed.
               Closes off the connection to the database.
      Arguments: None
      Return Value: Promise; Completes when the connection has closed.

    initialize() : Promise()
      Purpose: Initializes the database. This creates the underlying tables
                for storing data in the database.
      Arguments: None
      Return Value:
        Promise; Completes once all tables are created & ready to be used.

  GETTERS - Retrieves data from the database
    getProducts (pageNumber : Integer) : Product[]
      Purpose: Fetches the products for the given page from the database.
      Arguments:
        pageNumber : The page number of products to fetch. Each page will contain
                       20 items, sorted by ID.
      Return Value: Product[]. The products for the given page (at most 20).

    getOrders(pageNumber : Integer) : Order[]
      Purpose: Fetches the orders from the database.
      Arguments:
        pageNumber: The page of orders to fetch.
      Returns: Order[]. The list of orders from the given page (at most 20).

    getLineItems(pageNumber : Integer) : LineItem[]
      Purpose: Retrieves the Line Items for the given page from the database.
      Arguments:
        pageNumber: The page number to fetch.
      Returns: LineItem[]. The line items for the given page, at most 20.

    getShops(pageNumber : Integer) : Shop[]
      Purpose: Retrieves the Shops for the given page from the database.
      Arguments:
        pageNumber: The page number to fetch from.
      Returns: Shop[]. The Shops for the given page (at most 20).

  CREATION - Adds new items to the database
    createProduct (name : String, price : Integer) : Promise(Id : Integer)
      Purpose: Creates a new Product of the given name & price.
      Returns: A Promise. Will be passed the ID of the new product.
    createOrder () : Promise(Id : Integer)
      Purpose: Creates a new Order.
      Returns: A promise; will be resolved with the new order's ID.
    createLineItem (productId : Integer, orderId : Integer, quantity : Integer) : Promise(Id : Integer)
      Purpose: Creates a new line item for the given product, order & quantity.
      Arguments:
        productId: The product to map the line item to;
        orderId: The order for which the line item will be created;
        quantity: The number of products being purchased in the order.
      Returns: Promise. Resolves with the ID of the line item.
    createShop (name : String) : Promise (Id : Integer)
      Purpose: Creates a new shop with the given name.
      Returns: Promise. Will be resolved with the new shop's ID.

  CONNECTION - Connecting shops to their Products & Orders
    addProductToShop (shopId : Integer, productId : Integer) : Promise()
      Purpose: Connects the given shop to the given product, so that the product
                 will appear in the shop's list of products.
      Returns: Promise. Will be resolved on a successful operation.
    addOrderToShop (shopId : Integer, productId : Integer) : Promise()
      Purpose: Connects the given shop to the given order, so that the order
                 will appear in the shop's list of orders.
      Returns: Promise. Will be resolved when the order has been added to the
                shop's orders.

  Any methods with a name starting with _ are private & should not be used
   externally.
*/

const sqlite3 = require ("sqlite3");
const Promises = require ("../Promises.js").Promises;
const QueryStrings = require ("./QueryStrings.js");

const database = ":memory:";

const DEFAULT_RESULTS_PER_PAGE = 20;

const PRODUCTS_TABLE = "Product";
const ORDERS_TABLE = "Orders";
const LINE_ITEMS_TABLE = "LineItem";

const PRODUCT_LINE_ITEMS = "ProductLineItems";
const ORDER_LINE_ITEMS = "OrderLineItems";

const SHOPS_TABLE = "Shops";
const SHOP_PRODUCTS_GROUP = "ShopProducts";
const SHOP_ORDERS_GROUP = "ShopOrders";

class Database {
  constructor() {
    this._connection = null;
    this._numResultsPerPage = DEFAULT_RESULTS_PER_PAGE;
  }

  // To be called on startup - Connects to the database
  connect(databaseUrl) {
    let database = databaseUrl || database;

    return new Promise ((fulfill, reject) => {
      this._connection = new sqlite3.Database(database, (err) => {
       if (err) reject (err);
       fulfill ();
     });
   });
  }

  // To be called when the program is done - releases the database connection
  release() {
    return new Promise ((fulfill, reject) => {
      this._connection.close((err) => {
        if (err) reject (err);
        else fulfill();
      });
    });
  }

  // To be called on first startup - Initializes the database
  initialize() {
    return Promises.chain ([
      ()=>this._createProductsTable(),
      ()=>this._createOrdersTable(),
      ()=>this._createLineItemsTable(),
      ()=>this._createShopsTable(),

      ()=>this._createShopProductsGroup(),
      ()=>this._createShopOrdersGroup()
    ]);
  }

  // Fetching
  getProducts(pageNumber) {
    return this._fetch (PRODUCTS_TABLE, QueryStrings.GetProducts, pageNumber);
  }
  getOrders(pageNumber) {
    return this._fetch (ORDERS_TABLE, QueryStrings.GetOrders, pageNumber)
  }
  getLineItems(pageNumber) {
    return this._fetch(LINE_ITEMS_TABLE, QueryStrings.GetLineItems, pageNumber);
  }
  getShops(pageNumber){
    return this._fetch(null, QueryStrings.GetShops, pageNumber);
  }
  getShopProducts(pageNumber){
    return this._fetch(SHOPS_TABLE, QueryStrings.GetShopProducts, pageNumber);
  }
  getShopOrders(pageNumber){
    return this._fetch(SHOPS_TABLE, QueryStrings.GetShopOrders, pageNumber);
  }

  // Get By Id
  getProductById(id){
    return this._getById (PRODUCTS_TABLE, QueryStrings.GetProducts, id);
  }
  getOrderById(id){
    return this._getById (ORDERS_TABLE, QueryStrings.GetOrders, id);
  }
  getShopById(id){
    return this._getById (null, QueryStrings.GetShops, id);
  }

  // Insertions
  createProduct(name, value){
    return this._insert (PRODUCTS_TABLE, "NULL", `'${name}'`, value);
  }
  createOrder(){
    return this._insert (ORDERS_TABLE, "NULL");
  }
  createLineItem(productId, orderId, quantity) {
    return this._insert (LINE_ITEMS_TABLE, "NULL", productId, orderId, quantity);
  }
  createShop(shopName){
    return this._insert (SHOPS_TABLE, "NULL", `'${shopName}'`);
  }

  // Connections
  addProductToShop(shopId, productId){
    return this._insert (SHOP_PRODUCTS_GROUP, shopId, productId);
  }
  addOrderToShop(shopId, orderId){
    return this._insert (SHOP_ORDERS_GROUP, shopId, orderId);
  }


  // Table Creation
  _createProductsTable() {
    return this._createTable (PRODUCTS_TABLE, `
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      ProductName varchar(255) NOT NULL,
      Price INTEGER
    `);
  }
  _createOrdersTable() {
    return this._createTable (ORDERS_TABLE, `
      Id INTEGER PRIMARY KEY AUTOINCREMENT
    `);
  }
  _createLineItemsTable() {
    return this._createTable (LINE_ITEMS_TABLE, `
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      ProductId INTEGER NOT NULL,
      OrderId INTEGER NOT NULL,
      Quantity INTEGER,

      FOREIGN KEY (ProductId) REFERENCES ${PRODUCTS_TABLE}(Id),
      FOREIGN KEY (OrderId) REFERENCES ${ORDERS_TABLE}(Id)
    `)
  }
  _createShopsTable() {
    return this._createTable (SHOPS_TABLE, `
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      ShopName varchar(255) UNIQUE NOT NULL
    `);
  }
  _createShopProductsGroup() {
    return this._createTable (SHOP_PRODUCTS_GROUP, `
      ShopId INTEGER NOT NULL,
      ProductId INTEGER NOT NULL,

      PRIMARY KEY (ShopId, ProductId),

      FOREIGN KEY (ShopId) REFERENCES ${SHOPS_TABLE}(Id),
      FOREIGN KEY (ProductId) REFERENCES ${PRODUCTS_TABLE}(Id)
    `)
  }
  _createShopOrdersGroup() {
    return this._createTable (SHOP_ORDERS_GROUP, `
      ShopId INTEGER NOT NULL,
      OrderId INTEGER NOT NULL,

      PRIMARY KEY (ShopId, OrderId),

      FOREIGN KEY (ShopId) REFERENCES ${SHOPS_TABLE}(Id),
      FOREIGN KEY (OrderId) REFERENCES ${ORDERS_TABLE}(Id)
    `)
  }


  // Helper methods - fetching data, inserting data, creating tables
  _fetch (tableName, selectionQuery, pageNumber) {
    if (!pageNumber) pageNumber = 0;

    let offset = pageNumber * this._numResultsPerPage;
    let limit = this._numResultsPerPage;

    let idQuery = this._getIdQuery(tableName)


    return this._query (`${selectionQuery}
      GROUP BY ${idQuery}
      ORDER BY ${idQuery}
      LIMIT ${limit}
      OFFSET ${offset}`);
  }
  _getById(tableName, selectionQuery, id) {
    let idQuery = this._getIdQuery(tableName);
    return this._query(`${selectionQuery}
      WHERE ${idQuery} = ${id}
    `);
  }
  _insert (tableName, ...values) {
    let valuesList = values.join(", ")
    return this._runInsert (`INSERT INTO ${tableName} VALUES(${valuesList});`);
  }
  _createTable (tableName, variables) {
    return this._query (`CREATE TABLE IF NOT EXISTS ${tableName} (${variables})`);
  }

  // Base methods for querying & inserting
  _runInsert (request) {
    // Has to be performed separately from a query;
    // That way, can return the new ID from the query
    return new Promise((fulfill, reject) => {
      this._connection.run (request, function (err) {
        if (err) reject(err);
        else {
          fulfill (this.lastID);
        }
      })
    });
  }
  _query (request, parameters) {
    if (!parameters) parameters = [ ];

    // Helper to query the server for a single request
    return new Promise ((fulfill, reject) => {
      let connection = this._connection;
      connection.all (request, parameters, function (err, result) {
        if (err)
          reject (err);
        else {
          fulfill (result);
        }
      });
    });
  }

  // get the ID query - how to find the ID
  _getIdQuery (tableName) {
    return (tableName == null) ? "Id" : `${tableName}.Id`
  }
}

module.exports.Database = Database;
