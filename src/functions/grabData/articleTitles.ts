import { examples } from "./examples";
import { CohereClient } from "cohere-ai";
import { articleTitlesResolver } from "./articleTitlesResolver";

type DateRange = {
  startDate: string;
  endDate: string;
};
export const articleTitles = async ({
  dateRange,
  category,
}: {
  dateRange: DateRange;
  category?: string;
}) => {
  const cohere = new CohereClient({
    token: "LyXpMQ3g4B1lsE6GmnFkGMAFmIPzOLc0zZyrwk8v",
  });

  // Grabs news
  const parsedNews = await articleTitlesResolver({ dateRange, category });
  // compile all the titles into one array programatically
  const titles = parsedNews.reduce((acc, day) => {
    return acc.concat(day["titles"]);
  }, [] as string[]);

  const { classifications } = await cohere.classify({
    inputs: titles,
    examples: examples,
  });
  const LABEL_SCORES: { [key: string]: number } = {
    "positive review": 10,
    "negative review": 1,
  };
  classifications.forEach(({ prediction, input }) => {
    if (!prediction || !input) return;
    parsedNews.forEach((day) => {
      if (
        input &&
        prediction &&
        Object.keys(LABEL_SCORES).includes(prediction) &&
        day["titles"].includes(input)
      ) {
        day["scores"].push(LABEL_SCORES[prediction]);
      }
    });
  });

  parsedNews.forEach((day) => {
    day["average"] =
      day["scores"].reduce((a, b) => a + b, 0) / day["scores"].length;
  });
  const sortedScoresByDay = parsedNews.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedScoresByDay;
};
