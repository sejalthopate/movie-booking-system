import Movie from "../Models/Movie.js";
import TheaterModel from "../Models/TheaterModel.js";
import Booking from "../Models/Booking.js";
import { User } from "../Models/UserModel.js";
import mongoose from "mongoose";

/* ================================
   1️⃣ SUMMARY REPORT
================================ */
export const getSummaryReport = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await TheaterModel.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments({
  bookingStatus: "Booked"
});

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "Success" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      totalMovies,
      totalTheatres,
      totalUsers,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching summary report" });
  }
};

/* ================================
   2️⃣ MOVIE-WISE REPORT
================================ */
export const getMovieWiseReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
     {
  $match: { bookingStatus: "Booked" }
},
      {
        $group: {
          _id: "$movieId",
          totalBookings: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
    ]);

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching movie-wise report" });
  }
};
export const getDateWiseReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date)
      return res.status(400).json({ message: "Date required" });
const bookings = await Booking.find({
  date,
  bookingStatus: "Booked"
});

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    res.json({
      date,
      totalBookings,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Theatre Wise Booking Report
export const getTheatreReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      {
        $match: { bookingStatus: "Booked" }
      },
      {
        $group: {
          _id: "$theatreId",
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalShows: { $addToSet: "$time" }
        }
      },
      {
        $lookup: {
          from: "theatres",   // ✅ YOUR CORRECT COLLECTION NAME
          localField: "_id",
          foreignField: "_id",
          as: "theatre"
        }
      },
      {
        $unwind: {
          path: "$theatre",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          theatreName: {
            $concat: [
              { $ifNull: ["$theatre.location", "Unknown"] },
              ", ",
              { $ifNull: ["$theatre.city", ""] }
            ]
          },
          totalBookings: 1,
          totalRevenue: 1,
          totalShows: { $size: "$totalShows" }
        }
      }
    ]);

    res.json(report);
  } catch (err) {
    console.error("Theatre Report Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Time-slot Wise Booking Report
export const getTimeSlotReport = async (req, res) => {
  try {
    const bookings = await Booking.find({
  bookingStatus: "Booked"
});

    // Initialize time slots
    const slots = {
      morning: 0,      // 6 AM - 12 PM
      afternoon: 0,    // 12 PM - 4 PM
      evening: 0,      // 4 PM - 8 PM
      night: 0         // 8 PM - 12 AM
    };

    bookings.forEach(b => {
      const timeStr = b.time; // e.g., '10:00 AM'
      const [hourPart, minPart] = timeStr.split(":");
      const hour = parseInt(hourPart);
      const isPM = timeStr.toLowerCase().includes("pm");

      let hour24 = hour;
      if (isPM && hour !== 12) hour24 += 12;
      if (!isPM && hour === 12) hour24 = 0;

      if (hour24 >= 6 && hour24 < 12) slots.morning += 1;
      else if (hour24 >= 12 && hour24 < 16) slots.afternoon += 1;
      else if (hour24 >= 16 && hour24 < 20) slots.evening += 1;
      else slots.night += 1;
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getMovieRevenueGraph = async (req, res) => {
  try {
const bookings = await Booking.find({
  bookingStatus: "Booked"
}).populate("movieId", "title");

    const movieMap = {};

    bookings.forEach(b => {
      const movieTitle = b.movieId.title;
      if (!movieMap[movieTitle]) movieMap[movieTitle] = 0;
      movieMap[movieTitle] += b.totalAmount;
    });

    // Format for chart [{ movie: "Animal", revenue: 32000 }, ...]
    const data = Object.keys(movieMap).map(title => ({
      movie: title,
      revenue: movieMap[title]
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getDateWiseBookingGraph = async (req, res) => {
  try {
 const bookings = await Booking.find({
  bookingStatus: "Booked"
})

    const dateMap = {};

    bookings.forEach(b => {
      const date = b.date; // assume 'YYYY-MM-DD'
      if (!dateMap[date]) dateMap[date] = 0;
      dateMap[date] += 1;
    });

    const data = Object.keys(dateMap).sort().map(date => ({
      date,
      bookings: dateMap[date]
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getPopularMovieGraph = async (req, res) => {
  try {
   const bookings = await Booking.find({
  bookingStatus: "Booked"
}).populate("movieId", "title");

    const movieMap = {};

    bookings.forEach(b => {
      const movieTitle = b.movieId.title;
      if (!movieMap[movieTitle]) movieMap[movieTitle] = 0;
      movieMap[movieTitle] += b.seats.length;
    });

    const data = Object.keys(movieMap).map(title => ({
      movie: title,
      seatsBooked: movieMap[title]
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNewUsersToday = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({ createdAt: { $gte: today } });
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Example: Users with at least 1 booking in last 7 days
export const getActiveUsers = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const activeUsers = await Booking.distinct("userId", {
      createdAt: { $gte: lastWeek }
    });

    res.json({ count: activeUsers.length, users: activeUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getCancelledBookings = async (req, res) => {
  try {
    // Assume paymentStatus === "Failed" is cancelled
   const cancelled = await Booking.find({ bookingStatus: "Cancelled" });
    res.json({ count: cancelled.length, bookings: cancelled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getFilteredBookings = async (req, res) => {
  try {
    const { date, movieId, theatreId } = req.query;

    const filter = {};
    if (date) filter.date = date;
    if (movieId) filter.movieId = movieId;
    if (theatreId) filter.theatreId = theatreId;

    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .populate("movieId", "title")
      .populate("theatreId", "location");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
