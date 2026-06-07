import { z } from 'zod';

export const batteryCreateSchema = z.object({
  sku: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  category: z.string().trim().min(1),
  voltage: z.string().trim().min(1),
  capacityAh: z.number().int().nonnegative(),
  warrantyMonths: z.number().int().nonnegative(),
  purchasePrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

export const batteryUpdateSchema = batteryCreateSchema.partial();

export const stockAdjustmentSchema = z.object({
  adjustment: z.number().int(),
  reason: z.string().trim().optional(),
});

export const stockTransferSchema = z.object({
  sourceBatteryId: z.string().uuid(),
  destinationBatteryId: z.string().uuid(),
  quantity: z.number().int().positive(),
  reason: z.string().trim().optional(),
});

export type BatteryCreateDto = z.infer<typeof batteryCreateSchema>;
export type BatteryUpdateDto = z.infer<typeof batteryUpdateSchema>;
export type StockAdjustmentDto = z.infer<typeof stockAdjustmentSchema>;
export type StockTransferDto = z.infer<typeof stockTransferSchema>;
