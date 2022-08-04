import { useMemo } from 'react'

export const usePagination = ({ totalCount, pageSize, siblingCount = 1, currentPage }) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)
    const dots = '...'
    const totalPageNumbers = siblingCount + 5

    if (!totalCount || totalCount == 0) return [1]
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (totalPageCount < 10) {
      return range(1, totalPageCount)
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let itemCount = 2 + 2 * siblingCount
      let leftRange = range(1, itemCount)
      let rightRange = range(totalPageCount - itemCount + 1, totalPageCount)
      return [...leftRange, dots, ...rightRange]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let itemCount = 2 + 2 * siblingCount
      let leftRange = range(1, itemCount)
      let rightRange = range(totalPageCount - itemCount, totalPageCount)
      return [...leftRange, dots, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, '..', ...middleRange, dots, lastPageIndex]
    }
  }, [totalCount, pageSize, siblingCount, currentPage])

  return paginationRange
}

const range = (start, end) => {
  let length = end - start + 1

  return Array.from({ length }, (_, idx) => idx + start)
}
