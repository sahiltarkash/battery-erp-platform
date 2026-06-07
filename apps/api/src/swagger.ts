import { Router } from 'express';
// @ts-ignore
import swaggerJsdoc from 'swagger-jsdoc';
// @ts-ignore
import swaggerUi from 'swagger-ui-express';

const router = Router();

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Battery ERP API',
    version: '0.1.0',
    description: 'Authentication and RBAC API for the Battery ERP platform',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterDto: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
        required: ['firstName', 'lastName', 'email', 'password'],
      },
      LoginDto: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
        required: ['email', 'password'],
      },
      RefreshTokenDto: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
        required: ['refreshToken'],
      },
      ForgotPasswordDto: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
        },
        required: ['email'],
      },
      ResetPasswordDto: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string', format: 'password' },
        },
        required: ['token', 'password'],
      },
      BatteryCreateDto: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          brand: { type: 'string' },
          category: { type: 'string' },
          voltage: { type: 'string' },
          capacityAh: { type: 'integer' },
          warrantyMonths: { type: 'integer' },
          purchasePrice: { type: 'number' },
          sellingPrice: { type: 'number' },
          stockQuantity: { type: 'integer' },
          lowStockThreshold: { type: 'integer' },
        },
        required: ['sku', 'brand', 'category', 'voltage', 'capacityAh', 'warrantyMonths', 'purchasePrice', 'sellingPrice', 'stockQuantity'],
      },
      BatteryUpdateDto: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          brand: { type: 'string' },
          category: { type: 'string' },
          voltage: { type: 'string' },
          capacityAh: { type: 'integer' },
          warrantyMonths: { type: 'integer' },
          purchasePrice: { type: 'number' },
          sellingPrice: { type: 'number' },
          stockQuantity: { type: 'integer' },
          lowStockThreshold: { type: 'integer' },
        },
      },
      StockAdjustmentDto: {
        type: 'object',
        properties: {
          adjustment: { type: 'integer' },
          reason: { type: 'string' },
        },
        required: ['adjustment'],
      },
      StockTransferDto: {
        type: 'object',
        properties: {
          sourceBatteryId: { type: 'string' },
          destinationBatteryId: { type: 'string' },
          quantity: { type: 'integer' },
          reason: { type: 'string' },
        },
        required: ['sourceBatteryId', 'destinationBatteryId', 'quantity'],
      },
    },
  },
  security: [{ bearerAuth: [] }],
  servers: [{ url: '/', description: 'API server' }],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { router as swaggerRouter };
