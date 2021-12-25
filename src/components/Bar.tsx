import styled from 'styled-components';
import { BUTTON_BORDER_COLOR } from '../static/contants';

const BarContainer = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${BUTTON_BORDER_COLOR};
  margin: 8px 0;
`;
export function Bar(): JSX.Element {
  return <BarContainer />;
}
