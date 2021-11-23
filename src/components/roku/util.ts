import { ActionRequest, Remote } from '../../static/types';
import styled from 'styled-components';

export const req = (cmd: string | number, type: 'keypress' | 'launch' = 'keypress'): ActionRequest => ({
  httpMethod: 'POST',
  remote: Remote.ROKU,
  endpoint: `/${type}/${cmd}`,
  type: 'text',
});

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;
