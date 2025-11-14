// src/components/FormRenderer.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore'; // addDoc is used by FormDisplay

// ... (FormRenderer component and its functions remain the same)
const FormRenderer = () => {
    const [forms, setForms] = useState([]);
    const [selectedFormId, setSelectedFormId] = useState(null);
    const [selectedFormFields, setSelectedFormFields] = useState(null);

    // Fetch all saved forms on load (IMPLEMENTATION ADDED HERE)
    useEffect(() => {
        const fetchForms = async () => {
            try {
                // 1. Get a reference to the 'forms_poc' collection
                const formsCollectionRef = collection(db, 'forms_poc'); 
                
                // 2. Fetch all documents in that collection
                const snapshot = await getDocs(formsCollectionRef);

                // 3. Map the documents into an array of objects
                const formsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(), // Includes name, fields, createdAt
                }));
                
                // 4. Update the component state
                setForms(formsList);
            } catch (error) {
                console.error("Error fetching forms list:", error);
                // Can be caused by 'allow read: if true' not being published
            }
        };
        fetchForms();
    }, []); // Empty dependency array means this runs only once on mount

    // Function to load the fields of the selected form
    const loadForm = (form) => {
        setSelectedFormId(form.id);
        setSelectedFormFields(form.fields);
    };

    return (
        <div>
            <h2>Available Forms</h2>
            {forms.length === 0 ? (
                // This message will display if the fetch failed or returned 0 forms
                <p>No forms found. Head to the builder!</p>
            ) : (
                <ul>
                    {forms.map(form => (
                        <li key={form.id}>
                            {/* Display the form name and ID */}
                            **{form.name}** (*{form.id}*)
                            <button onClick={() => loadForm(form)} style={{ marginLeft: '10px' }}>
                                Select
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <hr />
            {selectedFormFields && (
                <FormDisplay fields={selectedFormFields} formId={selectedFormId} />
            )}
        </div>
    );
};

// ====================================================================
// UPDATED FormDisplay Component (Validation and Submission Logic)
// ... (The rest of FormDisplay remains the same as your previous code)
// ====================================================================

// Inside src/components/FormRenderer.jsx

const FormDisplay = ({ fields, formId }) => {

    // ... (Your handleSubmit function and validation logic remain here)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target); 
        const submissionData = Object.fromEntries(formData.entries()); 
        
        // --- START ADVANCED VALIDATION LOGIC ---
        let isValid = true;
        const errors = [];

        fields.forEach(field => {
            // Get value, trim it, and ensure it's treated as a string for safety
            const submittedValue = String(submissionData[field.id] || '').trim();
            const rules = field.validation; 

            // 1. REQUIRED CHECK
            if (field.required && submittedValue === '') {
                isValid = false;
                errors.push(`"${field.label}" is required.`);
                return; 
            }
            
            // Only run length/range checks if a value was provided
            if (submittedValue !== '' && rules) {
                
                // 2. TEXT/TEXTAREA LENGTH CHECKS
                if ((field.type === 'text' || field.type === 'textarea')) {
                    const len = submittedValue.length;
                    
                    // Min Length Check
                    if (rules.minLength !== null && len < rules.minLength) {
                        isValid = false;
                        errors.push(`"${field.label}" must be at least ${rules.minLength} characters long (current: ${len}).`);
                    }
                    
                    // Max Length Check
                    if (rules.maxLength !== null && len > rules.maxLength) {
                        isValid = false;
                        errors.push(`"${field.label}" cannot exceed ${rules.maxLength} characters (current: ${len}).`);
                    }
                }
            }
        });

        if (!isValid) {
            alert("Please fix the following errors before submitting:\n" + errors.join('\n'));
            return; // STOP EXECUTION if validation fails
        }
        // --- END ADVANCED VALIDATION LOGIC ---


        // If validation passes, proceed with Firestore submission
        try {
            await addDoc(collection(db, 'submissions_poc'), {
                formId: formId,
                data: submissionData,
                submittedAt: new Date(),
            });
            alert("Form submitted successfully! Data saved to Firestore.");
            e.target.reset(); 
        } catch (e) {
            console.error("Error submitting data: ", e);
            alert("Submission failed. Check console for details.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Form Preview</h3> 
            
            {/* 🎯 THIS IS THE CRITICAL RENDERING BLOCK */}
            {fields.map(field => (
                <div key={field.id} style={{ marginBottom: '15px' }}>
                    {/* Display the label, removing markdown ** */ }
                    <label htmlFor={field.id}>
                        {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                    </label>
                    <br />
                    
                    {/* Dynamic rendering based on type */}
                    {field.type === 'text' && (
                        <input 
                            type="text" 
                            id={field.id} 
                            name={field.id} 
                            required={field.required}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    )}
                    {field.type === 'textarea' && (
                        <textarea 
                            id={field.id} 
                            name={field.id}
                            required={field.required}
                            rows="4"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    )}
                    {field.type === 'checkbox' && (
                        <input 
                            type="checkbox" 
                            id={field.id} 
                            name={field.id}
                        />
                    )}
                </div>
            ))}
            
            <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', marginTop: '15px' }}>
                Submit Form
            </button>
        </form>
    );
};

export default FormRenderer;