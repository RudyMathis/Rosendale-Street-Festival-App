import { useState, useEffect } from "react";
import useLabels from "../../hooks/UseLabels";
import ErrorMessage from "../../UI/ErrorMessage";
import "../../styles/members.css";

type EditMemberProps = {
    member: { _id: string; name: string; role: string; password: string };
    onSave: (updatedMember: { _id: string; name: string; role: string; password: string }) => void;
    onCancel: () => void;
};

const EditMember: React.FC<EditMemberProps> = ({ member, onSave, onCancel }) => {
    const [updatedMember, setUpdatedMember] = useState(member);
    const labels = useLabels();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(updatedMember);
    };

    if (!labels) {
        return <ErrorMessage />
    }

    return (
            <form className="edit-member-form" onSubmit={handleSubmit}>
                <label className="member-label">
                    {labels.adminPanel.role}
                    <select
                        name="role"
                        value={updatedMember.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value={labels.role.level2}>{labels.displayRole.level2}</option>
                        <option value={labels.role.level3}>{labels.displayRole.level3}</option>
                        <option value={labels.role.level4}>{labels.displayRole.level4}</option>
                    </select>
                </label>
                <label className="member-label">
                    {labels.adminPanel.name}
                    <input
                        type="text"
                        name="name"
                        value={updatedMember.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label className="member-label">
                    {labels.adminPanel.password}
                    <input
                        type="password"
                        name="password"
                        value={updatedMember.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <div className="edit-member-buttons">
                    <button type="submit">{labels.actions.save}</button>
                    <button type="button" onClick={onCancel}>{labels.actions.cancel}</button>
                </div>
            </form>
    );
};

export default EditMember;
