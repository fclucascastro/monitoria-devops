# Etapa 1: build
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build

# Etapa 2: produção
FROM node:18

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
RUN npx prisma generate

CMD ["node", "dist/main"]
