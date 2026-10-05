FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Frontend (Vite) and backend ports
EXPOSE 5173 3000

CMD ["npm", "run", "server"]