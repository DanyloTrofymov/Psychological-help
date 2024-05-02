import { UserContextProvider } from "@/context/useUser";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }: AppProps) {
  return (<SnackbarProvider>
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  </SnackbarProvider>)
}

export default MyApp;