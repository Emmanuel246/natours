// import axios from 'axios';
// const stripe = Stripe('pk_test_51S2tfC3Ysshx6QExr1RxtOWk1wwdpSNGD7bDqcxgLGOnILv9feSOFmMyXBJZkPFd7hXla1ZmXfH9FMpsaWcXMkzR0087lWOoaQ');

// export const bookTour = async (tourId) => {

//     // 1) Get the checkout session from the server
//     const session = await axios(
//         `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
//     )
//     console.log(session);
//     // 2) Create checkout form + charge to credit card
// }

/* eslint-disable */
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

let stripe;
(async function () {
  stripe = await loadStripe(
    "pk_test_51S2tfC3Ysshx6QExr1RxtOWk1wwdpSNGD7bDqcxgLGOnILv9feSOFmMyXBJZkPFd7hXla1ZmXfH9FMpsaWcXMkzR0087lWOoaQ",
  );
})();

export const bookTour = async (tourId) => {
//   try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id,
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert("error", err);
//   }
};
