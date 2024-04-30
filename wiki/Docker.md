
# running the Docker from the code

To run the BloomFilter application inside a Docker container, follow these steps:
1. Navigate to Repository Directory:


```
cd path-to-repository’s-directory/BloomFilter
```



2. Build Docker Image:

```
docker build -t ex1 .
```


<img width="1921" alt="‏‏1" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/3116d8f5-f774-4390-927a-8bdef76c4972">


This command builds a Docker image named "ex1" using the Dockerfile in the current directory.



3. Run Docker Container:

```
docker run -i -t -p 5555:5555 ex1

```

<img width="1919" alt="‏‏2" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/b2ca5d3a-83bf-4620-a736-c5d7cfd25670">
This command runs a Docker container based on the "ex1" image, exposing port 5555 on the host system to port 5555 in the container.




# running the Docker from Docker Hub
 The lastest tag for now is v1.2.0
 Follow these steps to find the BloomFilter Docker image on Docker Hub and run it:


1. Pull the Image: Use the docker pull command to download the image from Docker Hub.

```
 docker pull edenbdv/bloom_filter:<latest_tag>
```
<img width="1912" alt="5PNG" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/c5d4b6a7-9a9c-48c2-8b83-eb6daf30d83f">



or search on the dockerhub directly the last version in edenbdv's  bloom_filter repo , and pull it.  
<img width="1082" alt="‏‏4" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/1ec269a6-51b6-4873-aa0a-22fb3ca892bc">



2. Run Containers: After pulling the image, you can run containers based on that image using the docker run command. For example:

```
docker run -i -t -p 5555:5555 edenbdv/bloom_filter:<latest_tag>

```
<img width="1919" alt="‏‏6" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/8a5cdf99-dbf7-4fb6-905a-91d97e6956ed">

