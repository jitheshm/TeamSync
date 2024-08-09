"use client"
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./Checkout";
import { string } from "zod";
// import "./App.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51PUVQpRsEcnIFbVXyhvSXV7ihZqEE5YO6BgPnWe3CmdO3rmik4WVzAmvlWNTdfHlOuCzgKO24u5Y8caOZ7WARnL700XKBuDF5v");

export default function Payment({clientSecret}) {
 

  

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full h-screen fixed  top-0 pt-36 overflow-y-scroll">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret}/>
        </Elements>
      )}
    </div>
  );
}