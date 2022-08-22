import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import types from './assets/types.json'
import { Question, QuestionType } from './components/Question'
import _ from 'underscore'
import { Type } from './components/Type'
import { SelectedAnswers } from './components/SelectedAnswers'

type TypeCounter = {
  weakAgainst: string[]
  strongAgainst: string[]
}
type TypeCounterMap = {
  [key: string]: TypeCounter
}
type QuestionStates = 'busy' | 'correct' | 'wrong'

function App() {
  const [typeMap, setTypeMap] = useState(types as unknown as TypeCounterMap)
  const [questionCount, setQuestionCount] = useState(0)

  const [typeForQuestion, setTypeForQuestion] = useState<keyof typeof typeMap & string>('')
  const [questionType, setQuestionType] = useState<QuestionType>('weakness')
  const [typeKeys, setTypeKeys] = useState(Object.keys(typeMap))

  const [questionState, setQuestionState] = useState<QuestionStates>('busy')

  const [missedAnswers, setMissedAnswers] = useState<string[]>([])
  const [wronglySelectedAnswers, setWronglySelectedAnswers] = useState<string[]>([])

  const [correctAnswers, setCorrectAnswers] = useState<string[]>([])

  useEffect(() => {
    setTypeForQuestion(typeKeys[randomInteger(0, typeKeys.length)])
    setQuestionType(randomInteger(0, 1) === 0 ? 'weakness' : 'strength')
    setSelectedAnswers([])
    setQuestionState('busy')
  }, [questionCount, typeKeys])

  useEffect(() => {
    if (!typeMap || !typeForQuestion) return
    if (questionType === 'weakness') {
    } else {
      setCorrectAnswers(typeMap[typeForQuestion].strongAgainst)
    }
  }, [typeForQuestion, questionType, typeMap])

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  let unSelectedAnswers = _.difference(typeKeys, selectedAnswers)
  if (questionState !== 'busy') {
    unSelectedAnswers = _.difference(unSelectedAnswers, missedAnswers)
  }

  const selectAnswer = (key: string) => {
    if (questionState !== 'busy') return
    if (!selectedAnswers.includes(key)) {
      setSelectedAnswers((prev) => [...prev, key])
    }
  }

  const deselectAnswer = (key: string) => {
    if (questionState !== 'busy') return
    if (selectedAnswers.includes(key)) {
      selectedAnswers.splice(selectedAnswers.indexOf(key), 1)
      setSelectedAnswers([...selectedAnswers])
    }
  }

  const isButtonSelected = (key: string) => {
    return selectedAnswers.includes(key)
  }
  const isButtonCorrectAnswer = (key: string) => {
    return correctAnswers.includes(key)
  }
  const isButtonWrongAnswer = (key: string) => {
    return wronglySelectedAnswers.includes(key)
  }

  const classNameForButton = (key: string) => {
    const classes: string[] = [key]
    if (isButtonSelected(key)) classes.push('selected')
    if (isButtonCorrectAnswer(key) && questionState !== 'busy') classes.push('correct')
    if (isButtonWrongAnswer(key) && questionState !== 'busy') classes.push('wrong')
    return classes.join(' ')
  }

  const handleAnswerButtonClick = () => {
    const localCorrect = [...correctAnswers].sort()
    const localSelected = [...selectedAnswers].sort()
    if (_.isEqual(localSelected, localCorrect)) {
      //answered correctly!
      setQuestionState('correct')
    } else {
      setQuestionState('wrong')

      //calculate missed answers
      setMissedAnswers(_.difference(correctAnswers, selectedAnswers))

      //calculate wrongly selected answers
      setWronglySelectedAnswers(_.difference(selectedAnswers, correctAnswers))
    }
  }

  const handleNextQuestion = () => {
    setQuestionCount((prev) => ++prev)
  }

  return (
    <div className="App">
      <header>{correctAnswers.join(',')}</header>
      <main>
        <section>
          {/* {correctAnswers?.join(',')} */}
          <Question type={typeForQuestion} questionType={questionType} />

          {selectedAnswers.map((a) => (
            <button key={a} className={'answer-button ' + classNameForButton(a)} onClick={() => deselectAnswer(a)}>
              {a}
            </button>
          ))}
          {questionState !== 'busy' &&
            missedAnswers.map((a) => (
              <button key={a} className={'answer-button ' + classNameForButton(a)}>
                {a}
              </button>
            ))}
        </section>
      </main>
      <footer>
        <span className="fade-rule"></span>
        <div className="buttons">
          {unSelectedAnswers.map((a) => (
            <button
              key={a}
              value={a}
              onClick={() => selectAnswer(a)}
              className={'answer-button ' + classNameForButton(a)}
            >
              {a}
            </button>
          ))}
        </div>
        {questionState === 'busy' && (
          <button onClick={() => handleAnswerButtonClick()} className="submit">
            Answer
          </button>
        )}
        {questionState !== 'busy' && (
          <button className="submit" onClick={handleNextQuestion}>
            Next Question!
          </button>
        )}
      </footer>
    </div>
  )
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default App
