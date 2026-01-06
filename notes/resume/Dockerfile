FROM rust:bullseye AS build

WORKDIR /tmp
RUN cargo install --locked typst-cli
RUN mkdir -p ~/.fonts \
    && wget https://github.com/rsms/inter/releases/download/v4.1/Inter-4.1.zip \
    && unzip Inter-4.1.zip \
    && cp Inter.ttc *.ttf ~/.fonts/ \
    && wget https://api.fontshare.com/v2/fonts/download/general-sans \
    && unzip general-sans \
    && cp GeneralSans_Complete/Fonts/OTF/* ~/.fonts/ \
    && fc-cache -f -v

COPY resume.typ ./resume.typ
RUN typst compile resume.typ && mv resume.pdf /resume.pdf

FROM busybox:1.35
RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=build /resume.pdf .
CMD ["busybox", "httpd", "-f", "-p", "0.0.0.0:3000"]