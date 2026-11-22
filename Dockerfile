FROM node:26-alpine as base 
WORKDIR /app

FROM base as build

COPY package*.json ./
RUN npm ci
RUN ls

COPY ./ ./

RUN npx prisma generate
RUN NODE_ENV=production npm run build

FROM base 

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma7.config.ts ./prisma7.config.ts
COPY --from=build /app/src/generated ./src/generated

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && npx prisma db seed me && node dist/main"
