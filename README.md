# MyFinance <img src="https://img.shields.io/badge/version-1.0-blue.svg">
This WebApp is a real-time stocks investments tracker using React and Django.

***

## Features

<img src="https://i.ibb.co/KK20hFN/homepage.png" width="80%" alt="Homepage">

It has a complete authentication system with a sign-up and login page. Each user has a wallet assigned, that contains their stocks with the quantity and average price.<br/>
When the user enters the page, real-time data from the stock market is retrieved and displayed.<br/>
To add a stock, the user can add a transaction with the plus icon. This form appears:

<img src="https://i.ibb.co/0JG9qf4/transaction-form.png" width="30%" alt="Add a transaction form">

He first has to input the ticker of the stock, then it is validated by the backend, and the user can enter the 
complete transaction.<br/>
The trash can icon deletes the last entered transaction, which is highlighted when the button is hovered.

***

## How to use

To run the app, first navigate to the project folder and install all the requirements with `pip install -r requirements.txt`
, start the backend with `py backend/manage.py runserver` and the frontend with `cd frontend` then `npm start`.


Finally, open http://localhost:3000

***

## Built with
- Django 4.1.1, for the backend
- React 17.0.2, for the frontend
- Django REST framework 3.14.0, to communicate between the front and the back
- yfinance 0.1.74, to retrieve stocks data

***

## To Do
- Add a shares chart on the right
- Add a stock infos search with the price evolution on the right