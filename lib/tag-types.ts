export type Tag = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type TagGroupDetail = {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
};
