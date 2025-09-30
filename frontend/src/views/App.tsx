import { StyledEngineProvider } from "@mui/styled-engine-sc";
import Calendar from "../components/Calendar";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Calendar />
    </StyledEngineProvider>
  );
}

export default App;
