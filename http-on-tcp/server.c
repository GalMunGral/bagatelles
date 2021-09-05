#include <netinet/in.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#define CONN_MAX 10
#define PORT 3000

struct sockaddr_in addr;
int addr_size;
int server_fd;
char buffer[] = "HTTP/1.1 200 OK\n\n<h1>Hello</h1><p>world</p>";
char recv_buffer[1024];

int main(int argc, char const *argv[]) {
  printf("Listening on 3000\n");
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = INADDR_ANY;
  addr.sin_port = htons(PORT);
  addr_size = sizeof(addr);
  server_fd = socket(AF_INET, SOCK_STREAM, 0);
  bind(server_fd, (struct sockaddr *) &addr, addr_size);

  listen(server_fd, CONN_MAX);
  while(1) {
    int sock = accept(server_fd, (struct sockaddr *) &addr, (socklen_t *) &addr_size);
    printf("New connection!\n");
    recv(sock, recv_buffer, 1024, 0);
    send(sock, buffer, strlen(buffer), 0);
    close(sock);
  }
  return 0;
}
  
