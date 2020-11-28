export interface IFbUserAccessTokenResponse {
  access_token: string;
  token_type: string;
}

export type FbPaginated<T> = {
  data: T[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    previous?: string;
    next?: string;
  };
};

export interface IFbPage {
  id: string;
  name: string;
  access_token: string;
}

export interface IFbIgAccount {
  id: string;
  profile_pic: string;
  username: string;
}

export interface IIgAccount {
  facebookId: string;
  username: string;
  profilePicture: string;
  facebookAccessToken: string;
}
