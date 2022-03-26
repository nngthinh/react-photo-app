import { Button, Icon } from "@ahaui/react";

const ButtonItem = ({
  value,
  variant = "primary",
  size = "large",
  width = "full",
  disabled = false,
  icon,
  iconComponent,
  sizeIcon,
  ...rest
} = {}) => {
  const isHavingIcon = iconComponent || icon;
  const IconComponent = isHavingIcon ? (
    <Button.Icon>
      {iconComponent ?? <Icon size={sizeIcon ?? size} name={icon} />}
    </Button.Icon>
  ) : (
    <></>
  );
  const LabelComponent = isHavingIcon ? (
    <Button.Label>{value}</Button.Label>
  ) : (
    <>{value}</>
  );

  return (
    <div className="buttonItem">
      <Button
        variant={variant}
        size={size}
        width={width}
        disabled={disabled}
        {...rest}
      >
        {IconComponent}
        {LabelComponent}
      </Button>
    </div>
  );
};

export default ButtonItem;
