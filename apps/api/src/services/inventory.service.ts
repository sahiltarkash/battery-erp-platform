import { prisma } from '../prisma/client';
import { HttpError } from '../middleware/error.middleware';
import {
  BatteryCreateDto,
  BatteryUpdateDto,
  StockAdjustmentDto,
  StockTransferDto,
} from '../dto/inventory.dto';

export async function createBattery(data: BatteryCreateDto) {
  return prisma.battery.create({
    data: {
      sku: data.sku,
      brand: data.brand,
      category: data.category,
      voltage: data.voltage,
      capacityAh: data.capacityAh,
      warrantyMonths: data.warrantyMonths,
      purchasePrice: Number(data.purchasePrice).toFixed(2),
      sellingPrice: Number(data.sellingPrice).toFixed(2),
      stockQuantity: data.stockQuantity,
      lowStockThreshold: data.lowStockThreshold ?? 5,
    },
  });
}

export async function updateBattery(id: string, data: BatteryUpdateDto) {
  const battery = await prisma.battery.findUnique({ where: { id } });
  if (!battery || battery.deletedAt) {
    throw new HttpError(404, 'Battery not found');
  }

  return prisma.battery.update({
    where: { id },
    data: {
      sku: data.sku,
      brand: data.brand,
      category: data.category,
      voltage: data.voltage,
      capacityAh: data.capacityAh,
      warrantyMonths: data.warrantyMonths,
      purchasePrice: data.purchasePrice !== undefined ? Number(data.purchasePrice).toFixed(2) : undefined,
      sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice).toFixed(2) : undefined,
      stockQuantity: data.stockQuantity,
      lowStockThreshold: data.lowStockThreshold,
    },
  });
}

export async function deleteBattery(id: string) {
  const battery = await prisma.battery.findUnique({ where: { id } });
  if (!battery || battery.deletedAt) {
    throw new HttpError(404, 'Battery not found');
  }
  return prisma.battery.update({ where: { id }, data: { deletedAt: new Date() } });
}

export async function getBatteryById(id: string) {
  return prisma.battery.findFirst({ where: { id, deletedAt: null } });
}

export async function listBatteries(options: {
  search?: string;
  brand?: string;
  category?: string;
  lowStockOnly?: boolean;
}) {
  const filters: any[] = [{ deletedAt: null }];

  if (options.search) {
    const term = options.search.trim();
    filters.push({
      OR: [
        { sku: { contains: term, mode: 'insensitive' } },
        { brand: { contains: term, mode: 'insensitive' } },
        { category: { contains: term, mode: 'insensitive' } },
        { voltage: { contains: term, mode: 'insensitive' } },
      ],
    });
  }

  if (options.brand) {
    filters.push({ brand: { equals: options.brand } });
  }

  if (options.category) {
    filters.push({ category: { equals: options.category } });
  }

  const batteries = await prisma.battery.findMany({
    where: { AND: filters },
    orderBy: { updatedAt: 'desc' },
  });

  if (options.lowStockOnly) {
    return batteries.filter((battery) => battery.stockQuantity <= battery.lowStockThreshold);
  }

  return batteries;
}

export async function getLowStockBatteries() {
  const allBatteries = await prisma.battery.findMany({ where: { deletedAt: null } });
  return allBatteries.filter((battery) => battery.stockQuantity <= battery.lowStockThreshold);
}

export async function getInventoryValuation() {
  const batteries = await prisma.battery.findMany({ where: { deletedAt: null } });
  const totalQuantity = batteries.reduce((sum, battery) => sum + battery.stockQuantity, 0);
  const totalValue = batteries.reduce(
    (sum, battery) => sum + Number(battery.purchasePrice.toString()) * battery.stockQuantity,
    0,
  );
  return {
    totalQuantity,
    totalValue: Number(totalValue.toFixed(2)),
  };
}

export async function adjustStock(id: string, data: StockAdjustmentDto) {
  const battery = await prisma.battery.findUnique({ where: { id } });
  if (!battery || battery.deletedAt) {
    throw new HttpError(404, 'Battery not found');
  }

  const newQuantity = battery.stockQuantity + data.adjustment;
  if (newQuantity < 0) {
    throw new HttpError(400, 'Stock adjustment cannot reduce quantity below zero');
  }

  return prisma.$transaction(async (tx) => {
    await tx.stockAdjustment.create({
      data: {
        batteryId: id,
        adjustment: data.adjustment,
        reason: data.reason,
      },
    });

    return tx.battery.update({ where: { id }, data: { stockQuantity: newQuantity } });
  });
}

export async function transferStock(data: StockTransferDto) {
  if (data.sourceBatteryId === data.destinationBatteryId) {
    throw new HttpError(400, 'Source and destination batteries must be different');
  }

  return prisma.$transaction(async (tx) => {
    const source = await tx.battery.findUnique({ where: { id: data.sourceBatteryId } });
    const destination = await tx.battery.findUnique({ where: { id: data.destinationBatteryId } });

    if (!source || source.deletedAt) {
      throw new HttpError(404, 'Source battery not found');
    }
    if (!destination || destination.deletedAt) {
      throw new HttpError(404, 'Destination battery not found');
    }
    if (source.stockQuantity < data.quantity) {
      throw new HttpError(400, 'Source battery does not have enough quantity to transfer');
    }

    const updatedSource = await tx.battery.update({
      where: { id: source.id },
      data: { stockQuantity: source.stockQuantity - data.quantity },
    });

    const updatedDestination = await tx.battery.update({
      where: { id: destination.id },
      data: { stockQuantity: destination.stockQuantity + data.quantity },
    });

    await tx.stockTransfer.create({
      data: {
        sourceBatteryId: source.id,
        destinationBatteryId: destination.id,
        quantity: data.quantity,
        reason: data.reason,
      },
    });

    return { source: updatedSource, destination: updatedDestination };
  });
}
