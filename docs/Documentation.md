# Main Getter Methods

**Products**
----
  Returns data about the products in the database.

* **URL**

  /products

* **Method:**

  `GET`

*  **URL Params**

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"Name":"Product Name","Price":25,"LineItemIds":["1","2"]}]`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/products",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Orders**
----
  Returns data about the orders in the database.

* **URL**

  /orders

* **Method:**

  `GET`

*  **URL Params**

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"Value":25}]`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/orders",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Line Items**
----
  Returns data about the line items in the database.

* **URL**

  /lineItems

* **Method:**

  `GET`

*  **URL Params**

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"OrderId":1,"ProductId":1,"Quantity":1,"Value":25}`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/lineItems",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Shops**
----
Returns data about the shops in the database.

* **URL**

  /shops

* **Method:**

  `GET`

*  **URL Params**

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"Name":"Shop Name","Products":["1","2"],"Orders":["1","2"]}]`


* **Sample Call:**

```javascript
  $.ajax({
    url: "/shops",
    dataType: "json",
    type : "GET",
    success : function(r) {
      console.log(r);
    }
  });
```


# Get By Id

**Product**
----
  Returns data about a single product from the database.

* **URL**

  /product/[ID]

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `id=[Integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"Name":"Product Name","Price":25,"LineItemIds":["1","2"]}]`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/product/1",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```


**Order**
----
  Returns data about a single order from the database.

* **URL**

  /order/[ID]

* **Method:**

  `GET`

*  **URL Params**

   **Required:**

   `id=[Integer]`


* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"Value":25}]`


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/order/1",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Shop**
----
Returns data about the shops in the database.

* **URL**

  /shop/[ID]

* **Method:**

  `GET`

*  **URL Params**

     **Required:**

     `id=[Integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[{"Id":1,"Name":"Shop Name","Products":["1","2"],"Orders":["1","2"]}]`


* **Sample Call:**

```javascript
  $.ajax({
    url: "/shop/1",
    dataType: "json",
    type : "GET",
    success : function(r) {
      console.log(r);
    }
  });
```


# Value Creation

**Product**
----
  Adds a new product to the database under a given store.

* **URL**

  /product

* **Method:**

  `POST`

*  **URL Params**

     **Required:**

     `name=[String]`

     `price=[Integer]`

     `shopId=[Integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** [NEW PRODUCT ID]


* **Sample Call:**

  ```javascript
      $.post("/product", {
          shopId: 1,
          name: "Shop",
          price: 123
      });
  ```

**Order**
----
  Adds a new order to the database under a given store.

* **URL**

  /order

* **Method:**

  `POST`

*  **URL Params**

     **Required:**

     `shopId=[Integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** [NEW ORDER ID]


* **Sample Call:**

  ```javascript
      $.post("/order", {
          shopId: 1
      });
  ```


**Line Item**
----
  Adds a new line item to the database for a given product & order.

* **URL**

  /lineItem

* **Method:**

  `POST`

*  **URL Params**

   **Required:**

   `productId=[Integer]`

   `orderId=[Integer]`

   `quantity=[Integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** [NEW LINE ITEM ID]


* **Sample Call:**

  ```javascript
      $.post("/lineItem", {
          productId: 1,
          orderId: 1,
          quantity: 3
      });
  ```

**Shop**
----
  Adds a new shop to the database.

* **URL**

  /shop

* **Method:**

  `POST`

*  **URL Params**

   **Required:**

   `name=[String]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** [NEW STORE ID]


* **Sample Call:**

```javascript
    $.post("/shop", {
        name: "New Store Name"
    });
```
