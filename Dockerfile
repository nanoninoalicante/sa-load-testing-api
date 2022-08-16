FROM node:16

WORKDIR /usr/src/app

ARG COMMIT_ID
ARG BRANCH_NAME
ARG REGION
ARG VERSION

ENV COMMIT_ID=$COMMIT_ID
ENV BRANCH_NAME=$BRANCH_NAME
ENV REGION=$REGION
ENV VERSION=$VERSION
ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm ci

# Copy the local code to the container
COPY . .
# Build
# RUN npm run build-container
# Start the service
CMD npm start