import styled from "styled-components";

function App() {
  return <Container>testing testing</Container>;
}

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => props.theme.fontSizes.xlarge};
`;

export default App;
