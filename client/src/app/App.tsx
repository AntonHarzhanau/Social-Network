import Providers from "./Providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <Providers>
     <RouterProvider router={router} /> 
    </Providers>
  );
}

export default App;
