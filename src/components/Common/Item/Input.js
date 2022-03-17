const InputItem = ({
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
        value={value}
        type="text"
        placeholder="Name"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        {...restProps}
      ></input>
      {error ? <div className="inputItemError">error</div> : <></>}
    </div>
  );
};

export default InputItem;
