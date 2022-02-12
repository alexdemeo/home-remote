import styled from 'styled-components';
import { OnOffPanel } from './OnOffPanel';
import { network, networkStatusWrapper } from '../utils/network';
import { ActionRequest, Remote } from '../static/types';
import { useEffect, useState } from 'react';
import { useRemoteReducer } from '../reducer';

const Container = styled.div``;

const statusReq: ActionRequest = { remote: Remote.COFFEE, endpoint: '/coffee/status', type: 'text', httpMethod: 'GET' };

export function CoffeeRemote(): JSX.Element {
  const [currStatus, setCurrStatus] = useState<'on' | 'off' | 'unknown'>('unknown');
  const [, dispatch] = useRemoteReducer();
  useEffect(() => {
    network(statusReq)
      .then(result => {
        setCurrStatus(result.textData as any);
        dispatch({ type: 'setStatus', code: result.status, endpoint: statusReq.endpoint });
      })
      .catch(err => {
        console.error(err);
        dispatch({ type: 'setStatus', code: err.message, endpoint: statusReq.endpoint });
      });
  }, [dispatch]);
  return (
    <Container>
      <OnOffPanel
        applianceName="Coffee machine"
        onAction={action =>
          networkStatusWrapper(
            { remote: Remote.COFFEE, endpoint: `/coffee/${action}`, type: 'text', httpMethod: 'PUT' },
            dispatch,
            succeeded => succeeded && setCurrStatus(currStatus === 'on' ? 'off' : 'on'),
          )
        }
        status={currStatus}
        onButtonNotificationDelayMinutes={15}
      />
    </Container>
  );
}
