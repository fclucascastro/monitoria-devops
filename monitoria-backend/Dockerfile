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

# Copia apenas o necessário da build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
RUN npx prisma generate

# Porta da aplicação NestJS
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

