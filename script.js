// DOM elements
const btnNext = document.querySelector("button.btn-next");
const btnPrevious = document.querySelector("button.btn-previous");
const divImages = document.querySelector("div.images");
const icons = document.querySelector(".icons").children;
const iconElements = Array.from(icons);

// config values (grab from CSS variables)
const config = getComputedStyle(document.documentElement);
const imageWidth = parseInt(config.getPropertyValue("--image-width"));
const imageHeight = parseInt(config.getPropertyValue("--image-height"));
const transition = config.getPropertyValue("--transition");
const transitionInt =
  parseInt(config.getPropertyValue("--transition-number")) * 1100;

let currentIndex = 0;
let blockButtons = false;

const images = [
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
// const labels = [4,1,2,3]
const imgElements = images.map((img, i) => {
  const imgElement = document.createElement("img");
  imgElement.src = img;
  // const imgElement = document.createElement("div");
  // imgElement.style.backgroundColor = img;
  imgElement.style.left = i * imageWidth - imageWidth + "px";
  divImages.appendChild(imgElement);
  return imgElement;
});

// create icon handlers
iconElements.forEach((icon, i) => {
  icon.addEventListener("click", () => {
    const newIndex = i;
    const diff = newIndex - currentIndex;
    console.log({ currentIndex, newIndex, diff });
    // cases:
    // if 0 => we do nothing
    // if from LAST to FIRST or vice versa => we move just ONE!
    // if -1 => we move one BACK
    // if 1 => we move one FORWARD
    // if something else => we move X FORWARD
    if (diff === 0) return;

    // from first to last => go one back
    if (diff > 0 && diff === imgElements.length - 1) {
      slidePrevious();
    }
    // from last to first => go one forward
    if (diff < 0 && Math.abs(diff) === imgElements.length - 1) {
      slideNext();
    }

    if (diff === -1) slidePrevious();
    if (diff === 1) {
      slideNext();
    }
    // move "diff" steps
    if(diff > 0) {
      console.log(diff, "forwards")
      slideNext(diff);
    }
    else {
      console.log(diff, "back");
      slidePrevious(Math.abs(diff))
    }
  });
});

const setIndex = (inc) => {
  currentIndex += inc;
  if (currentIndex < 0) {
    currentIndex = imgElements.length - 1;
  } else if (currentIndex === imgElements.length) {
    currentIndex = 0;
  }
  // color selected icon (at index position)
  iconElements.forEach((icon, i) => {
    if (i === currentIndex) {
      return icon.classList.add("active");
    }
    icon.classList.remove("active");
  });
};

// click LEFT
const slidePrevious = (inc = 1) => {
  if (blockButtons) return;
  blockButtons = true;

  setIndex(-inc);

  // move ALL images X image widths to the RIGHT
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    const leftNew = parseInt(left) + imageWidth * inc + "px";
    img.style.left = leftNew;
  });

  // move LAST X images to FIRST position in container
  const lastItem = imgElements[imgElements.length - 1];
  // lastItem.style.zIndex = -1
  lastItem.style.display = "none";
  const leftNew = -imageWidth + "px";
  lastItem.style.left = leftNew;

  resetItem(lastItem);

  // move element to FIRST position in array
  const firstItemNew = imgElements.pop(); // remove last array item
  imgElements.unshift(firstItemNew); // add removed item at begin of array
};

// click RIGHT
const slideNext = (inc = 1) => {
  if (blockButtons) return;
  blockButtons = true;

  setIndex(inc);

  // move ALL images X image widths to the LEFT
  imgElements.forEach((img, i) => {
    const { left } = getComputedStyle(img);
    img.style.left = parseInt(left) - imageWidth * inc + "px";
  });

  // move FIRST X items to last position in container (AFTER move left is finished!)
  const firstItem = imgElements[0];
  firstItem.style.display = "none";
  // firstItem.style.zIndex = -1
  const newLeft = (imgElements.length - 2 - inc+1) * imageWidth + "px";
  firstItem.style.left = newLeft;

  resetItem(firstItem);

  // move element to LAST position in array
  const lastItemNew = imgElements.shift();
  imgElements.push(lastItemNew);
};

// reset CSS of moved item and unblock actions
const resetItem = (item) => {
  // allow user to slide again in round about a second
  setTimeout(() => {
    item.style.display = "grid";
    // item.style.removeProperty("z-index");
    blockButtons = false;
  }, transitionInt);
};

// make buttons work...
btnPrevious.addEventListener("click", () => slidePrevious(1));
btnNext.addEventListener("click", () => slideNext(1));

// autoslide...
// setInterval(() => {
//   slideNext()
// },3000)
