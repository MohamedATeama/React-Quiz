import { useEffect } from "react"

function Timer({ dispatch, secondsRemaining }) {
  useEffect(function () {
    const timer = setInterval(function () {
      dispatch({ type: 'tick' })
    }, 1000)
    return function () {
      clearInterval(timer);
    }
  }, [dispatch])

  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;

  return (
    <div className="timer">
      {min < 10 && "0"}{min}:{sec < 10 && "0"}{sec}
    </div>
  )
}

export default Timer
