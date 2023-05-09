import styled from "styled-components";

const HorizontalSpacingDiv = styled.div<{ width: number }>`
  min-width: ${(props) => props.width}rem;
`;

function HorizontalSpacing({ width }: { width?: number | undefined }) {
  return <HorizontalSpacingDiv width={width ? width : 1} />;
}

export default HorizontalSpacing;
