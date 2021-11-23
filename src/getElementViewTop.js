export default function getElementViewTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent;
    }

    if (document.compatMode == "BackCompat") {
      var elementScrollTop = document.body.scrollTop;
    } else {
      var elementScrollTop = document.documentElement.scrollTop;
    }

    return actualTop - elementScrollTop;
  }