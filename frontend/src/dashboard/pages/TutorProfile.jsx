import { useParams } from "react-router-dom";
import tutors from "../data/tutors";
import DashboardLayout from "../layout/DashboardLayout";

const TutorProfile = () => {
  const { id } = useParams();
  const tutor = tutors.find((t) => t.id === Number(id));

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold">{tutor.name}</h2>
      <p>⭐ {tutor.rating}</p>
    </DashboardLayout>
  );
};

export default TutorProfile;
