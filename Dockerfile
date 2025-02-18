FROM node:18-alpine as build

# Declare build argument
ARG REACT_APP_API_URL

WORKDIR /app

# Add logging for debugging
RUN echo "Starting build process..."
RUN echo "Working directory: $(pwd)"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable from build arg
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Log for debugging
RUN echo "Building with REACT_APP_API_URL=$REACT_APP_API_URL"

# Create a .env file during build
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env

# Log for debugging
RUN echo "Content of .env file:"
RUN cat .env

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/build ./build

EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"] 