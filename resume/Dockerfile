FROM registry.gitlab.com/islandoftex/images/texlive:latest AS resume-builder
WORKDIR /resume

RUN apt update && apt install -y wget
RUN mkdir -p ~/.local/share/fonts
RUN wget -O ~/.local/share/fonts/Avenir.ttf\
	https://github.com/platanus/fonts/raw/master/Avenir/Avenir-Medium.ttf
RUN fc-cache -f -v


COPY ./ /resume
RUN make
RUN mv /resume/TylerHolewinski-Resume.pdf /resume.pdf

FROM busybox:1.35

RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=resume-builder /resume.pdf .
CMD ["busybox", "httpd", "-f", "-p", "0.0.0.0:3000"]
