export class ReviewApp {
  _id!: string;
  content!: string;
  likes!: number;
  writtenBy!: string;
  byImage!: {
    _id: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    md5: string;
    contentType: string;
  };
  byImagePath!: {
    type: Buffer;
    data: string;
  };
  byRating!: number;
  oAnswered!: boolean;
  oResponse!: string;
  oRDate!: Date | string;
  createdAt!: string;
  updatedAt!: string;
}
