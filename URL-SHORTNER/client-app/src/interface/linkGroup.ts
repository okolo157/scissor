export interface Link {
  _id?: string;
  title: string;
  url: string;
  order: number;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
}

export interface LinkGroup {
  _id: string;
  groupName: string;
  description: string;
  groupUrl: string;
  links: Link[];
  theme: Theme;
  views: number;
  createdAt: string;
  updatedAt: string;
}
