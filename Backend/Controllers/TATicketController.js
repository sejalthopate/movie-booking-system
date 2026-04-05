import TicketPricing from "../Models/TATicketPricingModel.js";

// ✅ GET ALL PRICING
export const getTickets = async (req, res) => {
  try {
    const tickets = await TicketPricing.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD PRICING (movie + screen + seatType)
export const addTicket = async (req, res) => {
  try {
    const { movieName, screen, seatType, price } = req.body;

    if (!movieName || !screen || !seatType || !price) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ❌ duplicate pricing check
    const exists = await TicketPricing.findOne({
      movieName,
      screen,
      seatType,
    });

    if (exists) {
      return res.status(400).json({
        message: "Pricing already exists for this movie & seat type",
      });
    }

    const ticket = await TicketPricing.create({
      movieName,
      screen,
      seatType,
      price,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PRICING
export const updateTicket = async (req, res) => {
  try {
    const { movieName, screen, seatType, price } = req.body;

    const updated = await TicketPricing.findByIdAndUpdate(
      req.params.id,
      { movieName, screen, seatType, price },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE PRICING
export const deleteTicket = async (req, res) => {
  try {
    await TicketPricing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
