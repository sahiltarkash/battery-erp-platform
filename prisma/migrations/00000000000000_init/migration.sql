-- Prisma Migrate migration
-- Generated manually for battery-erp-platform database design

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "Brand" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" text NOT NULL UNIQUE,
    "description" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Category" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "description" text,
    "parentId" uuid,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Vendor" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" text NOT NULL,
    "email" text UNIQUE,
    "phone" text,
    "website" text,
    "addressLine1" text,
    "addressLine2" text,
    "city" text,
    "state" text,
    "postalCode" text,
    "country" text,
    "isActive" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Product" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sku" text NOT NULL UNIQUE,
    "name" text NOT NULL,
    "description" text,
    "brandId" uuid,
    "categoryId" uuid,
    "vendorId" uuid,
    "costPrice" numeric(12,2) NOT NULL,
    "retailPrice" numeric(12,2) NOT NULL,
    "unit" text,
    "barcode" text UNIQUE,
    "isActive" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Inventory" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" uuid NOT NULL UNIQUE,
    "quantityOnHand" integer NOT NULL DEFAULT 0,
    "reservedQuantity" integer NOT NULL DEFAULT 0,
    "reorderLevel" integer NOT NULL DEFAULT 0,
    "lastStockedAt" timestamp(3) with time zone,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Customer" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "email" text UNIQUE,
    "phone" text,
    "company" text,
    "addressLine1" text,
    "addressLine2" text,
    "city" text,
    "state" text,
    "postalCode" text,
    "country" text,
    "isActive" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "User" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "phone" text,
    "passwordHash" text NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    "lastLoginAt" timestamp(3) with time zone,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Role" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" text NOT NULL UNIQUE,
    "description" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Permission" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" text NOT NULL UNIQUE,
    "description" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "UserRole" (
    "userId" uuid NOT NULL,
    "roleId" uuid NOT NULL,
    "assignedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone,
    PRIMARY KEY ("userId", "roleId")
);

