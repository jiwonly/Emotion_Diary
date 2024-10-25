import { useEffect } from "react";

const usePageTitle = (title) => {
  // mount되었을 때 한번만 실행
  // document.getElementByTagName("title")[0] : title 태그를 가져옴
  useEffect(() => {
    const $title = document.getElementsByTagName("title")[0];
    $title.innerText = title;
  }, [title]);
};

export default usePageTitle;
