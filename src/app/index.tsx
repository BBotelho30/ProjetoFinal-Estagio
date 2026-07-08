import { Redirect } from "expo-router";
import { Platform } from "react-native";

export default function Index() {
  if (Platform.OS === "web") {
    return <Redirect href="/backoffice/superadmin/pagina_inicial/inicio" />;
  }

  return <Redirect href="/pagina_inicial/inicio" />;
}
