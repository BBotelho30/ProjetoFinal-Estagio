import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "../../../lib/supabase";

export function useContasPendentes() {
  const [contasPendentes, setContasPendentes] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const { count, error } = await supabase
        .from("utilizadores")
        .select("*", { count: "exact", head: true })
        .eq("estado", "pendente");

      if (!ativo) return;

      if (!error) {
        setContasPendentes(count ?? 0);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  return contasPendentes;
}

export function ContasPendentesBadge({ count }: { count: number }) {
  if (!count) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF4D4F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: "auto",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
