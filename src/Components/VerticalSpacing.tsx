import styled from "styled-components";

const VerticalSpacingDiv = styled.div<{ height: number }>`
  min-height: ${(props) => props.height}rem;
`;

function VerticalSpacing({ height }: { height?: number | undefined }) {
  return <VerticalSpacingDiv height={height ? height : 1} />;
}

export default VerticalSpacing;
