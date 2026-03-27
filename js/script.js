document.addEventListener("DOMContentLoaded", function () {
  const fromZip = document.getElementById("from");
  const fromCity = document.getElementById("fromCity");
  const fromState = document.getElementById("fromState");

  async function fillCityState() {
    const zip = fromZip.value.trim();

    if (!/^\d{5}$/.test(zip)) {
      fromCity.value = "";
      fromState.value = "";
      return;
    }

    try {
      const response = await fetch("https://api.zippopotam.us/us/" + zip);
      const data = await response.json();

      if (data.places && data.places.length > 0) {
        fromCity.value = data.places[0]["place name"] || "";
        fromState.value = data.places[0]["state abbreviation"] || "";
      } else {
        fromCity.value = "";
        fromState.value = "";
      }
    } catch (error) {
      fromCity.value = "";
      fromState.value = "";
      console.log(error);
    }
  }

  if (fromZip) {
    fromZip.addEventListener("input", function () {
      if (fromZip.value.trim().length === 5) {
        fillCityState();
      }
    });
  }
});
