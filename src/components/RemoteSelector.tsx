import { Remote } from '../static/types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BUTTON_BORDER_COLOR } from '../static/contants';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 28px;
  color: white;
`;

const NavButton = styled.div`
  background-color: transparent;
  border-radius: 6px;
  width: 48px;
  height: 36px;
  color: white;
  font-size: 32px;
  border: solid ${BUTTON_BORDER_COLOR} 2px;
`;

const RemoteLink = styled(Link)`
  text-decoration: none;
  margin: 2px;
  padding: 2px;
`;

const remotes = Object.values(Remote);

interface Props {
  remote: Remote;
  onRefresh: () => void;
}

export function RemoteSelector({ remote, onRefresh }: Props): JSX.Element {
  const nextRemote = (dir: 'left' | 'right') => {
    const idx = remotes.findIndex(_remote => _remote === remote);
    return dir === 'right'
      ? remotes[idx === remotes.length - 1 ? 0 : idx + 1]
      : remotes[idx === 0 ? remotes.length - 1 : idx - 1];
  };
  return (
    <Container>
      <RemoteLink to={`/${nextRemote('left')}`}>
        <NavButton>{'<'}</NavButton>
      </RemoteLink>
      {remote.toLowerCase()}
      <RemoteLink to={`/${nextRemote('right')}`}>
        <NavButton>{'>'}</NavButton>
      </RemoteLink>
    </Container>
  );
}
