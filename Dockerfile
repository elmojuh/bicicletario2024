# Use uma imagem base do Node.js
FROM node:latest

# Crie um diretório para a aplicação
WORKDIR /usr/src/app

# Copie o arquivo package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação usa
EXPOSE 3000

# Defina a variável de ambiente DOCKER_ENV
ENV DOCKER_ENV=true

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]
