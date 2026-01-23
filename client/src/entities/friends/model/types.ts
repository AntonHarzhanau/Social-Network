export type PublicFriendsStats = {
  total: number;
};

export type MyFriendsStats = PublicFriendsStats & {
  sentRequests: number;
  receivedRequests: number;
};
