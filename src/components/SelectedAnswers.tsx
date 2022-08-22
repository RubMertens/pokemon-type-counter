import { FunctionComponent } from 'react'
import _ from 'underscore'
import { Type } from './Type'

export const SelectedAnswers: FunctionComponent<{
  selectedAnswers: string[]
  correctAnswers?: string[]
  wrongAnswers?: string[]
}> = ({ selectedAnswers, correctAnswers, wrongAnswers }) => {
  const classNamesFor = (key: string) => {
    const classes: string[] = []
    if (correctAnswers?.includes(key)) {
      classes.push(key)
    }
    if (wrongAnswers?.includes(key)) {
      classes.push(key)
    }
  }

  const missingKeysFromCorrectAnswers = _.difference(correctAnswers ?? [], selectedAnswers)
  return (
    <div className="selected-answers">
      {selectedAnswers.map((a) => (
        <span className="">
          <Type type={a} key={a} />
        </span>
      ))}
    </div>
  )
}
