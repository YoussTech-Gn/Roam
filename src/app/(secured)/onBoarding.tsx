import { ALL_CURRENCIES, CurrencyPicker } from "@/components/CurrencyPicker";
import { useSupabase } from "@/hooks/useSupabase";
import CustomButton from "@/src/components/CustomButton";
import CustomInput from "@/src/components/InputField";
import { useUserSync } from "@/src/hooks/useUserSync";
import { useUserStore } from "@/store/userStore";
import {
  OnboardingFormValues,
  onboardingSchema,
} from "@/utils/schemas/onboarding";
import { useUser } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";

const GENERIC_ERROR = "Something went wrong. Please try again.";

export default function OnboardingScreen() {
  const { user } = useUser();
  const authSupabase = useSupabase();
  const setCurrency = useUserStore((s) => s.setCurrency);
  const setNeedsOnboarding = useUserStore((s) => s.setNeedsOnboarding);
  const { retry } = useUserSync();

  const { control, handleSubmit } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: { startingBalance: "" },
  });

  const [selectedCurrency, setSelectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === "CFA") ?? ALL_CURRENCIES[0],
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async ({ startingBalance }: OnboardingFormValues) => {
    const parsed = parseFloat(startingBalance.replace(/,/g, ""));
    setSaving(true);
    setError("");
    console.log(startingBalance, parsed);

    const { error: updateError } = await authSupabase
      .from("users")
      .update({ currency: selectedCurrency.code })
      .eq("clerk_id", user!.id);

    if (updateError) {
      setSaving(false);
      setError(GENERIC_ERROR);
      console.log(updateError);
      return;
    }

    const { data: accountsData, error: accountFetchError } = await authSupabase
      .from("accounts")
      .select("id, balance")
      .eq("user_id", user!.id)
      .eq("is_default", true)
      .limit(1); // يعيد مصفوفة بأمان مثل: [{ id: '...', balance: 0 }]

    if (accountFetchError || !accountsData || accountsData.length === 0) {
      setSaving(false);
      setError(GENERIC_ERROR);
      console.log(
        "Account fetch error or empty:",
        accountFetchError,
        accountsData,
      );
      return;
    }
    const defaultAccount = accountsData[0];
    const { error: txError } = await authSupabase.from("transactions").insert({
      user_id: user!.id,
      account_id: defaultAccount.id,
      type: "INCOME",
      amount: parsed,
      category: "other_income",
      description: "Starting balance",
      date: new Date().toISOString(),
      input_method: "MANUAL",
    });

    if (txError) {
      setSaving(false);
      setError(GENERIC_ERROR);
      console.log(txError);
      return;
    }

    const { error: balanceError } = await authSupabase
      .from("accounts")
      .update({ balance: defaultAccount.balance + parsed })
      .eq("id", defaultAccount.id);

    setSaving(false);

    if (balanceError) {
      setError(GENERIC_ERROR);
      console.log(balanceError);
      return;
    }

    setCurrency(selectedCurrency.code);
    setNeedsOnboarding(false);
    router.replace("/(secured)/(tabs)");
  };

  // useEffect(() => {
  //   retry;
  // }, []);

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background"
      >
        <View className="flex-1 justify-center px-6 -mt-16">
          <Image
            source={require("@/assets/images/welth.png")}
            className="mb-10 h-14 w-32"
            resizeMode="contain"
          />

          <Text className="mb-2 text-3xl font-bold text-foreground">
            Let&apos;s get you set up
          </Text>
          <Text className="mb-10 text-sm text-muted-foreground">
            A couple of quick details to personalise your experience.
          </Text>

          {/* Starting balance: the input draws its own border and error */}
          <Text className="mb-3 text-base font-medium tracking-wide text-foreground">
            Starting balance
          </Text>
          <View>
            <CustomInput
              control={control}
              name="startingBalance"
              placeholder="e.g. 50000"
              keyboardType="numeric"
              returnKeyType="done"
              className="pl-14"
            />
            <View pointerEvents="none" className="absolute left-4 top-3">
              <Text className="text-base text-muted-foreground">
                {selectedCurrency.symbol}
              </Text>
            </View>
          </View>

          <View className="mb-4" />

          {/* Currency picker */}
          <Text className="mb-3 text-base font-medium tracking-wide text-foreground">
            Currency
          </Text>
          <CustomButton
            className="mb-6 justify-between border border-border bg-input px-4 py-3.5"
            textClassName="text-foreground"
            onPress={() => setPickerOpen(true)}
            text={`${selectedCurrency.symbol} ${selectedCurrency.code} - ${selectedCurrency.name}`}
            name="chevron-down"
          />

          {error ? (
            <Text className="mb-4 text-xs text-destructive">{error}</Text>
          ) : null}

          <CustomButton
            text="Get started"
            isPending={saving}
            onPress={() => handleSubmit(handleSave)()}
          />
        </View>
      </KeyboardAvoidingView>

      <CurrencyPicker
        visible={pickerOpen}
        selectedCode={selectedCurrency.code}
        onSelect={(currency) => {
          setSelectedCurrency(currency);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
