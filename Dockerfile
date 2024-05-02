FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY . /usr/src/app

ENV NEXT_PUBLIC_HOST=https://be.getpsychohelp.com
ENV NEXT_PUBLIC_URL=https://getpsychohelp.com
ENV NEXT_PUBLIC_BOT=psycological_help_bot

EXPOSE 3000

RUN npm ci

RUN npm run build

CMD ["npm", "start"]