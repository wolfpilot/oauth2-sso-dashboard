export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  errors: string[] | undefined
}