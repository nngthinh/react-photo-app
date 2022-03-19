import { Button } from "@ahaui/react";

const ButtonItem = ({
  value,
  variant = "primary",
  size = "large",
  width = "full",
  disabled = false,
  ...rest
} = {}) => {
  return (
    <div className="buttonItem">
      <Button
        variant={variant}
        size={size}
        width={width}
        disabled={disabled}
        {...rest}
      >
        {value}
      </Button>
    </div>
  );
};

export default ButtonItem;
