import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, focused, selectedPage, position }) => {
  const pages = [];
  const maxVisible = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className={`pagination-btn ${focused && position === 'prev' ? 'keyboard-focused' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>

      <div className="pagination-numbers">
        {startPage > 1 && (
          <>
            <button
              className={`pagination-number ${1 === currentPage ? 'active' : ''} ${focused && position === 'page' && selectedPage === 1 ? 'keyboard-focused' : ''}`}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            className={`pagination-number ${page === currentPage ? 'active' : ''} ${focused && position === 'page' && selectedPage === page ? 'keyboard-focused' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button
              className={`pagination-number ${totalPages === currentPage ? 'active' : ''} ${focused && position === 'page' && selectedPage === totalPages ? 'keyboard-focused' : ''}`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={`pagination-btn ${focused && position === 'next' ? 'keyboard-focused' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;