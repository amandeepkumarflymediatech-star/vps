import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Book Now", path: "/dashboard/book" },
  { name: "Tutors", path: "/dashboard/tutors" },
  { name: "Profile", path: "/dashboard/profile" },
  { name: "Payments", path: "/dashboard/payments" },
  { name: "FAQ", path: "/dashboard/faq" },
];

const Sidebar = () => (
  <aside className="w-64 bg-white shadow">
    <h2 className="text-xl font-bold p-5 text-[#0852A1]">English Raj</h2>
    {menu.map((item) => (
      <NavLink
        key={item.name}
        to={item.path}
        className="block px-6 py-3 hover:bg-blue-50"
      >
        {item.name}
      </NavLink>
    ))}
  </aside>
);

export default Sidebar;
