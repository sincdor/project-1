import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from '.';

describe('<TextInput />', () => {
  it('should have a value of searchValue', () => {
    const fn = jest.fn();
    render(<TextInput onChange={fn} value={'test'} />);

    const input = screen.getByPlaceholderText(/type your search/i);
    expect(input.value).toBe('test');
  });

  it('should call onChange function on each key pressed', () => {
    const fn = jest.fn();
    render(<TextInput onChange={fn} />);

    const input = screen.getByPlaceholderText(/type your search/i);
    const value = 'the value';
    userEvent.type(input, value);

    expect(input.value).toBe(value);
    expect(fn).toHaveBeenCalledTimes(value.length);
  });

  it('should match snapshot', () => {
    const fn = jest.fn();
    const {container} = render(<TextInput onChange={fn} value={'test'} />);
    expect(container).toMatchSnapshot();

  });
});
