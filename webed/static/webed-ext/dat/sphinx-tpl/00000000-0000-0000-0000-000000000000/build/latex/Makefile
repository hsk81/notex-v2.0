ALLDOCS = $(basename $(wildcard *.tex))
ALLPDF = $(addsuffix .pdf,$(ALLDOCS))
ALLDVI = $(addsuffix .dvi,$(ALLDOCS))

ARCHIVEPRREFIX =
LATEXOPTS=-no-shell-escape -halt-on-error
LATEXEXEC=xelatex

all: $(ALLPDF)
all-pdf: $(ALLPDF)
all-dvi: $(ALLDVI)
all-ps: all-dvi
	for f in *.dvi; do dvips $$f; done

%.dvi: %.tex
	latex $(LATEXOPTS) '$<'
	-makeindex -s python.ist '$(basename $<).idx'
	latex $(LATEXOPTS) '$<'

%.pdf: %.tex
	$(LATEXEXEC) $(LATEXOPTS) '$<'
	-makeindex -s python.ist '$(basename $<).idx'
	$(LATEXEXEC) $(LATEXOPTS) '$<'

clean:
	rm -f *.dvi *.log *.ind *.aux *.toc *.syn *.idx *.out *.ilg *.pla

.PHONY: all all-pdf all-dvi all-ps clean
