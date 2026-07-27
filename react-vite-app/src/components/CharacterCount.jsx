export default function CharacterCount({ id, value, maxLength }) {
  return (
    <span id={id} className="field-help">
      {String(value ?? '').length} of {maxLength} characters.
    </span>
  );
}
