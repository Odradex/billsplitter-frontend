export type MeetMember = {
  id: number;
  name: string;
};

export type Meet = {
  ID: string;
  name: string;
  date: string;
  members: MeetMember[];
};
