import styled, { keyframes } from 'styled-components';
import { ActionRequest } from '../../static/types';
import { BUTTON_BORDER_COLOR } from '../../static/constants';
import { networkStatusWrapper } from '../../utils/network';
import { isMobile } from 'react-device-detect';
import { useCallback, useEffect } from 'react';
import { useRemoteStore } from '../../RemoteStoreProvider';

const shrink = keyframes`
  from { transform: scale(1) }
  to { transform: scale(0.85) }
`;

const HOLD_DELAY_TO_TRIGGER_REPEAT_MS = 300;
const REPEAT_DELAY_MS = 350;
const BUTTON_PRESS_ANIMATION_DURATION_MS = 100;

const Container = styled.div<{ isShortIcon: boolean }>`
  // single character icon big: 32. mobile text small: 16. desktop text big not matter what (48)
  font-size: ${({ isShortIcon }) => (isMobile && isShortIcon ? 32 : isMobile ? 16 : 32)}px;
  padding: ${({ isShortIcon }) => (isShortIcon ? 16 : 0)}px;
  margin: ${isMobile ? 4 : 8}px;
  background-color: transparent;
  border: solid ${BUTTON_BORDER_COLOR} 4px;
  border-radius: 16px;
  color: white;
  transform: scale(${({ isShortIcon }) => (isShortIcon ? 115 : 100)}%);
  width: ${({ isShortIcon }) => (isShortIcon ? '56px' : 'inherit')};
  :active {
    animation: ${shrink} ${BUTTON_PRESS_ANIMATION_DURATION_MS}ms ease;
    background-color: black;
  }
`;

let repeatTimer: NodeJS.Timeout | undefined = undefined;
let delayTimer: NodeJS.Timeout | undefined = undefined;

interface Props {
  icon: string | ImageButtonProps;
  request: ActionRequest;
  enabled: boolean;
  // key is taken by react. not inventive enough to abandon the object structure implying key.bind
  key_?: {
    bind: string;
    enabled: boolean;
  };
  doRepeat?: boolean;
}

export function RemoteButton({ icon, request, key_, doRepeat, enabled }: Props): JSX.Element {
  const key = key_;
  const [state, dispatch] = useRemoteStore();

  const onClick = useCallback(() => networkStatusWrapper(request, dispatch), [request, dispatch]);
  // const onClick = useCallback(() => console.log('onclick', request.endpoint), [request]);

  useEffect(() => {
    if (key?.enabled) {
      const keyDown = (event: KeyboardEvent) => {
        // console.log(event.key);
        if (key?.enabled && event.key === key?.bind && enabled) {
          console.log(event.key, key?.bind);
          onClick();
        }
      };
      window.addEventListener('keydown', keyDown, true);
      return () => window.removeEventListener('keydown', keyDown, true);
    }
  }, [key, request, state, dispatch, enabled, onClick]);

  const resetTimers = () => {
    clearTimeout(delayTimer!);
    clearInterval(repeatTimer!);
  };
  const onMouseUp = resetTimers;
  const onMouseDown = () => {
    resetTimers();
    if (!!doRepeat) {
      delayTimer = setTimeout(() => {
        repeatTimer = setInterval(onClick, REPEAT_DELAY_MS);
        onClick();
      }, HOLD_DELAY_TO_TRIGGER_REPEAT_MS);
    }
  };
  return (
    <Container
      isShortIcon={typeof icon === 'string'}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
    >
      {typeof icon === 'string' ? icon : <ImageButton {...icon} />}
    </Container>
  );
}

const IconImage = styled.img<{ hasText: boolean }>`
  width: ${isMobile ? 84 : 96}px;
  margin-bottom: ${({ hasText }) => (hasText ? -24 : 0)}px;
  border-radius: 16px;
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
