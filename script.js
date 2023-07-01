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
  // `./images/cherries.resized.jpg`,
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
    containerIndexCurrent = containerIndexCurrent === 0 ? 1 : 0
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

const swapContainers = () => {
  // exchange position of container depending on index
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

  // TODO check if index at outer bound => then we shift containers
  console.log({ containerIndexCurrent, itemIndexCurrent })

  // outer LEFT bound? 
  if (itemIndexCurrent === 0 && containerIndexCurrent === 0) {
    console.log("LEFT BOUND reached");

    // WAIT until containers have locked in (transition finished)
    // move container 2 LEFT to container 1 and swap container index
    setTimeout(() => {
      const container1Style = getComputedStyle(imgContainer1);
      const leftNew = parseInt(container1Style.left) - parseInt(container1Style.width) + "px" 
      imgContainer2.style.transition = "none";
      imgContainer2.style.left = leftNew

      // swap containers
      containerIndexCurrent = 1;
      const temp = imgContainer1
      imgContainer1 = imgContainer2
      imgContainer2 = temp
    },transitionInt)
  }
  // outer RIGHT bound?
  else if (
    itemIndexCurrent === images.length - 1 &&
    containerIndexCurrent === 1
  ) {
    console.log("RIGHT BOUND reached");

    // WAIT until containers have locked in (transition finished)
    // move container 1 RIGHT to container 2 and swap container index
    setTimeout(() => {
      const container2Style = getComputedStyle(imgContainer2);
      const leftNew =
        parseInt(container2Style.left) + parseInt(container2Style.width) + "px";
      // prevent transition
      imgContainer1.style.transition = "none";
      imgContainer1.style.left = leftNew;

      // swap containers
      containerIndexCurrent = 0;
      const temp = imgContainer1;
      imgContainer1 = imgContainer2;
      imgContainer2 = temp;
    }, transitionInt);
  }

  // once shift is done => invert container indexes!!

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
// setInterval(() => {
//   slideNext()
// },3000)
