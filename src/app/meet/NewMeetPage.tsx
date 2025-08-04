import Header from "@/components/Header";
import { MainButton } from "@/components/MainButton";
import { ArrowLeft, Trash2 } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Schema without members
const MeetSchema = z.object({
  name: z
    .string()
    .min(1, "Название не может быть пустым")
    .max(50, "Название не может быть длиннее 50 символов"),
  date: z.date(),
  members: z.array(z.string().min(1, "Участник не может быть пустым"))
});

type MeetFormData = z.infer<typeof MeetSchema>;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function NewMeet() {
  const form = useForm<MeetFormData>({
    resolver: zodResolver(MeetSchema),
    defaultValues: {
      name: "",
      date: new Date(Date.now()),
      members: [],
    },
  });

  function addMember(member: string) {
    const currentMembers = form.getValues("members");
    if (!currentMembers.includes(member)) {
      form.setValue("members", [member, ...currentMembers]);
    } else {
      form.setError("members", {
        type: "manual",
        message: "Этот участник уже добавлен",
      });
    }
  }

  function removeMember(index: number) {
    const currentMembers = form.getValues("members");
    const updatedMembers = currentMembers.filter((_, i) => i !== index);
    form.setValue("members", updatedMembers);
  }

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-16 mb-24 p-4 space-y-4"
        >
          <h2 className="text-2xl text-center mb-4">Информация</h2>
          <Card className="p-4 bg-secondary shadow-md">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название мита</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Это будет названием твоей встречи.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ? formatDate(field.value) : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? new Date(value) : null);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Выбери дату встречи.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
          <h2 className="text-2xl text-center mb-4">Участники</h2>
          <Card className="p-4 bg-secondary shadow-md">
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Добавь участников"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          addMember(e.currentTarget.value.trim());
                          e.currentTarget.value = ""; // Clear input after adding
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Участников можно добавить позже.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("members").length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  {form.watch("members").map((member, index) => (
                    <div className="flex justify-between items-center p-2 rounded-lg border bg-white">
                      <span>{member}</span>
                      <Button
                        type="button"
                        onClick={() => removeMember(index)}
                        variant="outline"
                      >
                        <Trash2/>
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )
            }
          </Card>
          <MainButton type="submit">Готово</MainButton>
        </form>
      </Form>
    </>
  );
}
