import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";

export const bookTour = async (tourId) => {
  try {
   const stripe = await loadStripe('pk_test_51S2tfC3Ysshx6QExr1RxtOWk1wwdpSNGD7bDqcxgLGOnILv9feSOFmMyXBJZkPFd7hXla1ZmXfH9FMpsaWcXMkzR0087lWOoaQ');
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
 
    
    //await stripe.redirectToCheckout({
    //  sessionId: session.data.session.id,
    //});
 
    //works as expected
    window.location.replace(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};



// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";

// export const bookTour = async (tourId) => {
//   try {
//     // Load stripe instance each time (safe)
//     const stripe = await loadStripe("pk_test_...");

//     // Get checkout session
//     const { data } = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
//     console.log("Checkout session:", data);

//     // Redirect
//     await stripe.redirectToCheckout({
//       sessionId: data.session.id, // adjust if backend shape is different
//     });
//   } catch (err) {
//     console.error("Checkout error:", err);
//     showAlert("error", err.message || "Something went wrong");
//   }
// };




// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";

// export const bookTour = async (tourId) => {
//   try {
//     // 1) Initialize Stripe
//     const stripe = await loadStripe("pk_test_51S2tfC3Ysshx6QExr1RxtOWk1wwdpSNGD7bDqcxgLGOnILv9feSOFmMyXBJZkPFd7hXla1ZmXfH9FMpsaWcXMkzR0087lWOoaQ");
//     if (!stripe) {
//       console.error("❌ Stripe failed to initialize");
//       return;
//     }

//     // 2) Get checkout session from your API
//     const { data } = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
//     console.log("✅ Checkout session:", data);

//     // 3) Redirect to Checkout
//     const result = await stripe.redirectToCheckout({
//       // 👇 if backend sends { id: "cs_test_..." }
//       sessionId: data.session.id,
//     });

//     // 4) Handle errors (Stripe returns them inside `result`, not throw)
//     if (result.error) {
//       console.error("❌ Stripe redirect error:", result.error.message);
//       alert(result.error.message);
//     }
//   } catch (err) {
//     console.error("❌ Checkout failed:", err);
//     alert("Something went wrong, please try again.");
//   }
// };


// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("pk_test_YOUR_KEY");

// export const bookTour = async (tourId) => {
//   try {
//     // 1) Fetch Checkout Session from your backend
//     const { data } = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
//     console.log("Checkout session:", data);

//     // 2) Load Stripe instance
//     const stripe = await stripePromise;
//     if (!stripe) throw new Error("Stripe failed to load");

//     // 3) Redirect to Stripe Checkout
//     const result = await stripe.redirectToCheckout({
//       sessionId: data.session.id,
//     });

//     if (result.error) {
//       console.error("Stripe redirect error:", result.error.message);
//       alert(result.error.message);
//     }
//   } catch (err) {
//     console.error("Booking error:", err);
//     alert("Booking failed. Please try again.");
//   }
// };


