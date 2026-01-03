
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
    cancelButtonText: "Cancel"
  }).then((result) => {

    if (!result.isConfirmed) return;

    $.ajax({
      url: "/admin/users/toggle-status",
      type: "POST",
      data: {
        id: userId,
        status: !currentStatus
      },
      success: function (res) {

        badge.data("status", res.isVerified);

        if (res.isVerified) {
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
          timer: 2000
        });
      },
      error: function () {
        Swal.fire("Error", "Failed to update status", "error");
      }
    });

  });
});
