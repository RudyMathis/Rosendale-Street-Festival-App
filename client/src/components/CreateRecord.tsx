import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "../UI/FormInput";
import { useRoleContext } from "../context/RoleContext";
import { useUserContext } from "../context/UserContext";
import Login from "./Login";
import LoginReminder from "../UI/LoginReminder";
import useLabels from "../hooks/UseLabels";
import ErrorMessage from "../UI/ErrorMessage";
import "../styles/CreateRecord.css";

export default function Record() {

  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;

      setIsNew(false);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record/${id}`);
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

  const [form, setForm] = useState({
    name: "", 
    email: "", 
    level: "", 
    committeNotes: "", 
    members: 1,
    hudsonValley: false, 
    shirtSizeXS: 0, 
    shirtSizeS: 0, 
    shirtSizeM: 0,
    shirtSizeL: 0,
    shirtSizeXL: 0, 
    shirtSizeXXL: 0, 
    primaryContact: "",
    primaryEmail: "", 
    primaryPhone: "", 
    primaryAddress: "",
    secondaryContact: "", 
    secondaryEmail: "", 
    secondaryPhone: "", 
    approval: false,
    nameOfUser: currentUser?.name,
    editedTime: new Date().toLocaleDateString(),
  });

  const labels = useLabels();
  if (!labels) {
    return <ErrorMessage />;
  }

  const formSections = [
    {
      title: "Performer/Band",
      fields: [
        { label: labels.record.fields.name, name: labels.record.fields.name, type: "text", placeholder: "Enter your name", required: true },
        { label: labels.record.fields.email, name: labels.record.fields.email, type: "email", placeholder: "Enter your email", required: true },
        { label: labels.record.fields.level, name: labels.record.fields.level, type: "radio", options: ["Low", "Medium", "High"] },
        { label: labels.record.fields.committeNotes, name: labels.record.fields.committeNotes, type: "textarea", placeholder: "Committee Notes" },
        { label: labels.record.fields.members, name: labels.record.fields.members, type: "number", placeholder: "Number of members", required: true },
        { label: labels.record.fields.hudsonValley, name: labels.record.fields.hudsonValley, type: "checkbox" },
      ],
    },
    {
      title: "T-shirt Sizes",
      fields: [
        { label: labels.record.fields.shirtSizeXS, name: labels.record.fields.shirtSizeXS, type: "number" },
        { label: labels.record.fields.shirtSizeS, name: labels.record.fields.shirtSizeS, type: "number" },
        { label: labels.record.fields.shirtSizeM, name: labels.record.fields.shirtSizeM, type: "number" },
        { label: labels.record.fields.shirtSizeL, name: labels.record.fields.shirtSizeL, type: "number" },
        { label: labels.record.fields.shirtSizeXL, name: labels.record.fields.shirtSizeXL, type: "number" },
        { label: labels.record.fields.shirtSizeXXL, name: labels.record.fields.shirtSizeXXL, type: "number" },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        { label: labels.record.fields.primaryContact, name: labels.record.fields.primaryContact, type: "text", required: true },
        { label: labels.record.fields.primaryEmail, name: labels.record.fields.primaryEmail, type: "email", required: true },
        { label: labels.record.fields.primaryPhone, name: labels.record.fields.primaryPhone, type: "tel", required: true },
        { label: labels.record.fields.primaryAddress, name: labels.record.fields.primaryAddress, type: "text", required: true },
        { label: labels.record.fields.secondaryContact, name: labels.record.fields.secondaryContact, type: "text" },
        { label: labels.record.fields.secondaryEmail, name: labels.record.fields.secondaryEmail, type: "email" },
        { label: labels.record.fields.secondaryPhone, name: labels.record.fields.secondaryPhone, type: "tel" },
      ],
    },
    {
      title: "Approval",
      fields: [
        { label: labels.record.fields.approval, name: labels.record.fields.approval, type: "checkbox" },
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
              title === labels.record.fields.approval ? (
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
