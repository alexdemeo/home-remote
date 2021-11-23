import { StatusProps } from './Status';
import { ActionRequest, ApplianceStatus, Remote } from '../static/types';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { network, networkStatusWrapper } from '../utils/network';
import { OnOffPanel } from './OnOffPanel';

const Container = styled.div``;

interface Props {
  setStatus: (status: StatusProps) => void;
}

const printerStatusReq: ActionRequest = {
  remote: Remote.STATION,
  endpoint: '/station/printer/status',
  type: 'text',
  httpMethod: 'GET',
};

const lightsStatusReq: ActionRequest = {
  remote: Remote.STATION,
  endpoint: '/station/lights/status',
  type: 'text',
  httpMethod: 'GET',
};

export function PrinterStationRemote({ setStatus }: Props): JSX.Element {
  const [printerStatus, setPrinterStatus] = useState<ApplianceStatus>('unknown');
  const [lightsStatus, setLightsStatus] = useState<ApplianceStatus>('unknown');
  useEffect(() => {
    network(printerStatusReq)
      .then(result => {
        setPrinterStatus(result.textData as ApplianceStatus);
        setStatus({ ...result, endpoint: printerStatusReq.endpoint });
      })
      .catch(err => {
        console.error(err);
        setStatus({ status: err.message, endpoint: printerStatusReq.endpoint });
      });
    network(lightsStatusReq)
      .then(result => {
        setLightsStatus(result.textData as ApplianceStatus);
        setStatus({ ...result, endpoint: lightsStatusReq.endpoint });
      })
      .catch(err => {
        console.error(err);
        setStatus({ status: err.message, endpoint: lightsStatusReq.endpoint });
      });
  }, [setStatus]);
  return (
    <Container>
      <OnOffPanel
        applianceName="3D printer"
        onAction={action =>
          networkStatusWrapper(
            { remote: Remote.STATION, endpoint: `/station/printer/${action}`, type: 'text', httpMethod: 'PUT' },
            setStatus,
          )
        }
        status={printerStatus}
      />
      <OnOffPanel
        applianceName="Lights"
        onAction={action =>
          networkStatusWrapper(
            { remote: Remote.STATION, endpoint: `/station/lights/${action}`, type: 'text', httpMethod: 'PUT' },
            setStatus,
          )
        }
        status={lightsStatus}
      />
    </Container>
  );
}
