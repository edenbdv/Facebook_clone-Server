
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
<img width="532" alt="‏‏7" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/e250c770-dcbf-478e-8a3c-fa3c87c45951">


This command runs a Docker container based on the "ex1" image, exposing port 5555 on the host system to port 5555 in the container.




# running the Docker from Docker Hub
 The lastest tag for now is v1.0.3
 Follow these steps to find the BloomFilter Docker image on Docker Hub and run it:


1. Pull the Image: Use the docker pull command to download the image from Docker Hub.

```
 docker pull edenbdv/bloom_filter:<latest_tag>
```
<img width="1081" alt="‏‏11" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/cde5dcd8-8a2d-4fad-b14f-e9ece38dbfdc">



or search on the dockerhub directly the last version in edenbdv's  bloom_filter repo , and pull it.  

<img width="1330" alt="‏‏8" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/1bf86247-920f-4722-8084-0bc27625fdc6">



2. Run Containers: After pulling the image, you can run containers based on that image using the docker run command. For example:

```
docker run -i -t -p 5555:5555 edenbdv/bloom_filter:<latest_tag>

```
<img width="1913" alt="‏‏10" src="https://github.com/edenbdv/FooBar-Server/assets/94904176/23cdea91-8e2f-4917-b708-97e06573260d">

