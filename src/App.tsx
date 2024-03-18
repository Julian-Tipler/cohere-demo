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
  const [focusedNode, setFocusedNode] = useState<PointElement | null>(null);

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

  const canvasX = document
    .querySelector(".date-chart")
    ?.getBoundingClientRect().x;
  const canvasY = document
    .querySelector(".date-chart")
    ?.getBoundingClientRect().y;

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
          className="date-chart"
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
            onHover: handleHover(focusedNode, setFocusedNode),
          }}
        />
        {focusedNode && (
          <div
            style={{
              position: "absolute",
              top: canvasY + focusedNode.y,
              left: canvasX + focusedNode.x,
              width: "100px",
              height: "100px",
              backgroundColor: "white",
              zIndex: 1000,
            }}
          >
            focusedNode
          </div>
        )}
      </div>
    </>
  );
}

const handleHover = (
  focusedNode: PointElement | null,
  setFocusedNode: React.Dispatch<React.SetStateAction<PointElement | null>>
) => {
  return (e: any, chartElements: any) => {
    if (!chartElements.length) {
      setFocusedNode(null);
      return;
    }
    const newfocusedNode = chartElements[0]["element"];
    if (!focusedNode) return;

    console.log(newfocusedNode.$context, focusedNode.$context);
    // if (
    //   !focusedNode ||
    //   newfocusedNode.$context.dataIndex != focusedNode.$context.dataIndex
    // ) {

    //   setFocusedNode(newfocusedNode);
    // }
  };
};

export default App;
