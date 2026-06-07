import { Request, Response, NextFunction } from 'express';
import {
  createBattery,
  deleteBattery,
  getBatteryById,
  getInventoryValuation,
  getLowStockBatteries,
  listBatteries,
  updateBattery,
  adjustStock,
  transferStock,
} from '../services/inventory.service';

export const inventoryController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const battery = await createBattery(body);
      return res.status(201).json(battery);
    } catch (error) {
      next(error);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, brand, category, lowStockOnly } = req.query;
      const batteries = await listBatteries({
        search: typeof search === 'string' ? search : undefined,
        brand: typeof brand === 'string' ? brand : undefined,
        category: typeof category === 'string' ? category : undefined,
        lowStockOnly: lowStockOnly === 'true',
      });
      return res.json(batteries);
    } catch (error) {
      next(error);
    }
  },

  async details(req: Request, res: Response, next: NextFunction) {
    try {
      const battery = await getBatteryById(req.params.id);
      if (!battery) {
        return res.status(404).json({ message: 'Battery not found' });
      }
      return res.json(battery);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const battery = await updateBattery(req.params.id, req.body);
      return res.json(battery);
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const battery = await deleteBattery(req.params.id);
      return res.json(battery);
    } catch (error) {
      next(error);
    }
  },

  async adjust(req: Request, res: Response, next: NextFunction) {
    try {
      const battery = await adjustStock(req.params.id, req.body);
      return res.json(battery);
    } catch (error) {
      next(error);
    }
  },

  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transferStock(req.body);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async lowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const batteries = await getLowStockBatteries();
      return res.json(batteries);
    } catch (error) {
      next(error);
    }
  },

  async valuation(req: Request, res: Response, next: NextFunction) {
    try {
      const valuation = await getInventoryValuation();
      return res.json(valuation);
    } catch (error) {
      next(error);
    }
  },
};
