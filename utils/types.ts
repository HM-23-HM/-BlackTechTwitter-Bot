export type TweetCompoundData = {
  data: TweetData[];
  metadata: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
    next_token: string;
  };
};

export type TweetData = {
  edit_history_tweet_ids: any[];
  id: string;
  text: string;
};

export type SearchParams = {
  query: string,
  max_results: number,
  start_time: Date
}