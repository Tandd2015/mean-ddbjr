export class SectionApp {
  _id!: string;
  title!: string;
  content!: string;
  sectionImage!: {
    _id: string;
    length: number;
    chunkSize: number;
    uploadDate: Date;
    filename: string;
    md5: string;
    contentType: string;
  };
  sectionImagePath!: {
    type: Buffer;
    data: string;
  };
  sectionImageAttributionLink!: string;
  sectionImageAttributionCredit!: string;
  createdAt!: string;
  updatedAt!: string;
}
