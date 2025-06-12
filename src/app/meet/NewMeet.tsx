import Header from "@/components/Header";
import { MainButton } from "@/components/MainButton";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Schema without members
const MeetSchema = z.object({
  name: z
    .string()
    .min(1, "Название не может быть пустым")
    .max(50, "Название не может быть длиннее 50 символов"),
});

type MeetFormData = z.infer<typeof MeetSchema>;

export function NewMeet() {
  const form = useForm<MeetFormData>({
    resolver: zodResolver(MeetSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: MeetFormData) {
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <>
      <Header>
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft />
          Новый мит
        </Link>
      </Header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-20 p-4 space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Название митапа" {...field} />
                </FormControl>
                <FormDescription>Это будет названием вашей встречи.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <MainButton type="submit">
            Готово
          </MainButton>
        </form>
      </Form>
    </>
  );
}
