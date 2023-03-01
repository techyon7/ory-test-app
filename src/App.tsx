import { RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { routes } from "./routes";
import themeBase from "./theme";

function App() {
  return (
    <ChakraProvider theme={themeBase}>
      <RouterProvider router={routes} />
    </ChakraProvider>
  );
}

export default App;