CREATE TABLE "RolePermission" (
    "roleId" uuid NOT NULL,
    "permissionId" uuid NOT NULL,
    "assignedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone,
    PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE "Order" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" uuid NOT NULL,
    "userId" uuid,
    "orderNumber" text NOT NULL UNIQUE,
    "status" text NOT NULL DEFAULT 'draft',
    "paymentStatus" text NOT NULL DEFAULT 'pending',
    "totalAmount" numeric(12,2) NOT NULL,
    "taxAmount" numeric(12,2) NOT NULL DEFAULT 0,
    "discountAmount" numeric(12,2) NOT NULL DEFAULT 0,
    "placedAt" timestamp(3) with time zone,
    "fulfilledAt" timestamp(3) with time zone,
    "dueAt" timestamp(3) with time zone,
    "notes" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "OrderItem" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "quantity" integer NOT NULL DEFAULT 1,
    "unitPrice" numeric(12,2) NOT NULL,
    "discountAmount" numeric(12,2) NOT NULL DEFAULT 0,
    "taxAmount" numeric(12,2) NOT NULL DEFAULT 0,
    "totalAmount" numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Purchase" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "vendorId" uuid NOT NULL,
    "userId" uuid,
    "purchaseNumber" text NOT NULL UNIQUE,
    "status" text NOT NULL DEFAULT 'draft',
    "totalAmount" numeric(12,2) NOT NULL,
    "taxAmount" numeric(12,2) NOT NULL DEFAULT 0,
    "discountAmount" numeric(12,2) NOT NULL DEFAULT 0,
    "orderedAt" timestamp(3) with time zone,
    "receivedAt" timestamp(3) with time zone,
    "notes" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "PurchaseItem" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "purchaseId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "quantity" integer NOT NULL DEFAULT 1,
    "unitCost" numeric(12,2) NOT NULL,
    "totalCost" numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Service" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "code" text NOT NULL UNIQUE,
    "name" text NOT NULL,
    "description" text,
    "durationMinutes" integer NOT NULL DEFAULT 0,
    "basePrice" numeric(12,2) NOT NULL,
    "active" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Technician" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "email" text UNIQUE,
    "phone" text,
    "employeeNumber" text UNIQUE,
    "specialty" text,
    "isActive" boolean NOT NULL DEFAULT true,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Vehicle" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" uuid NOT NULL,
    "vin" text NOT NULL UNIQUE,
    "make" text NOT NULL,
    "model" text NOT NULL,
    "year" integer NOT NULL,
    "licensePlate" text UNIQUE,
    "color" text,
    "mileage" integer DEFAULT 0,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "ServiceBooking" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "serviceId" uuid NOT NULL,
    "technicianId" uuid,
    "customerId" uuid NOT NULL,
    "vehicleId" uuid,
    "status" text NOT NULL DEFAULT 'scheduled',
    "scheduledAt" timestamp(3) with time zone NOT NULL,
    "completedAt" timestamp(3) with time zone,
    "totalAmount" numeric(12,2) NOT NULL,
    "notes" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Payment" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderId" uuid,
    "purchaseId" uuid,
    "serviceBookingId" uuid,
    "amount" numeric(12,2) NOT NULL,
    "method" text NOT NULL,
    "status" text NOT NULL DEFAULT 'pending',
    "transactionRef" text,
    "paidAt" timestamp(3) with time zone,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "RefreshToken" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "token" text NOT NULL UNIQUE,
    "userId" uuid NOT NULL,
    "expiresAt" timestamp(3) with time zone NOT NULL,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "revokedAt" timestamp(3) with time zone,
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "PasswordResetToken" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "token" text NOT NULL UNIQUE,
    "userId" uuid NOT NULL,
    "expiresAt" timestamp(3) with time zone NOT NULL,
    "usedAt" timestamp(3) with time zone,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "Notification" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" uuid,
    "customerId" uuid,
    "orderId" uuid,
    "serviceBookingId" uuid,
    "type" text NOT NULL,
    "title" text NOT NULL,
    "body" text,
    "isRead" boolean NOT NULL DEFAULT false,
    "sentAt" timestamp(3) with time zone,
    "readAt" timestamp(3) with time zone,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "WarrantyRecord" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "purchaseId" uuid,
    "serviceBookingId" uuid,
    "startDate" timestamp(3) with time zone NOT NULL,
    "endDate" timestamp(3) with time zone NOT NULL,
    "claimStatus" text NOT NULL DEFAULT 'active',
    "details" text,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

CREATE TABLE "AnalyticsSnapshot" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "recordedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "snapshotType" text NOT NULL,
    "metricName" text NOT NULL,
    "metricValue" numeric(18,4) NOT NULL,
    "dimensions" jsonb,
    "createdAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp(3) with time zone
);

ALTER TABLE "Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL;

ALTER TABLE "Product"
    ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE SET NULL,
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL,
    ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE SET NULL;

ALTER TABLE "Inventory"
    ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE;

ALTER TABLE "Order"
    ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT,
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL;

ALTER TABLE "OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT;

ALTER TABLE "Purchase"
    ADD CONSTRAINT "Purchase_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT,
    ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL;

ALTER TABLE "PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "PurchaseItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT;

ALTER TABLE "ServiceBooking"
    ADD CONSTRAINT "ServiceBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT,
    ADD CONSTRAINT "ServiceBooking_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician" ("id") ON DELETE SET NULL,
    ADD CONSTRAINT "ServiceBooking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "ServiceBooking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE SET NULL;

ALTER TABLE "Vehicle"
    ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE;

ALTER TABLE "UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE;

ALTER TABLE "RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE CASCADE;

ALTER TABLE "Payment"
    ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "Payment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "Payment_serviceBookingId_fkey" FOREIGN KEY ("serviceBookingId") REFERENCES "ServiceBooking" ("id") ON DELETE CASCADE;

