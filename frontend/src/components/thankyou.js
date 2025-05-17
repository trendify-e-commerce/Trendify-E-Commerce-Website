import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Thank‑you page displayed after a successful checkout.
 * Retrieves the order details from localStorage, shows a concise summary,
 * and then clears the stored data so it isn’t leaked or shown again.
 */
export default function ThankYou() {
  const navigate = useNavigate();
  const [orderTotal, setOrderTotal] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to read the order information from localStorage
    try {
      const raw = localStorage.getItem("orderDetails");
      if (!raw) throw new Error("Missing order details");
      const parsed: { total: number } = JSON.parse(raw);
      setOrderTotal(parsed.total.toFixed(2));
      // Generate a simple pseudo‑random order number (e.g. ORD123456)
      setOrderNumber("ORD" + Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0"));
    } catch {
      // If anything goes wrong, surface an error message to the user
      setOrderTotal("Error: Order data not found");
      setOrderNumber("Error: Order data not found");
    }

    // Clean up – avoid leaking PII
    localStorage.removeItem("orderDetails");
  }, []);

  return (
    <>
      <Header />

      <section className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-3xl font-semibold">Thank You for Your Order!</h1>
        <p className="mt-2 text-lg text-gray-600">
          We appreciate your purchase and look forward to serving you again.
        </p>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-medium text-blue-600">Order Summary</h2>
          <p className="mt-4 text-gray-700">
            <strong>Order Number:</strong> <span>{orderNumber ?? "Loading..."}</span>
          </p>
          <p className="text-gray-700">
            <strong>Order Total:</strong> $<span>{orderTotal ?? "Loading..."}</span>
          </p>
          <p className="text-gray-700">
            <strong>Estimated Delivery Date:</strong> 3‑5 Business Days
          </p>
        </div>

        <div className="mt-10 text-left">
          <h3 className="text-xl font-semibold">What’s Next?</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>You’ll receive an email confirmation with your order details.</li>
            <li>Track your order through your account page.</li>
            <li>
              If you have any questions, feel free to {" "}
              <Link to="/contact" className="text-blue-600 hover:underline">
                contact us
              </Link>
              .
            </li>
          </ul>
        </div>
        <button onClick={() => navigate("/Home")} className="mt-8 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        > Return to Shop </button>
      </section>
    <Footer /> </>
  );
}