export type MeetMember = {
  id: number;
  name: string;
};

export type Meet = {
  id: string;
  name: string;
  date: string;
  members: MeetMember[];
};