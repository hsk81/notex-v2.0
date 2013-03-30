\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{sphinxmanual}[2012/05/18 Document class (Sphinx manual)]

\PassOptionsToClass{openright}{\sphinxdocclass}

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
\setcounter{tocdepth}{1}

\renewcommand{\maketitle}{
    \begin{titlepage}
    \begin{center}
    \begin{minipage}[t][0.550\textheight]{\textwidth}
    \rule{\textwidth}{2pt}
    \begin{center}
    \huge\textsc{\@title}
    \end{center}
    \rule{\textwidth}{2pt}
    \end{minipage}
    \begin{minipage}[b][0.425\textheight]{\textwidth}
    \begin{center}
    \textsc{\@author}\\
    \tiny{\@date}
    \end{center}
    \rule{\textwidth}{2pt}
    \end{minipage}
    \end{center}
    \end{titlepage}
}

\let\py@OldEndAbstract=\endabstract
\renewcommand{\endabstract}{
  \if@openright
    \ifodd\value{page}
      \typeout{Adding blank page after the abstract.}
      \vfil\pagebreak
    \fi
  \fi
  \py@OldEndAbstract
}

\let\py@OldTableofcontents=\tableofcontents
\renewcommand{\tableofcontents}{
  \setcounter{page}{1}
  \pagebreak
  \pagestyle{plain}{
    \parskip = 0mm
    \py@OldTableofcontents
    \if@openright
      \ifodd\value{page}
        \typeout{Adding blank page after the table of contents.}
        \pagebreak\hspace{0pt}
      \fi
    \fi
    \cleardoublepage
  }\pagenumbering{arabic}
  \@ifundefined{fancyhf}{}{\pagestyle{normal}}
}

\renewcommand*\l@section{\@dottedtocline{1}{1.5em}{2.6em}}
\renewcommand*\l@subsection{\@dottedtocline{2}{4.1em}{3.5em}}

\let\py@OldThebibliography=\thebibliography
\renewcommand{\thebibliography}[1]{
  \cleardoublepage
  \phantomsection
  \py@OldThebibliography{1}
  \addcontentsline{toc}{chapter}{\bibname}
}
