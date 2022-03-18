import { Button } from "@ahaui/react";

const ButtonItem = ({ value, variant, size, width, disabled, ...rest }) => {
  return (
    <div className="buttonItem">
      <Button
        {...rest}
        variant={variant ?? "primary"}
        size={size ?? "large"}
        width={width ?? "full"}
        disabled={disabled ?? false}
        {...rest}
      >
        {value}
      </Button>
    </div>
  );
};

export default ButtonItem;
