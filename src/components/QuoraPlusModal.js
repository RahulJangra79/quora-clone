import { useState, useEffect } from "react";
import "../css/QuoraPlusModal.css";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import Swal from "sweetalert2";

function QuoraPlusModal({ isOpen, onClose, user }) {
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [prices, setPrices] = useState({ yearly: 0, monthly: 0 });
  const trialStartDate = new Date();
  const [daysLeft, setDaysLeft] = useState(getTrialDaysLeft(trialStartDate));

  useEffect(() => {
    const fetchPrices = async () => {
      const docRef = doc(db, "subscriptions", "pricing");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrices(docSnap.data());
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysLeft(getTrialDaysLeft(trialStartDate));
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = () => {
    const price = selectedPlan === "yearly" ? prices.yearly : prices.monthly;

    const options = {
      key: "rzp_test_hrZxVvTBohc9xJ",
      amount: price * 100,
      currency: "INR",
      name: "Quora+ Subscription",
      description: `${selectedPlan} plan`,
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Payment Successful",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        await updateDoc(doc(db, "users", user.uid), {
          isQuoraPlus: true,
          subscriptionPlan: selectedPlan,
          subscriptionDate: new Date().toISOString(),
        });
        onClose();
      },
      prefill: {
        name: user?.displayName || "Quora User",
        email: user?.email || "user@example.com",
        contact: "",
      },
      theme: {
        color: "#2e69ff",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isOpen ? (
    <div className="quora-plus-overlay" onClick={onClose}>
      <div className="quora-plus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">Try Quora+</h2>
        <p className="description">
          Browse Quora ad-free. Unlock millions of answers. Try free for 30
          days.
        </p>

        <div className="plan-options">
          <div
            className={`plan ${selectedPlan === "yearly" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("yearly")}
          >
            <h3>₹{prices.yearly}/yr</h3>
            <p>Save 43%</p>
          </div>
          <div
            className={`plan ${selectedPlan === "monthly" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <h3>₹{prices.monthly}/mo</h3>
            <p>Billed monthly</p>
          </div>
        </div>

        <p className="trial-text">
          {daysLeft} days left in trial. Ends on{" "}
          {getRenewalDate(trialStartDate)}.
        </p>

        <p className="total-price">
          Total after trial: ₹
          {selectedPlan === "yearly" ? prices.yearly : prices.monthly}
        </p>

        <button className="subscribe-btn" onClick={handleSubscribe}>
          Try 30 Days Free
        </button>

        <p className="terms">
          By signing up, you agree to Quora’s <a href="#">Subscriber Terms</a>.
        </p>
      </div>
    </div>
  ) : null;
}

function getTrialDaysLeft(startDate) {
  const today = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  const diff = endDate - today;
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}

function getRenewalDate(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  return endDate.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default QuoraPlusModal;
