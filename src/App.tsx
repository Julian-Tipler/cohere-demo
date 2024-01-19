import { useEffect, useState } from "react";
import "./App.css";
import { articleTitles } from "./functions/grabData/articleTitles";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  Chart,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);

type DailyData = {
  date: string;
  average: number;
};

function App() {
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

  const labels = articles.map((article) => article.date);
  const data = articles.map((article) => article.average);
  console.log("labels", labels);
  console.log("data", data);

  if (!articles.length) return <div>Loading...</div>;

  return (
    <>
      {articles.map((article, i) => {
        return (
          <div key={`article-${i}`}>
            {article.date} - {article.average}
          </div>
        );
      })}
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "sentiment",
              data,
              borderWidth: 1,
            },
          ],
        }}
      />
    </>
  );
}

export default App;
