import styled from 'styled-components';
import { ApplianceStatus } from '../static/types';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 32px 0 0;
  justify-content: space-around;
`;

const Button = styled.button<{ color: string }>`
  background-color: ${({ color }) => color};
  width: 45%;
  height: 64px;
  font-size: 32px;
  border-radius: 8px;
`;

interface Props {
  onAction: (action: Omit<ApplianceStatus, 'unknown'>) => void;
  status: ApplianceStatus;
  applianceName: string;
  onButtonNotificationDelayMinutes?: number; // if undefined, no don't send a delayed "applianceName" been on x minutes notification
}

const StatusText = styled.div<{ borderColor: string }>`
  font-size: 48px;
  font-weight: bolder;
  font-style: italic;
  border-radius: 8px;
  border: 4px solid ${({ borderColor }) => borderColor};
  padding: 0 16px;
  margin: auto;
`;

const OuterStatusText = styled.div`
  padding: 16px 0;
  font-size: 32px;
`;

const RED = '#ff6060';
const GREEN = '#abff63';
const YELLOW = '#ffdc68';
export function OnOffPanel({
  onAction,
  applianceName,
  onButtonNotificationDelayMinutes,
  status = 'unknown',
}: Props): JSX.Element {
  const clickOn = () => {
    onAction('on');
    if (onButtonNotificationDelayMinutes) {
      Notification.requestPermission().then(result => {
        console.log('notification perms =', result);
        if (result === 'granted') {
          const icon = 'favicon.png';
          const body = `${applianceName} has been on for ${onButtonNotificationDelayMinutes} minutes`;
          console.log(`scheduled notification: ${body}`);
          setTimeout(
            () => new Notification('HomeRemote', { body, icon }),
            onButtonNotificationDelayMinutes * 60 * 1000,
          );
        }
      });
    }
  };
  const clickOff = () => onAction('off');
  return (
    <Stack>
      <OuterStatusText>{applianceName} status</OuterStatusText>
      <StatusText borderColor={statusToColor(status)}>{status.toUpperCase()}</StatusText>
      <Container>
        <Button color={RED} disabled={status === 'off'} onClick={clickOff}>
          off
        </Button>
        <Button color={GREEN} disabled={status === 'on'} onClick={clickOn}>
          on
        </Button>
      </Container>
    </Stack>
  );
}

function statusToColor(status: ApplianceStatus): string {
  switch (status) {
    case 'on':
      return GREEN;
    case 'off':
      return RED;
    case 'unknown':
      return YELLOW;
  }
}
