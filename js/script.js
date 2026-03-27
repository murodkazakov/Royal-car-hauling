document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".quote-form");

  const fromZip = document.getElementById("from");
  const toZip = document.getElementById("to");

  const fromCity = document.getElementById("fromCity");
  const fromState = document.getElementById("fromState");

  const toCity = document.getElementById("toCity");
  const toState = document.getElementById("toState");

  async function fillCityState(zipInput, cityInput, stateInput) {
    const zip = zipInput.value.trim();

    if (!/^\d{5}$/.test(zip)) {
      cityInput.value = "";
      stateInput.value = "";
      return;
    }

    try {
      const response = await fetch("https://api.zippopotam.us/us/" + zip);

      if (!response.ok) {
        cityInput.value = "";
        stateInput.value = "";
        return;
      }

      const data = await response.json();

      if (data.places && data.places.length > 0) {
        cityInput.value = data.places[0]["place name"] || "";
        stateInput.value = data.places[0]["state abbreviation"] || "";
      } else {
        cityInput.value = "";
        stateInput.value = "";
      }
    } catch (error) {
      cityInput.value = "";
      stateInput.value = "";
      console.error("ZIP lookup error:", error);
    }
  }

  if (fromZip) {
    fromZip.addEventListener("input", function () {
      if (fromZip.value.trim().length === 5) {
        fillCityState(fromZip, fromCity, fromState);
      } else {
        fromCity.value = "";
        fromState.value = "";
      }
    });
  }

  if (toZip) {
    toZip.addEventListener("input", function () {
      if (toZip.value.trim().length === 5) {
        fillCityState(toZip, toCity, toState);
      } else {
        toCity.value = "";
        toState.value = "";
      }
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Your quote form layout is ready. Next we can connect real email sending and vehicle dropdowns.");
    });
  }
});
