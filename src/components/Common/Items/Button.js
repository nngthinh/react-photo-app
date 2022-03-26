import { Button, Icon, Loader } from "@ahaui/react";

const ButtonItem = ({
  value,
  variant = "primary",
  size = "large",
  width = "full",
  disabled = false,
  icon,
  isLoading,
  iconSize = "medium",
  ...rest
} = {}) => {
  const isHavingIcon = isLoading || icon ? true : false;
  console.log(isLoading, disabled, isHavingIcon);
  const IconComponent = isHavingIcon ? (
    <Button.Icon>
      {isLoading ? (
        <Loader size={iconSize ?? size} />
      ) : (
        <Icon size={iconSize ?? size} name={icon} />
      )}
    </Button.Icon>
  ) : (
    <></>
  );
  const LabelComponent = isLoading ? (
    <></>
  ) : isHavingIcon ? (
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
