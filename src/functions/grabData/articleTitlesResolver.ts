type DateRange = {
  startDate: string;
  endDate: string;
};

export type ParsedNews = {
  date: string;
  titles: string[];
  scores: number[];
  average: number;
};

export const articleTitlesResolver = async ({
  dateRange,
  category,
}: {
  dateRange: DateRange;
  category?: string;
}) => {
  const categoryParam = category ? `&category=${category}` : "";
  const dateRangeParam = dateRange
    ? `&from=${dateRange["startDate"]}&to=${dateRange["endDate"]}`
    : "";
  const baseUrl = `https://newsapi.org/v2/everything?sources=techcrunch,thenextweb.com&language=en${categoryParam}${dateRangeParam}&apiKey=14b888fb788e484388f89e920f867f2f`;

  const news = await fetchNews(baseUrl);

  let count = 0;
  const parsedNews: ParsedNews[] = news.reduce(
    (acc: ParsedNews[], article: any) => {
      if (count > 95) return acc;
      const date = article["publishedAt"].split("T")[0];
      const title = article["title"];
      const day = acc.find((day) => day.date === date);
      if (day) {
        day.titles.push(title);
      } else {
        acc.push({ date, titles: [title], scores: [], average: 0 });
      }
      count++;
      return acc;
    },
    []
  );
  return parsedNews;
};

export const fetchNews = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data["status"] !== "ok") {
      throw new Error("News API error");
    }
    return data["articles"];
  } catch (error) {
    console.log(error);
  }
};
