import Calendar from "./components/Calendar";
import { StyledEngineProvider } from "@mui/styled-engine-sc";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Calendar />
    </StyledEngineProvider>
  );
}

export default App;
