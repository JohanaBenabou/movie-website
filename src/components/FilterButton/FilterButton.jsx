const FilterButton = ({ label, active, focused, onClick }) => {
  return (
    <button
      className={`filter-btn ${active ? 'active' : ''} ${focused ? 'focused' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default FilterButton;