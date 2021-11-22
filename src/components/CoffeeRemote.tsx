import styled from 'styled-components';
import { OnOffPanel } from './OnOffPanel';
import { StatusProps } from './Status';
import { network, networkStatusWrapper } from '../utils/network';
import { ActionRequest, Remote } from '../static/types';
import { useEffect, useState } from 'react';

const Container = styled.div``;

interface Props {
  setStatus: (status: StatusProps) => void;
}

const statusReq: ActionRequest = { remote: Remote.COFFEE, endpoint: '/coffee/status', type: 'text', httpMethod: 'GET' };

export function CoffeeRemote({ setStatus }: Props): JSX.Element {
  const [currStatus, setCurrStatus] = useState<'on' | 'off' | 'unknown'>('unknown');
  useEffect(() => {
    network(statusReq)
      .then(result => {
        setCurrStatus(result.textData as any);
        setStatus({ ...result, endpoint: statusReq.endpoint });
      })
      .catch(err => {
        console.error(err);
        setStatus({ status: err.message, endpoint: statusReq.endpoint });
      });
  }, [setStatus]);
  return (
    <Container>
      <OnOffPanel
        applianceName="Coffee machine"
        onAction={action =>
          networkStatusWrapper(
            { remote: Remote.COFFEE, endpoint: `/coffee/${action}`, type: 'text', httpMethod: 'PUT' },
            setStatus,
          )
        }
        status={currStatus}
      />
    </Container>
  );
}
