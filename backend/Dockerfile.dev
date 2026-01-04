FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema first
COPY prisma ./prisma/

# Generate Prisma Client during build
RUN npx prisma generate

# Copy tsconfig before source code (for path resolution)
COPY tsconfig*.json ./

# Copy source code
COPY . .

# Expose port
EXPOSE 3000 

# Start with tsconfig-paths support for path aliases
CMD ["npm", "run", "start:dev"]