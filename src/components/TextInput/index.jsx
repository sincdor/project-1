import './styles.css';

import P from 'prop-types';

export function TextInput({ onChange, value }) {
  return (
    <input className="text-input" type="search" onChange={onChange} value={value} placeholder={'type your search'} />
  );
}

TextInput.propTypes = {
  onChange: P.func.isRequired,
  value: P.string,
};
