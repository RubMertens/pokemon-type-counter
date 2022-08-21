import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import types from './assets/types.json'
import { Question, QuestionType } from './components/Question'
import _ from 'underscore'
import { Type } from './components/Type'

type TypeCounter = {
  weakAgainst: string[]
  strongAgainst: string[]
}
type TypeCounterMap = {
  [key: string]: TypeCounter
}
type QuestionStates = 'busy' | 'correct' | 'wrong'

function App() {
  console.log(types)
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
    setSelectedButtons([])
    setQuestionState('busy')

    console.log(typeKeys)
  }, [questionCount, typeKeys])

  useEffect(() => {
    if (!typeMap || !typeForQuestion) return
    console.log('effect setting correct answsers')
    if (questionType === 'weakness') {
      setCorrectAnswers(typeMap[typeForQuestion].weakAgainst)
    } else {
      setCorrectAnswers(typeMap[typeForQuestion].strongAgainst)
    }
  }, [typeForQuestion, questionType, typeMap])

  const [selectedButtons, setSelectedButtons] = useState<string[]>([])

  const handleButtonClick = (key: string) => {
    if (selectedButtons.includes(key)) {
      console.log(selectedButtons, selectedButtons.indexOf(key))
      selectedButtons.splice(selectedButtons.indexOf(key), 1)
      console.log(selectedButtons)
      setSelectedButtons([...selectedButtons])
    } else {
      setSelectedButtons((prev) => [...prev, key])
    }
  }

  const isButtonSelected = (key: string) => {
    return selectedButtons.includes(key)
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
    correctAnswers.sort()
    selectedButtons.sort()
    if (_.isEqual(selectedButtons, correctAnswers)) {
      //answered correctly!
      setQuestionState('correct')
    } else {
      setQuestionState('wrong')

      //calculate missed answers
      setMissedAnswers(_.difference(correctAnswers, selectedButtons))

      //calculate wrongly selected answers
      setWronglySelectedAnswers(_.difference(selectedButtons, correctAnswers))
    }
  }

  const handleNextQuestion = () => {
    setQuestionCount((prev) => ++prev)
  }

  return (
    <div className="App">
      <header></header>
      <main>
        <section>
          {/* {correctAnswers?.join(',')} */}
          <Question type={typeForQuestion} questionType={questionType} />
          {questionState === 'correct' ? <div>You answered correctly!</div> : ''}
          {questionState === 'wrong' ? (
            <div>
              <h3>Sadly your answer is wrong</h3>
              {missedAnswers.length > 0 && (
                <p className="feedback">
                  You missed{' '}
                  {missedAnswers.map((a) => (
                    <Type type={a} />
                  ))}
                </p>
              )}
              {wronglySelectedAnswers.length > 0 && (
                <p className="feedback">
                  You wrongly chose:{' '}
                  {wronglySelectedAnswers.map((a) => (
                    <Type type={a} />
                  ))}
                </p>
              )}
            </div>
          ) : (
            ''
          )}
          {questionState !== 'busy' ? <button onClick={handleNextQuestion}>Next question</button> : ''}
        </section>
      </main>
      <footer>
        <span className="fade-rule"></span>
        <div className="buttons">
          {typeKeys.map((tk) => (
            <button
              key={tk}
              value={tk}
              onClick={() => handleButtonClick(tk)}
              className={'answer-button ' + classNameForButton(tk)}
            >
              {tk}
            </button>
          ))}
        </div>
        <button onClick={() => handleAnswerButtonClick()} className="submit">
          Answer
        </button>
      </footer>
    </div>
  )
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default App
