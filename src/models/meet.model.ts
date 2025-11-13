export type MeetMember = {
  ID: number;
  name: string;
  username: string;
};

export type Meet = {
  ID: string;
  name: string;
  date: string;
  members: MeetMember[];
};
