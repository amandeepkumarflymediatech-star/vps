// Map lesson number to price
const lessonPricing = {
  8: 2830,
  12: 3530,
  16: 4720,
};

// POST /api/payment/upi
export const createUpiPayment = (req, res) => {
  try {
    const { lessons } = req.body;

    if (!lessons || !lessonPricing[lessons]) {
      return res.status(400).json({ message: "Invalid lesson plan" });
    }

    const amount = lessonPricing[lessons];

    // Optionally: create a payment record in DB here

    return res.status(200).json({ amount, lessons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
