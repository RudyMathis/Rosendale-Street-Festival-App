import { useState } from "react";

type AddMemberProps = {
    onAdd: (newMember: { name: string; role: string; password: string }) => void;
};

const AddMember: React.FC<AddMemberProps> = ({ onAdd }) => {
    const [newMember, setNewMember] = useState<{ name: string; role: string; password: string }>({
        name: "",
        role: "member",  // Default role
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMember((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Add new member (you can integrate it with the backend here)
        onAdd(newMember);
        setNewMember({ name: "", role: "member", password: "" }); // Clear form after submission
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
                        <option value="member"> Member</option>
                        <option value="moderator"> Moderator</option>
                        <option value="admin"> Admin</option>
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
                <button className="add-member-button" type="submit">Add Member</button>
            </form>
        </div>
    );
};

export default AddMember;
