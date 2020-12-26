## Quick start

1.  Clone this repo using `git clone https://github.com/novikdev/yocco.git`
1.  Go to the project folder `cd yocco`
1.  Run `cd client && yarn install && cd ../server && yarn install` to install dependencies.
1.  Run Postgres in container
    ```
    docker run --name yocco-db -it -d -p 5432:5432 \
    -e POSTGRES_DB=yocco \
    -e POSTGRES_USER=admin \
    -e POSTGRES_PASSWORD=yoursecretpassword \
    -v yocco_data:/var/lib/postgresql/data \
    postgres
    ```
