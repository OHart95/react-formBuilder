// src/components/FieldPalette.jsx
const FIELD_TYPES = [
  { type: 'text', label: 'Text Input' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'textarea', label: 'Long Text' },
  // Add more later if time allows
];

const FieldPalette = ({ onAddField }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
    <h4>Field Types</h4>
    {FIELD_TYPES.map(field => (
      <button
        key={field.type}
        onClick={() => onAddField(field.type)}
        style={{ display: 'block', margin: '5px 0' }}
      >
        Add {field.label}
      </button>
    ))}
  </div>
);

export default FieldPalette;