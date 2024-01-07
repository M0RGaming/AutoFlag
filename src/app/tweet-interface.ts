export interface TweetInterface {
  user: string;
  id: string;
  text: string;
  picture: string;
}

export interface FlaggedInterface extends TweetInterface {
  flags: any[];
}
