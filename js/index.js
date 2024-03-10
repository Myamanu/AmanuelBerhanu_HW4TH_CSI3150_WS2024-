document.addEventListener("DOMContentLoaded", () => {
  const carListingsSection = document.getElementById("carListings");
  const filtersSection = document.getElementById("filters");

  initInterface();

  function initInterface() {
    generateCarListings(usedCars);
    generateFilters(usedCars);
  }

  function generateCarListings(cars) {
    carListingsSection.innerHTML = "";

    if (cars.length > 0) {
      cars.forEach((car) => {
        const carCard = document.createElement("div");
        carCard.classList.add("car-card");
        carCard.innerHTML = `
                    <h2>${car.year} ${car.make} ${car.model}</h2>
                    <img src="${car.carImg}" alt="${car.make} ${car.model}">
                    <p>Mileage: ${car.mileage} miles</p>
                    <p>Price: $${car.price}</p>
                    <p>Color: ${car.color}</p>
                    <p>Gas Mileage: ${car.gasMileage}</p>
                `;
        carListingsSection.appendChild(carCard);
      });
    } else {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent =
        "No cars available. Please try again with different filters.";
      noResultsMessage.classList.add("no-results");
      carListingsSection.appendChild(noResultsMessage);
    }
  }

  function generateFilters(cars) {
    filtersSection.innerHTML = "";

    const yearFilter = document.createElement("div");
    yearFilter.innerHTML = `
            <label for="minYear">Min. Car Year:</label>
            <input type="number" id="minYear" />
            <label for="maxYear">Max. Car Year:</label>
            <input type="number" id="maxYear" />
        `;
    filtersSection.appendChild(yearFilter);

    const makeFilter = document.createElement("div");
    makeFilter.innerHTML = `
            <label for="carMake">Car Make:</label>
            <select id="carMake" multiple>
                ${getCarMakeOptions(cars)}
            </select>
        `;
    filtersSection.appendChild(makeFilter);

    const mileageFilter = document.createElement("div");
    mileageFilter.innerHTML = `
           <label for="maxMileage">Max. Car Mileage:</label>
           ${getMaxMileageOptions()}
  `;
    filtersSection.appendChild(mileageFilter);

    const priceFilter = document.createElement("div");
    priceFilter.innerHTML = `
            <label for="priceRange">Price Range:</label>
            <select id="priceRange">
                ${getPriceRangeOptions(cars)}
            </select>
        `;
    filtersSection.appendChild(priceFilter);

    const colorFilter = document.createElement("div");
    colorFilter.innerHTML = `
            <label for="carColor">Car Color:</label>
            
            ${getCarColorOptions(cars)}
            
        `;
    filtersSection.appendChild(colorFilter);

    const applyFiltersButton = document.createElement("button");
    applyFiltersButton.textContent = "Apply Filters";
    applyFiltersButton.addEventListener("click", handleFilters);

    filtersSection.appendChild(applyFiltersButton);
  }

  function getCarMakeOptions(cars) {
    const uniqueMakes = [...new Set(cars.map((car) => car.make))];
    return uniqueMakes
      .map((make) => `<option value="${make}">${make}</option>`)
      .join("");
  }

  function getMaxMileageOptions() {
    const mileageOptions = [
      "<15K",
      "<30K",
      "<45K",
      "<60K",
      "<75K",
      "<100K",
      "<150K",
      "<200K",
      "<250K",
    ];
    return mileageOptions
      .map(
        (option) =>
          `<label><input type="radio" name="maxMileage" value="${option}">${option}</label>`
      )
      .join("");
  }

  function getPriceRangeOptions(cars) {
    const prices = cars.map((car) => car.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const ranges = [
      { min: 0, max: 5000 },
      { min: 5001, max: 10000 },
      { min: 10001, max: 15000 },
      { min: 15001, max: 20000 },
      { min: 20001, max: 25000 },
      { min: 25001, max: 30000 },
      { min: 30001, max: 35000 },
      { min: 35001, max: 40000 },
      { min: 40001, max: 45000 },
      { min: 45001, max: 50000 },
      { min: 50001, max: 75000 },
      { min: 75001, max: 100000 },
      { min: 100001, max: 200000 },
    ];

    return ranges
      .map((range) => {
        const selected =
          range.min === minPrice && range.max === maxPrice ? "selected" : "";
        return `<option value="${range.min}-${range.max}" ${selected}>$${range.min} - $${range.max}</option>`;
      })
      .join("");
  }

  function getCarColorOptions(cars) {
    const uniqueColors = [...new Set(cars.map((car) => car.color))];
    return uniqueColors
      .map(
        (color) =>
          `<label><input type="checkbox" class="color-checkbox" value="${color}">${color}</label>`
      )
      .join("");
  }

  function handleFilters() {
    console.log("Handling Filters...");

    const minYear = parseInt(document.getElementById("minYear").value) || 0;
    const maxYear =
      parseInt(document.getElementById("maxYear").value) || Infinity;
    const selectedMakes = Array.from(
      document.getElementById("carMake").selectedOptions
    ).map((option) => option.value);
    const selectedMileage =
      document.querySelector('input[name="maxMileage"]:checked')?.value ||
      Infinity;
    const selectedPriceRange = document.getElementById("priceRange").value;
    const selectedColors = Array.from(
      document.getElementsByClassName("color-checkbox")
    )
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    console.log("minYear:", minYear);
    console.log("maxYear:", maxYear);
    console.log("selectedMakes:", selectedMakes);
    console.log("selectedMileage:", selectedMileage);
    console.log("selectedPriceRange:", selectedPriceRange);
    console.log("selectedColors:", selectedColors);

    const filteredCars = usedCars.filter((car) => {
      const carYear = car.year;
      const carMake = car.make;
      const carMileage =
        parseInt(car.mileage.replace(" miles", "").replace(",", "")) || 0;
      const carPrice = car.price;

      // Filter by Year
      const isYearInRange = carYear >= minYear && carYear <= maxYear;

      // Filter by Make
      const isMakeSelected =
        selectedMakes.length === 0 || selectedMakes.includes(carMake);
      // Filter by Mileage
      const isMileageInRange =
        carMileage <= parseInt(selectedMileage.replace("K", "")) * 1000;

      // Filter by Price Range
      const isPriceInRange =
        selectedPriceRange === "0-Infinity" ||
        (carPrice >= parseInt(selectedPriceRange.split("-")[0]) &&
          carPrice <= parseInt(selectedPriceRange.split("-")[1]));

      // Filter by Color
      const isColorSelected =
        selectedColors.length === 0 || selectedColors.includes(car.color);

      return (
        isYearInRange &&
        isMakeSelected &&
        isMileageInRange &&
        isPriceInRange &&
        isColorSelected
      );
    });

    generateCarListings(filteredCars);
  }
});
