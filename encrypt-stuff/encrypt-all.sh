for file in $(./run/list.sh); do
  echo "$file"
  if ! [[ $(file $file) =~ directory ]]; then
    if ! [[ "$file" =~ \.enc$ ]]; then
      echo "Encrypting $file"
      node ./run/encrypt.js $file
    fi
  fi
done
