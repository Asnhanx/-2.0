export interface RecordItem {
  id: string;
  title: string;
  category: Category;
  content: string;
  image?: string;
  date: number;
  // New fields for notes
  bgColor?: string;
  sticker?: string;
}

export enum Category {
  Food = '美食',
  Hobbies = '爱好',
  Wishlist = '愿望清单',
  Goals = '目标规划',
  Daily = '日常',
  Anniversary = '纪念日',
  Memo = '随手记', // New Category
  Other = '其他',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingMetadata?: any;
}

export enum AspectRatio {
  Square = "1:1",
  Portrait_3_4 = "3:4",
  Landscape_4_3 = "4:3",
  Portrait_9_16 = "9:16",
  Landscape_16_9 = "16:9",
  Wide_21_9 = "21:9",
  Standard_2_3 = "2:3",
  Standard_3_2 = "3:2"
}