
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import  userRouter from "./Routes/UserRoutes.js";
import movieRouter from "./Routes/MovieRoutes.js";
import theaterRouter from "./Routes/TheaterRoute.js";
import showRouter from "./Routes/ShowRoutes.js";
import AdminUserRouter from "./Routes/AdminUserRoutes.js";
import bookingRouter from "./Routes/BookingRoutes.js";
// import paymentRoutes from "./Routes/paymentRoutes.js";
import snackRouter from "./Routes/SnackRoutes.js"
import seatRouter from "./Routes/SeatRoutes.js"
import personRouter from "./Routes/PersonRoutes.js";
//import ThreaterAdminSeatApi from "./Routes/TheatreAdminSeatRoutes.js";
import couponRouter from "./Routes/TACouponRoutes.js";
import TATicketPricingRoute from "./Routes/TATicketPricingRoute.js"
import TAReportRoute from "./Routes/TAReportRoute.js"
//import TABookingRoute from "./Routes/TABookingRoute.js"
//import TANotificationRoute from "./Routes/TANotificationRoute.js";
//import TASeatRoutes from "./Routes/TASeatRoute.js";
// import bookingRoutes from "./Routes/TABookingRoute.js";
import reportRouter from "./Routes/ReportRoutes.js";
dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes


app.use("/api/admin",AdminUserRouter);


app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres",theaterRouter);
app.use("/api/shows", showRouter);
app.use("/api/bookings",bookingRouter);
app.use("/api/snacks", snackRouter);
app.use("/api/seats", seatRouter);   
app.use("/api/persons", personRouter);
// app.use("/api/payment", paymentRoutes);
//app.use("/api/SeatShow", ThreaterAdminSeatApi);
app.use("/api/coupon", couponRouter);
app.use("/api/tickets", TATicketPricingRoute);
app.use("/api/report",TAReportRoute);
//app.use("/api/notifications", TANotificationRoute);
//app.use("/api/tabooking",TABookingRoute);
//app.use("/api/taseats", TASeatRoutes);
// app.use("/api/tabookings", bookingRoutes);
app.use("/api/reports", reportRouter );
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

