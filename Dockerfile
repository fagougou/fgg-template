FROM node:alpine

# File Author / Maintainer
MAINTAINER fgghackers

# Set Chinese Timezone
RUN apk update && \
    apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" >  /etc/timezone && \
    date

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && \
    npm install --production --silent && \
    mkdir -p /app && \
    cp -a /tmp/node_modules /app/

WORKDIR /app

ADD . .

CMD ["node", "bin/www"]
