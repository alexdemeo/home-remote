import styled from 'styled-components';
import { ActionRequest } from '../../static/types';
import { networkStatusWrapper } from '../../utils/network';
import { StatusProps } from '../Status';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';

const Container = styled.button<{ isShortIcon: boolean }>`
  // single character icon big: 32. mobile text small: 16. desktop text big not matter what (48)
  font-size: ${({ isShortIcon }) => (isMobile && isShortIcon ? 32 : isMobile ? 16 : 48)}px;
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

// const HOLD_DELAY_TO_TRIGGER_REPEAT_MS = 300;
// const REPEAT_DELAY_MS = 350;

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

  const onClick = () => networkStatusWrapper(request, setStatus);
  // const onClick = () => console.log('onclick', request.endpoint);
  // let timer: NodeJS.Timeout | undefined = undefined;
  return (
    <Container
      isShortIcon={typeof icon === 'string'}
      onClick={onClick}
      onMouseDown={() => {
        // setTimeout(() => {
        //   timer = setInterval(onClick, REPEAT_DELAY_MS);
        // }, HOLD_DELAY_TO_TRIGGER_REPEAT_MS)
      }}
      onMouseUp={() => {
        // if (timer) {
        //   clearTimeout(timer);
        //   timer = undefined;
        // }
      }}
    >
      {typeof icon === 'string' ? icon : <ImageButton {...icon} />}
    </Container>
  );
}

const IconImage = styled.img<{ hasText: boolean }>`
  width: ${isMobile ? 84 : 148}px;
  margin-bottom: ${({ hasText }) => (hasText ? -24 : 0)}px;
`;

const ImageButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
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
