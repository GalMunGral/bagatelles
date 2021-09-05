
#!/bin/bash
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
mkdir -p .src
for path in $(curl -sL https://math.gatech.edu/faculty-research-interests | ggrep -Po "/people/.*(?=\" )" | sort -u); do
  link=$(curl -sL "https://math.gatech.edu/$path" | ggrep -Po "(?<=href=\")http://people.math.gatech.edu/.*(?=\">)")
  curl -sLA "$USER_AGENT" "$link"  -o ".src/$(echo $link | ggrep -Po "(?<=\w/).*").html";
done
for username in $(grep -rl $1 .src | ggrep -Po "(?<=src/).*(?=.html)" | sort -u); do
  echo "http://people.math.gatech.edu/$username"
done
rm -r .src
