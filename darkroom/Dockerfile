FROM golang:latest
RUN apt-get update
RUN apt-get install -y git vim curl
RUN sh -c "$(curl -fsSL https://get.docker.com)"
RUN git config --global user.email "hewenqi96@gmail.com"
RUN git config --global user.name "Wenqi He"
RUN cd $GOPATH/src && git clone https://github.com/GalMunGral/test.git
RUN cd $GOPATH/src/test && go get
CMD dockerd
