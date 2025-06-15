import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * 30,
      }
    case 'newAnswer':
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    case 'finish':
      return {
        ...state,
        status: 'finish',
        highScore: state.points > state.highScore ? state.points : state.highScore,
      }
    case 'restart':
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions,
      }
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finish' : state.status,
      }
    default:
      throw new Error(`Unknown Action`);
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, question) => acc + question.points, 0);

  useEffect(function () {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, [])

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && <> <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} /> <Question question={questions[index]} dispatch={dispatch} answer={answer} /> <Footer> <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} /> <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} /> </Footer> </>}
        {status === 'finish' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}

export default App;
