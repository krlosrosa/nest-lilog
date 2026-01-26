# ---------- BUILD ----------
  FROM node:22 AS builder

  WORKDIR /app
  
  COPY package.json package-lock.json ./
  RUN npm install
  
  COPY . .
  RUN npm run build
  
  
  # ---------- RUNTIME ----------
  FROM node:22-alpine
  
  WORKDIR /app
  
  COPY package.json package-lock.json ./
  RUN npm install --omit=dev
  
  COPY --from=builder /app/dist ./dist
  
  EXPOSE 3000
  CMD ["node", "dist/src/main.js"]
  