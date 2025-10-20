# Dockerfile per il Backend (Strapi)

# Usa un'immagine Node.js ufficiale come base
FROM node:18-alpine

# Imposta la directory di lavoro nel container sul progetto Strapi generato in ./app
WORKDIR /opt/app/app

# Copia i file di manifest se presenti (usa npm)
COPY app/package.json ./
COPY app/package-lock.json ./

# Installa le dipendenze del progetto
RUN npm install --legacy-peer-deps

# Copia il resto dei file dell'applicazione
# Questo è fatto dopo l'installazione delle dipendenze per sfruttare la cache di Docker
COPY . /opt/app

# Esponi la porta su cui Strapi verrà eseguito
EXPOSE 1337

# Comando per avviare l'applicazione in modalità sviluppo
CMD ["npm", "run", "develop"]
