import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoleContext } from "../context/RoleContext";
import { useUserContext } from "../context/UserContext";
import Login from "./Login";
import ConfirmationModal from "./ConfirmationModal";
import useRecords from "../hooks/UseRecords";
import useLabels from "../hooks/UseLabels";
import FormInput from "../util/FormInput";
import Button from "../util/Button";
import LoginReminder from "../UI/LoginReminder";
import Label from "../labels/UILabel.json"
import "../styles/CreateRecord.css";

export default function Record() {
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const { refreshRecords } = useRecords();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

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

  const serverLabel = useLabels();

  const [form, setForm] = useState({
    [serverLabel.record.name[0]]: "", 
    [serverLabel.record.email[0]]: "", 
    [serverLabel.record.volunteerStatus[0]]: false,
    [serverLabel.record.level[0]]: serverLabel.record.low[1], 
    [serverLabel.record.committeeNotes[0]]: "", 
    [serverLabel.record.members[0]]: 1,
    [serverLabel.record.hudsonValley[0]]: false, 
    [serverLabel.record.summary[0]]: "",
    [serverLabel.record.genre[0]]: "",
    [serverLabel.record.link[0]]: "",
    [serverLabel.record.website[0]]: "",
    [serverLabel.record.dates[0]]: "",
    [serverLabel.record.anotherGig[0]]: false,
    [serverLabel.record.gigIfYes[0]]: "",
    [serverLabel.record.shirtSizeXS[0]]: 0, 
    [serverLabel.record.shirtSizeS[0]]: 0, 
    [serverLabel.record.shirtSizeM[0]]: 0,
    [serverLabel.record.shirtSizeL[0]]: 0,
    [serverLabel.record.shirtSizeXL[0]]: 0,
    [serverLabel.record.shirtSizeXXL[0]]: 0,
    [serverLabel.record.primaryContact[0]]: "",
    [serverLabel.record.primaryEmail[0]]: "", 
    [serverLabel.record.primaryPhone[0]]: "", 
    [serverLabel.record.primaryAddress[0]]: "",
    [serverLabel.record.secondaryContact[0]]: "", 
    [serverLabel.record.secondaryEmail[0]]: "", 
    [serverLabel.record.secondaryPhone[0]]: "", 
    [serverLabel.record.isNewToStreeFest[0]]: false,
    [serverLabel.record.isAccepted[0]]: false,
    [serverLabel.record.isWillingToFundraise[0]]: false,
    [serverLabel.record.anythingElse[0]]: "",
    [serverLabel.record.nameOfUser[0]]: currentUser?.name,
    [serverLabel.record.editedTime[0]]: new Date().toLocaleDateString(),
    [serverLabel.record.isDemoData[0]]: false
  });

  const formSections = [
    {
      title: Label.createForm.band,
      length: "full",
      fields: [
        { label: serverLabel.record.name[1], name: serverLabel.record.name[0], type: "text", placeholder: "Enter band name" },
        { label: serverLabel.record.email[1], name: serverLabel.record.email[0], type: "email", placeholder: "Enter band email" },
        { label: serverLabel.record.volunteerStatus[1], name: serverLabel.record.volunteerStatus[0], type: "checkbox" },
        { label: serverLabel.record.level[1], name: serverLabel.record.level[0], type: "radio", options: [serverLabel.record.low[1], serverLabel.record.medium[1], serverLabel.record.high[1]] },
        { label: serverLabel.record.committeeNotes[1], name: serverLabel.record.committeeNotes[0], type: "textarea", placeholder: "Committee Notes" },
        { label: serverLabel.record.members[1], name: serverLabel.record.members[0], type: "number", placeholder: "Number of members" },
        { label: serverLabel.record.hudsonValley[1], name: serverLabel.record.hudsonValley[0], type: "checkbox" },
        { label: serverLabel.record.summary[1], name: serverLabel.record.summary[0], type: "textarea", placeholder: "Summary" },
        { label: serverLabel.record.genre[1], name: serverLabel.record.genre[0], type: "text", placeholder: "Genre of music" },
        { label: serverLabel.record.link[1], name: serverLabel.record.link[0], type: "url", placeholder: "Link to your band" },
        { label: serverLabel.record.website[1], name: serverLabel.record.website[0], type: "url", placeholder: "Link to your website" },
        { label: serverLabel.record.dates[1], name: serverLabel.record.dates[0], type: "text", placeholder: "Dates" },
        { label: serverLabel.record.anotherGig[1], name: serverLabel.record.anotherGig[0], type: "checkbox" },
        { label: serverLabel.record.gigIfYes[1], name: serverLabel.record.gigIfYes[0], type: "text", placeholder: "Gig" },

      ],
    },
    {
      title: Label.createForm.shirts,
      length: "half",
      fields: [
        { label: serverLabel.record.shirtSizeXS[1], name: serverLabel.record.shirtSizeXS[0], type: "number" },
        { label: serverLabel.record.shirtSizeS[1], name: serverLabel.record.shirtSizeS[0], type: "number" },
        { label: serverLabel.record.shirtSizeM[1], name: serverLabel.record.shirtSizeM[0], type: "number" },
        { label: serverLabel.record.shirtSizeL[1], name: serverLabel.record.shirtSizeL[0], type: "number" },
        { label: serverLabel.record.shirtSizeXL[1], name: serverLabel.record.shirtSizeXL[0], type: "number" },
        { label: serverLabel.record.shirtSizeXXL[1], name: serverLabel.record.shirtSizeXXL[0], type: "number" },
      ],
    },
    {
      title: Label.createForm.contact,
      length: "half",
      fields: [
        { label: serverLabel.record.primaryContact[1], name: serverLabel.record.primaryContact[0], type: "text" },
        { label: serverLabel.record.primaryEmail[1], name: serverLabel.record.primaryEmail[0], type: "email" },
        { label: serverLabel.record.primaryPhone[1], name: serverLabel.record.primaryPhone[0], type: "tel" },
        { label: serverLabel.record.primaryAddress[1], name: serverLabel.record.primaryAddress[0], type: "text" },
        { label: serverLabel.record.secondaryContact[1], name: serverLabel.record.secondaryContact[0], type: "text" },
        { label: serverLabel.record.secondaryEmail[1], name: serverLabel.record.secondaryEmail[0], type: "email" },
        { label: serverLabel.record.secondaryPhone[1], name: serverLabel.record.secondaryPhone[0], type: "tel" },
      ],
    },
    {
      title: Label.createForm.additional,
      length: "full",
      fields: [
        { label: serverLabel.record.isNewToStreeFest[1], name: serverLabel.record.isNewToStreeFest[0], type: "checkbox" },
        { label: serverLabel.record.isWillingToFundraise[1], name: serverLabel.record.isWillingToFundraise[0], type: "checkbox" },
        { label: serverLabel.record.anythingElse[1], name: serverLabel.record.anythingElse[0], type: "textarea", placeholder: "Anything else?" },
      ],
    },
    {
      title: Label.createForm.approval,
      length: "full",
      fields: [
        { label: serverLabel.record.isAccepted[1], name: serverLabel.record.isAccepted[0], type: "checkbox" },
        { label: serverLabel.record.isDemoData[1], name: serverLabel.record.isDemoData[0], type: "checkbox" },
      ],
    },
  ];

  const updateForm = (value: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = Object.keys(form).filter((key) => {
        const value = form[key as keyof typeof form];
        return value === "" || value === null || value === undefined;
    });

    if (missing.length > 0) {
        setMissingFields(missing);
        setIsModalOpen(true);
        return;
    }

    await submitForm();
  };

  const submitForm = async () => {
    try {
        // Convert empty strings to "N/A"
        const processedForm = Object.fromEntries(
            Object.entries(form).map(([key, value]) => 
                value === "" ? [key, Label.undefinedValues.string] : [key, value]
            )
        );

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}/record${isNew ? "" : `/${params.id}`}`,
            {
                method: isNew ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(processedForm),
            }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        refreshRecords();
        navigate("/");
    } catch (error) {
        console.error("A problem occurred with your fetch operation: ", error);
    }
};


  const handleConfirmAction = () => {
      setIsModalOpen(false);
      submitForm();
  };

  const handleCancelDownload = () => {
      setIsModalOpen(false);
  };

  return (
    <>
      {canViewContent ? 
        <>
          <h2>{isNew ? "Create" : "Update"} {Label.createForm.band}</h2>
          <section className="create-record-container card">
            <form className="record-form" onSubmit={onSubmit}>
              {formSections.map(({ title, fields, length }) => (
                title === "Approval" ? (
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
                  <fieldset key={title} className={`create-record-form-section ${length}`}>
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
              <Button 
                label={Label.createForm.submit}
                className=""
                type="submit"
              />
            </form>
            <ConfirmationModal
              isOpen={isModalOpen}
              optionalMessage="You may be missing the following fields:"
              message={
                <>
                  {missingFields.map((field) => (
                    <li key={field}>{serverLabel.record[field]?.[1] || field}</li>
                  ))}
                </>
              }
              secondOptionalMessage="Are you sure you want to proceed?"
              onConfirm={handleConfirmAction}
              onCancel={handleCancelDownload}
            />
          </section>
        </>
      : 
        <>
          <LoginReminder />
          <Login />
        </>}
    </>
  );

}
