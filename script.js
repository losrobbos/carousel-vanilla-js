const btnNext = document.querySelector("button.btn-next");
const btnPrevious = document.querySelector("button.btn-previous");
const divImages = document.querySelector("div.images");

const imageWidth = 100;
let currentIndex = 0;

let blockButtons = false

const images = [
  `//source.unsplash.com/${imageWidth}x100?apples`,
  `//source.unsplash.com/${imageWidth}x100?bananas`,
  `//source.unsplash.com/${imageWidth}x100?cherries`,
];

// place images ABSOLUTELY in container
const imgElements = images.map((img, i) => {
  const imgElement = document.createElement("img");
  imgElement.src = img;
  imgElement.style.left = i * imageWidth - 100 + "px";
  divImages.appendChild(imgElement);
  return imgElement;
});

/**
 *      1|2|3 
 * =>     1|2|3
 * =>   3|1|2
 */
btnPrevious.addEventListener("click", () => {

  if(blockButtons) return
  blockButtons = true

  // move ALL images one image width to the RIGHT
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    img.style.left = parseInt(left) + imageWidth + "px";
  });
  // move LAST item to first position
  const lastItem = imgElements[imgElements.length-1]
  lastItem.style.transition = "none";
  lastItem.style.left = -imageWidth + "px"

  setTimeout(() => {
    lastItem.style.transition = "1s";
    blockButtons = false
  }, 1000)

  // move element to FIRST position in array
  const firstItemNew = imgElements.pop()
  imgElements.unshift(firstItemNew)
});

btnNext.addEventListener("click", () => {
  if (blockButtons) return;
  blockButtons = true;

  // move ALL images one image width to the LEFT
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    img.style.left = parseInt(left) - imageWidth + "px";
  });

  // move FIRST item to last position in container
  const firstItem = imgElements[0];
  firstItem.style.transition = "none";
  firstItem.style.left = (imgElements.length-2)*imageWidth + "px";
  setTimeout(() => {
    firstItem.style.transition = "1s";
    blockButtons = false
  }, 1000)

  // move element to LAST position in array
  const lastItemNew = imgElements.shift();
  imgElements.push(lastItemNew);
});
