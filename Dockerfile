FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Install serve package
RUN npm install -g serve

EXPOSE 3000

# Use serve to run the built application
CMD ["serve", "-s", "build", "-l", "3000"] 