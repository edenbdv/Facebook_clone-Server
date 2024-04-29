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

### Running the Server

After compilation, run the bloom filter server:

```
./main.exe
```

you will know it started to run when you will see 'start' in the terminal.

![best](https://github.com/edenbdv/FooBar-Server/assets/148945751/12a84517-7511-4440-8687-ccd1fef8daa1)


## 2. Web Server

Running the web server depends on which client you want to run.
- Android:
  - Procced in step 2 and run the server and then continue to step 3 and run the android app.
- Web Client
  - Start with step 4 to compile the web client.
  - Copy the ststic files and index.html to the 'public' dir in the server.
  - Procced in step 2 and run the server.

### Running the Server

After compilation, run the web server:

```
node app.js
```

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
npm install
```

### Running the Client

After installing dependencies, start the web client:

```
npm start
```
