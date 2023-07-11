import styled from 'styled-components'

export const LayoutContainer = styled.div`
  width: 70rem;
  height: 46.5rem;
  margin: 5rem auto;
  padding: 2.5rem;
  flex-shrink: 0;
  background: ${props => props.theme['gray-800']};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-self: stretch;
`
