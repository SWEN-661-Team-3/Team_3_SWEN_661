import { useRef, useEffect } from 'react';

export default function SearchBar({ visible, value, onChange, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="search-bar" role="search">
      <label htmlFor="search-input" className="search-bar__label">
        Search today&apos;s plan
      </label>
      <input
        ref={inputRef}
        type="search"
        id="search-input"
        className="search-bar__input"
        placeholder="Search tasks and appointments..."
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="search-bar__close"
        aria-label="Close search"
        onClick={onClose}
      >
        <span aria-hidden="true">X</span>
      </button>
    </div>
  );
}
