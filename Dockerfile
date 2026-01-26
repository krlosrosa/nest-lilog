# Dockerfile simplificado para NestJS + Prisma
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --force --loglevel=error

# Copiar código fonte
COPY . .

# Fazer build da aplicação
RUN npm run build

# Expor porta
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]