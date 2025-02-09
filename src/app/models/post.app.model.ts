export class PostApp {
  _id!: string;
  content!: string;
  category!: string;
  writtenBy!: string;
  likes!: number;
  mainImage!:  {
    _id: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    contentType: string;
  };
  mainImagePath!: {
    type: Buffer;
    data: string
  };
  images!: [{
    _id: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    contentType: string;
  }];
  imagesPaths!: [{
    type: Buffer;
    data: string
  }];
  videos!: [{
    _id: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    contentType: string;
  }];
  videosPaths!: [{
    type: Buffer;
    data: string
  }];
  createdAt!: string;
  updatedAt!: string;
}
