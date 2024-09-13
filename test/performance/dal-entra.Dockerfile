FROM fcp-data-access-layer-api

USER root
RUN apk add py3-pip \
 && apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo make \
 && pip install --upgrade pip \
 && pip install azure-cli

USER node

## may need to start the container with a shell to do `az login` before running the app
# ENTRYPOINT [ "sh" ]