const btnNext = document.querySelector("button.btn-next");
const btnPrevious = document.querySelector("button.btn-previous");
const divImages = document.querySelector("div.images");

const config = getComputedStyle(document.documentElement)
const imageWidth = parseInt(config.getPropertyValue("--image-width"))
const imageHeight = parseInt(config.getPropertyValue("--image-height"))
const transition = config.getPropertyValue("--transition")
let currentIndex = 0;
let blockButtons = false

const images = [
  `//source.unsplash.com/${imageWidth}x${imageHeight}?apples`,
  `//source.unsplash.com/${imageWidth}x${imageHeight}?bananas`,
  `//source.unsplash.com/${imageWidth}x${imageHeight}?cherries`,
  `//source.unsplash.com/${imageWidth}x${imageHeight}?mangos`,
];

// place images ABSOLUTELY in container
const imgElements = images.map((img, i) => {
  const imgElement = document.createElement("img");
  imgElement.src = img;
  imgElement.style.left = i * imageWidth - imageWidth + "px";
  divImages.appendChild(imgElement);
  return imgElement;
});

const slidePrevious = () => {
  if (blockButtons) return;
  blockButtons = true;

  // move ALL images one image width to the RIGHT
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    img.style.left = parseInt(left) + imageWidth + "px";
  });
  // move LAST image to first position in container
  const lastItem = imgElements[imgElements.length - 1];
  lastItem.style.transition = "none"; // make move invisible to user
  lastItem.style.left = -imageWidth + "px";

  // allow user to slide again in round about a second
  setTimeout(() => {
    lastItem.style.transition = transition;
    blockButtons = false;
  }, 800);

  // move element to FIRST position in array
  const firstItemNew = imgElements.pop();
  imgElements.unshift(firstItemNew);
};

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
  firstItem.style.transition = "none"; // make move invisible to user
  firstItem.style.left = (imgElements.length - 2) * imageWidth + "px";

  // allow user to slide again in round about a second
  setTimeout(() => {
    firstItem.style.transition = transition;
    blockButtons = false;
  }, 800);

  // move element to LAST position in array
  const lastItemNew = imgElements.shift();
  imgElements.push(lastItemNew);
};

// make buttons work...
btnPrevious.addEventListener("click", slidePrevious);
btnNext.addEventListener("click", slideNext);

// autoslide...
setInterval(() => {
  slideNext()
},3000)
