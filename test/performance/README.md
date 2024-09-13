# Microservice Performance Tests

This folder contains the peformance tests for the FFC Demo Web service `ffc-demo-web` front end.

The framework is based upon (jmeter)[https://jmeter.apache.org/], and utilises an jmeter image from [https://github.com/justb4/docker-jmeter].

## Requirements

- Docker Desktop 2.2.0.3 (42716) or higher
- (jmeter v5.1.1)[https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.1.1.tgz] (for local running)

## How to run the tests

- `cd test/performance`
- `docker-compose -f ../../docker-compose.yaml -f docker-compose.jmeter.yaml run jmeter-test`

## Parameterising your Tests

You can modify the number of virtual users, loop count and ramp-up duration by changing the settings in the file `demo-web-perf-test.properties`.

```yaml

# Sample user.properties file
#---------------------------------------------------------------------------
# Properties added to manage noThreads rampUp lCount values
#---------------------------------------------------------------------------
noThreads=15 
rampUp=1 
lCount=2

```
