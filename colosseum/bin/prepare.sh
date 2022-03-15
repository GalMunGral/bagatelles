#!/usr/bin/env bash

mp4box -dash 30000 -segment-name $1-'$Number$' -out $1.mpd $1.mp4

for file in $1-*; do
  mv $file $file.orig
  openssl enc -aes-256-cbc -pass pass:"$2" -in $file.orig -base64 -out $file
  rm $file.orig
done

rm $1.mp4