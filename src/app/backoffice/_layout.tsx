import { Slot, router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../../lib/supabase";

const LOGIN_BACKOFFICE = "/backoffice/superadmin/login/login";

export default function BackofficeLayout() {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  const estaNoLogin = pathname.includes("/login");

  useEffect(() => {
    verificarAcesso();
  }, []);

  async function verificarAcesso() {
    if (estaNoLogin) {
      setAutorizado(true);
      setLoading(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setAutorizado(false);
      setLoading(false);
      router.replace(LOGIN_BACKOFFICE as any);
      return;
    }

    const { data: perfil, error } = await supabase
      .from("utilizadores")
      .select("id, tipo, estado, ativo")
      .eq("id", user.id)
      .maybeSingle();

    if (error || !perfil) {
      setAutorizado(false);
      setLoading(false);
      router.replace(LOGIN_BACKOFFICE as any);
      return;
    }

    const tiposPermitidos = [
      "superadmin",
      "professor_responsavel",
      "professorResponsavel",
    ];

    const tipoValido = tiposPermitidos.includes(perfil.tipo);
    const contaAprovada = perfil.estado === "aprovado";
    const contaAtiva = perfil.ativo !== false;

    if (!tipoValido || !contaAprovada || !contaAtiva) {
      setAutorizado(false);
      setLoading(false);
      router.replace(LOGIN_BACKOFFICE as any);
      return;
    }

    setAutorizado(true);
    setLoading(false);
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F4F6F8",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FDB515" />
      </View>
    );
  }

  if (!autorizado) {
    return null;
  }

  return <Slot />;
}