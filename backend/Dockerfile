FROM node:22-alpine

WORKDIR /app

# Install deps separately for better caching
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 5000

# Default to dev. For prod, build and use `npm start`
CMD ["npm", "run", "dev"]
