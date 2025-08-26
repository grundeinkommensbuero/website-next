#!/bin/sh
if [ "$NEXT_PUBLIC_PROJECT" = "Hamburg" ]; then
  cp public/favicon-hamburg.ico public/favicon.ico
elif [ "$NEXT_PUBLIC_PROJECT" = "Berlin" ]; then
  cp public/favicon-berlin.ico public/favicon.ico
fi
