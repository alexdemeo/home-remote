import styled from 'styled-components';
import { BUTTON_BORDER_COLOR } from '../static/constants';

const BarContainer = styled.div`
  width: 80%;
  height: 1px;
  background-color: ${BUTTON_BORDER_COLOR};
  margin: 8px auto;
`;
export function Bar(): JSX.Element {
  return <BarContainer />;
}
