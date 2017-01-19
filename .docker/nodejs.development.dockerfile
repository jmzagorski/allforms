FROM node:latest
MAINTAINER Jeremy Zagorski

ENV APPHOME=/home/app

RUN useradd --user-group --create-home --shell /bin/false app && \
    chown -R app:app $APPHOME

# use changes to package.json to force cache bust
#COPY package.json /tmp/package.json
COPY ./package.json /install/package.json
WORKDIR /install
#RUN cd /tmp && npm install
RUN npm install
RUN mkdir -p $APPHOME/allforms && cp -ra /install/node_modules $APPHOME/allforms/

#USER app
WORKDIR $APPHOME/allforms/
COPY . $APPHOME/allforms/

ENTRYPOINT ["npm", "start", "-s" ]
