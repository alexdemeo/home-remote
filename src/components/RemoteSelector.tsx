import { Remote } from '../static/types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
`;

const NavButton = styled.button`
  background-color: transparent;
  border-radius: 6px;
  width: 48px;
  height: 36px;
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
      <Link to={`/${nextRemote('left')}`}>
        <NavButton>{'<'}</NavButton>
      </Link>
      {remote.toUpperCase()}
      <Link to={`/${nextRemote('right')}`}>
        <NavButton>{'>'}</NavButton>
      </Link>
    </Container>
  );
}
