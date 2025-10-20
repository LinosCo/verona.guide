# Dockerfile per il Frontend (Next.js)

# Usa un'immagine Node.js ufficiale come base
FROM node:18-alpine

# Imposta la directory di lavoro nel container
WORKDIR /usr/src/app

# Copia i file package.json e yarn.lock (o package-lock.json)
# Verranno creati al passo di inizializzazione del progetto
COPY package*.json ./

# Installa le dipendenze
# Usiamo 'npm install' perché create-next-app usa npm di default
RUN npm install

# Copia il resto dei file dell'applicazione
COPY . .

# Esponi la porta su cui Next.js verrà eseguito
EXPOSE 3000

# Comando per avviare il server di sviluppo
CMD ["npm", "run", "dev"]
