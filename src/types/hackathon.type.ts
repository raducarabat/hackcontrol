export type THackathon = {
  id?: string;
  name: string;
  url: string;
  description: string;
  rules?: string;
  criteria?: string;
  is_finished: boolean;
  owner: string;
  creation_date: Date;
};
