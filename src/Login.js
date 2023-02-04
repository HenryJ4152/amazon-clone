import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
// v6: useHistory -> useNavigate
import { auth } from './firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = e => {
    e.preventDefault()

    //firebase login
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        if (userCredential) {
          // const user = userCredential.user
          navigate('/')
        }
      })
      .catch(error => alert(error.message))
  }

  const register = e => {
    e.preventDefault()
    console.log(111111111);
    createUserWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        console.log(auth);
        if (auth) {
          // history.push('/')
          //v6
          navigate('/')
        }
      })
      .catch(error => alert(error.message))
    //firebase register
  }

  return (
    <div className='login'>
      <Link to={'/'}>
        <img
          className='login__logo' src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" alt="" />
      </Link>

      <div className="login__container">
        <h1>Sign in</h1>

        <form>
          <h5>E-mail</h5>
          <input type="text" value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input type="password" value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type='submit'
            onClick={signIn}
            className='login__signInButton'>Sign In
          </button>

          <p>
            By signing-in you agree to the AMAZON CLONE Conditions of Use & Sale. Please
            see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.

          </p>

          <button onClick={register}
            className='login__registerButton'>
            Create Amazon account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login