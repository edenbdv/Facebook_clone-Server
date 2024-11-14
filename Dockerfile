FROM node:18 AS node-build

# Set the working directory for the Node.js application
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files into the container
COPY . .

# Expose the app port
EXPOSE 12346

# Start the Node.js server
CMD ["node", "app.js"]
