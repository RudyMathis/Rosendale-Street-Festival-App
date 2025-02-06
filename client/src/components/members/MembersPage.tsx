import { useState, useEffect } from "react";
import { useRoleContext } from "../../context/RoleContext";
import AddMember from "./AddMember";
import EditMember from "./EditMember";
import DeleteMember from "./DeleteMember";
import Login from "../Login";
import Button from "../../util/Button";
import LoginReminder from "../../UI/LoginReminder";
import LoadingMessage from "../../UI/LoadingMessage";
import Label from "../../labels/UILabel.json"

type Member = {
  _id: string;
  name: string;
  role: string;
  password: string;
};

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [ isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const { canEditRecords } = useRoleContext();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/members` // Make into hook
        );

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return <LoadingMessage message="Loading Members List" />;
  }

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

  if (error) return <p>Error: {error}</p>; // update

  return (
    <section className="members-page">
      {canEditRecords ? 
        <>
          <h2>{Label.adminPanel.title}</h2>
          <div className="member-page-container card">
            <AddMember onAdd={handleAddMember} />
            <ul className="member-list-container">
              {members.map((member) => (
                <li className="member-container" key={member._id}>
                  <div className="member-details">
                    <div className="member-label">
                      <strong>{Label.adminPanel.role}</strong>
                      <span>{member.role}</span>
                    </div>
                    <div className="member-label">
                      <strong>{Label.adminPanel.name}</strong>
                      <span>{member.name}</span>
                    </div>
                    <div className="member-label">
                      <strong>{Label.adminPanel.password}</strong>
                      <span>{member.password}</span>
                    </div>
                  </div>
                  <div className="member-button-container">
                    <Button
                      label={Label.actions.edit}
                      onClick={() => setEditingMemberId(member._id)}
                      className="button edit-button"
                      type="button"
                      role={member.role} // remove to edit 
                    />
                    <DeleteMember
                      memberId={member._id}
                      deleteMemeber={handleDeleteMember}
                      role={member.role} 
                    />
                  </div>
                  {member.role === `admin` && (
                    <code className="admin-label">Update in Code</code>
                  )}
                  {editingMemberId === member._id && (
                    <>
                      <div className="edit-icon">&#10233;</div>
                      <EditMember
                        member={member}
                        onSave={handleEditMember}
                        onCancel={() => setEditingMemberId(null)} 
                      />
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
        : 
        <>
          <LoginReminder />
          <Login />
        </>}
    </section>
  );
};

export default MembersPage;