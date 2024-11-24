"use client"
import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

interface CheckoutFormProps {
  clientSecret: string;
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      console.log("client secret not found");
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          {
            console.log(paymentIntent);
            if (attempt > 0) {
              setMessage("Your payment was not successful, please try again.");
            }
            setAttempt(attempt + 1);
          }
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs"
  }

  return (
    <div className="max-w-lg mx-auto p-6  shadow-md rounded-lg bg-[#1a1919]">
      <h2 className="text-2xl font-semibold mb-4 text-center">Complete Your Payment</h2>
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className={`w-full py-2 px-4 rounded-md text-white ${isLoading || !stripe || !elements ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'
            } transition-colors`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner-border animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
          ) : (
            "Pay Now"
          )}
        </button>
        {message && (
          <div className={`text-center mt-4 p-2 rounded-md ${message.includes("succeeded") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}