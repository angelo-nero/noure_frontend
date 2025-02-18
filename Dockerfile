FROM node:18-alpine as build

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

# Log environment variables (be careful not to expose sensitive data)
RUN echo "REACT_APP_API_URL during build: $REACT_APP_API_URL"

# Build with environment variable
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN echo "Final REACT_APP_API_URL: $REACT_APP_API_URL"

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

# Log environment at startup
CMD echo "Starting server with REACT_APP_API_URL: $REACT_APP_API_URL" && serve -s build -l 3000 