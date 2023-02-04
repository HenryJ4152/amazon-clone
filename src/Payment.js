import React, { useEffect, useState } from 'react'
import CheckoutProduct from './CheckoutProduct'
import './Payment.css'
import { useStateValue } from './StateProvider'
import { Link, useNavigate } from 'react-router-dom'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import CurrencyFormat from 'react-currency-format'
import { getBasketTotal } from './reducer'
import axios from './axios'
import { db } from './firebase'
import { doc, setDoc } from 'firebase/firestore'

function Payment() {

  const navigate = useNavigate()

  const [{ basket, user }, dispatch] = useStateValue()

  const stripe = useStripe()
  const elements = useElements()

  const [succeeded, setSucceeded] = useState(false)
  const [processing, setProcessing] = useState("")
  const [error, setError] = useState(null)
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState(true)

  useEffect(() => {
    //generate the special stripe secret which allows to charge a customer
    const getClientSecret = async () => {
      console.log('getClientSecret');
      console.log('getBasketTotal(basket) ' + Math.trunc(getBasketTotal(basket) * 100))
      const response = await axios({
        method: 'post',
        url: `/payments/create?total=${Math.trunc(getBasketTotal(basket) * 100)}`
        //stripe expects total in currency's subunits so multiple by 100 cents
      });
      // console.log('response.data >>>' + response.data);
      setClientSecret(response.data.clientSecret)
    }

    getClientSecret()
  }, [basket])

  console.log('secret is ' + clientSecret);

  const handleSubmit = async (event) => {
    // do all the stripe stuff
    event.preventDefault()
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    }).then(({ paymentIntent }) => {
      //paymentIntent = payment confirmation
      // console.log(user);
      // console.log(user?.uid);

      setDoc(doc(db, 'users', user?.uid, 'orders', paymentIntent.id), {
        basket: basket,
        amount: paymentIntent.amount,
        created: paymentIntent.created
      })

      console.log('paymentIntent = ', paymentIntent);
      setSucceeded(true)
      setError(null)
      setProcessing(false)

      dispatch({
        type: 'EMPTY_BASKET'
      })

      navigate('/orders', { replace: true })
    })

  }

  const handleChange = event => {
    //listen for changed in CardElement and display error in their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : "")
  }

  return (
    <div className='payment'>
      <div className='payment__container'>

        <h1>
          Checkout (
          <Link to="/checkout">{basket.length} items</Link>
          )

        </h1>



        {/* section - delivery address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>333 React Lane</p>
            <p>Antartica, Gaia</p>
          </div>
        </div>
        {/* review items */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map(item => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <h3>Order total: {value}</h3>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>

              {/* error */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Payment