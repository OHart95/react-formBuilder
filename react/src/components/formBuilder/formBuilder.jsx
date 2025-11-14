// src/components/FormBuilder.jsx
import React, { useState } from 'react';
import FieldPalette from '../fieldPalette.jsx';
// Import Firestore helpers from the previous plan (Step 8)
import { db } from '../../firebaseConfig.js'; 
import { collection, addDoc } from 'firebase/firestore';
import styles from './FormBuilder.module.css';

const FormBuilder = () => {
  // 1. STATE: Holds the definition of the form
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState('Untitled Form');

  // 2. LOGIC: Function to add a new field
const handleAddField = (type) => {
  const newField = {
    id: `q_${Date.now()}`,
    label: `New ${type} Field`,
    type: type,
    required: false,
    // Add new validation parameters, initialized to null/default
    validation: {
      minLength: null, // For text/textarea
      maxLength: null, // For text/textarea
      minRange: null,  // For number inputs (we'll assume text input for now)
      maxRange: null,  // For number inputs
    }
  };
  setFormFields([...formFields, newField]);
};

  // 3. LOGIC: Function to save the form to Firestore (from previous plan)
  const saveForm = async () => {
    // ... (use the saveForm function from the previous step)
    try {
      const docRef = await addDoc(collection(db, 'forms_poc'), { // Use forms_poc
        name: formTitle,
        fields: formFields,
        createdAt: new Date(),
      });
      alert(`Form saved! ID: ${docRef.id}`); 
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

const handleFieldUpdate = (id, key, value) => {
  setFormFields(prevFields =>
    prevFields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    )
  );
};

  return (
    <div className={styles.formBuilderMain}>
      {/* LEFT SIDE: Field Palette */}
      <FieldPalette onAddField={handleAddField} />

      {/* RIGHT SIDE: Builder Canvas */}
      <div style={{ flex: 1, padding: '20px', border: '1px solid lightgray', marginLeft: '20px' }}>
        <input 
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}
        />

{formFields.map(field => (
  <div key={field.id} style={{ border: '1px dashed blue', padding: '10px', marginBottom: '10px' }}>
    {/* Existing Label/Required Inputs... */}
    <input
      type="text"
      value={field.label}
      onChange={(e) => handleFieldUpdate(field.id, 'label', e.target.value)}
      style={{ width: '80%', fontSize: '16px' }}
    />
    <p>Type: **{field.type}**</p>
    
    <label>
      Required:
      <input
        type="checkbox"
        checked={field.required}
        onChange={(e) => handleFieldUpdate(field.id, 'required', e.target.checked)}
      />
    </label>

    <hr style={{ margin: '10px 0' }}/>
    
    {/* NEW VALIDATION INPUTS */}
    <h4>Validation Rules:</h4>
    {(field.type === 'text' || field.type === 'textarea') && (
      <>
        <label>Min Length:</label>
        <input
          type="number"
          value={field.validation.minLength || ''}
          onChange={(e) => handleFieldUpdate(field.id, 'validation', { ...field.validation, minLength: e.target.value ? Number(e.target.value) : null })}
          style={{ width: '60px', marginLeft: '5px' }}
        />
        <label style={{ marginLeft: '10px' }}>Max Length:</label>
        <input
          type="number"
          value={field.validation.maxLength || ''}
          onChange={(e) => handleFieldUpdate(field.id, 'validation', { ...field.validation, maxLength: e.target.value ? Number(e.target.value) : null })}
          style={{ width: '60px', marginLeft: '5px' }}
        />
      </>
    )}
    
    {/* If you add a dedicated 'number' field type, you'd add minRange/maxRange here */}

  </div>
))}

        <button onClick={saveForm} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Save Form to Firestore
        </button>
      </div>
    </div>
  );
};

export default FormBuilder;