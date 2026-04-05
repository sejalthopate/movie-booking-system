import TABooking from "../Models/TAReportModel.js";
import mongoose from "mongoose";

export const getTAOverviewReport = async (req, res) => {
  try {
    const { startDate, endDate, movieId, theatreId, timeSlot } = req.query;

    let match = {};

    if (startDate && endDate) {
      match.showDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (movieId) match.movieId = new mongoose.Types.ObjectId(movieId);
    if (theatreId) match.theatreId = new mongoose.Types.ObjectId(theatreId);
    if (timeSlot) match.timeSlot = timeSlot;

    const report = await TABooking.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalSeats: { $sum: "$totalSeats" },
          bookedSeats: { $sum: "$bookedSeats" },
          shows: { $addToSet: "$timeSlot" },
        },
      },
      {
        $project: {
          _id: 0,
          totalBookings: 1,
          totalRevenue: 1,
          totalShows: { $size: "$shows" },
          seatOccupancy: {
            $cond: [
              { $eq: ["$totalSeats", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$bookedSeats", "$totalSeats"] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.json(
      report[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        totalShows: 0,
        seatOccupancy: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
