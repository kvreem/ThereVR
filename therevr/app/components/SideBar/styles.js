import styled from 'styled-components';

export const LeftContainer = styled.div`
  height: 100vh;
  position: fixed;
  margin-left: 30px;
  left: 0;
  border-right: #00aeef solid;
  min-width: 76.87px;

  @media(max-width: 400px) {
    ${''/* padding-left: 100px; */}
  }
`;
