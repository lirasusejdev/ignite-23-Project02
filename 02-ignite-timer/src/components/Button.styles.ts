import styled, { css } from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
interface ButtonContainerProps {
  variant: ButtonVariant
}
const buttonVariants = {
  primary: '#8257e6',
  secondary: 'orange',
  danger: 'red',
  success: 'green'
}
export const ButtonContainer = styled.button<ButtonContainerProps>`
  border-radius: '6px';
  border: 0;
  margin: '10px';
  background-color: ${props => props.theme['green-500']};
  color: ${props => props.theme.white};
  /* ${props => {
    return css`
      background-color: ${buttonVariants[props.variant]};
    `
  }} */
`
