import { useState } from "react";
import useLabels from "../../hooks/UseLabels";
import { useSubmit } from "../../hooks/UseSubmit";
import Button from "../../util/Button";
import Label from "../../labels/UILabel.json"
import "../../styles/members.css";
type AddMemberProps = {
    onAdd: (newMember: { name: string; role: string; password: string }) => void;
};

const AddMember: React.FC<AddMemberProps> = ({ onAdd }) => {
    const serverLabel = useLabels();
    const [newMember, setNewMember] = useState<{ name: string; role: string; password: string }>({
        name: "",
        role: `${serverLabel.role.level2[0]}`,  // Default role
        password: "",
    });

    const resetState = () => {
        setNewMember({ name: "", role: serverLabel.role.level2[0], password: "" });
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
        <div className="add-member-container">
            <h3>{Label.adminPanel.add}</h3>
            <div className="add-member">
                <form className="add-member-form" onSubmit={handleSubmit(newMember)}>
                    <label className="member-label">
                        <span className="role-label">{Label.adminPanel.name}</span>
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
                        <span className="role-label">{Label.adminPanel.role} </span> 
                        <select
                            name="role"
                            value={newMember.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value={serverLabel.role.level2[0]}>{serverLabel.role.level2[1]}</option>
                            <option value={serverLabel.role.level3[0]}>{serverLabel.role.level3[1]}</option>
                            <option value={serverLabel.role.level4[0]}>{serverLabel.role.level4[1]}</option>
                        </select>
                    </label>
                    <label className="member-label">
                        <span className="role-label">{Label.adminPanel.password}</span>
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
                        secondaryLabel={serverLabel.role.level2[1]}
                        className="add-member-button"
                        type="submit"
                    />
                </form>
            </div>
        </div>
    );
};

export default AddMember;
