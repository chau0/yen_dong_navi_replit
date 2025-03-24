import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
}

export function AlertModal({ isOpen, onClose, currentRate }: AlertModalProps) {
  const { t } = useTranslation();
  
  const formSchema = z.object({
    email: z.string().email({ message: t('alertModal.emailError', 'Please enter a valid email address') }),
    targetRate: z.coerce.number().positive({ message: t('alertModal.rateError', 'Rate must be positive') }),
    isAbove: z.boolean(),
  });
  
  type FormValues = z.infer<typeof formSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      targetRate: parseFloat((currentRate + 2).toFixed(1)),
      isAbove: true,
    },
  });

  const alertMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await apiRequest("POST", "/api/alert", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: t('toasts.alertSuccess'),
        description: t('toasts.alertSuccessDesc'),
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t('toasts.alertError'),
        description: t('toasts.alertErrorDesc'),
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    alertMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('alertModal.title')}</DialogTitle>
          <DialogDescription>
            {t('alertModal.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isAbove"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>{t('alertModal.alertType')}</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`border rounded-lg p-3 flex items-center ${
                        field.value ? "border-primary bg-primary/5" : "border-gray-200"
                      }`}
                      onClick={() => field.onChange(true)}
                    >
                      <RadioGroupItem
                        value="above"
                        id="above"
                        checked={field.value === true}
                        className="mr-2"
                      />
                      <Label htmlFor="above" className="text-sm font-medium text-gray-900">
                        {t('alertModal.rateGoesAbove')}
                      </Label>
                    </div>
                    <div
                      className={`border rounded-lg p-3 flex items-center ${
                        !field.value ? "border-primary bg-primary/5" : "border-gray-200"
                      }`}
                      onClick={() => field.onChange(false)}
                    >
                      <RadioGroupItem
                        value="below"
                        id="below"
                        checked={field.value === false}
                        className="mr-2"
                      />
                      <Label htmlFor="below" className="text-sm font-medium text-gray-900">
                        {t('alertModal.rateGoesBelow')}
                      </Label>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('alertModal.targetRate')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        min="0"
                        className="pr-12 font-mono"
                      />
                    </FormControl>
                    <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 font-mono">
                      VND
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('alertModal.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="your@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>
                {t('alertModal.cancel')}
              </Button>
              <Button type="submit" disabled={alertMutation.isPending}>
                {alertMutation.isPending ? t('alertModal.settingAlert') : t('alertModal.setAlert')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
