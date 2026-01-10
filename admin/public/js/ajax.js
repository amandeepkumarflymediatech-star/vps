/* ===============================
   User Status Toggle
   =============================== */

// SweetAlert2 is already available as "Swal"

$(document).on("click", ".status-toggle", function () {
  const badge = $(this);
  const userId = badge.data("id");
  const currentStatus = badge.data("status"); 
  Swal.fire({
    title: "Change status?",
    text: "Do you want to update this user status?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (!result.isConfirmed) return;

    $.ajax({
      url: "/admin/users/toggle-status",
      type: "POST",
      data: {
        id: userId,
        status: currentStatus,
      },
      success: function (res) {
        console.log("Status Toggle Response:", res);
        badge.data("status", res.status);

        if (res.status=== "ACTIVE") {
          badge
            .text("Active")
            .removeClass("bg-yellow-100 text-yellow-700")
            .addClass("bg-green-100 text-green-700");
        } else {
          badge
            .text("Pending")
            .removeClass("bg-green-100 text-green-700")
            .addClass("bg-yellow-100 text-yellow-700");
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Status updated",
          showConfirmButton: false,
          timer: 2000,
        });
      },
      error: function () {
        Swal.fire("Error", "Failed to update status", "error");
      },
    });
  });
});




/* ===============================
   User Delete (UPDATED)
   =============================== */

$(document).on("click", ".delete-btn", function () {
  const btn = $(this);
  const userId = btn.data("id");
  const userName = btn.data("name") || "this user";

  Swal.fire({
    title: "Are you sure?",
    text: `Delete ${userName}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete",
  }).then((result) => {
    if (!result.isConfirmed) return;

    $.ajax({
      url: `/admin/users/delete/${userId}`,
      type: "DELETE",

      success: function (res) {
        // Desktop table
        btn.closest("tr").fadeOut(300, function () {
          $(this).remove();
        });

        // Mobile card
        btn.closest(".border").fadeOut(300, function () {
          $(this).remove();
        });

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: res.message || "User deleted successfully",
          showConfirmButton: false,
          timer: 2000,
        });
      },

      error: function (xhr) {
        Swal.fire(
          "Error",
          xhr.responseJSON?.message || "Delete failed",
          "error"
        );
      },
    });
  });
  });


