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

![best](https://github.com/edenbdv/FooBar-Server/assets/148945751/f5ec4787-423a-4631-a336-5baabd5e7e83)


### Running the Server

After compilation, run the bloom filter server:

```
./main.exe
```

you will know it started to run when you will see 'start' in the terminal.

## 2. Web Server

If you want to run the android application there is no need to move the build files from the web client to 
the public dir in the server. But if you want to use the web client tou do need to follow this procedure.

So, for running web client - first go to step 3, compile the client code and copy
the static files and the index.html to the public folder of the server adn then run the server 
as written in step 2.

If you want to run the android client there is no need to copy any files and you
can just proceed with 2, ruun the server and then run the android client in step 4.

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
