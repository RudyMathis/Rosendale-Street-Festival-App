import { useState, useEffect } from "react";
import "../../styles/members.css";

type EditMemberProps = {
    member: { _id: string; name: string; role: string; password: string };
    onSave: (updatedMember: { _id: string; name: string; role: string; password: string }) => void;
    onCancel: () => void;
};

const EditMember: React.FC<EditMemberProps> = ({ member, onSave, onCancel }) => {
    const [updatedMember, setUpdatedMember] = useState(member);

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

    return (
            <form className="edit-member-form" onSubmit={handleSubmit}>
                <label className="member-label">
                    Role:
                    <select
                        name="role"
                        value={updatedMember.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="member"> Member</option>
                        <option value="moderator"> Moderator</option>
                        <option value="admin"> Admin</option>
                    </select>
                </label>
                <label className="member-label">
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={updatedMember.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label className="member-label">
                Password:
                    <input
                        type="password"
                        name="password"
                        value={updatedMember.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <div className="edit-member-buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
    );
};

export default EditMember;
