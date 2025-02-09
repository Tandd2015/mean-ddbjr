export class AdminApp {
  _id!: string;
  email!: string;
  password!: string;
  firstName!: string;
  middleName!: string;
  lastName!: string;
  suffixName!: string;
  phoneNumber!: number;
  profilePicture!: {
    _id: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    md5: string;
    contentType: string;
  };
  profilePicturePath!: {
    type: Buffer;
    data: string;
  };
  createdAt!: string;
  updatedAt!: string;
}
