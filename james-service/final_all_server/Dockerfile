FROM node:bullseye
# FROM sandrokeil/typescript:latest

# Install 
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN apt-get update && \
    apt-get install -y docker.io
RUN echo "Y" | apt-get install expect
RUN npm install

# RUN  touch /var/run/docker.sock 
# RUN chmod 666 /var/run/docker.sock
# build
# FROM base AS builder
COPY components ./components
COPY contexts ./contexts
COPY next.config.js ./next.config.js
COPY next-env.d.ts ./next-env.d.ts 
COPY tsconfig.json ./
COPY styles ./styles
COPY hooks ./hooks
COPY public ./public
COPY utils ./utils
COPY vpn ./vpn
COPY .env .
COPY .env.local .
COPY server.js .
COPY db.ts .
COPY db.json .
COPY .babelrc .
COPY .eslintrc.json .
COPY pages ./pages
COPY . .

RUN chmod 777 db.json
RUN npm run build

# production
# FROM base AS runner
# WORKDIR /app
ENV NODE_ENV production
USER root



EXPOSE 3000
ENV PORT 3000


#NextAuth 
ENV NEXTAUTH_SECRET 
ENV NEXTAUTH_URL 
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID 
ENV NEXT_PUBLIC_GOOGLE_CLIENT_SECRET 

#init e-mail admin
ENV NEXT_PUBLIC_MAIL_GOOGLE=



#firebase
ENV NEXT_PUBLIC_APIKEY 
ENV NEXT_PUBLIC_AUTHDOMAIN 
ENV NEXT_PUBLIC_PROJECTID 
ENV NEXT_PUBLIC_STORAGE 
ENV NEXT_PUBLIC_MESSAGE 
ENV NEXT_PUBLIC_APPID 
ENV NEXT_PUBLIC_WEB_APP=


#docker
ENV NEXT_PUBLIC_CONTAINER_NAME=

#ENV DOMAIN_NAME 
ENV DOMAIN_NAME=

CMD ["npm","start"]
