import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  translations?: {
    previous?: string
    next?: string
  }
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage = true,
  hasPreviousPage = true,
  translations = {},
}: PaginationProps) {
  const { previous = 'Previous', next = 'Next' } = translations

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      pageNum => {
        // Show first page, last page, current page, and pages around current
        return (
          pageNum === 1 ||
          pageNum === totalPages ||
          Math.abs(pageNum - currentPage) <= 1
        )
      }
    )
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        aria-label={previous}
      >
        <ChevronLeft className="w-4 h-4" />
        {previous}
      </button>

      <div className="flex items-center gap-2">
        {pageNumbers.map((pageNum, index, array) => {
          const prevPageNum = array[index - 1]
          const showEllipsis = prevPageNum && pageNum - prevPageNum > 1

          return (
            <div key={pageNum} className="flex items-center gap-2">
              {showEllipsis && <span className="text-gray-400 px-2">...</span>}
              <button
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-md transition-colors ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === currentPage ? 'page' : undefined}
              >
                {pageNum}
              </button>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        aria-label={next}
      >
        {next}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
