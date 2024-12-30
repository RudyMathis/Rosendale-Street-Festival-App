import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "./FormInput";
import { useRoleContext } from "./context/RoleContext";


const formSections = [
  {
    title: "Performer/Band",
    fields: [
      { label: "Name", name: "name", type: "text", placeholder: "Enter your name", required: true },
      { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
      { label: "Ranking/Priority", name: "level", type: "radio", options: ["Low", "Medium", "High"] },
      { label: "Committee Notes", name: "committeNotes", type: "textarea", placeholder: "Committee Notes" },
      { label: "How many members", name: "members", type: "number", placeholder: "Number of members", required: true },
      { label: "Located in Hudson Valley", name: "hudsonValley", type: "checkbox" },
    ],
  },
  {
    title: "T-shirt Sizes",
    fields: [
      { label: "Size XS", name: "shirtSizeXS", type: "number" },
      { label: "Size S", name: "shirtSizeS", type: "number" },
      { label: "Size M", name: "shirtSizeM", type: "number" },
      { label: "Size L", name: "shirtSizeL", type: "number" },
      { label: "Size XL", name: "shirtSizeXL", type: "number" },
      { label: "Size XXL", name: "shirtSizeXXL", type: "number" },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      { label: "Primary Name", name: "primaryContact", type: "text", required: true },
      { label: "Primary Email", name: "primaryEmail", type: "email", required: true },
      { label: "Primary Phone Number", name: "primaryPhone", type: "tel", required: true },
      { label: "Primary Address", name: "primaryAddress", type: "text", required: true },
      { label: "Secondary Name", name: "secondaryContact", type: "text" },
      { label: "Secondary Email", name: "secondaryEmail", type: "email" },
      { label: "Secondary Phone Number", name: "secondaryPhone", type: "tel" },
    ],
  },
  {
    title: "Approval",
    fields: [
      { label: "Approve", name: "approval", type: "checkbox" },
    ],
  },
];

export default function Record() {

  const { canViewActions } = useRoleContext();

  const [form, setForm] = useState({
    name: "", email: "", level: "", committeNotes: "", members: 1,
    hudsonValley: false, shirtSizeXS: 0, shirtSizeS: 0, shirtSizeM: 0,
    shirtSizeL: 0, shirtSizeXL: 0, shirtSizeXXL: 0, primaryContact: "",
    primaryEmail: "", primaryPhone: "", primaryAddress: "",
    secondaryContact: "", secondaryEmail: "", secondaryPhone: "", approval: false
  });
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

  const updateForm = (value: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5050/record${isNew ? "" : `/${params.id}`}`,
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
    <section className="create-record-container container-shadow">
      <h3>{isNew ? "Create" : "Update"} Performer/Band</h3>
      <form className="record-form" onSubmit={onSubmit}>
        {formSections.map(({ title, fields }) => (
          title === "Approval" ? (
            canViewActions && (
              <article key={title} className="create-record-form-section">
                <h2 className="create-record-form-section-title">{title}</h2>
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
              </article>
            )
          ) : (
            <article key={title} className="create-record-form-section">
              <h2 className="create-record-form-section-title">{title}</h2>
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
            </article>
          )
        ))}
        <input type="submit" value="Save Performer/Band Record" />
      </form>
    </section>
  );
}
