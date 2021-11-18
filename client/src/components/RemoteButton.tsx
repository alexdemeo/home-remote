import styled from 'styled-components';
import { ActionRequest } from '../static/types';
import { network } from '../utils/network';
import { StatusProps } from './Status';

const Container = styled.button`
  font-size: 48px;
  background-color: transparent;
  border: none;
`;
interface Props {
  icon: string;
  request: ActionRequest;
  setStatus: (status: StatusProps) => void;
}
export function RemoteButton({ icon, request, setStatus }: Props): JSX.Element {
  return (
    <Container
      onClick={() => {
        network(request)
          .then(response => {
            console.log('Received: ', JSON.stringify(response));
            setStatus({ ...response, endpoint: request.endpoint });
          })
          .catch(err => {
            console.error('Error: ', JSON.stringify(err));
            setStatus({ status: -1, endpoint: request.endpoint });
          });
      }}
    >
      {icon}
    </Container>
  );
}
