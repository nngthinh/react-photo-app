import { Button, Icon } from "@ahaui/react";

const ButtonItem = ({
  value,
  variant = "primary",
  size = "large",
  width = "full",
  disabled = false,
  icon,
  sizeIcon,
  ...rest
} = {}) => {
  return (
    <div className="buttonItem">
      {icon ? (
        <Button
          variant={variant}
          size={size}
          width={width}
          disabled={disabled}
          {...rest}
        >
          <Button.Icon>
            <Icon size={sizeIcon ?? size} name={icon} />
          </Button.Icon>
          <Button.Label>{value}</Button.Label>
        </Button>
      ) : (
        <Button
          variant={variant}
          size={size}
          width={width}
          disabled={disabled}
          {...rest}
        >
          {value}
        </Button>
      )}
    </div>
  );
};

export default ButtonItem;
