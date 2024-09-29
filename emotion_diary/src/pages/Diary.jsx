import { useParams } from "react-router-dom"; // url 파라미터의 값을 가져옴

const Diary = () => {
  const params = useParams();
  console.log(params);

  return <div>{params.id}번 일기입니다~</div>;
};

export default Diary;
