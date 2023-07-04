// DOM elements
const btnNext = document.querySelector("button.btn-next");
const btnPrevious = document.querySelector("button.btn-previous");
const divImages = document.querySelector("div.images");

const divIcons = document.querySelector(".icons");
const iconElements = [];

// config values (grab from CSS variables)
const config = getComputedStyle(document.documentElement);
const imageWidth = parseInt(config.getPropertyValue("--image-width"));
const imageHeight = parseInt(config.getPropertyValue("--image-height"));
const transition = config.getPropertyValue("--transition");
const transitionInt =
  parseInt(config.getPropertyValue("--transition-number")) * 1100;

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

let currentIndex = 0;
let blockButtons = false;
let imageIndexes = [0, 1, 2, 3];

// place images ABSOLUTELY in container
const imgElements = images.map((img, i) => {
  // create image
  const imgElement = document.createElement("img");
  imgElement.src = img;
  imgElement.style.left = i * imageWidth + "px";
  divImages.appendChild(imgElement);

  // create icon
  const iconElement = document.createElement("div");
  iconElement.innerText = i + 1;
  iconElement.classList.add("icon");
  // make first icon active
  if (i == 0) iconElement.classList.add("active");
  iconElements.push(iconElement);
  divIcons.appendChild(iconElement);

  return imgElement;
});

const updateIconActive = (itemIndex) => {
  // color the selected icon (at index position)
  iconElements.forEach((ico, i) => {
    if (i === itemIndex) {
      return ico.classList.add("active");
    }
    ico.classList.remove("active");
  });
};

// create icon handlers
iconElements.forEach((icon, itemIndex) => {
  icon.addEventListener("click", () => {
    if (blockButtons) return;

    updateIconActive(itemIndex);

    // examples:
    // new 2, current 0  => diff 2
    // new 0, current 2 => diff -2
    const diff = itemIndex - currentIndex;
    console.log({ currentIndex, itemIndex, diff });

    // if 0 => we do nothing
    if (diff === 0) return;

    // going forward: simply slide x steps forward
    if (diff > 0) {
      return slideNext(diff);
    }

    // move "X" steps to item user has chosen
    slidePrevious(diff);
  });
});

const moveItem = (item, steps, doTransition = true) => {
  if (doTransition) {
    item.style.transition = transition;
    item.style.removeProperty("z-index");
  } else {
    item.style.transition = "none";
    item.style.zIndex = -1;
  }
  const { left } = getComputedStyle(item);
  const leftNew = parseInt(left) + imageWidth * -1 * steps + "px";
  item.style.left = leftNew;
};

const slideImages = (inc) => {
  // block buttons => to prevent multi sliding
  if (blockButtons) return;
  blockButtons = true;

  /**
   * reordering is performed each time we move "out of bounds" (e.g. below index 0)
   * then we reorder the items into their naturals order after the move
   */
  let reorderItems = false;

  // update index
  currentIndex += inc;

  console.log({ currentIndex });
  // reached outer bound? copy image from other end
  if (currentIndex < 0) {
    // move LAST item to FIRST position
    currentIndex = imgElements.length - 1;
    moveItem(imgElements[imgElements.length - 1], imgElements.length, false);
    reorderItems = true; // mark for re-ordering after slide was finished
  } else if (currentIndex === imgElements.length) {
    currentIndex = 0;
    // move FIRST item to LAST position
    moveItem(imgElements[0], -imgElements.length, false);
    reorderItems = true; // mark for re-ordering after slide was finished
  }

  // update selected item
  updateIconActive(currentIndex);

  // slide images in given direction
  setTimeout(() => {
    imgElements.forEach((img, i) => {
      // activate smooth transition
      moveItem(img, inc, true);
    });
  }, 100);

  // unblock buttons => so we can slide again
  setTimeout(() => {
    // bring items back into order after move has finished
    if (reorderItems) {
      // index 0 ? => move LAST items before first
      let itemsReorder;
      if (currentIndex === 0) {
        itemsReorder = imgElements.slice(1);
      }
      // index LAST? => move FIRST items after last
      else {
        itemsReorder = imgElements.slice(0, imgElements.length - 1);
      }
      // move items out of order into order again
      itemsReorder.forEach((img, i) => {
        // activate smooth transition
        moveItem(img, (itemsReorder.length+1)*(currentIndex === 0 ? -1 : 1), false);
      });
    }
    blockButtons = false;
  }, transitionInt);
};

// click RIGHT
const slideNext = (inc = 1) => slideImages(inc);

// click LEFT
const slidePrevious = (inc = -1) => slideImages(inc);

// make buttons work...
btnPrevious.addEventListener("click", () => slidePrevious());
btnNext.addEventListener("click", () => slideNext());

// autoslide...
setInterval(() => {
  slideNext();
}, 3000);
