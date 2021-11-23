export default function getElementViewLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;

    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }

    if (document.compatMode == "BackCompat") {
      var elementScrollLeft = document.body.scrollLeft;
    } else {
      var elementScrollLeft = document.documentElement.scrollLeft;
    }

    return actualLeft - elementScrollLeft;
  }