\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{sphinxhowto}[2009/06/02 Document class (Sphinx HOWTO)]

\newif\if@oneside
\DeclareOption{oneside}{\@onesidetrue}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{\sphinxdocclass}}
\ProcessOptions\relax

\if@oneside
\else
\PassOptionsToClass{twoside}{\sphinxdocclass}
\fi

\LoadClass{\sphinxdocclass}
\setcounter{secnumdepth}{2}

\renewcommand{\maketitle}{
    \begin{minipage}[t][0.382\textheight]{\linewidth}
    \rule{\textwidth}{2pt}
    \begin{center}
    \huge\textsc{\@title}
    \vfill
    \begin{center}
    \bigskip\small\textsc{\@author}\\
    \tiny{\@date}
    \end{center}
    \end{center}
    \rule{\textwidth}{2pt}
    \end{minipage}
}

\let\py@OldTableofcontents=\tableofcontents
\renewcommand{\tableofcontents}{
  \begingroup
    \parskip = 0mm
    \py@OldTableofcontents
  \endgroup
  \vspace{12pt}
}  

\@ifundefined{fancyhf}{
  \pagestyle{plain}}{
  \pagestyle{normal}}
\pagenumbering{arabic}

\thispagestyle{empty}

\let\py@OldThebibliography=\thebibliography
\renewcommand{\thebibliography}[1]{
  \phantomsection
  \py@OldThebibliography{1}
  \addcontentsline{toc}{section}{\bibname}
}
