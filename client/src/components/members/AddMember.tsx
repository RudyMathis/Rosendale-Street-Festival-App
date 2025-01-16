import { useState } from "react";
import useLabels from "../../hooks/UseLabels";
import ErrorMessage from "../../UI/ErrorMessage";
type AddMemberProps = {
    onAdd: (newMember: { name: string; role: string; password: string }) => void;
};

const AddMember: React.FC<AddMemberProps> = ({ onAdd }) => {
    const [newMember, setNewMember] = useState<{ name: string; role: string; password: string }>({
        name: "",
        role: "member",  // Default role
        password: "",
    });
    const labels = useLabels();

    if (!labels) {
        return <ErrorMessage />
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMember((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(newMember);
        setNewMember({ name: "", role: labels.role.level2, password: "" }); // Clear form after submission
    };

    return (
        <div className="add-member">
        <h2>Add New Member</h2>
            <form className="container-shadow" onSubmit={handleSubmit}>
                <label className="member-label">
                    Name: 
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
                    Role: 
                    <select
                        name="role"
                        value={newMember.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value={labels.role.level2}>{labels.displayRole.level2}</option>
                        <option value={labels.role.level3}>{labels.displayRole.level3}</option>
                        <option value={labels.role.level4}>{labels.displayRole.level4}</option>
                    </select>
                </label>
                <label className="member-label">
                    Password: 
                    <input
                        type="password"
                        name="password"
                        value={newMember.password}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button className="add-member-button" type="submit">Add {labels.displayRole.level2}</button>
            </form>
        </div>
    );
};

export default AddMember;
