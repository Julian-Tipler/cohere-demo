import { useEffect, useState } from "react";
import "./App.css";
import { articleTitles } from "./functions/grabData/articleTitles";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  Chart,
  LineElement,
  PointElement,
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
  const [info, setNode] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    articleTitles({
      dateRange: {
        startDate: "2024-01-01",
        endDate: today,
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
          width: "600px",
          height: "600px",
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
          options={{
            onHover: handleHover(setNode),
          }}
        />
        <div>f{info}</div>
      </div>
    </>
  );
}

const handleHover = (
  setNode: React.Dispatch<React.SetStateAction<string | null>>
) => {
  return (e: any, chartElements: any) => {
    if (!chartElements.length) {
      setNode(null);
      return;
    }
    const node = chartElements[0]["element"];
    setNode(node);
  };
};

export default App;
