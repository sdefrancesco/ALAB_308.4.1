import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_32lM8iy1pyWLvnNf1bnlXXbQ6yWzrHaHTG3YeWlIXizJdFof3OSFZmetoAW33g1y";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

// Async function to load breeds
const initialLoad = async () => {
  // Get the select element by its ID
  let selectBox = document.getElementById("breedSelect");

  // Check if the selectBox exists to avoid errors if it's missing

  try {
    // Make a GET request to the API to retrieve the list of breeds
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const breeds = await response.json();

    // Iterate through the breeds and create <option> elements
    breeds.forEach((breed) => {
      let option = document.createElement("option");
      option.value = breed.id; // Use the breed's id as the value
      option.textContent = breed.name; // Use the breed's name as the displayed text
      selectBox.appendChild(option); // Append the option to the select element
    });
  } catch (err) {
    console.log("Error:", err); // Log any errors
  }
};

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

// Event handler for breed selection
const handleBreedSelect = async (event) => {
  const breedId = event.target.value;
  const infoDump = document.getElementById("infoDump");
  const progressBar = document.getElementById("progressBar");
  const getFavouritesBtn = document.getElementById("getFavouritesBtn");
  const carouselInner = document.getElementById("carouselInner");

  if (!breedId) return; // if no breed is selected, exit

  // show the progress bar while fetching breed info
  progressBar.style.width = "100%";
  progressBar.style.transition = "width 1s ease";

  try {
    // fetch information for the selected breed from the Cat API
    const breedInfoResponse = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );

    const breedImages = await breedInfoResponse.json();

    // Clear any previous carousel and information
    carouselInner.innerHTML = "";
    infoDump.innerHTML = "";

    // Create carousel items using the images from the API
    breedImages.forEach((imageData, index) => {
      const carouselItemTemplate = document.getElementById(
        "carouselItemTemplate"
      );
      const newCarouselItem = carouselItemTemplate.content.cloneNode(true);
      const carouselItem = newCarouselItem.querySelector(".carousel-item");
      const img = carouselItem.querySelector("img");
      const favButton = carouselItem.querySelector(".favourite-button");

      img.src = imageData.url; // set the image URL
      img.alt = `Cat Image ${index + 1}`; // Set the alt text for accessibility

      // adding functionality to the favourite button
      favButton.dataset.imgId = imageData.id; // Store the image ID for future reference
      favButton.addEventListener("click", () =>
        handleFavouriteClick(imageData.id)
      );

      if (index === 0) {
        carouselItem.classList.add("active"); // first item active
      }

      carouselInner.appendChild(carouselItem); // add carousel item to carousel
    });

    // show breed information
    const breedInfo = document.createElement("div");
    breedInfo.innerHTML = `
      <h3>Breed Info</h3>
      <p><strong>Origin:</strong> ${breedImages[0].breeds[0].origin}</p>
      <p><strong>Description:</strong> ${breedImages[0].breeds[0].description}</p>
      <p><strong>Temperament:</strong> ${breedImages[0].breeds[0].temperament}</p>
    `;
    infoDump.appendChild(breedInfo);

    // hide progress bar after data is fetched
    progressBar.style.width = "0%";
  } catch (err) {
    console.log("Error fetching breed data:", err);
    progressBar.style.width = "0%"; // hide progress bar in case of an error
  }
};

// favourite button click handler
const handleFavouriteClick = (imageId) => {
  alert(`Image with ID: ${imageId} marked as favourite.`);
};

// add event listener for breed selection when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initialLoad();
  const breedSelect = document.getElementById("breedSelect");
  breedSelect.addEventListener("change", handleBreedSelect);
});

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 *
 *
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
