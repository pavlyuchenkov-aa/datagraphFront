# Build React app
FROM node:14 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Serve the app with Nginx
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the React app build files to the Nginx web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 80 so that it can be accessed outside the Docker container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]