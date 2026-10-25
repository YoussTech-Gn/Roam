import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useColorScheme,
  View,
} from "react-native";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<TextInputProps, "value" | "onChangeText">;

export default function CustomInput<T extends FieldValues>({
  name,
  control,
  ...inputProps
}: Props<T>) {
  const color = useColorScheme();
  return (
    <View className="mt-3 ">
      <Controller
        name={name}
        control={control}
        render={({
          field: { onBlur, onChange, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              {...inputProps}
              value={value}
              onChangeText={onChange}
              // onBlur={onBlur}
              style={setStyle.input}
              placeholderTextColor={color === "dark" ? "#8a8a8a" : "#555"}
              className={`border text-base text-foreground bg-card ${
                error ? "border-destructive" : "border-border"
              }`}
              {...inputProps}
            />
            {error && (
              <View className="flex-row items-center gap-1 mt-2">
                {/* <Ionicons name="alert-circle" color={"red"} size={13} /> */}
                <Text className="text-red-300 font-bold mb-1">
                  {error?.message}
                </Text>
              </View>
            )}
          </>
        )}
      />
    </View>
  );
}

{
  /* <Text className="text-destructive text-sm mt-1">{error.message}</Text>; */
}

const setStyle = StyleSheet.create({
  input: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 13,
    letterSpacing: 1,
  },
});
