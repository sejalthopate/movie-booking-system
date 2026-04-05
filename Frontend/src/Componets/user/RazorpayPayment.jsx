import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAppLanguage } from "../../i18n/useAppLanguage";

const paymentText = {
  English: {
    title: "Movie Ticket Payment",
    ticketBooked: "Ticket Booked",
    generateQR: "Generate QR",
    scanAndPay: "Scan & Pay",
    processing: "Processing Payment...",
    timeLeft: (timer) => `Time Left: ${timer}s`,
    bookedSuccess: "Ticket Booked Successfully!",
    bookingId: "Booking ID",
    user: "User",
    movie: "Movie",
    theatre: "Theatre",
    seats: "Seat(s)",
    time: "Time",
    date: "Date",
    amount: "Amount",
    enjoy: "Enjoy Your Movie",
    unknownMovie: "Unknown Movie",
    unknownTheatre: "Unknown Theatre",
    guest: "Guest",
    notSelected: "Not selected",
  },
  Hindi: {
    title: "मूवी टिकट पेमेंट",
    ticketBooked: "टिकट बुक हो गई",
    generateQR: "QR बनाएं",
    scanAndPay: "स्कैन करें और भुगतान करें",
    processing: "पेमेंट प्रोसेस हो रहा है...",
    timeLeft: (timer) => `बाकी समय: ${timer} सेकंड`,
    bookedSuccess: "टिकट सफलतापूर्वक बुक हो गई!",
    bookingId: "बुकिंग आईडी",
    user: "यूज़र",
    movie: "फिल्म",
    theatre: "थियेटर",
    seats: "सीटें",
    time: "समय",
    date: "तारीख",
    amount: "राशि",
    enjoy: "अपनी फिल्म का आनंद लें",
    unknownMovie: "अज्ञात फिल्म",
    unknownTheatre: "अज्ञात थियेटर",
    guest: "गेस्ट",
    notSelected: "चयनित नहीं",
  },
  Marathi: {
    title: "चित्रपट तिकीट पेमेंट",
    ticketBooked: "तिकीट बुक झाले",
    generateQR: "QR तयार करा",
    scanAndPay: "स्कॅन करा आणि पेमेंट करा",
    processing: "पेमेंट प्रक्रिया सुरू आहे...",
    timeLeft: (timer) => `शिल्लक वेळ: ${timer} सेकंद`,
    bookedSuccess: "तिकीट यशस्वीपणे बुक झाले!",
    bookingId: "बुकिंग आयडी",
    user: "युजर",
    movie: "चित्रपट",
    theatre: "थिएटर",
    seats: "सीट्स",
    time: "वेळ",
    date: "तारीख",
    amount: "रक्कम",
    enjoy: "तुमच्या चित्रपटाचा आनंद घ्या",
    unknownMovie: "अज्ञात चित्रपट",
    unknownTheatre: "अज्ञात थिएटर",
    guest: "गेस्ट",
    notSelected: "निवडलेले नाही",
  },
};

export default function RazorpayPayment() {
  const { state } = useLocation();
  const { appLanguage } = useAppLanguage();
  const text = paymentText[appLanguage] || paymentText.English;

  const bookingData =
  state ||
  JSON.parse(localStorage.getItem("bookingData") || "{}");
  const {
    movieName = text.unknownMovie,
    theatreName = text.unknownTheatre,
    user = text.guest,
    seats = [],
    time = "",
    date = "",
    total = 0,
  } = bookingData;

  const [qrUrl, setQrUrl] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [timer, setTimer] = useState(0);
  const [success, setSuccess] = useState(false);

  const generateQR = () => {
    if (success) return;

    const fakeBookingId = `BOOK${Date.now()}`;
    const testPaymentLink = `https://rzp.io/i/test_payment_${fakeBookingId}`;

    setQrUrl(testPaymentLink);
    setBookingId(fakeBookingId);
    setTimer(10);
    setSuccess(false);
  };

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }

    if (timer === 1) {
      setTimeout(() => setSuccess(true), 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f0f0, #d9e4f5)",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2>{text.title}</h2>

        <button
          onClick={generateQR}
          disabled={success}
          style={{
            padding: "12px 25px",
            margin: "20px 0",
            backgroundColor: success ? "#aaa" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: success ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {success ? text.ticketBooked : text.generateQR}
        </button>

        {qrUrl && !success && (
          <>
            <h3>{text.scanAndPay}</h3>
            <div
              style={{
                background: "#f9f9f9",
                padding: "20px",
                borderRadius: "12px",
                display: "inline-block",
              }}
            >
              <QRCode value={qrUrl} size={200} />
            </div>
            <p>{text.processing}</p>
            {timer > 0 && <h3 style={{ color: "orange" }}>{text.timeLeft(timer)}</h3>}
          </>
        )}

        {success && (
          <div
            style={{
              marginTop: "20px",
              background: "#e6fffa",
              padding: "20px",
              borderRadius: "10px",
              color: "#065f46",
              textAlign: "left",
            }}
          >
            <h3 style={{ textAlign: "center" }}>{text.bookedSuccess}</h3>
            <hr />
            <p><b>{text.bookingId}:</b> {bookingId}</p>
            <p><b>{text.user}:</b> {user}</p>
            <p><b>{text.movie}:</b> {movieName}</p>
            <p><b>{text.theatre}:</b> {theatreName}</p>
            <p><b>{text.seats}:</b> {seats.length > 0 ? seats.join(", ") : text.notSelected}</p>
            <p><b>{text.time}:</b> {time}</p>
            <p><b>{text.date}:</b> {date}</p>
            <p><b>{text.amount}:</b> Rs.{total}</p>
            <hr />
            <p style={{ textAlign: "center", fontWeight: "bold" }}>{text.enjoy}</p>
          </div>
        )}
      </div>
    </div>
  );
}