document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".quote-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Your quote request form design is ready. Next we will connect the real form sending.");
    });
  }
});
