export const createUpiPayment = async (lessons) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/upi`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lessons }),
    }
  );

  if (!res.ok) throw new Error("Payment failed");

  return res.json();
};
