// DOM elements
const btnNext = document.querySelector("button.btn-next");
const btnPrevious = document.querySelector("button.btn-previous");
const divImages = document.querySelector("div.images");
const icons = document.querySelector(".icons").children;

// config values (grab from CSS variables)
const config = getComputedStyle(document.documentElement)
const imageWidth = parseInt(config.getPropertyValue("--image-width"))
const imageHeight = parseInt(config.getPropertyValue("--image-height"))
const transition = config.getPropertyValue("--transition")
const transitionInt = parseInt(config.getPropertyValue("--transition-number")) * 1100
console.log(transitionInt)

let blockButtons = false

const images = [
  // "red",
  // "purple",
  // "orange",
  // "green",
  `./images/ananas.resized.jpg`,
  `./images/bananas.resized.jpg`,
  `./images/berries.resized.jpg`,
  `./images/cherries.resized.jpg`,
  // `https://source.unsplash.com/${imageWidth}x${imageHeight}?apples`,
  // `https://source.unsplash.com/${imageWidth}x${imageHeight}?bananas`,
  // `https://source.unsplash.com/${imageWidth}x${imageHeight}?cherries`,
  // `https://source.unsplash.com/${imageWidth}x${imageHeight}?mangos`,
];

// place images ABSOLUTELY in container
const imgElements = images.map((img, i) => {
  const imgElement = document.createElement("img");
  imgElement.src = img;
  // const imgElement = document.createElement("div");
  // imgElement.style.backgroundColor = img;
  imgElement.style.left = i * imageWidth - imageWidth + "px";
  divImages.appendChild(imgElement);
  return imgElement;
});

// click LEFT
const slidePrevious = () => {
  if (blockButtons) return;
  blockButtons = true;

  // move ALL images one image width to the RIGHT (except LAST item)
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    const leftNew = parseInt(left) + imageWidth + "px";
    img.style.left = leftNew
  });
  // move LAST image to FIRST position in container
  const lastItem = imgElements[imgElements.length - 1];
  lastItem.style.zIndex = -1
  const leftNew = -imageWidth + "px"
  lastItem.style.left = leftNew;

  resetItem(lastItem)

  // move element to FIRST position in array
  const firstItemNew = imgElements.pop(); // remove last array item
  imgElements.unshift(firstItemNew); // add removed item at begin of array
};

// click RIGHT
const slideNext = () => {
  if (blockButtons) return;
  blockButtons = true;

  // move ALL images one image width to the LEFT
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    img.style.left = parseInt(left) - imageWidth + "px";
  });

  // move FIRST item to last position in container
  const firstItem = imgElements[0];
  firstItem.style.zIndex = -1
  firstItem.style.left = (imgElements.length - 2) * imageWidth + "px";

  resetItem(firstItem)

  // move element to LAST position in array
  const lastItemNew = imgElements.shift();
  imgElements.push(lastItemNew);
};

// reset CSS of moved item and unblock actions
const resetItem = (item) => {
  // allow user to slide again in round about a second
  setTimeout(() => {
    item.style.removeProperty("z-index");
    blockButtons = false;
  }, transitionInt);
};

// make buttons work...
btnPrevious.addEventListener("click", slidePrevious);
btnNext.addEventListener("click", slideNext);

// autoslide...
// setInterval(() => {
//   slideNext()
// },3000)
