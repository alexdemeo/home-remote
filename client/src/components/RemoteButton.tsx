import styled from 'styled-components';
import { ActionRequest, ActionResponse } from '../static/types';
import { network } from '../utils/network';

const Container = styled.button`
  font-size: 48px;
  background-color: transparent;
  border: none;
`;
interface Props {
  icon: string;
  request: ActionRequest;
  onResponse: (response: ActionResponse) => void;
}
export function RemoteButton({ icon, request, onResponse }: Props): JSX.Element {
  return (
    <Container
      onClick={() => {
        network(request)
          .then(response => {
            console.log('Received: ', JSON.stringify(response));
            onResponse(response);
          })
          .catch(err => {
            console.error('Error: ', JSON.stringify(err));
            onResponse({ status: -1 });
          });
      }}
    >
      {icon}
    </Container>
  );
}
