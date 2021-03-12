# Back-end Assessment for Speer Technologies

## Build a Stock Market Tracking System  

### Application Checklist
- Supports User Registration, User Login, and User Logout with added validation
- Supports session persistence using Cookies and session based authorization
- Users are able to load and unload Wallet
- Users are able to buy and sell stocks, linked to the users wallet
- Users are able to add and remove stocks to a watchlist and get live updates on intraday data
- Users are able to see the stocks they buy and sell in a portfolio
- Robust Error Handling using a Custom ApiError Class and an error handler middleware to catch all errors
- All async operations are wrapped in a try, catch block
- Implements a Model-View-Controller design pattern, minus the View
- Implements Separation of Concern for ease of testing and scalability

### Getting Started
This application requires the Nodejs, MongoDB, and Redis runtime environments be installed locally. For the sake of this exercise, I have added the environment variables in [dev.env](./dev.env).  
First start by cloning this repository, making sure Node, MongoDB, and Redis are installed and running locally. Next install at dependencies by running the command `npm install`.
Now everything should be configured through the [dev.env](./dev.env) file.  
By running the command `npm run dev`, the server should start up locally on localhost:3000 where you can access certain endpoints, where most endpoints require authentication.

### Dependencies
- Express.js Server
- Express Sessions and Setting Cookies
- MongoDB Databasing / Redis Caching
- Axios/Cheerio for Web Scraping Financial Data from Yahoo Finance
- Bcryptjs for hashing and storing passwords

### Bugs and Potential Errors  
Due to a time constraint the server-side application has not been tested yet. However, the functionality of the app has been tested using Postman and all endpoints behave according to design.

Currently there has been one bug that I was unable to fix. When buying a stock, the user is unable to buy a stock unless it has already been added into the watchlist. The user is required to add it into their watchlist before trying to buy the stock.

Lastly, to save time, I opted in using Web Scraping tools to fetch Stock Prices from Yahoo Finance. I created a quick and dirty script that fetches the data. There are potentially 2 problems with this implementation. First, it is a slow solution. The current architecture fetches the data via Web Scraping then does manipulation before saving it into the MongoDB database, and then finally hitting the Client. Second, as a rule of thumb, I do not like to web scrape too frequently or in large volumes. As a result this means that the user must manually ask for the data, as opposed to the data updating on a timer function. This becomes a challenge when working with real-time data like stock prices and my implementation is no where near scalable currently.

### License

The MIT License (MIT)

Copyright 2020 Chris Kim

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, ITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.