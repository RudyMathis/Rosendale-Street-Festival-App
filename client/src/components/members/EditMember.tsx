import { useState, useEffect } from "react";
import useLabels from "../../hooks/UseLabels";
import { useSubmit } from "../../hooks/UseSubmit";
import Button from "../../util/Button";
import Label from "../../labels/UILabel.json"
import "../../styles/members.css";

type EditMemberProps = {
    member: { _id: string; name: string; role: string; password: string };
    onSave: (updatedMember: { _id: string; name: string; role: string; password: string }) => void;
    onCancel: () => void;
};

const EditMember: React.FC<EditMemberProps> = ({ member, onSave, onCancel }) => {
    const [updatedMember, setUpdatedMember] = useState(member);
    const serverLabel = useLabels();
    const handleSubmit = useSubmit(onSave);

    useEffect(() => {
        setUpdatedMember(member); // Reset to the original member data if the component re-renders
    }, [member]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedMember((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
            <form className="edit-member-form" onSubmit={handleSubmit(updatedMember)}>
                <label className="member-label">
                    {Label.adminPanel.role}
                    <select
                        name="role"
                        value={updatedMember.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value={serverLabel.role.level2[0]}>{serverLabel.role.level2[1]}</option>
                        <option value={serverLabel.role.level3[0]}>{serverLabel.role.level3[1]}</option>
                        <option value={serverLabel.role.level4[0]}>{serverLabel.role.level4[1]}</option>
                    </select>
                </label>
                <label className="member-label">
                    {Label.adminPanel.name}
                    <input
                        type="text"
                        name="name"
                        value={updatedMember.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label className="member-label">
                    {Label.adminPanel.password}
                    <input
                        type="password"
                        name="password"
                        value={updatedMember.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <div className="edit-member-buttons">
                    <Button 
                        label={Label.actions.save} 
                        className="button"
                        type="submit"
                    />
                    <Button 
                        label={Label.actions.cancel}
                        onClick={onCancel}
                        className="button"
                        type="button"
                    />
                </div>
            </form>
    );
};

export default EditMember;
