import express from "express";
import { addCoupon, getCoupons, updateCoupon, deleteCoupon } from "../Controllers/TACouponController.js";

const router = express.Router();

// Add new coupon
router.post("/add-coupon", addCoupon);

// Get coupons by theatreId and movieId
router.get("/get-coupon/:theatreId/:movieId", getCoupons);

// Update coupon
router.put("/update-coupon/:id", updateCoupon);

// Delete coupon
router.delete("/delete-coupon/:id", deleteCoupon);

export default router;
