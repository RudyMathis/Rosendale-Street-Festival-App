import { useState } from "react";
import useLabels from "../../hooks/UseLabels";
import { useSubmit } from "../../hooks/UseSubmit";
import Button from "../../util/Button";
import Label from "../../labels/UILabel.json"
type AddMemberProps = {
    onAdd: (newMember: { name: string; role: string; password: string }) => void;
};

const AddMember: React.FC<AddMemberProps> = ({ onAdd }) => {
    const serverLabel = useLabels();
    const [newMember, setNewMember] = useState<{ name: string; role: string; password: string }>({
        name: "",
        role: `${serverLabel.role.level2}`,  // Default role
        password: "",
    });

    const resetState = () => {
        setNewMember({ name: "", role: serverLabel.role.level2, password: "" });
    };
    
    const handleSubmit = useSubmit(onAdd, resetState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMember((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="add-member">
        <h2>{Label.adminPanel.add} </h2>
            <form className="container-shadow" onSubmit={handleSubmit(newMember)}>
                <label className="member-label">
                    {Label.adminPanel.name} 
                    <input
                        type="text"
                        name="name"
                        value={newMember.name}
                        onChange={handleInputChange}
                        autoComplete="off"
                        required
                    />
                </label>
                <label className="member-label">
                {Label.adminPanel.role}  
                    <select
                        name="role"
                        value={newMember.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value={serverLabel.role.level2}>{Label.displayRole.level2}</option>
                        <option value={serverLabel.role.level3}>{Label.displayRole.level3}</option>
                        <option value={serverLabel.role.level4}>{Label.displayRole.level4}</option>
                    </select>
                </label>
                <label className="member-label">
                    {Label.adminPanel.password}  
                    <input
                        type="password"
                        name="password"
                        value={newMember.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <Button 
                    label={Label.actions.add}
                    secondaryLabel={Label.displayRole.level2}
                    className="add-member-button"
                    type="submit"
                />
            </form>
        </div>
    );
};

export default AddMember;
