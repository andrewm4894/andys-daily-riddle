import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingAnimation } from '@/components/LoadingAnimation';

// Initialize Stripe with the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key. Please add VITE_STRIPE_PUBLIC_KEY to your environment variables.');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// CheckoutForm component handles the payment submission
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setPaymentError(error.message || 'An unexpected error occurred');
      toast({
        title: "Payment Failed",
        description: error.message || 'Payment could not be processed',
        variant: "destructive",
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, call the API to generate a riddle
      try {
        const response = await apiRequest('POST', '/api/generate-paid-riddle', {
          paymentIntentId: paymentIntent.id
        });
        
        if (response.ok) {
          toast({
            title: "Success",
            description: "Your riddle has been generated!",
          });
          // Redirect to home page to see the new riddle
          setLocation('/');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to generate riddle');
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || 'We could not generate a riddle. Please try again.',
          variant: "destructive",
        });
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {paymentError && (
        <div className="text-red-500 text-sm">{paymentError}</div>
      )}
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Generate Riddle for $1"}
      </Button>
    </form>
  );
};

// Checkout page that creates a payment intent and loads the Stripe Elements
export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Create a payment intent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const res = await apiRequest('POST', '/api/create-payment-intent');
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to initialize');
        }
        
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }
    };

    createPaymentIntent();
  }, []);

  if (error) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Error</CardTitle>
            <CardDescription className="text-center text-red-500">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container max-w-md mx-auto py-12 flex justify-center">
        <LoadingAnimation message="Preparing form..." />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Generate a New Riddle</CardTitle>
          <CardDescription className="text-center">
            Generate a unique, AI-powered riddle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}