import './styles.css';

export function TextInput({ onChange, value }) {
  return (
    <input
      className='text-input'
      type='search'
      onChange={onChange}
      value={value}
      placeholder={"type your search"}
    />
  );
}
