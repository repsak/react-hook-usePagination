export default getMoveLeftPage

function getMoveLeftPage(currentPage, neighbours) {
  return currentPage - (neighbours * 2) - 1
}
