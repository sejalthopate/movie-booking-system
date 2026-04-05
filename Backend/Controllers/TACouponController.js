import Coupon from "../Models/TACouponModel.js";

// ADD COUPON
export const addCoupon = async (req, res) => {
  try {
    const existing = await Coupon.findOne({ code: req.body.code });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    console.error("Add coupon error:", err);
    res.status(500).json({ message: "Server error while adding coupon" });
  }
};

// GET COUPONS BY THEATRE & MOVIE
export const getCoupons = async (req, res) => {
  try {
    const { theatreId, movieId } = req.params;
    const coupons = await Coupon.find({ theatreId, movieId });
    res.status(200).json(coupons);
  } catch (err) {
    console.error("Get coupons error:", err);
    res.status(500).json({ message: "Server error while fetching coupons" });
  }
};

// UPDATE COUPON
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update coupon error:", err);
    res.status(500).json({ message: "Server error while updating coupon" });
  }
};

// DELETE COUPON
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Delete coupon error:", err);
    res.status(500).json({ message: "Server error while deleting coupon" });
  }
};
