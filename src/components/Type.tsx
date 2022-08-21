import { FunctionComponent } from 'react'

export const Type: FunctionComponent<{ type: string }> = ({ type }) => {
  return <span className={`type ${type}`}>{type}</span>
}
