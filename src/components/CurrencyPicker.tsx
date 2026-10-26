import cc from "currency-codes";
import getSymbol from "currency-symbol-map";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type CurrencyEntry = { code: string; name: string; symbol: string };

const PINNED = ["XOF", "XAF", "USD", "EUR"];

export const ALL_CURRENCIES: CurrencyEntry[] = cc
  .codes()
  .map((code) => ({
    code,
    name: cc.code(code)?.currency ?? code,
    symbol: getSymbol(code) ?? code,
  }))
  .filter((c) => c.symbol !== c.code) // drop ones with no real symbol
  .sort((a, b) => {
    const ia = PINNED.indexOf(a.code);
    const ib = PINNED.indexOf(b.code);
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }
    return a.code.localeCompare(b.code);
  });

/* -------------------------------------------------------------------------- */
/*  EDIT HERE: sheet size and animation                                        */
/* -------------------------------------------------------------------------- */

const SHEET_HEIGHT = "70%"; // how much of the screen the sheet covers
const BACKDROP = "rgba(0,0,0,0.55)"; // dark layer behind the sheet
const EXIT_MS = 260; // must be a bit longer than the exit animations below

const PLACEHOLDER = { light: "#737373", dark: "#a1a1a1" }; // = --muted-foreground

/* -------------------------------------------------------------------------- */

export function CurrencyPicker({
  visible,
  selectedCode,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedCode: string;
  onSelect: (currency: CurrencyEntry) => void;
  onClose: () => void;
}) {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  // Keep the Modal alive until the exit animation finishes,
  // otherwise React Native removes it instantly and nothing animates out.
  const [mounted, setMounted] = useState(visible);
  useEffect(() => {
    if (visible) {
      setMounted(true);
      return;
    }
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [visible]);

  const close = () => {
    setSearch("");
    onClose();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {visible && (
          <>
            {/* Dark layer: fades in and out. Tap it to close. */}
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={[StyleSheet.absoluteFill, { backgroundColor: BACKDROP }]}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            {/* The sheet: slides up with a soft spring, slides down on exit. */}
            <Animated.View
              entering={SlideInDown.springify().damping(20).stiffness(180)}
              exiting={SlideOutDown.duration(220)}
              style={{ height: SHEET_HEIGHT }}
            >
              <View className="flex-1 overflow-hidden rounded-t-3xl border-t border-border bg-card">
                {/* Small handle so it looks like a sheet */}
                <View className="items-center pb-1 pt-3">
                  <View className="h-1 w-10 rounded-full bg-border" />
                </View>

                {/* Search + cancel */}
                <View className="flex-row items-center gap-3 px-5 pb-3 pt-2">
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search currency…"
                    placeholderTextColor={
                      PLACEHOLDER[scheme === "dark" ? "dark" : "light"]
                    }
                    className="flex-1 rounded-full bg-input px-4 py-2.5 text-sm text-foreground"
                  />
                  <TouchableOpacity onPress={close} hitSlop={8}>
                    <Text className="text-sm font-medium text-muted-foreground">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* List: scrolls inside the sheet */}
                <FlatList
                  data={filtered}
                  keyExtractor={(item) => item.code}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
                  renderItem={({ item }) => {
                    const selected = item.code === selectedCode;
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          onSelect(item);
                          setSearch("");
                        }}
                        className={`flex-row items-center border-b border-border px-5 py-3.5 ${
                          selected ? "bg-accent" : ""
                        }`}
                      >
                        <Text className="w-10 text-sm text-muted-foreground">
                          {item.symbol}
                        </Text>
                        <Text className="w-12 text-sm font-medium text-foreground">
                          {item.code}
                        </Text>
                        <Text
                          className="flex-1 text-sm text-muted-foreground"
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        {selected && (
                          <Text className="font-bold text-foreground">✓</Text>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </Animated.View>
          </>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
});
