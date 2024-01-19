import { ClassifyResponseClassificationsItem } from "cohere-ai/api";
import { ParsedNews } from "./articleTitlesResolver";

export const classificationsToDates = (
  classifications: ClassifyResponseClassificationsItem[],
  parsedNews: ParsedNews[]
) => {
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

  return parsedNews.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
