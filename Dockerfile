FROM node:current

ARG buildno
ARG commitsha

# Add remotr user so we don't run as root
RUN useradd -m -d /home/remotr -s /bin/bash remotr
RUN mkdir /opt/remotr
RUN chown remotr /opt/remotr -R

# Copy files, install and compile
COPY . /opt/remotr
WORKDIR /opt/remotr
RUN npm ci
RUN npm run build

# Start
USER remotr
CMD ["npm", "run", "start"]
