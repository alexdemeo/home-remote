import styled from 'styled-components';
import { ActionRequest } from '../static/types';
import { networkStatusWrapper } from '../utils/network';
import { StatusProps } from './Status';
import { isMobile } from 'react-device-detect';
import { useEffect } from 'react';

const Container = styled.button`
  font-size: ${isMobile ? 32 : 48}px;
  background-color: transparent;
  border: none;
  color: white;
  margin: 0;
`;

interface Props {
  icon: string | ImageButtonProps;
  request: ActionRequest;
  setStatus: (status: StatusProps) => void;
  // key is taken by react. not inventive enough to abandon the object structure implying key.bind
  key_?: {
    bind: string;
    enabled: boolean;
  };
}

export function RemoteButton({ icon, request, setStatus, key_ }: Props): JSX.Element {
  const key = key_;
  useEffect(() => {
    if (key?.enabled) {
      const keyDown = (event: KeyboardEvent) => {
        if (key?.enabled && event.key === key?.bind) {
          console.log(event.key, key?.bind);
          networkStatusWrapper(request, setStatus);
        }
      };
      window.addEventListener('keydown', keyDown, true);
      return () => window.removeEventListener('keydown', keyDown, true);
    }
  }, [key, request, setStatus]);
  return (
    <Container onClick={() => networkStatusWrapper(request, setStatus)}>
      {typeof icon === 'string' ? icon : <ImageButton {...icon} />}
    </Container>
  );
}

const IconImage = styled.img<{ hasText: boolean }>`
  width: 96px;
  margin-bottom: ${({ hasText }) => (hasText ? -24 : 0)}px;
`;

const ImageButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  padding-bottom: 8px;
`;

interface ImageButtonProps {
  blob: Blob;
  text?: string;
}

function ImageButton({ blob, text }: ImageButtonProps): JSX.Element {
  return (
    <ImageButtonContainer>
      <IconImage alt="" src={URL.createObjectURL(blob)} hasText={!!text} />
      {text}
    </ImageButtonContainer>
  );
}
