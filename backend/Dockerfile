FROM node:19-buster

# set the working directory for the container to "/backend_source"
WORKDIR /backend_source

# copy the project into the build-stage container at "/frontend_source"
COPY ./ /backend_source

# run the following commands to install dependencies, build project
# these run *inside* the build-stage container
RUN npm install
CMD npm run start


