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

export interface IIgAccountMetricValue {
  value: number;
  end_time: string;
}

export interface IIgAccountMetric {
  name: string;
  period: string;
  title: string;
  description: string;
  id: string;
  values: IIgAccountMetricValue[];
}

export interface IFbPage {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
  };
}

export interface IFbIgAccount {
  id: string;
  profile_pic: string;
  username: string;
}

export interface IIgAccount {
  fbIgAccountId: string;
  fbIgBusinessAccountId: string;
  username: string;
  profilePicture: string;
  fbAccessToken: string;
}

export interface IFbPermission {
  permission: string;
  status: 'granted' | 'declined' | 'expired';
}
