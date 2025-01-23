import { useState, useEffect } from "react";
import { useRoleContext } from "../../context/RoleContext";
import useLabels from "../../hooks/UseLabels";
import AddMember from "./AddMember";
import EditMember from "./EditMember";
import DeleteMember from "./DeleteMember";
import Login from "../Login";
import LoginReminder from "../../UI/LoginReminder";
import ErrorMessage from "../../UI/ErrorMessage";

type Member = {
  _id: string;
  name: string;
  role: string;
  password: string;
};

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const { canEditRecords } = useRoleContext();
  const labels = useLabels();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/members`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleAddMember = async (newMember: { name: string; role: string; password: string }) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMember),
        });

        if (!response.ok) {
            throw new Error('Failed to add member');
        }

        const addedMember = await response.json();

        // Update the state with the new member, including the _id from the database
        setMembers((prevMembers) => [...prevMembers, addedMember]);
    } catch (error) {
        console.error('Error adding member:', error);
    }
};

  const handleEditMember = async (updatedMember: { _id: string; name: string; role: string; password: string }) => {
    try {
        // Create a new object without _id to avoid trying to update it
        const { _id, ...memberWithoutId } = updatedMember;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/members/${_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberWithoutId),
        });

        if (!response.ok) {
            throw new Error('Failed to update member');
        }

        // Update the state with the updated member information
        setMembers((prevMembers) =>
            prevMembers.map((member) =>
                member._id === updatedMember._id ? updatedMember : member
            )
        );
        setEditingMemberId(null); // Exit edit mode
    } catch (error) {
        console.error('Error updating member:', error);
    }
};

  const handleDeleteMember = async (id: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/members/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete member');
        }

        setMembers((prevMembers) => prevMembers.filter((member) => member._id !== id));
    } catch (error) {
        console.error('Error deleting member:', error);
    }
};


  if (loading) return <p>Loading members...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!labels) {
    return <ErrorMessage />
}


  return (
    <>
      {canEditRecords ? 
        <section>
          <AddMember onAdd={handleAddMember} />
          <h2>{labels.adminPanel.title}</h2>
          <ul>
            {members.map((member) => (
              <li className="container-shadow member-list-container" key={member._id}>
                <div className="member-container">
                  <div className="member-details">
                    <div className="member-label">
                        <strong>{labels.adminPanel.role}</strong><span>{member.role}</span>
                    </div>
                    <div className="member-label">
                        <strong>{labels.adminPanel.name}</strong><span>{member.name}</span>
                    </div>
                    <div className="member-label">
                        <strong>{labels.adminPanel.password}</strong><span>{member.password}</span>
                    </div>
                  </div>
                  <div className="member-button-container">
                    <button onClick={() => setEditingMemberId(member._id)}>{labels.actions.edit}</button>
                      <DeleteMember memberId={member._id} deleteMemeber={handleDeleteMember} role={member.role} />
                  </div>
                </div>
                {editingMemberId === member._id && (
                  <>
                    <div className="edit-icon">&#10233;</div>
                    <EditMember
                        member={member}
                        onSave={handleEditMember}
                        onCancel={() => setEditingMemberId(null)} />
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
        : 
        <>
          <LoginReminder />
          <Login />
        </>}
    </>
  );
};

export default MembersPage;