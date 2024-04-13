#include <iostream>
#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include <sstream> 
using namespace std;

void handleCommunication(int sock) {
    
    for (int i = 0; i < 5; ++i) {
        stringstream ss;
        ss << "I'm a message " << i;
        string message = ss.str();
        const char *data_addr = message.c_str();
        int data_len = strlen(data_addr);
        int sent_bytes = send(sock, data_addr, data_len, 0);    
        if (sent_bytes < 0) {
            perror("error sending data to server");
            return;
        }
    
        char buffer[4096];
        int expected_data_len = sizeof(buffer);
        int read_bytes = recv(sock, buffer, expected_data_len, 0);
        if (read_bytes == 0) {
            // connection is closed
            cout<<"read_bytes == 0";
            break;
        } else if (read_bytes < 0) {
            perror("error receiving data from server");
            break;
        } else {
            cout << "Received from server: " << buffer << endl;
        }
        // Sleep for 5 seconds
        sleep(5);
    }
    
        //close(sock);
}

int main() {
    const char *ip_address = "127.0.0.1";
    const int port_no = 5555;
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return 1;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = inet_addr(ip_address);
    sin.sin_port = htons(port_no);

    if (connect(sock, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        perror("error connecting to server");
        return 1;
    }

    // Handle communication in a separate thread
    thread communication_thread(handleCommunication, sock);

    //communication_thread.detach(); // Detach the thread to let it run independently

    //communication_thread.join(); // Wait for the communication thread to finish

    // Keep the main thread alive until the communication thread finishes
    while (communication_thread.joinable()) {
        communication_thread.join();
    }

    return 0;
}
