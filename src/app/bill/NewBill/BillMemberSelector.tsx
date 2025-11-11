
import { Card } from '@/components/ui/card';
import { FormField, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import type { UseFormReturn } from 'react-hook-form';
import type { BillFormData } from './NewBillPage';
import { Calculator } from 'lucide-react';

export type Member = {
  name: string;
  amount: number;
};

interface BillMemberSelectorProps {
  meetMembers: string[];
  billAmount: number;
  form: UseFormReturn<BillFormData>;
}

export const BillMemberSelector = ({ meetMembers, billAmount, form }: BillMemberSelectorProps) => {
  const members = form.watch('members');
  const membersLength = members.length;

  const splitEvenly = () => {
    if (membersLength === 0 || !billAmount) return;
    
    const baseAmount = Math.floor((billAmount * 100) / membersLength) / 100;
    const remainder = Math.round((billAmount - baseAmount * membersLength) * 100) / 100;
    
    const updated = members.map((mem, idx) => ({
      ...mem,
      amount: idx === 0 ? baseAmount + remainder : baseAmount
    }));
    
    form.setValue('members', updated);
  };

  const getTotalAllocated = () => {
    return members.reduce((sum, m) => sum + (m.amount || 0), 0);
  };

  const getRemaining = () => {
    return Math.round((billAmount - getTotalAllocated()) * 100) / 100;
  };

  return (
    <div className="space-y-4">
      <div className="text-base font-medium text-gray-700">Выберите участников, которые участвуют в чеке:</div>
      
      {/* Split evenly button - always shown */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={splitEvenly}
          variant="outline"
          disabled={membersLength === 0 || !billAmount}
          className="w-full py-6 text-base font-semibold border-2 hover:bg-primary/10 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calculator className="mr-2 h-5 w-5" />
          Разделить поровну
        </Button>
        
        {/* Status indicator */}
        <div className="p-3 bg-gray-50 rounded-lg border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Распределено:</span>
            <span className="text-lg font-semibold text-gray-800">
              {getTotalAllocated().toFixed(2)} ₽
            </span>
          </div>
          
          {Math.abs(getRemaining()) > 0.01 && (
            <div className="text-center">
              <span className={`text-sm font-medium ${getRemaining() > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                {getRemaining() > 0 ? `Осталось ${getRemaining().toFixed(2)} ₽` : `Превышение на ${Math.abs(getRemaining()).toFixed(2)} ₽`}
              </span>
            </div>
          )}
          
          {Math.abs(getRemaining()) <= 0.01 && (
            <div className="text-center">
              <span className="text-sm font-medium text-green-600">✓ Сходится</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Selected members at the top */}
      {membersLength > 0 && (
        <div className="space-y-3">
          {members.map((member, idx) => (
            <Card
              key={member.name}
              className="p-4 bg-primary/5 border-2 border-primary shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                const updated = members.filter((_, i) => i !== idx);
                form.setValue('members', updated);
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-primary text-lg flex-shrink-0">{member.name}</span>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0.00"
                    className="w-28 text-lg font-medium text-gray-800 bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={member.amount || ''}
                    onChange={e => {
                      const updated = [...members];
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      updated[idx].amount = isNaN(value) ? 0 : Math.round(value * 100) / 100;
                      form.setValue('members', updated);
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-base text-gray-600 font-medium flex-shrink-0">₽</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Unselected meet members */}
      {meetMembers
        .filter(m => !members.some((sel: { name: string }) => sel.name === m))
        .length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600 mt-4">Добавить участников:</div>
          {meetMembers
            .filter(m => !members.some((sel: { name: string }) => sel.name === m))
            .map((m: string) => (
              <Card
                key={m}
                className="p-4 bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all shadow-sm hover:shadow"
                onClick={() => {
                  const updatedMembers = [
                    ...members,
                    { name: m, amount: 0 }
                  ];
                  form.setValue('members', updatedMembers);
                }}
              >
                <span className="text-base font-medium text-gray-700">{m}</span>
              </Card>
            ))}
        </div>
      )}
      
      <FormField
        control={form.control}
        name="members"
        render={() => <FormMessage />}
      />
    </div>
  );
};
