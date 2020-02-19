import range from './range'
import getMoveLeftPage from './getMoveLeftPage'
import getMoveRightPage from './getMoveRightPage'

/**
 * Экспорт
 */
export default usePagination

/**
 * Хук пагинации
 * @param {number} totalPages количество страниц
 * @param {number} currentPage текущая страница
 * @param {{
 *  pageNeighbours: number,
 *  onPageClick: function,
 *  onPageClickPropName: string,
 *  leftChar: string,
 *  rightChar: string
 * }} opts конфигурируемые свойства
 * @returns {{[p: string]: *|(function(): void)|(function(): void)|(function(): void), children: *}[]|*[]}
 */
function usePagination(
  totalPages,
  currentPage,
  opts = {
    pageNeighbours: 2,
    onPageClick: console.log,
    onPageClickPropName: 'onClick',
    onCurrentActivePropName: 'active',
    leftChar: '<<',
    rightChar: '>>'
  }
) {
  // пагинация для одной страницы не нужна
  if(totalPages === 1) {
    return []
  }

  const {
    pageNeighbours,
    onPageClick,
    onPageClickPropName,

    leftChar,
    rightChar
  } = opts

  let resultPaginationPages = []

  // количество отображаемых элементов пагинации
  // соседи с каждой стороны от текущей + первая и последняя
  const totalNumbers = pageNeighbours * 2 + 3

  // к кол-ву отображаемых добавляются управляющие элементы [назад(<)] && [вперед(>)]
  const totalBlocks = totalNumbers + 2

  if(totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbours)
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours)

    let pages = range(startPage, endPage)

    const hasLeftSpill = startPage > 2
    const hasRightSpill = (totalPages - endPage) > 1
    const spillOffset = totalNumbers - (pages.length +1)

    // (1) < {5 6} [7] {8 9} (10)
    if(hasLeftSpill && !hasRightSpill) {
      const extraPages = range(startPage - spillOffset, startPage - 1)
      pages = [leftChar, ...extraPages, ...pages]
    }

    // (1) {2 3} [4] {5 6} > (10)
    if(!hasLeftSpill && hasRightSpill) {
      const extraPages = range(endPage + 1, endPage + spillOffset)
      pages = [...pages, ...extraPages, rightChar]
    }

    // (1) < {4 5} [6] {7 8} > (10)
    if(hasLeftSpill && hasRightSpill) {
      pages = [leftChar, ...pages, rightChar]
    }

    resultPaginationPages = [1, ...pages, totalPages]
  } else {
    resultPaginationPages = range(1, totalPages)
  }

  return resultPaginationPages.map(item => ({
    children: item,
    [onPageClickPropName]: item === leftChar
      ? () => onPageClick(getMoveLeftPage(currentPage, pageNeighbours))
      : item === rightChar
        ? () => onPageClick(getMoveRightPage(currentPage, pageNeighbours))
        : () => onPageClick(item)
  }))
}
