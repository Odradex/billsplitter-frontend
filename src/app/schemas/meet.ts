import z from "zod";

export const MeetSchema = z.object({
  name: z
    .string()
    .min(1, "Название не может быть пустым")
    .max(50, "Название не может быть длиннее 50 символов"),
  date: z.date(),
  members: z.array(z.string().min(1, "Участник не может быть пустым"))
});
