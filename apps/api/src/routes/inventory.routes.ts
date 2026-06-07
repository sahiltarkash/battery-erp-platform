import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { validateDto } from '../middleware/validate.middleware';
import {
  batteryCreateSchema,
  batteryUpdateSchema,
  stockAdjustmentSchema,
  stockTransferSchema,
} from '../dto/inventory.dto';
import { inventoryController } from '../controllers/inventory.controller';

export const inventoryRouter = Router();

/**
 * @openapi
 * /api/inventory:
 *   get:
 *     summary: List batteries with search and filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: lowStockOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Battery list returned
 */
inventoryRouter.get('/', requireAuth, inventoryController.list);

/**
 * @openapi
 * /api/inventory/valuation:
 *   get:
 *     summary: Get current inventory valuation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory valuation returned
 */
inventoryRouter.get('/valuation', requireAuth, inventoryController.valuation);

/**
 * @openapi
 * /api/inventory/low-stock:
 *   get:
 *     summary: Get batteries that are low on stock
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock batteries returned
 */
inventoryRouter.get('/low-stock', requireAuth, inventoryController.lowStock);

/**
 * @openapi
 * /api/inventory:
 *   post:
 *     summary: Add a new battery to inventory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatteryCreateDto'
 *     responses:
 *       201:
 *         description: Battery created successfully
 */
inventoryRouter.post('/', requireAuth, validateDto(batteryCreateSchema), inventoryController.create);

/**
 * @openapi
 * /api/inventory/{id}:
 *   get:
 *     summary: Get battery details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Battery details returned
 */
inventoryRouter.get('/:id', requireAuth, inventoryController.details);

/**
 * @openapi
 * /api/inventory/{id}:
 *   put:
 *     summary: Update an existing battery
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatteryUpdateDto'
 *     responses:
 *       200:
 *         description: Battery updated successfully
 */
inventoryRouter.put('/:id', requireAuth, validateDto(batteryUpdateSchema), inventoryController.update);

/**
 * @openapi
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete a battery from inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Battery deleted successfully
 */
/**
 * @openapi
 * /api/inventory/transfer:
 *   post:
 *     summary: Transfer stock between two batteries
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockTransferDto'
 *     responses:
 *       200:
 *         description: Stock transfer completed successfully
 */
inventoryRouter.post('/transfer', requireAuth, validateDto(stockTransferSchema), inventoryController.transfer);

inventoryRouter.delete('/:id', requireAuth, inventoryController.remove);

/**
 * @openapi
 * /api/inventory/{id}/adjust:
 *   post:
 *     summary: Adjust battery stock quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockAdjustmentDto'
 *     responses:
 *       200:
 *         description: Stock adjusted successfully
 */
inventoryRouter.post('/:id/adjust', requireAuth, validateDto(stockAdjustmentSchema), inventoryController.adjust);
