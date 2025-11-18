# Dockerfile simplificado para NestJS + Prisma
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/


# Instalar dependências
RUN npm cache clean --force 
RUN npm install --legacy-peer-deps --loglevel=error

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Fazer build da aplicação
RUN npm run build

# Expor porta
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]