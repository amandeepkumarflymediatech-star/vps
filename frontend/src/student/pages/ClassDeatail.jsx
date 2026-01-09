import { useEffect, useState } from "react";
import { getClassById } from "../../api/classes.api";

export default function ClassDetail({ id }) {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await getClassById(id // ✅ SENT TO API
        );
        setClassData(res.data.data);
      } catch (err) {
        setError("Failed to load class details");
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!classData) return <p className="p-6">No class found</p>;

  const finalPrice = classData.price ?? classData.courseId?.price ?? 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{classData.title}</h1>

      <p className="text-gray-600 mb-4">
        Course: <strong>{classData.courseId?.title}</strong>
      </p>

      <p className="mb-4">{classData.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Instructor</h3>
          <p>{classData.instructorId?.name}</p>
          <p className="text-sm text-gray-500">
            {classData.instructorId?.email}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Price</h3>
          <p className="text-xl font-bold">₹{finalPrice}</p>
        </div>
      </div>

      <div className="mt-6 border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Schedule</h3>
        <ul className="space-y-2">
          {classData.schedule?.map((s, index) => (
            <li key={index} className="flex justify-between">
              <span>{s.day}</span>
              <span>
                {s.startTime} - {s.endTime}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border rounded-xl p-4">
        <h3 className="font-semibold mb-2">Duration</h3>
        <p>
          {new Date(classData.startDate).toDateString()} –{" "}
          {new Date(classData.endDate).toDateString()}
        </p>
      </div>

      {classData.meetingLink && (
        <div className="mt-6">
          <a
            href={classData.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Join Live Class
          </a>
        </div>
      )}
    </div>
  );
}