ALTER TABLE "RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE;

ALTER TABLE "PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE;

ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "Notification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "Notification_serviceBookingId_fkey" FOREIGN KEY ("serviceBookingId") REFERENCES "ServiceBooking" ("id") ON DELETE CASCADE;

ALTER TABLE "WarrantyRecord"
    ADD CONSTRAINT "WarrantyRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE,
    ADD CONSTRAINT "WarrantyRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT,
    ADD CONSTRAINT "WarrantyRecord_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE SET NULL,
    ADD CONSTRAINT "WarrantyRecord_serviceBookingId_fkey" FOREIGN KEY ("serviceBookingId") REFERENCES "ServiceBooking" ("id") ON DELETE SET NULL;

CREATE INDEX "Category_parentId_idx" ON "Category" ("parentId");
CREATE INDEX "Category_deletedAt_idx" ON "Category" ("deletedAt");
CREATE INDEX "Product_brandId_idx" ON "Product" ("brandId");
CREATE INDEX "Product_categoryId_idx" ON "Product" ("categoryId");
CREATE INDEX "Product_vendorId_idx" ON "Product" ("vendorId");
CREATE INDEX "Product_deletedAt_idx" ON "Product" ("deletedAt");
CREATE INDEX "Inventory_deletedAt_idx" ON "Inventory" ("deletedAt");
CREATE INDEX "Customer_email_idx" ON "Customer" ("email");
CREATE INDEX "Customer_deletedAt_idx" ON "Customer" ("deletedAt");
CREATE INDEX "User_email_idx" ON "User" ("email");
CREATE INDEX "User_deletedAt_idx" ON "User" ("deletedAt");
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken" ("userId");
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken" ("expiresAt");
CREATE INDEX "RefreshToken_deletedAt_idx" ON "RefreshToken" ("deletedAt");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken" ("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken" ("expiresAt");
CREATE INDEX "PasswordResetToken_deletedAt_idx" ON "PasswordResetToken" ("deletedAt");
CREATE INDEX "Role_deletedAt_idx" ON "Role" ("deletedAt");
CREATE INDEX "Permission_deletedAt_idx" ON "Permission" ("deletedAt");
CREATE INDEX "UserRole_roleId_idx" ON "UserRole" ("roleId");
CREATE INDEX "UserRole_deletedAt_idx" ON "UserRole" ("deletedAt");
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission" ("permissionId");
CREATE INDEX "RolePermission_deletedAt_idx" ON "RolePermission" ("deletedAt");
CREATE INDEX "Order_customerId_idx" ON "Order" ("customerId");
CREATE INDEX "Order_userId_idx" ON "Order" ("userId");
CREATE INDEX "Order_status_idx" ON "Order" ("status");
CREATE INDEX "Order_placedAt_idx" ON "Order" ("placedAt");
CREATE INDEX "Order_deletedAt_idx" ON "Order" ("deletedAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem" ("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem" ("productId");
CREATE INDEX "OrderItem_deletedAt_idx" ON "OrderItem" ("deletedAt");
CREATE INDEX "Vendor_email_idx" ON "Vendor" ("email");
CREATE INDEX "Vendor_deletedAt_idx" ON "Vendor" ("deletedAt");
CREATE INDEX "Purchase_vendorId_idx" ON "Purchase" ("vendorId");
CREATE INDEX "Purchase_userId_idx" ON "Purchase" ("userId");
CREATE INDEX "Purchase_status_idx" ON "Purchase" ("status");
CREATE INDEX "Purchase_orderedAt_idx" ON "Purchase" ("orderedAt");
CREATE INDEX "Purchase_deletedAt_idx" ON "Purchase" ("deletedAt");
CREATE INDEX "PurchaseItem_purchaseId_idx" ON "PurchaseItem" ("purchaseId");
CREATE INDEX "PurchaseItem_productId_idx" ON "PurchaseItem" ("productId");
CREATE INDEX "PurchaseItem_deletedAt_idx" ON "PurchaseItem" ("deletedAt");
CREATE INDEX "Service_code_idx" ON "Service" ("code");
CREATE INDEX "Service_active_idx" ON "Service" ("active");
CREATE INDEX "Service_deletedAt_idx" ON "Service" ("deletedAt");
CREATE INDEX "Technician_email_idx" ON "Technician" ("email");
CREATE INDEX "Technician_employeeNumber_idx" ON "Technician" ("employeeNumber");
CREATE INDEX "Technician_deletedAt_idx" ON "Technician" ("deletedAt");
CREATE INDEX "Vehicle_customerId_idx" ON "Vehicle" ("customerId");
CREATE INDEX "Vehicle_deletedAt_idx" ON "Vehicle" ("deletedAt");
CREATE INDEX "ServiceBooking_serviceId_idx" ON "ServiceBooking" ("serviceId");
CREATE INDEX "ServiceBooking_technicianId_idx" ON "ServiceBooking" ("technicianId");
CREATE INDEX "ServiceBooking_customerId_idx" ON "ServiceBooking" ("customerId");
CREATE INDEX "ServiceBooking_vehicleId_idx" ON "ServiceBooking" ("vehicleId");
CREATE INDEX "ServiceBooking_status_idx" ON "ServiceBooking" ("status");
CREATE INDEX "ServiceBooking_scheduledAt_idx" ON "ServiceBooking" ("scheduledAt");
CREATE INDEX "ServiceBooking_deletedAt_idx" ON "ServiceBooking" ("deletedAt");
CREATE INDEX "Payment_orderId_idx" ON "Payment" ("orderId");
CREATE INDEX "Payment_purchaseId_idx" ON "Payment" ("purchaseId");
CREATE INDEX "Payment_serviceBookingId_idx" ON "Payment" ("serviceBookingId");
CREATE INDEX "Payment_status_idx" ON "Payment" ("status");
CREATE INDEX "Payment_deletedAt_idx" ON "Payment" ("deletedAt");
CREATE INDEX "Notification_userId_idx" ON "Notification" ("userId");
CREATE INDEX "Notification_customerId_idx" ON "Notification" ("customerId");
CREATE INDEX "Notification_orderId_idx" ON "Notification" ("orderId");
CREATE INDEX "Notification_serviceBookingId_idx" ON "Notification" ("serviceBookingId");
CREATE INDEX "Notification_isRead_idx" ON "Notification" ("isRead");
CREATE INDEX "Notification_deletedAt_idx" ON "Notification" ("deletedAt");
CREATE INDEX "WarrantyRecord_customerId_idx" ON "WarrantyRecord" ("customerId");
CREATE INDEX "WarrantyRecord_productId_idx" ON "WarrantyRecord" ("productId");
CREATE INDEX "WarrantyRecord_purchaseId_idx" ON "WarrantyRecord" ("purchaseId");
CREATE INDEX "WarrantyRecord_serviceBookingId_idx" ON "WarrantyRecord" ("serviceBookingId");
CREATE INDEX "WarrantyRecord_startDate_idx" ON "WarrantyRecord" ("startDate");
CREATE INDEX "WarrantyRecord_endDate_idx" ON "WarrantyRecord" ("endDate");
CREATE INDEX "WarrantyRecord_deletedAt_idx" ON "WarrantyRecord" ("deletedAt");
CREATE INDEX "AnalyticsSnapshot_recordedAt_idx" ON "AnalyticsSnapshot" ("recordedAt");
CREATE INDEX "AnalyticsSnapshot_snapshotType_idx" ON "AnalyticsSnapshot" ("snapshotType");
CREATE INDEX "AnalyticsSnapshot_metricName_idx" ON "AnalyticsSnapshot" ("metricName");
CREATE INDEX "AnalyticsSnapshot_deletedAt_idx" ON "AnalyticsSnapshot" ("deletedAt");
