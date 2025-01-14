type FilterButtonProps = {
    name: string;
    field: string;
    onClick: () => void;
};

const FilterButton = ({ name, onClick }: FilterButtonProps) => (
    <button onClick={onClick}>{name}</button>
);

export default FilterButton;
