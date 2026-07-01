#!/bin/sh
set -e

export BACKEND_HOST="${BACKEND_HOST:-backend}"
export CSP_CONNECT_SRC="${CSP_API_ORIGIN:-${REACT_APP_BACKEND_URL:-}}"

envsubst '${BACKEND_HOST} ${CSP_CONNECT_SRC}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
