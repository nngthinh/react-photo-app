import { Form } from "@ahaui/react";

const InputItem = ({
  name,
  type,
  value,
  placeholder,
  handleOnChange,
  handleOnBlur,
  error,
  className,
  ...restProps
}) => {
  const isHavingError = error ? true : false;
  return (
    <div className={`inputItem ${className}`}>
      <Form.Input
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        isInvalid={isHavingError}
        sizeInput={"large"}
        {...restProps}
      ></Form.Input>
      <Form.Feedback
        type={"invalid"}
        className="inputItemError"
        visible={isHavingError}
      >
        {error}
      </Form.Feedback>
    </div>
  );
};

export default InputItem;
