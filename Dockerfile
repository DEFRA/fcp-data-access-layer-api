ARG PARENT_VERSION=2.1.2-node18.11.0
ARG PORT=3000
ARG PORT_DEBUG=9229
ARG PORT_MOCK=3100

# Development
FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

ARG PORT
ARG PORT_DEBUG
ARG PORT_MOCK
ENV PORT ${PORT}
ENV PORT_MOCK ${PORT_MOCK}
EXPOSE ${PORT} ${PORT_DEBUG} ${PORT_MOCK}

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
CMD [ "npm", "run", "start:watch" ]

# Production
FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

ARG PORT
ENV PORT ${PORT}
EXPOSE ${PORT}

COPY --from=development /home/node/mocks/ ./mocks/
COPY --from=development /home/node/app/ ./app/
COPY --from=development /home/node/package*.json ./
RUN npm ci
CMD [ "node", "app" ]
