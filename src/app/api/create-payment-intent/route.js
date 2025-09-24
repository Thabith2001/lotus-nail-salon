import Stripe from "stripe";
import convertToSubCurrency from "@/lib/convertToSubCurrency";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { amount } = await req.json();

        if (!amount) {
            return new Response(
                JSON.stringify({ error: "Amount is required" }),
                { status: 400 }
            );
        }

        if (amount < 0.5) {
            return new Response(
                JSON.stringify({ error: "Amount must be at least $0.50" }),
                { status: 400 }
            );
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: convertToSubCurrency(amount),
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return new Response(
            JSON.stringify({ clientSecret: paymentIntent.client_secret }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Stripe PaymentIntent error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}