import StatsCard from "../components/StatsCard";
import TutorCard from "../components/TutorCard";

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    icon: "📅",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Active Tutors",
    value: "5",
    icon: "🧑‍🏫",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Wallet Balance",
    value: "₹1,250",
    icon: "💰",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Completed Sessions",
    value: "34",
    icon: "🎯",
    color: "bg-purple-100 text-purple-600",
  },
];

const recentBookings = [
  {
    id: 1,
    tutor: "Rahul Sharma",
    subject: "Mathematics",
    date: "25 Sep 2025",
    status: "Upcoming",
  },
  {
    id: 2,
    tutor: "Anita Verma",
    subject: "English",
    date: "20 Sep 2025",
    status: "Completed",
  },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here’s what’s happening with your learning today
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <StatsCard key={index} {...item} />
        ))}
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Bookings
          </h2>
          <button className="text-sm text-[#0852A1] font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-2">Tutor</th>
                <th className="text-left py-2">Subject</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b last:border-none">
                  <td className="py-3">{booking.tutor}</td>
                  <td>{booking.subject}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPULAR TUTORS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Popular Tutors
          </h2>
          <button className="text-sm text-[#0852A1] font-medium">
            Explore Tutors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TutorCard
            name="Rahul Sharma"
            subject="Mathematics"
            rating={4.8}
          />
          <TutorCard
            name="Anita Verma"
            subject="English"
            rating={4.6}
          />
          <TutorCard
            name="Amit Singh"
            subject="Science"
            rating={4.7}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
