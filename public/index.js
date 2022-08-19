 "use strict";

 (function() {

    // MODULE GLOBAL VARIABLES, CONSTANTS, AND HELPER FUNCTIONS CAN BE PLACED HERE

    /**
    * Add a function that will be called when the window is loaded.
    */
    window.addEventListener("load", init);
    let model;
    let image;
    /**
    * CHANGE: Describe what your init function does here.
    */
    function init() {
      // THIS IS THE CODE THAT WILL BE EXECUTED ONCE THE WEBPAGE LOADS


      loadModel();

      id("model-button").addEventListener("click", prediction);

      const fileInput = document.getElementById('file');
      fileInput.addEventListener("change", handleFiles);


    }

    async function loadModel() {
      model = await tf.loadGraphModel("./model/model.json");
    }

    async function prediction() {
      let tensor = preprocessImage(image);
      let predictions = await model.predict(tensor).data();
      // console.log(predictions);

      let topFour = Array.from(predictions)
        .map(function (p, i) {
          return {
            probability:p,
            className: PLANT_SCIENTIFIC[i]
          }
        }).sort(function (a, b) {
          return b.probability - a.probability;
        }).slice(0, 4);

      generateResults(topFour);
    }

    function generateResults(results) {
      console.log(results);

      let imageDivs = [];

      for (let i = 0; i < results.length; i++) {
        let imageElement = gen("img");
        let string = imageString(results[i]['className']);

        if (PLANT_IMAGE[string] != null) {
          imageElement.src = "./img/plants/" + PLANT_IMAGE[string];
          imageElement.alt = results[i]['className']
        } else {
          console.log("does not exist")
          break;
        }
        imageDivs.push(imageElement);
      }

      console.log(image);

      let originalImageSection = generateOriginalImageSection();
      let plantImageSection = generatePlantsSection(imageDivs, results);
      let button = generateBackToUploadButton();

      let resultsPage = id("results");

      resultsPage.innerHTML = "";

      resultsPage.appendChild(originalImageSection);
      resultsPage.appendChild(plantImageSection);

      switchPages();
    }

    function switchPages() {
      id("results").classList.toggle("hidden");
      id("upload").classList.toggle("hidden");
    }

    function generateBackToUploadButton() {

      let button = gen("button");
      button.textContent = "Back To Upload"

      // add event listener here

      button.addEventListener("click", switchPages);

      return button;
    }

    function generateOriginalImageSection() {

      let section = gen("section");
      section.id = "original";

      let div = gen("div");
      let img = gen("img");
      img.src = image;
      img.alt = "user's input image";

      let h2 = gen("h2");
      h2.textContent = "Original Plant"

      div.appendChild(img);
      div.appendChild(h2);

      let backButton = generateBackToUploadButton();

      div.appendChild(backButton);

      section.appendChild(div);

      return section;
    }

    function generatePlantsSection(imageDivs, results) {

      if (results.length !== 4) {
        return null;
      }

      let plants = gen("section");
      plants.id = "plants"

      let counter = 0;
      for (let i = 0; i < 2; i++) {
        let section = gen("section");
        for (let j = 0; j < 2; j++) {
          let div = gen("div");
          let img = imageDivs[counter];
          let h2 = gen("h2");
          h2.textContent = results[counter]["className"];
          div.appendChild(img)
          div.append(h2);
          section.append(div);
          counter++;
        }
        plants.appendChild(section)
      }

      return plants;

    }



    function imageString(name) {
      let imageName = name;
      imageName = imageName.toLowerCase();
      imageName = imageName.replace(" ", "-")
      return imageName;
    }

    function preprocessImage(image) {

      let imageElement = gen("img")
      imageElement.src = image;
      let tensor = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]).toFloat();
      let offset = tf.scalar(127.5);
      let returnValue = tensor.sub(offset).div(offset).expandDims();

      return returnValue;
    }


    function handleFiles() {

      id("image-div").innerHTML = "";
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        image = reader.result;
        let imageElement = gen("img");
        imageElement.src = image;
        id("image-div").append(imageElement);
      });
      reader.readAsDataURL(this.files[0]);
      // image = null;
      // const selectedFiles = [...id('file').files];
      // console.log(selectedFiles);
      // let imageElement = gen("img");
      // imageElement.src = selectedFiles[0].name;
      // id("image-div").append(imageElement);
    }


    /**
    * Make sure to always add a descriptive comment above
    * every function detailing what it's purpose is
    * Use JSDoc format with @param and @return.
    */
    function exampleFunction1() {
      /* SOME CODE */
    }

    /**
    * Make sure to always add a descriptive comment above
    * every function detailing what it's purpose is
    * @param {variabletype} someVariable This is a description of someVariable, including, perhaps, preconditions.
    * @returns {returntype} A description of what this function is actually returning
    */
    function exampleFunction2(someVariable) {
      /* SOME CODE */
      return something;
    }

    /** ------------------------------ Helper Functions  ------------------------------ */
    /**
    * Note: You may use these in your code, but remember that your code should not have
    * unused functions. Remove this comment in your own code.
    */

    /**
    * Returns the element that has the ID attribute with the specified value.
    * @param {string} idName - element ID
    * @returns {object} DOM object associated with id.
    */
    function id(idName) {
      return document.getElementById(idName);
    }

    /**
    * Returns the first element that matches the given CSS selector.
    * @param {string} selector - CSS query selector.
    * @returns {object} The first DOM object matching the query.
    */
    function qs(selector) {
      return document.querySelector(selector);
    }

    /**
    * Returns the array of elements that match the given CSS selector.
    * @param {string} selector - CSS query selector
    * @returns {object[]} array of DOM objects matching the query.
    */
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }

    /**
    * Returns a new element with the given tag name.
    * @param {string} tagName - HTML tag name for new DOM element.
    * @returns {object} New DOM object for given HTML tag.
    */
    function gen(tagName) {
      return document.createElement(tagName);
    }

 })();