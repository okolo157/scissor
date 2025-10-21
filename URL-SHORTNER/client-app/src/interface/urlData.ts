export interface urlData {
  _id: string;
  fullUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt?: Date; // Optional properties
  updatedAt?: Date;
}
