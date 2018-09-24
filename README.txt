This is my submission for the Shopify Developer Intern Challenge, 2018.

To install, run the command:
  npm install

To run, start the program main.js in node:
  node main.js

Documentation is available in the directory /docs

The API can be neatly formatted if the query ?pretty is passed into any url;
  for example, /orders?pretty provides the orders in pretty formatting.

I was working on implementing CRUD operations but ran out of time;
  Currently, the Create & Read operations are implemented, but Update & Delete
  are not.

Please note that the database should be already filled with data (from /database/db.sql);
  However, if the data does not get loaded correctly, it can be reinitialized by uncommenting
  the Initialization portion of main.js.

Code was developed using Express (along with the body-parser middleware) for the API
 & SQLite for the database.

All code written by Sean Hodges
