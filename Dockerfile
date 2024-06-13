ARG DOCKER_REGISTRY=""

##### BASE NODE IMAGE #######

FROM node:20.9.0-slim as base

WORKDIR /usr/app

##### SET UP PNPM ######

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

#####  Source stage ######

FROM base as source

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --production=false
COPY src ./src

#####  Dependencies stage ######

FROM source as dependencies

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --production --ignore-scripts

#### Build stage ####

FROM source as build

COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY public ./public
COPY index.html ./
COPY vite.config.ts ./
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build

###### Release stage #####

FROM base as release

COPY --from=source --chown=node:node /usr/app/package.json /usr/app/package.json
COPY --from=dependencies --chown=node:node /usr/app/node_modules/ /usr/app/node_modules/
COPY --from=build --chown=node:node /usr/app/dist/ /usr/app/dist

FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /usr/app/dist ./
COPY injectVarEnv.sh /usr/share/nginx/injectVarEnv.sh
RUN chmod +x /usr/share/nginx/injectVarEnv.sh

EXPOSE 4001

# Replace placeholders with environment variables at runtime
RUN apk add --no-cache bash

CMD ["/usr/share/nginx/injectVarEnv.sh", "nginx", "-g", "daemon off;"] 
