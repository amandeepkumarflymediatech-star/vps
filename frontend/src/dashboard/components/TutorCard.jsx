// import { Link } from "react-router-dom";

// const TutorCard = ({ tutor }) => (
//   <div className="bg-white p-5 rounded-xl shadow">
//     <h3 className="font-bold">{tutor.name}</h3>
//     <p>⭐ {tutor.rating}</p>
//     <Link
//       to={`/dashboard/tutors/${tutor.id}`}
//       className="text-[#0852A1]"
//     >
//       View Profile
//     </Link>
//   </div>
// );

// export default TutorCard;


const TutorCard = ({ name, subject, rating }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
      {/* Tutor Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#0852A1] text-white flex items-center justify-center font-bold text-lg">
          {name?.charAt(0)}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            {name || "Tutor Name"}
          </h3>
          <p className="text-sm text-gray-500">
            {subject || "Subject"}
          </p>
        </div>
      </div>

      {/* Rating + Action */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-yellow-500 font-medium">
          ⭐ {rating || "4.5"}
        </span>

        <button className="px-4 py-1.5 text-sm bg-[#0852A1] text-white rounded-lg hover:bg-blue-700">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TutorCard;
