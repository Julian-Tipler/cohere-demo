import { examples } from "./examples";
import { CohereClient } from "cohere-ai";
import { articleTitlesResolver } from "./articleTitlesResolver";
import { classificationsToDates } from "./classificationsToDates";


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

  // Compile all the titles into one array of scores programatically
  const titles = parsedNews.reduce((acc, day) => {
    return acc.concat(day["titles"]);
  }, [] as string[]);

  const { classifications } = await cohere.classify({
    inputs: titles,
    examples: examples,
  });

  const sortedScoresByDay = classificationsToDates(classifications, parsedNews);
  return sortedScoresByDay;
};
