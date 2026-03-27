document.addEventListener("DOMContentLoaded", function () {
  const fromZip = document.getElementById("from");
  const fromCity = document.getElementById("fromCity");
  const fromState = document.getElementById("fromState");

  async function fillCityState(zipInput, cityInput, stateInput) {
    const zip = zipInput.value.trim();

    if (zip.length !== 5 || !/^\d{5}$/.test(zip)) {
      cityInput.value = "";
      stateInput.value = "";
      return;
    }

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);

      if (!response.ok) {
        cityInput.value = "";
        stateInput.value = "";
        return;
      }

      const data = await response.json();

      cityInput.value = data.places[0]["place name"];
      stateInput.value = data.places[0]["state abbreviation"];
    } catch (error) {
      cityInput.value = "";
      stateInput.value = "";
    }
  }

  fromZip.addEventListener("blur", function () {
    fillCityState(fromZip, fromCity, fromState);
  });
});
