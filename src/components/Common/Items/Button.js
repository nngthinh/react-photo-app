import { Button, Icon, Loader } from "@ahaui/react";

const ButtonItem = ({
  value,
  variant = "primary",
  size = "large",
  width = "full",
  disabled = false,
  icon,
  isSubmitting = false,
  iconSize = "medium",
  ...rest
} = {}) => {
  const isHavingIcon = isSubmitting || icon ? true : false;
  console.log(isSubmitting, disabled, isHavingIcon);
  const IconComponent = isHavingIcon ? (
    <Button.Icon>
      {isSubmitting ? (
        <Loader size={iconSize ?? size} />
      ) : (
        <Icon size={iconSize ?? size} name={icon} />
      )}
    </Button.Icon>
  ) : (
    <></>
  );
  const LabelComponent = isSubmitting ? (
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
        disabled={isSubmitting || disabled}
        {...rest}
      >
        {IconComponent}
        {LabelComponent}
      </Button>
    </div>
  );
};

export default ButtonItem;
