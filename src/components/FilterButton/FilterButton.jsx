const FilterButton = ({ label, active, onClick, onFocus, onBlur }) => {
  return (
    <button
      className={`filter-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {label}
    </button>
  );
};

export default FilterButton;

