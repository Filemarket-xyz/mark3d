#! /bin/bash

CURRENT=$(redis-cli get $1_hash)
shift

if [[ "$CURRENT" != "" ]]; then
    NEW=$(find $@ -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum)
    if [[ "$NEW" == "$CURRENT" ]]; then
        echo false
    else
        echo true
    fi
else
    echo true
fi
