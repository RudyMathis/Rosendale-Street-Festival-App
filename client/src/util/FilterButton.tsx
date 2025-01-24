type FilterButtonProps = {
    name: string;
    field: string;
    onClick: () => void;
    selected: string;
};

const FilterButton = ({ name, onClick, selected }: FilterButtonProps) => (
    <button className={`filter-button ${selected}`} onClick={onClick}>{name}</button>
);

export default FilterButton;
