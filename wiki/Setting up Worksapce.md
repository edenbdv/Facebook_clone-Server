# Setting Up Workspace for Android and Web Foobar

This guide will walk you through setting up your workspace for both Android and web mock Facebook projects. We'll cover cloning repositories, setting environment variables, and installing dependencies.

## Android

### Clone Android Repository

Clone the Android repository from GitHub:
```
git clone https://github.com/nogazit99/FB-android/tree/profile_page.git
```
The relevant and most up to date branch is 'ex4_main'.

### Environment Variables

In the `FB-android` project, you'll need to modify the `.env` file. Here are the environment variables you'll need to change:

-IP:
  - In the 'values' folder under 'res' there is a strings xml file.
  - In the strings file there is a variable called <string name="base_url">.
  - Change the string to the IP of the computer you're running the server from.
  - ![image](https://github.com/edenbdv/FooBar-Server/assets/148945751/431a5398-fa74-47d4-95ce-3ffd1d1cf013)

## Web Client

### Clone Web Repository

Clone the Web repository from GitHub:

```
git clone https://github.com/nogazit99/FB.git
```
The relevant and most up to date branch is 'ex4_main'.

### Environment Variables


### Install Dependencies


## Web Server

### Clone Web Repository

Clone the Web repository from GitHub:

```
git clone https://github.com/edenbdv/FooBar-Server.git
```
The relevant and most up to date branch is 'ex4_main'.

### Environment Variables

In the `FooBar-Server` project, you'll need to modify the `.env` file. Here are the environment variables you'll need to change:

-IP:
  - In a config folder there is a file called bloom_filter_config.env
  - Change the string to the IP of the computer you're running the server from.
  - ![image](https://github.com/edenbdv/FooBar-Server/assets/148945751/d6da64ee-6bf7-405a-a3bf-201662c5b926)


### Install Dependencies

Navigate to the `facebook-web` directory and install dependencies:

```
cd Foobar-Server
npm install
```

## Bloom-Filter

### Clone Web Repository

Clone the Web repository from GitHub:

```
git clone https://github.com/nogazit99/BloomFilter.git
```
The relevant and most up to date branch is 'ex4_main'.

#### It is very important to note that our bloomfilter and web server were built to support only urls that have the prefix 'http://'


## Summary

Now you have both Android and Web projects set up for running Foobar.

### Repositories:

- [Android Repository](https://github.com/nogazit99/FB-android/tree/ex4_main)
- [Web Client](https://github.com/nogazit99/FB/tree/ex4_main)
- [Web Server](https://github.com/edenbdv/FooBar-Server/tree/ex4_main)
- [BloomFilter](https://github.com/nogazit99/BloomFilter/tree/ex4_main)

