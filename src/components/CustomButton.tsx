import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

type CustomButtonProps = {
  text: string;
  isPending?: boolean;
  className?: string;
  onPress?: () => void;
} & Omit<PressableProps, "onPress" | "className">;

const CustomBotton = ({
  text,
  isPending,
  disabled,
  className,
  onPress,
  ...props
}: CustomButtonProps) => {
  const isDisabled = !!(disabled || isPending);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: !!isPending }}
      className={`w-full items-center rounded-xl bg-[#0043d3] py-3 active:opacity-80 ${
        isDisabled ? "opacity-50" : ""
      } ${className ?? ""}`}
      {...props}
    >
      {isPending ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className="text-white font-bold tracking-wider">{text}</Text>
      )}
    </Pressable>
  );
};

export default CustomBotton;
