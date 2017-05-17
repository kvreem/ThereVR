
LOCALLIBDIR = /usr/local/lib
NITE_INCLUDE = /Users/hen/Documents/NiTE-MacOSX-x64-2.2/Include
NITE_LIBS = /Users/hen/Documents/NiTE-MacOSX-x64-2.2/Redist

CC = g++
CPPFLAGS = -g -Wall -Werror -Wmissing-prototypes -I$(OPENNI2_INCLUDE) -I$(NITE_INCLUDE)
OBJS = main.o
PROG = main
LDFLAGS = -L$(LOCALLIBDIR) -L$(NITE_LIBS) -L/usr/local/lib/OpenNI2/drivers -L$(OPENNI2_REDIST)
LDLIBS  = -lfreenect2-openni2.0 -lNiTE2 -lOpenNI2

all: $(PROG)

$(PROG): $(OBJS)
	$(CC) $(CFLAGS) $(OBJS) -o $@ $(LDFLAGS) $(LDLIBS)

#server.o: rio.h
#rio.o: rio.h

clean:
	rm -f *~ *.o $(PROG) core a.out
