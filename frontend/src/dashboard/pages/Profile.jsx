import { useState } from "react";

const Profile = () => {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    plan: "Pro Member",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    alert("✅ Profile updated successfully");

    // 🔥 API READY
    // profileApi.update(profile)
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your personal information
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-[#0852A1] text-white px-4 py-2 rounded-lg text-sm"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* COVER */}
        <div className="h-28 bg-gradient-to-r from-[#0852A1] to-blue-400"></div>

        {/* CONTENT */}
        <div className="p-6">
          <div className="flex items-center gap-6 -mt-16">
            {/* AVATAR */}
            <div className="w-28 h-28 rounded-full bg-white p-1 shadow">
              <img
                src="https://i.pravatar.cc/150"
                alt="User"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* BASIC INFO */}
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                {profile.plan}
              </span>
            </div>
          </div>

          {/* FORM */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                disabled={!editing}
                value={profile.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                disabled={!editing}
                value={profile.phone}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Subscription
              </label>
              <input
                type="text"
                disabled
                value={profile.plan}
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              Change Password
            </button>
            <button className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              Logout from all devices
            </button>
            <button className="text-red-600 text-sm hover:underline">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
