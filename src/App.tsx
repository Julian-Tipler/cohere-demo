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
        endDate: "2024-01-10",
      },
    }).then((res) => {
      setArticles(res);
    });
  }, []);

  const labels = articles.map((article) => article.date);
  const data = articles.map((article) => article.average);

  if (!articles.length) return <div>Loading...</div>;

  return (
    <>
    <div>News sentiment by date</div>
      <div
        style={{
          width: "500px",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "sentiment",
                data,
                borderWidth: 1,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          }}
        />
      </div>
    </>
  );
}

export default App;
