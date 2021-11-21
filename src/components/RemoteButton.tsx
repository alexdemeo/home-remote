import styled from 'styled-components';
import { ActionRequest } from '../static/types';
import { network } from '../utils/network';
import { StatusProps } from './Status';
import { isMobile } from 'react-device-detect';

const Container = styled.button`
  font-size: ${isMobile ? 32 : 48}px;
  background-color: transparent;
  border: none;
`;

const IconImage = styled.img`
  width: 128px;
`;

interface Props {
  icon: string | { imgData: ArrayBuffer; text: string };
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
            console.error('Error: ', err.message);
            setStatus({ status: err.message, endpoint: request.endpoint });
          });
      }}
    >
      {typeof icon === 'string' ? icon : <IconImage alt="" src={URL.createObjectURL(new Blob([icon.imgData]))} />}
    </Container>
  );
}
