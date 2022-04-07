for file in $(./run/list.sh); do
  echo "Decrypting $file"
  if [[ $file =~ \.enc$ ]]; then
    node ./run/decrypt.js $file
  fi
done
