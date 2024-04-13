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



// Function to send data to the server
int sendData(int sock, const string& data) {
    const char *data_addr = data.c_str();
    int data_len = strlen(data_addr);
    int sent_bytes = send(sock, data_addr, data_len, 0);
    if (sent_bytes < 0) {
        perror("error sending data to server");
    }
    return sent_bytes;
}


// Function to receive data from the server
string receiveData(int sock) {
    char buffer[4096];
    memset(buffer, 0, sizeof(buffer)); // Clear the buffer before receiving data

    // Receive data from the server
    int read_bytes = recv(sock, buffer, sizeof(buffer), 0);
    if (read_bytes <= 0) {
        // Error or connection closed by server
        if (read_bytes == 0) {
            cout << "Connection closed by server." << endl;
        } else {
            perror("error receiving data from server");
        }
        return "";
    }

    buffer[read_bytes] = '\0'; // Null-terminate the received data
    return string(buffer);
}



// Function to handle communication with the server
void handleCommunication(int sock) {
    while (true) {
        // Read input from the user
        cout << "Enter bloom filter array size and hash functions: ";
        string input;
        getline(cin, input);


         // Send input to the server
        int sent_bytes = sendData(sock, input);
        if (sent_bytes < 0) {
            break; // Exit the loop if sending fails
        }

        //cout << "about  to receive data from server " << endl;

        // Receive response from the server
        string receivedData = receiveData(sock);
        //cout << "received data from server " << endl;

        if (receivedData.empty()) {
            break; // Exit the loop if there's an error or the connection is closed
        }

        // Check if the received data indicates an invalid input
        if (receivedData == "INVALID_INPUT") {
            cout << "Error: Invalid input received from server." << endl;
            // Continue waiting for user input
            continue;
        }

        // Check if the received data indicates a successful response
        if (receivedData == "SUCCESS") {
           // cout << "Received successful response from server." << endl;

            while(true) {
                // Ask for additional input
                cout << "Enter command and url: ";
                string additionalInput;
                getline(cin, additionalInput);

                // Send additional input to the server
                int additional_sent_bytes = sendData(sock, additionalInput);
                if (additional_sent_bytes < 0) {
                    break; // Exit the loop if sending additional input fails
                }

                // Receive response for additional input
                receivedData = receiveData(sock);
                if (receivedData.empty()) {
                    break; // Exit the loop if there's an error or the connection is closed
                }


                 if (receivedData == "INVALID_INPUT") {
                cout << "Error: Invalid input received from server." << endl;
                // Continue waiting for user input
                continue;
                }

                // case that the command is 1 (add to bloomfilter)
                else if(receivedData == "SUCCESS")
                {
                 cout << "added url to black list." << endl;
                  continue;

                }
                
                
                //case that the command is 2 (check if the url is in the blacklist)
                else {
                      // Process received data normally
                 cout << receivedData << endl;
                }

            }
        
        }
       
    }
        close(sock);

    
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

    // Wait for the communication thread to finish
    communication_thread.join();
    // // Keep the main thread alive until the communication thread finishes
    // while (communication_thread.joinable()) {
    //     communication_thread.join();
    // }

    return 0;
}
