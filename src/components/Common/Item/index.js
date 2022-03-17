const InputItem = ({
  name,
  type,
  value,
  placeholder,
  handleOnChange,
  handleOnBlur,
  error,
  ...restProps
}) => {
  return (
    <div className="inputItem">
      <input
        className="inputItemField"
        name={name}
        value={value}
        type="text"
        placeholder={placeholder}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        {...restProps}
      ></input>
      {error ? <div className="inputItemError">{error}</div> : <></>}
    </div>
  );
};

export default InputItem;
