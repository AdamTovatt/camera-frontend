import styled from "styled-components";
import { Color } from "./Constants";
import { Tv } from "react-feather";

const MainContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem;
  justify-content: space-between;
  align-items: center;
`;

const ImageContainer = styled.div`
  border-radius: 10px;
  background-color: ${Color.Height1};
  padding: 1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const Image = styled.img``;

const ImagePlaceHolder = styled.div`
  background-color: ${Color.Height0};
  min-width: 640px;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 1px 3px 3px rgba(0, 0, 0, 0.5);
  flex-direction: column;
  font-family: "Jost";
  font-size: 20px;
  color: ${Color.White};
`;

function ImageWindow({ imageSource }: { imageSource: string | undefined }) {
  return (
    <MainContainer>
      <ImageContainer>
        {imageSource ? (
          <Image src={imageSource} />
        ) : (
          <ImagePlaceHolder>
            <Tv size={128} strokeWidth={1} />
            Loading stream...
          </ImagePlaceHolder>
        )}
      </ImageContainer>
    </MainContainer>
  );
}

export default ImageWindow;
