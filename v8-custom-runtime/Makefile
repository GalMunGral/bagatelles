PROG = v8_repl
CC = g++
CPPFLAGS = -Ideps/v8 -Ideps/v8/include
LDFLAGS = -Ldeps/v8/out.gn/x64.release.sample/obj/ -lv8_monolith -lpthread

program: main.o
	$(CC) -o $(PROG) main.o $(LDFLAGS)
main.o:
	$(CC) $(CPPFLAGS) -c main.cpp
clean:
	rm v8_repl *.o