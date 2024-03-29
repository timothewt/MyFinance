# MyFinance <img src="https://img.shields.io/badge/version-1.0-blue.svg">
This WebApp is a real-time stocks investments tracker using React and Django.

***

## Features

<img src="https://i.ibb.co/RckRv9W/example.jpg" width="100%" alt="Homepage">

It has a complete authentication system with a sign-up and login page. Each user has a wallet assigned, that contains their stocks with the quantity and average price.<br/>
When the user enters the page, real-time data from the stock market is retrieved and displayed.<br/>
To add a stock, the user can add a transaction with the plus icon. This form appears:

<img src="https://camo.githubusercontent.com/d141a70b6ace514f3b72b0ea424cf456f40422a329629dc47e92e2c95f5afee6/68747470733a2f2f692e6962622e636f2f304a47397166342f7472616e73616374696f6e2d666f726d2e6a7067" width="30%" alt="Add a transaction form">

He first has to input the ticker of the stock, then it is validated by the backend, and the user can enter the 
complete transaction.<br/>
The trash can icon deletes the last entered transaction, which is highlighted when the button is hovered.
<br/>
Wallet shares are displayed with a pie chart.


The user can look up for infos (price evolution during the last 10 years, dividends rate, ...) of any stock.

***

## How to use

To run the app, clone the repo  first navigate to the project folder and install all the requirements with `pip install -r requirements.txt`.<br/>
Use `py backend/manage.py migrate`. Start the backend with `py backend/manage.py runserver`. <br/>
In another console instance, navigate to the frontend folder with `cd frontend`, and install react by using `npm install react-scripts` and `npm install recharts` (be sure to have npm installed).
In the same folder start the frontend with `npm start`.


Finally, open http://localhost:3000

***

## Built with
- Django 4.1.1, for the backend
- React 17.0.2, for the frontend
- Django REST framework 3.14.0, to communicate between the front and the back
- yfinance 0.1.74, to retrieve stocks data

***

## To Do
- Adapt values to currency depending on the exchange of the stock
