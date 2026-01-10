$(document).ready(function () {
  /* ===============================
     Active menu (URL-based)
     =============================== */
  const currentPath = window.location.pathname;

  $(".menu li a").each(function () {
    if ($(this).attr("href") === currentPath) {
      $(".menu li").removeClass("active");
      $(this).parent("li").addClass("active");
    }
  });

  /* ===============================
     Sidebar toggle (mobile)
     =============================== */
  $(".menu-btn").on("click", function () {
    $(".sidebar").toggleClass("hidden");
  });

  /* ===============================
     Logout
     =============================== */
  $("#logoutbtn").on("click", function (e) {
    e.preventDefault();

    fetch("/admin/logout", { method: "POST" })
      .then(() => (window.location.href = "/admin/login"))
      .catch((err) => console.error("Logout failed:", err));
  });

  
  
});
