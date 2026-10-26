import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Text,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";
import { twMerge } from "tailwind-merge";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  /** Classes for the input. They win over the defaults. */
  className?: string;
} & Omit<TextInputProps, "value" | "onChangeText" | "style" | "className">;

export default function CustomInput<T extends FieldValues>({
  name,
  control,
  className,
  onBlur,
  ...inputProps
}: Props<T>) {
  const scheme = useColorScheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <View>
          <TextInput
            {...inputProps}
            value={field.value == null ? "" : String(field.value)}
            onChangeText={field.onChange}
            onBlur={(e) => {
              field.onBlur();
              onBlur?.(e);
            }}
            placeholderTextColor={scheme === "dark" ? "#a1a1a1" : "#737373"}
            // Defaults first, your className last, so yours always wins.
            className={twMerge(
              "w-full rounded-xl border bg-input px-4 py-3 text-base text-foreground",
              error ? "border-destructive" : "border-border",
              className,
            )}
          />
          {error ? (
            <Text className="mt-1 text-xs text-destructive">
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
