default: clean all

all: resume.tex sidebar.tex
	lualatex -jobname TylerHolewinski-Resume resume.tex

clean:
	rm -f *.aux
	rm -f *.bbl
	rm -f *.bcf
	rm -f *.blg
	rm -f *.fdb_latexmk
	rm -f *.fls
	rm -f *.log
	rm -f *.out
	rm -f *.run.xml
	rm -f *.synctex.gz
	rm -f TylerHolewinski-Resume.pdf
	rm -f resume.pdf


watch:
	while true; do \
		$(MAKE) all; \
		fswatch -1 .; \
	done 

purge: clean
	rm -rf TylerHolewinski-Resume.pdf
	git clean -fX
