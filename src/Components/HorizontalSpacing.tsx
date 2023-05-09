import styled from "styled-components";

const HorizontalSpacingDiv = styled.div<{ height: number }>`
  min-height: ${(props) => props.height}rem;
`;

function HorizontalSpacing({ height }: { height?: number | undefined }) {
  return <HorizontalSpacingDiv height={height ? height : 1} />;
}

export default HorizontalSpacing;
