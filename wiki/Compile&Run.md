# Compiling and Running 

The web server relies on the Bloom Filter Server, because of that you need to run the bloom-filter-server befire the web server. The clients don't have an order they have to run in.

## 1. Bloom Filter Server

### Compilation

Navigate to the bloom filter server directory and compile the code:

```
cd src
g++ -o main.exe Main.cpp BloomFilter.cpp App.cpp Menu.cpp IHash.h ICommand.h Hashs/StdHash.cpp Hashs/DoubleStdHash.cpp 
Commands/AddUrlCommand.cpp Commands/ContainsUrlCommand.cpp -pthread
```

### Running the Bloom Filter

After compilation, run the bloom filter server:

```
./main.exe
```

this is how it will look once the run started.

![image](https://github.com/edenbdv/FooBar-Server/assets/148945751/c1a74440-4821-420e-bc75-e369035a09eb)


## 2. Web Server

Running the web server depends on which client you want to run.
- Android:
  - Procced in step 2 and run the server and then continue to step 3 and run the android app.
- Web Client
  - Start with step 4 to compile the web client.
  - Copy the content of the 'build' dir in the client to the server's public folder.
    
  - ![image](https://github.com/edenbdv/FooBar-Server/assets/148945751/9252768d-6b2b-4ede-a273-a2f8dfae8484)
 
  - ![image](https://github.com/edenbdv/FooBar-Server/assets/148945751/6f288f8e-8f45-4eb7-8df5-2f50bc2e02e4)

  - (optional) Delete from the index.html 
  - '<script src="../src/JSFiles/index.js"></script><script src="../src/JSFiles/App.js"></script>'
  - Procced in step 2 and run the server.

### Running the Server

After compilation, run the web server:

```
node app.js
```

and open on your web browser the url:

```
http://localhost:12346/
```

![image](https://github.com/edenbdv/FooBar-Server/assets/148945751/a6a48ed7-43ea-4b4d-9f30-14ff8c5e68f8)


## 3. Android

### Compilation

Ensure you have Android Studio installed. Open the `facebook-android` project in Android Studio and build it.

### Running the App

Run the Android app from Android Studio on an emulator or connected device.

## 4. Web Client

### Compilation

Navigate to the web client directory and install dependencies:

```
cd web-client
npm i
npm run build
```

### Running the Client

After installing dependencies, start the web client (that is if you don't want any connection with the server - if you want to see the interaction you need
to copy the buil dfiles to the server and run from there as explained in step 2.

```
npm start
```
