import styled from "styled-components";

const VerticalSpacing = styled.div<{ height?: number | null }>`
  min-height: ${(props) => (props.height ? props.height : 1)}rem;
`;

export default VerticalSpacing;
