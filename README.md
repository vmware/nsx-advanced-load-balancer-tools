# Migrationtools docker image

## Build instructions
```
cd build
docker build -t avinetworks/avitools:latest .
```

## How you can use migrationtools docker image

First you need to build a docker image
Run the run.sh which is in scripts directory to run avitools on that image


## If you want to run migrationtools for specific configuration then you need to
create a directory named as "avi" inside the avitools and copy the
configurations into that directory

You dont need to pass config file path as /avi/<your config file>
You can simply pass the file name

## To show the commands supported by avitools
```
./run.sh avitools-list or ./run.sh
```

## How to run commands using run.sh
```
ex. sh run.sh <image_name> <command>
./run.sh f5_converter.py -h
./run.sh f5_converter.py -f <filename> -v <version>
```

## To run ansible playbook
```
./run.sh ansible-playbook <playbook-name> -v
```