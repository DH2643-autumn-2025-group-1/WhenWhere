import { StyledEngineProvider } from "@mui/styled-engine-sc";
import Calendar from "../components/Calendar";
import { Location } from "./Location";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Calendar />
      <Location />
    </StyledEngineProvider>
  );
}

export default App;
