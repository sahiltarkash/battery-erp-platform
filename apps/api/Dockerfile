FROM node:20-bullseye

WORKDIR /app

# 1. Install dependencies first
COPY apps/api/package*.json ./
RUN npm install

# 2. Copy full API source
COPY apps/api ./

# 3. Copy Prisma schema (IMPORTANT)
COPY prisma ./prisma

# 4. Generate Prisma client AFTER schema exists
RUN npx prisma generate --schema=./prisma/schema.prisma

# 5. Build app
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]