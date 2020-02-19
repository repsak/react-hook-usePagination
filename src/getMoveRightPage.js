export default getMoveRightPage

function getMoveRightPage(currentPage, neighbours) {
  return currentPage + (neighbours * 2) + 1;
}
