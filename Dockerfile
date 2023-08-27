# Utiliza la imagen oficial de Node.js 14 slim como base
FROM node:14-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el contenido de tu aplicación al directorio de trabajo en el contenedor
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Expone el puerto en el que la aplicación escucha
EXPOSE 3000

# Comando para iniciar la aplicación cuando se inicie el contenedor
CMD ["npm", "run", "dev"]
