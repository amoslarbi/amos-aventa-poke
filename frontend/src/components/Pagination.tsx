// Pagination interface
interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  limit: number;
  total: number;
}

export default function Pagination({ page, setPage, limit, total }: PaginationProps) {
  // Compute total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 ${page !== totalPages ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      >
        Previous
      </button>
      <span className="px-4 py-2">Page {page} of {totalPages}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 ${page !== totalPages ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      >
        Next
      </button>
    </div>
  );
}