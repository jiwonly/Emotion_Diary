import "./App.css";
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";

function reducer(state, action) {
  let nextState;

  switch (action.type) {
    case "INIT":
      // nextState 사용 X
      return action.data;
    case "CREATE": {
      nextState  = [action.data, ...state];
      break;
    }
    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;
    }
    default:
      return state;
  }

  // localStorage에 저장
  // JSON.stringify : 자바스크립트 값이나 객체를 JSON 문자열로 변환
  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  // mount되었을 때 한번만 실행
  useEffect(() => {
    const storedData = localStorage.getItem("diary");

    // parse는 undefined가 들어오면 에러가 발생하므로
    // 체크를 해주어야 함
    if (!storedData) {
      setIsLoading(false);
      return;
    }

    // JSON.parse :JSON 문자열을 JavaScript 값이나 객체로 변환
    const parsedData = JSON.parse(storedData);

    // parsedData가 배열이 아닐 경우 return
    if (!Array.isArray(parsedData)) {
      setIsLoading(false);
      return;
    }

    let maxId = 0;

    // forEach : 배열의 각 요소에 대해 제공된 함수를 한번씩 실행
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    // 기존 데이터의 id + 1 -> 겹치치 않게 하기 위함
    idRef.current = maxId + 1;

    dispatch({
      type: "INIT",
      data: parsedData,
    });

    setIsLoading(false);
  }, []);

  // 새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id,
    });
  };

  if (isLoading) {
    return <div>데이터 로딩중입니다 ...</div>;
  }

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
