// DOM elements
const btnNext = document.querySelector("button.btn-next");
const btnPrevious = document.querySelector("button.btn-previous");
const icons = document.querySelector(".icons").children;
const iconElements = Array.from(icons);
let imgContainer1 = document.querySelector("div.images:nth-of-type(1)");
let imgContainer2 = document.querySelector("div.images:nth-of-type(2)");
const imgContainers = [imgContainer1, imgContainer2];

// config values (grab from CSS variables)
const config = getComputedStyle(document.documentElement);
const imageWidth = parseInt(config.getPropertyValue("--image-width"));
const imageHeight = parseInt(config.getPropertyValue("--image-height"));
const transition = config.getPropertyValue("--transition");
const transitionInt =
  parseFloat(config.getPropertyValue("--transition-number")) * 1050;

let containerIndexCurrent = 1;
let itemIndexCurrent = 0;
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

// place / duplicate images in both containers
images.forEach((img, i) => {
  imgContainers.forEach((container) => {
    const imgElement = document.createElement("img");
    imgElement.src = img;
    container.appendChild(imgElement);
  });
});

// create icon handlers
iconElements.forEach((icon, iconIndex) => {
  icon.addEventListener("click", () => {
    const diff = iconIndex - itemIndexCurrent;
    // if we are already at item (diff == 0) => we do nothing
    if (diff === 0) return;

    // move to new position X steps
    if (diff > 0) slideNext(diff);
    if (diff < 0) slidePrevious(Math.abs(diff));
  });
});

/**
 * update item index + selected icon
 */
const setCurrentItem = (inc) => {
  itemIndexCurrent += inc;

  // moved before begin? go to LAST item and switch container
  if (itemIndexCurrent < 0) {
    itemIndexCurrent = images.length - 1;
    containerIndexCurrent = containerIndexCurrent === 0 ? 1 : 0;
  }
  // moved after end? go to FIRST item and switch container
  else if (itemIndexCurrent === images.length) {
    itemIndexCurrent = 0;
    containerIndexCurrent = containerIndexCurrent === 0 ? 1 : 0;
  }

  // color the selected position icon
  iconElements.forEach((icon, itemIndex) => {
    if (itemIndex === itemIndexCurrent) {
      return icon.classList.add("active");
    }
    icon.classList.remove("active");
  });
};

const slideContainers = (inc) => {
  // shift containers in direction user clicked
  imgContainers.forEach((container, i) => {
    container.style.transition = transition;
    container.style.removeProperty("z-index");
    const { left } = getComputedStyle(container);
    const leftNew = parseInt(left) + imageWidth * inc + "px";
    container.style.left = leftNew;
  });

  // determine new current item (depending on last move)
  // update selected item icon for user
  setCurrentItem(-inc);

  // outer LEFT bound?
  if (itemIndexCurrent === 0 && containerIndexCurrent === 0) {
    // move container 2 LEFT to container 1 and swap container index
    swapContainers();
  }
  // outer RIGHT bound?
  else if (
    itemIndexCurrent === images.length - 1 &&
    containerIndexCurrent === 1
  ) {
    // move container 1 RIGHT to container 2 and swap container index
    swapContainers();
  }
};

const swapContainers = () => {
  // WAIT until containers have locked in (transition finished)
  setTimeout(() => {
    const containerStyle = getComputedStyle(
      imgContainers[containerIndexCurrent]
    );
    // calculate new container position next to other one
    const leftNew =
      parseInt(containerStyle.left) +
      (containerIndexCurrent === 0 ? -1 : 1) * parseInt(containerStyle.width) +
      "px";

    // perform move (prevent transition)
    const containerOther = imgContainers[containerIndexCurrent === 0 ? 1 : 0];
    containerOther.style.transition = "none";
    containerOther.style.left = leftNew;

    // swap containers in array
    containerIndexCurrent = containerIndexCurrent === 0 ? 1 : 0;
    const temp = imgContainers[0];
    imgContainers[0] = imgContainers[1];
    imgContainers[1] = temp;
  }, transitionInt);
};

// click RIGHT arrow icon
const slideNext = (inc = 1) => {
  if (blockButtons) return;
  blockButtons = true;

  // slide all images inc times to the LEFT
  slideContainers(-inc);

  setTimeout(() => {
    blockButtons = false;
  }, transitionInt);
};

// click LEFT arrow icon
const slidePrevious = (inc = 1) => {
  if (blockButtons) return;
  blockButtons = true;

  // slide all images inc times to the RIGHT
  slideContainers(inc);

  setTimeout(() => {
    blockButtons = false;
  }, transitionInt);
};

// make buttons work...
btnPrevious.addEventListener("click", () => slidePrevious());
btnNext.addEventListener("click", () => slideNext());

// autoslide...
setInterval(() => {
  slideNext()
},3000)
