ARG DOCKER_REGISTRY=""

##### BASE NODE IMAGE #######

FROM node:24-slim AS base

WORKDIR /usr/app

##### SET UP PNPM ######

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

#####  Source stage ######

FROM base AS source

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --production=false
COPY src ./src

#####  Dependencies stage ######

FROM source AS dependencies

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --production --ignore-scripts

#### Build stage ####

FROM source AS build

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build

###### Release stage #####

FROM base AS release

COPY --from=source --chown=node:node /usr/app/package.json /usr/app/package.json
COPY --from=dependencies --chown=node:node /usr/app/node_modules/ /usr/app/node_modules/
COPY --from=build --chown=node:node /usr/app/dist/ /usr/app/dist

FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /usr/app/dist ./
COPY entrypoint.sh /usr/share/nginx/entrypoint.sh
RUN chmod +x /usr/share/nginx/entrypoint.sh

EXPOSE 4001

# Replace placeholders with environment variables at runtime
RUN apk add --no-cache bash

ENTRYPOINT [ "/usr/share/nginx/entrypoint.sh" ]
