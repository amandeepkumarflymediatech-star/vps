const Settings = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">

      <h2 className="text-xl font-semibold">Account Settings</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="border w-full p-2 rounded-lg" placeholder="Tutor Name" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="border w-full p-2 rounded-lg" placeholder="tutor@email.com" />
      </div>

      <button className="bg-[#0852A1] text-white px-6 py-2 rounded-lg">
        Save Changes
      </button>

    </div>
  );
};

export default Settings;
