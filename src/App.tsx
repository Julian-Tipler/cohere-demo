import { useEffect, useState } from "react";
import "./App.css";
import { articleTitles } from "./functions/grabData/articleTitles";

type DailyData = {
  date: string;
  average: number;
};

function App() {
  const [count, setCount] = useState(0);
  const [articles, setArticles] = useState<DailyData[]>([]);

  useEffect(() => {
    articleTitles({
      dateRange: {
        startDate: "2024-01-01",
        endDate: "2024-01-04",
      },
    }).then((res) => {
      setArticles(res);
    });
  }, []);

  return (
    <>
      {articles.map((article, i) => {
        return (
          <div key={`article-${i}`}>
            {article.date} - {article.average}
          </div>
        );
      })}
    </>
  );
}

export default App;
