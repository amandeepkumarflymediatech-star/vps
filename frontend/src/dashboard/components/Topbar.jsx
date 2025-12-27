const Topbar = () => (
  <div className="bg-white shadow px-6 py-4 flex justify-between">
    <h3 className="font-semibold">Welcome back 👋</h3>
    <button
      onClick={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}
      className="text-red-500"
    >
      Logout
    </button>
  </div>
);

export default Topbar;
