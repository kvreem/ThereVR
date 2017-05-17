import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  text-align: left;
  padding-left: 10px;
  padding-top: 8px;

  p {
    color: grey;
  }
`;

export const MediumContainer = styled.div`
display: flex;
flex-direction: column;
align-content: center;
margin-top: 150px;
margin-left: -150px;
text-align: center;
color: black;

p {
  color: grey;
}
`;
