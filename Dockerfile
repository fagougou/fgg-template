FROM node:alpine

# File Author / Maintainer
MAINTAINER Fagougou Hackers

# Set Timezone
RUN apk update && \
    apk add tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" >  /etc/timezone && \
    date

# Uncomment the line below if you are using VUE
# RUN apk add --no-cache make gcc g++ python

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && \
    npm install --silent --production && \
    npm install chalk && \
    mkdir -p /app && \
    cp -a /tmp/node_modules /app

# Uncomment the line below if you are using VUE
# RUN apk del make gcc g++ python

WORKDIR /app

ADD . .

RUN npm run build

CMD ["node", "server/bin/www"]
