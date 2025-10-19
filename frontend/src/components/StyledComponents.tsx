import styled from "styled-components";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding-bottom: ${(props) => props.theme.spacing.xlarge};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xlarge};
  margin: 0 ${(props) => props.theme.spacing.large};
  padding-top: ${(props) => props.theme.spacing.xlarge};
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

export const Card = styled.div`
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  background: white;
  width: 95%;
  padding: ${(props) => props.theme.spacing.xlarge};
  gap: ${(props) => props.theme.spacing.large};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.desktop}) {
    width: 500px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.medium};
  padding-bottom: ${(props) => props.theme.spacing.medium};
  border-bottom: 2px solid ${(props) => props.theme.colors.secondary};
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary},
    #357abd
  );
  color: white;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
`;

export const Title = styled.h2`
  font-size: ${(props) => props.theme.fontSizes.xlarge};
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
`;

export const StyledRemoveIcon = styled(RemoveCircleOutlineIcon)`
  cursor: pointer;
  color: #f2a097;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &&:hover {
    color: ${(props) => props.theme.colors.danger};
    transform: scale(1.1);
  }
`;
