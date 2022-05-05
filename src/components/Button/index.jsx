import P from 'prop-types';

import './styles.css';

export default function Button({ text, onClick, disabled }) {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

Button.defaultProps = {
  disabled: false,
};

Button.propTypes = {
  text: P.string.isRequired,
  onClick: P.func.isRequired,
  disabled: P.bool,
};
