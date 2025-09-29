import Calendar from "./components/Calendar";
import styled from "styled-components";

function App() {
  return (
    <Container>
      <Calendar />
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  color: white;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
