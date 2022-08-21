import React from 'react'
import { Type } from './Type'

export type QuestionType = 'weakness' | 'strength'

export const Question: React.FunctionComponent<{
  type: string
  questionType: QuestionType
}> = ({ questionType, type }) => {
  return (
    <>
      <h1 className="">You're fighting against</h1>
      <h2 className="type-container">
        <Type type={type} />
      </h2>
      <h2>{questionType === 'weakness' ? 'What types is it weak for? ' : 'What types is it strong against?'}</h2>
    </>
  )
}
