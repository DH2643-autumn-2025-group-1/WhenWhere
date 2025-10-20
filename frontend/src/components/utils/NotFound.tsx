import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  width: 100%;
`;

const Message = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 24px 32px;
  font-size: 18px;
  color: #333;
  text-align: center;
`;

export function NotFound({ message }: { message: string }) {
  return (
    <Wrapper>
      <Message>{message}</Message>
    </Wrapper>
  );
}
