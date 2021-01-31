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
  id: string;
  fbIgBusinessAccountId: string;
  username: string;
  profilePicture: string;
  fbAccessToken: string;
}

export enum FbPermissionStatus {
  Granted = 'granted',
  Declined = 'declined',
  Expired = 'expired',
}
export interface IFbPermission {
  permission: FbPermission;
  status: FbPermissionStatus;
}

export interface IFbPermissionChange {
  field: FbPermission;
  value: {
    verb: FbPermissionStatus;
    target_ids: string[];
  };
}
export interface IBatchRequest {
  method: 'get' | 'post';
  relative_url: string;
  access_token?: string;
  search?: {
    [key: string]: string;
  };
}

export enum FbPermission {
  Email = 'email',
  PagesShowList = 'pages_show_list',
  PagesReadEngagement = 'pages_read_engagement',
  InstagramBasic = 'instagram_basic',
  InstagramManageInsights = 'instagram_manage_insights',
  AdsManagement = 'ads_management',
  BusinessManagement = 'business_management',
}
export interface IFbWebhook<T> {
  object: 'permissions';
  entry: {
    id: string;
    /** User id */
    uid?: string;
    changes: T[];
    time: number;
  }[];
}
