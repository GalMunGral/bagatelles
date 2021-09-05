#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <string.h>
#define SERVER_PORT 80
#define IP_ADDR "172.217.0.78"

struct sockaddr_in addr;
int addr_size;
int sock;
char buffer[] = "GET / HTTP/1.1\n\n";
char recv_buffer[4096];
int header_recved = 0;

int main(int argc, char const *argv[])
{
  addr.sin_family = AF_INET;
  addr.sin_port = htons(SERVER_PORT);
  inet_pton(AF_INET, IP_ADDR, &addr.sin_addr); 
  addr_size = sizeof(addr);
  sock = socket(AF_INET, SOCK_STREAM, 0);
  connect(sock, (struct sockaddr *) &addr, addr_size);
  printf("Connected!");  
  send(sock, buffer, strlen(buffer), 0);
  while(recv(sock, recv_buffer, 4096, 0) != 0) {
    printf("%s", recv_buffer);
    if (strstr(recv_buffer, "\r\n\r\n") != NULL) {
      if (0 == header_recved) {
        header_recved = 1;
      } else return 0;
    }
    memset(recv_buffer, 0, 4096);
  }
  return 0;
}
