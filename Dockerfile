FROM docker.io/zidizei/lualatex:latest AS latex-builder
WORKDIR /resume

COPY ./resume /resume
RUN make