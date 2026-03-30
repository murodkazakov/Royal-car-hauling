document.addEventListener("DOMContentLoaded", function () {
  const fromZip = document.getElementById("from");
  const toZip = document.getElementById("to");

  const fromCity = document.getElementById("fromCity");
  const fromState = document.getElementById("fromState");

  const toCity = document.getElementById("toCity");
  const toState = document.getElementById("toState");

  async function fillCityState(zipInput, cityInput, stateInput) {
    if (!zipInput || !cityInput || !stateInput) return;

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
      fromZip.value = fromZip.value.replace(/\D/g, "").slice(0, 5);

      if (fromZip.value.trim().length === 5) {
        fillCityState(fromZip, fromCity, fromState);
      } else {
        if (fromCity) fromCity.value = "";
        if (fromState) fromState.value = "";
      }
    });

    fromZip.addEventListener("blur", function () {
      if (fromZip.value.trim().length === 5) {
        fillCityState(fromZip, fromCity, fromState);
      }
    });
  }

  if (toZip) {
    toZip.addEventListener("input", function () {
      toZip.value = toZip.value.replace(/\D/g, "").slice(0, 5);

      if (toZip.value.trim().length === 5) {
        fillCityState(toZip, toCity, toState);
      } else {
        if (toCity) toCity.value = "";
        if (toState) toState.value = "";
      }
    });

    toZip.addEventListener("blur", function () {
      if (toZip.value.trim().length === 5) {
        fillCityState(toZip, toCity, toState);
      }
    });
  }

  const stepOneForm = document.getElementById("quoteStepOneForm");

  if (stepOneForm) {
    stepOneForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const smsConsent = document.getElementById("smsConsent");

      const data = {
        fromZip: fromZip ? fromZip.value.trim() : "",
        toZip: toZip ? toZip.value.trim() : "",
        fromCity: fromCity ? fromCity.value.trim() : "",
        fromState: fromState ? fromState.value.trim() : "",
        toCity: toCity ? toCity.value.trim() : "",
        toState: toState ? toState.value.trim() : "",
        smsConsent: smsConsent ? smsConsent.checked : false
      };

      if (!data.fromZip || !data.toZip) {
        alert("Please enter both pickup and delivery ZIP codes.");
        return;
      }

      if (!data.fromCity || !data.fromState || !data.toCity || !data.toState) {
        alert("Please enter valid ZIP codes so we can load the city and state.");
        return;
      }

      sessionStorage.setItem("royalQuoteStep1", JSON.stringify(data));
      window.location.href = "quote-details.html";
    });
  }

  const quoteDetailsForm = document.getElementById("quoteDetailsForm");

  if (quoteDetailsForm) {
    const savedData = JSON.parse(sessionStorage.getItem("royalQuoteStep1") || "{}");

    const routeFrom = document.getElementById("routeFrom");
    const routeTo = document.getElementById("routeTo");

    const hiddenFromZip = document.getElementById("hiddenFromZip");
    const hiddenToZip = document.getElementById("hiddenToZip");
    const hiddenFromCity = document.getElementById("hiddenFromCity");
    const hiddenFromState = document.getElementById("hiddenFromState");
    const hiddenToCity = document.getElementById("hiddenToCity");
    const hiddenToState = document.getElementById("hiddenToState");
    const hiddenSmsConsent = document.getElementById("hiddenSmsConsent");

    if (!savedData.fromZip || !savedData.toZip) {
      window.location.href = "index.html#quote";
      return;
    }

    if (routeFrom) {
      routeFrom.textContent = `${savedData.fromCity}, ${savedData.fromState} (${savedData.fromZip})`;
    }

    if (routeTo) {
      routeTo.textContent = `${savedData.toCity}, ${savedData.toState} (${savedData.toZip})`;
    }

    if (hiddenFromZip) hiddenFromZip.value = savedData.fromZip || "";
    if (hiddenToZip) hiddenToZip.value = savedData.toZip || "";
    if (hiddenFromCity) hiddenFromCity.value = savedData.fromCity || "";
    if (hiddenFromState) hiddenFromState.value = savedData.fromState || "";
    if (hiddenToCity) hiddenToCity.value = savedData.toCity || "";
    if (hiddenToState) hiddenToState.value = savedData.toState || "";
    if (hiddenSmsConsent) hiddenSmsConsent.value = savedData.smsConsent ? "Yes" : "No";

    const radioPills = document.querySelectorAll(".radio-pill");

    radioPills.forEach(function (pill) {
      const radio = pill.querySelector('input[type="radio"]');
      if (!radio) return;

      function syncActive() {
        const groupName = radio.name;

        document
          .querySelectorAll(`.radio-pill input[name="${groupName}"]`)
          .forEach(function (item) {
            const parent = item.closest(".radio-pill");
            if (parent) parent.classList.remove("active");
          });

        if (radio.checked) {
          pill.classList.add("active");
        }
      }

      pill.addEventListener("click", function () {
        radio.checked = true;
        syncActive();
      });

      syncActive();
    });

    quoteDetailsForm.addEventListener("submit", function (e) {
      const year = document.getElementById("year");
      const make = document.getElementById("make");
      const model = document.getElementById("model");
      const shipDate = document.getElementById("shipDate");
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");

      if (!year.value.trim() || !make.value.trim() || !model.value.trim()) {
        e.preventDefault();
        alert("Please complete vehicle year, make, and model.");
        return;
      }

      if (!shipDate.value) {
        e.preventDefault();
        alert("Please select your first available shipping date.");
        return;
      }

      if (!name.value.trim() || !email.value.trim() || !phone.value.trim()) {
        e.preventDefault();
        alert("Please complete your contact information.");
        return;
      }
    });
  }
});
