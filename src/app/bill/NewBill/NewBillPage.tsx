
import { getMeet } from "@/api/meet";
import Header from "@/components/Header"
import { MainButton } from "@/components/MainButton";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router"
import z from "zod";
import { BillMemberSelector } from "./BillMemberSelector";
import { BillImageUploader } from "./BillImageUploader";

const BillSchema = z.object({
  name: z.string().min(1, "Название не может быть пустым").max(50),
  amount: z.number().min(0.01, "Сумма должна быть больше 0"),
  images: z.array(z.instanceof(File)).optional(),
  members: z.array(z.object({
    name: z.string().min(1, "Имя участника не может быть пустым"),
    amount: z.number().min(0, "Сумма должна быть положительной"),
  })).min(1, "Выберите участников"),
}).refine(
  (data) => {
    const total = data.members.reduce((sum, m) => sum + m.amount, 0);
    return Math.abs(total - data.amount) < 0.01;
  },
  {
    message: "Сумма участников должна совпадать с общей суммой чека",
    path: ["members"],
  }
);

export type BillFormData = z.infer<typeof BillSchema>;

export const NewBill = () => {
  const { meetId } = useParams<{ meetId: string }>();

  const { data: meet, isLoading } = useQuery({
    queryKey: ['meet', meetId],
    queryFn: () => getMeet(meetId!),
    enabled: !!meetId,
  });

  const form = useForm<BillFormData>({
    resolver: zodResolver(BillSchema),
    defaultValues: {
      name: "",
      amount: 0,
      members: [],
      images: [],
    },
  });

  if (isLoading || !meet) {
    return null;
  }

  return (
    <>
      <Header>
        <Link to={`/meet/${meetId}`} className="flex items-center gap-2">
          <ArrowLeft />
          Новый чек
        </Link>
      </Header>
      
      <Form {...form}>
        <form
          className="mt-20 mb-24 p-4 space-y-6"
        >
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">Название</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Например: Ресторан, Такси..."
                      className="text-lg py-6 px-4 border-2 focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">Сумма</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder="0.00"
                        className="text-3xl font-semibold py-6 px-4 pr-12 border-2 focus:ring-2 focus:ring-primary text-right"
                        {...field}
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-500">₽</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700">Фото чека</FormLabel>
                  <FormControl>
                    <BillImageUploader
                      images={field.value || []}
                      onImagesChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Участники</h2>
            <BillMemberSelector meetMembers={meet.members} billAmount={form.watch('amount')} form={form} />
          </div>
          
          <div className="pt-4">
            <MainButton type="submit">Готово</MainButton>
          </div>
        </form>
      </Form>
    </>
  )
}
