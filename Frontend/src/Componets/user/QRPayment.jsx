import React, { useState } from "react";
import { QRCode } from "qrcode.react";

function QRPayment() {
  const [qrUrl, setQrUrl] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState(250); // Example amount
  const [userName, setUserName] = useState("Swanandi");

  const generateQR = async () => {
    const res = await fetch("http://localhost:5000/api/payment/create-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, amount }),
    });

    const data = await res.json();
    setQrUrl(data.qrUrl);
    setBookingId(data.bookingId);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Movie Ticket Payment (Test Mode)</h2>
      <p>User: {userName}</p>
      <p>Amount: ₹{amount}</p>

      <button onClick={generateQR} style={{ padding: "10px 20px", margin: "20px" }}>
        Generate QR
      </button>

      {qrUrl && (
        <>
          <h3>Scan & Pay</h3>
          <QRCode value={qrUrl} size={250} />
          <p>Scan with UPI test ID: <strong>success@razorpay</strong></p>
        </>
      )}

      {bookingId && <p>Booking ID: {bookingId}</p>}
    </div>
  );
}

export default QRPayment;
