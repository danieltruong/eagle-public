# Angular 21 Builder Image for OpenShift S2I
# Uses Node.js 22 for building Angular application

FROM registry.access.redhat.com/ubi9/nodejs-22:latest

ENV STI_SCRIPTS_PATH=/usr/libexec/s2i

# Set working directory
WORKDIR /opt/app-root/src

# Enable Corepack for Yarn 4.5.3 support
USER 0
RUN corepack enable && corepack prepare yarn@4.5.3 --activate
RUN npm install -g @angular/cli@21

# Copy S2I scripts
COPY ./s2i/bin/ $STI_SCRIPTS_PATH/
RUN chmod -R g+rwx $STI_SCRIPTS_PATH

# Switch back to default user
USER 1001

# The S2I assemble script will handle:
# - yarn install --immutable
# - ng build

# Build output will be in dist/eagle-public/browser/
