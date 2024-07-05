import React from 'react'
const stripePromise = loadStripe("pk_test_51OvbsySJGZTRpG19ZsMQGO5eHcI9HnPR6cx30NV5eekMMdCylvKFydcCWN0wIL6qoKtGP3CmeucvU6OUZdNCOCLJ001VuA93Gu")
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useLocation } from 'react-router-dom';
import "./Payment.css"
import Checkoutpage from './Checkoutpage';

const Payment = () => {
//    const key = import.meta.env.VITE_STRIP
//    console.log(key)
const location =useLocation()
// console.log(location)
const price = location.state?.price;
    const cartItm = location.state?.itemId;
    console.log(cartItm, 'itm form payment');
    if (!price) {
        return <Navigate to="/dashboard/my-selected" replace />
    }
  return (
    <div className="my-40 stripe-custom-class">
    
   
    <Elements stripe={stripePromise}>
      <Checkoutpage price={price} cartItm={cartItm}/>

     
    </Elements>
    
</div>
  )
}

export default Payment