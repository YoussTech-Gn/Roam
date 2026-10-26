import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";
import { twMerge } from "tailwind-merge";

type CustomButtonProps = {
  text: string;
  isPending?: boolean;
  /** Classes for the button. They win over the defaults. */
  className?: string;
  /** Classes for the text. They win over the defaults. */
  textClassName?: string;
  /** Feather icon name */
  name?: keyof typeof Feather.glyphMap;
  /** Icon size */
  size?: number;
  onPress?: () => void;
} & Omit<PressableProps, "onPress" | "className">;

const CustomButton = ({
  text,
  isPending,
  disabled,
  className,
  textClassName,
  name,
  size = 16,
  onPress,
  ...props
}: CustomButtonProps) => {
  const isDisabled = !!(disabled || isPending);

  // Defaults first, your className last, so yours always wins.
  const buttonClass = twMerge(
    "w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#0043d3] py-3 active:opacity-80",
    isDisabled && "opacity-50",
    className,
  );
  const textClass = twMerge(
    "font-bold tracking-wider text-white",
    textClassName,
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: !!isPending }}
      className={buttonClass}
      {...props}
    >
      {isPending ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className={textClass}>{text}</Text>
      )}
      {name && !isPending && (
        <Text className={textClass}>
          <Feather name={name} size={size} />
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;
