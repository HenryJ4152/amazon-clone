import './App.css';
import './Header.css'
import './Home.css'
import './Checkout.css'
import './Payment.css'
import './Orders.css'
import Header from './Header'
import Home from './Home'
import Checkout from './Checkout'
import Payment from './Payment'
import Login from './Login'
import Orders from './Orders'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React, { useEffect } from 'react';
import { auth } from './firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useStateValue } from './StateProvider'
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const promise = loadStripe(
  'pk_test_51Lnr8dIN4ErpUMnWx6aJ6V9d2cSGk1nhEnnHvM62fGXuR1WoKmD7QnPrDoNrDJk0NovBnmeCN4swCZugbCxunNdm006W6lTENF'
)




function App() {

  const [{ }, dispatch] = useStateValue()

  useEffect(() => {
    // will only run once when the app component loads...
    onAuthStateChanged(auth, (authUser) => {
      console.log('User is = ', authUser);

      if (authUser) {
        // user just logge din or was already in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
        console.log(authUser);

      } else {
        //user logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])

  return (
    <Router>
      <div className="app">

        <Routes>

          <Route path='/orders'
            element={<>
              <Header />
              <Orders />
            </>}
          />

          <Route path='/login'
            element={<>
              <Login />
            </>}
          />

          <Route path='/checkout'
            element={<>
              <Header />
              <Checkout />
            </>}
          />

          <Route path='/payment'
            element={<>
              <Header />
              <Elements stripe={promise}>
                <Payment />
              </Elements>

            </>}
          />

          <Route path='/'
            element={<>
              <Header />
              <Home />
            </>}
          />

        </Routes>
      </div>
    </Router >
  );
}

export default App;
