function Navigation({ currentPage, totalPages, onNext, onPrevious }) {
  return (
    <nav className="navigation">
      <button 
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>
      <span className="page-indicator">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </nav>
  );
}

export default Navigation;

