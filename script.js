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
    // cases:
    // if 0 => we do nothing
    if (diff === 0) return;

    // from first to last => go one back
    if (diff > 0 && diff === imgElements.length - 1) {
      slidePrevious();
    }
    // from last to first => go one forward
    if (diff < 0 && Math.abs(diff) === imgElements.length - 1) {
      slideNext();
    }

    // just one diff => use normal slidiing
    if (diff === -1) slidePrevious();
    if (diff === 1) slideNext();

    // move "X" steps to item user has chosen
    slideNext(Math.abs(diff));
  });
});

const setIndex = (inc) => {
  if (currentIndex + inc >= imgElements.length) 
    currentIndex -= inc;
  else {
    currentIndex += inc
  }
  if (currentIndex < 0) {
    currentIndex = imgElements.length - 1;
  }

  // color the selected icon (at index position)
  iconElements.forEach((icon, i) => {
    if (i === currentIndex) {
      return icon.classList.add("active");
    }
    icon.classList.remove("active");
  });
};

const slideImages = (inc) => {
  imgElements.forEach((img, i) => {
    img.style.transition = transition;
    img.style.removeProperty("z-index");
    const { left } = getComputedStyle(img);
    const leftNew = parseInt(left) + imageWidth * inc + "px";
    img.style.left = leftNew;
  });

}

// click RIGHT
const slideNext = (inc = 1) => {
  if (blockButtons) return;
  blockButtons = true;

  setIndex(inc);

  // slide all images inc times to the LEFT
  slideImages(-inc)

  // WAIT until all items are MOVED smoothly
  // THEN move FIRST X items to last position in container (AFTER move left is finished!)
  setTimeout(() => {
    for (let i = inc; i > 0; i--) {
      const firstItem = imgElements[0];
      // firstItem.style.display = "none";
      firstItem.style.transition = "none"
      firstItem.style.zIndex = -1
      const newLeft = (imgElements.length - 1 - i) * imageWidth + "px";
      console.log(i, newLeft)
      firstItem.style.left = newLeft;

      // move element to LAST position in array
      const lastItemNew = imgElements.shift();
      imgElements.push(lastItemNew);
    }
    blockButtons = false;
  }, transitionInt);
};

// click LEFT
const slidePrevious = (inc = 1) => {
  if (blockButtons) return;
  blockButtons = true;

  setIndex(-inc);

  // slide all images inc times to the RIGHT
  slideImages(inc);

  // WAIT until all items were moved
  // then move LAST X images to FIRST position in container (AFTER items have moved)
  setTimeout(() => {
    for (let i = 0; i < inc; i++) {
      const lastItem = imgElements[imgElements.length - 1];
      lastItem.style.transition = "none";
      lastItem.style.zIndex = -1;
      // lastItem.style.display = "none";
      const leftNew = -imageWidth * (i+1) + "px";
      lastItem.style.left = leftNew;

      blockButtons = false;

      // move element to FIRST position in array
      const firstItemNew = imgElements.pop(); // remove last array item
      imgElements.unshift(firstItemNew); // add removed item at begin of array
    }
  }, transitionInt);
};


// make buttons work...
btnPrevious.addEventListener("click", () => slidePrevious(1));
btnNext.addEventListener("click", () => slideNext(1));

// autoslide...
// setInterval(() => {
//   slideNext()
// },3000)
