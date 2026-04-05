import express from "express";
import {
  getSummaryReport,
  getDateWiseReport,
  getMovieWiseReport,
  getTheatreReport,
  getTimeSlotReport ,
  getPopularMovieGraph,
  getDateWiseBookingGraph,
  getMovieRevenueGraph,
  getNewUsersToday,
  getActiveUsers,
  getCancelledBookings,
getFilteredBookings
} from "../Controllers/ReportController.js";

const reportRouter = express.Router();

reportRouter .get("/summary", getSummaryReport);
reportRouter .get("/movie-wise", getMovieWiseReport);
reportRouter.get("/date-wise", getDateWiseReport);
reportRouter.get("/theatre-wise", getTheatreReport);

reportRouter.get("/time-slot", getTimeSlotReport);
reportRouter.get("/graph/movie-wise", getMovieRevenueGraph);
reportRouter.get("/graph/date-wise", getDateWiseBookingGraph);
reportRouter.get("/graph/popular-movie", getPopularMovieGraph);
reportRouter.get("/user-activity/new-users", getNewUsersToday);
reportRouter.get("/user-activity/active-users", getActiveUsers);
reportRouter.get("/user-activity/cancelled-bookings", getCancelledBookings);
reportRouter.get("/user-activity/filter", getFilteredBookings);
export default reportRouter ;
