import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";
import { useUserContext } from "../context/UserContext";
import Login from "./Login";
import useRecords from "../hooks/UseRecords";
import useLabels from "../hooks/UseLabels";
import FormInput from "../util/FormInput";
import LoginReminder from "../UI/LoginReminder";
import "../styles/CreateRecord.css";

export default function Record() {

  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const { refreshRecords } = useRecords(); // Import from context

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;

      setIsNew(false);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`); // part of hook
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
        return;
      }

      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }

    fetchData();
  }, [params.id, navigate]);

  const { canViewContent, canViewActions } = useRoleContext();
  const { currentUser } = useUserContext();

  /******************************************* 
  ******************************************* 
  ******************************************* 
  Update this if changes are made to the form
  *******************************************
  *******************************************
  *******************************************/
  const serverLabel = useLabels();

  const [form, setForm] = useState({
    [serverLabel.record.name]: "", 
    [serverLabel.record.email]: "", 
    [serverLabel.record.level]: "", 
    [serverLabel.record.committeNotes]: "", 
    [serverLabel.record.members]: 1,
    [serverLabel.record.hudsonValley]: false, 
    [serverLabel.record.shirtSizeXS]: 0, 
    [serverLabel.record.shirtSizeS]: 0, 
    [serverLabel.record.shirtSizeM]: 0,
    [serverLabel.record.shirtSizeL]: 0,
    [serverLabel.record.shirtSizeXL]: 0, 
    [serverLabel.record.shirtSizeXXL]: 0, 
    [serverLabel.record.primaryContact]: "",
    [serverLabel.record.primaryEmail]: "", 
    [serverLabel.record.primaryPhone]: "", 
    [serverLabel.record.primaryAddress]: "",
    [serverLabel.record.secondaryContact]: "", 
    [serverLabel.record.secondaryEmail]: "", 
    [serverLabel.record.secondaryPhone]: "", 
    [serverLabel.record.approval]: false,
    [serverLabel.record.nameOfUser]: currentUser?.name,
    [serverLabel.record.editedTime]: new Date().toLocaleDateString(),
  });


  const formSections = [
    {
      title: "Performer/Band",
      fields: [
        { label: serverLabel.record.name, name: serverLabel.record.name, type: "text", placeholder: "Enter your name", required: true },
        { label: serverLabel.record.email, name: serverLabel.record.email, type: "email", placeholder: "Enter your email", required: true },
        { label: serverLabel.record.level, name: serverLabel.record.level, type: "radio", options: ["Low", "Medium", "High"] },
        { label: serverLabel.record.committeNotes, name: serverLabel.record.committeNotes, type: "textarea", placeholder: "Committee Notes" },
        { label: serverLabel.record.members, name: serverLabel.record.members, type: "number", placeholder: "Number of members", required: true },
        { label: serverLabel.record.hudsonValley, name: serverLabel.record.hudsonValley, type: "checkbox" },
      ],
    },
    {
      title: "T-shirt Sizes",
      fields: [
        { label: serverLabel.record.shirtSizeXS, name: serverLabel.record.shirtSizeXS, type: "number" },
        { label: serverLabel.record.shirtSizeS, name: serverLabel.record.shirtSizeS, type: "number" },
        { label: serverLabel.record.shirtSizeM, name: serverLabel.record.shirtSizeM, type: "number" },
        { label: serverLabel.record.shirtSizeL, name: serverLabel.record.shirtSizeL, type: "number" },
        { label: serverLabel.record.shirtSizeXL, name: serverLabel.record.shirtSizeXL, type: "number" },
        { label: serverLabel.record.shirtSizeXXL, name: serverLabel.record.shirtSizeXXL, type: "number" },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        { label: serverLabel.record.primaryContact, name: serverLabel.record.primaryContact, type: "text", required: true },
        { label: serverLabel.record.primaryEmail, name: serverLabel.record.primaryEmail, type: "email", required: true },
        { label: serverLabel.record.primaryPhone, name: serverLabel.record.primaryPhone, type: "tel", required: true },
        { label: serverLabel.record.primaryAddress, name: serverLabel.record.primaryAddress, type: "text", required: true },
        { label: serverLabel.record.secondaryContact, name: serverLabel.record.secondaryContact, type: "text" },
        { label: serverLabel.record.secondaryEmail, name: serverLabel.record.secondaryEmail, type: "email" },
        { label: serverLabel.record.secondaryPhone, name: serverLabel.record.secondaryPhone, type: "tel" },
      ],
    },
    {
      title: "Approval",
      fields: [
        { label: serverLabel.record.approval, name: serverLabel.record.approval, type: "checkbox" },
      ],
    },
  ];


  const updateForm = (value: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record${isNew ? "" : `/${params.id}`}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      refreshRecords();
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      navigate("/");
    }
  };

  return (
    <>
      {canViewContent ? 
        <section className="create-record-container container-shadow">
          <h3>{isNew ? "Create" : "Update"} Performer/Band</h3>
          <form className="record-form" onSubmit={onSubmit}>
            {formSections.map(({ title, fields }) => (
              title === serverLabel.record.approval ? (
                canViewActions && (
                  <fieldset key={title} className="create-record-form-section">
                    <legend className="create-record-form-section-title">{title}</legend>
                    {fields.map(({ name, ...props }) => (
                      <FormInput
                        key={name}
                        name={name}
                        value={form[name as keyof typeof form] ?? ""}
                        onChange={(e) =>
                          updateForm({ [name]: e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value })
                        }
                        {...props}
                      />
                    ))}
                  </fieldset>
                )
              ) : (
                <fieldset key={title} className="create-record-form-section">
                  <legend className="create-record-form-section-title">{title}</legend>
                  {fields.map(({ name, ...props }) => (
                    <FormInput
                      key={name}
                      name={name}
                      value={form[name as keyof typeof form] ?? ""}
                      onChange={(e) =>
                        updateForm({ [name]: e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value })
                      }
                      {...props}
                    />
                  ))}
                </fieldset>
              )
            ))}
            <input type="submit" value="Save Performer/Band Record" />
          </form>
        </section>
      : 
        <>
          <LoginReminder />
          <Login />
        </>}
    </>
  );

}
