---
title: Fisher-Kasteleyn-Temperley Algorithm
date: 2021-07-25 23:44:51
tags:
  - Mathematics
  - Algorithm
  - Graph Theory
  - Computer Science
mathjax: true
---

## Intro to the problem

### Domino Tiling Question

#### Question Description

Assuming we have a regular grid board of size $m\times n$ (provided that $2\mid mn$). 

A perfect coverage is to completely covering the entire board with $1\times 2$ tiles which guaranteeing no extra parts and no overlap.

We want to know there are how many different perfect coverages (Let it be $f(m,n)$).

#### Degenerate Case

Provided $m=1$, we can easily derive that $f(1,n)=1$.

Provided $m=2$, by simply assuming two states of the last two columns, we know that 
$$f(2,n)=f(2,n-1)+f(2,n-2),f(2,1)=1,f(2,2)=2$$
which is reduced to the Fibonacci Series.

#### Dynamic Programming

Otherwise considering the cases how does a grid at $k$-th row get covered:
1. Get covered by a vertical tile spans $k$-th and $k+1$-th row ;
2. Get covered by a vertical tile spans $k-1$-th and $k$-th row ;
3. Get covered by a horizontal tile.

In fact, we can treat case 2 and 3 as the same state, since they share the truth that they do not "protrude to the next row".

we use $0$ denote case 1, and $1$ for case 2 and 3. For each row of the board, we can write its state string down like:

$$r_i=\cdots 10000111\cdots$$

However, two gird with adjacent rows and same column cannot take state $0$ simultaneously (a so-called double $0$ conflit), which means:

$$r_{i} | r_{i+1} =\underbrace{\cdots 11111111\cdots}_{\text{all is 1}}$$

here "|" denotes the bitwise **OR** operation.

Now we try to traverse the board line by line.

For grid at $i$-th row $j$-th column (marked as $(i,j)$):

+ If $(i,j)$ have been determined, skip to $(i,j+1)$
+ If $(i-1,j)$ takes $0$, $(i,j)$ automatically takes $1$, and then we consider $(i,j+1)$ ;
+ If $(i-1,j)$ takes $1$ :
  + We put a horizontal tile and $(i,j),(i,j+1)$ both take $1$ , the next one to be considered is $(i,j+2)$
   (Note that we are traversing the board line by line. if $(i,j)$ is covered by a horizontal tile spans $j-1$-th and $j$-th column
    it must have been skipped when we were considering $(i,j-1)$. We cannot choose this way when $j=n$) ;
  + We put a vertical tile and $(i,j)$ takes $0$, $(i+1,j)$ takes $1$. The next one to be considered is $(i,j+1)$ .

Assuming a simple extension that $(i,n+1)$ automatically transforms into $ (i+1,1)$.

Apparently a legal collection of state strings $\lbrack r_1,r_2,\cdots,r_m\rbrack$ determines only one perfect coverage, and a perfect coverage takes a fixed collection of state strings.

The last row must takes all-ones state ($r_m=\cdots 11111111 \cdots$).

To solve this, we first look into the state of two adjacent rows $r_i,r_{i+1}$:

We say two state string $s_1,s_2$ is compatible, if and only if row $s_1|s_2=1$ (No double $0$ conflict) while $r_i=s_1$ and $r_{i+1}=s_2$ indeed be fully convered (it is not required to consider whether there is a vertical tile span to $i-1$-th row or $i+2$-th row, we can just take care of $r_i$ and $r_{i+1}$).

All those compatible state string pairs can be calculated with a Deep First Search:

+ We define the searching state as $(s_1,s_2,l)$ where $l\in\lbrace 0,1,\cdots,n\rbrace$. Assuming $s_1=a_1a_2a_3\cdots a_n,s_2=b_1b_2b_3\cdots b_n$, $l$ denotes that $a_1a_2\cdots a_l$ and $b_1b_2\cdots b_l$ is determined, while $a_{l+1}a_{l+2}\cdots a_n$ and $b_{l+1}b_{l+2}\cdots b_n$ remain undetermined;
+ We start from state $(X,X,0)$ (since $l=0$ implies no state is determined, we use $X$ denotes a casual state);
+ When it cames to state $(s_1=a_1a_2\cdots a_n,s_2=b_1b_2\cdots b_n,l)$ the next hops are:
  + $(s_1\mid_{a_{l+1}=1,a_{l+2}=1},s_2\mid_{b_{l+1}=1,b_{l+2}=1},l+2)$ (If we put a horizontal tile at $i+1$-th row spans $l+1$-th column and $l+2$-th column , then $a_{i+1}$ and $a_{i+2}$ must not take $0$ , or the vertical tile will protrude into the horizontal one) ;
  + $(s_1\mid_{a_{l+1}=0},s_2\mid_{b_{l+1}=1},l+1)$ (place a vertical tile spans $i$-th row and $i+1$-th row) ;
  + $(s_1\mid_{a_{l+1}=1},s_2\mid_{b_{l+1}=0},l+1)$ (place a vertical tile spans $i+1$-th row and $i+2$-th row).
+ for any searching state with $l=n$ rightly, record its state string pair as a compatible state pair and stop jumping to next state. (if $l=n+1$, do not record it, since it is an illegal form.)
 
We can easily write down the searching split tree equation as 

$$f(l)=2f(l+1)+f(l+2)+1,f(n)=1$$

and a trivial transformation 

$$f(l)+(\sqrt2-1)f(l+1)+\frac{\sqrt2}{2}=(\sqrt2+1)\left\lbrack f(l+1)+(\sqrt2-1)f(l+2)+\frac{\sqrt2}{2}\right\rbrack$$

which implies the above searching algorithm has a temporal complexity of $\mathcal O\left((\sqrt2+1)^n\right)$ .

The record of all compatible string pairs is marked as 

$$CSP=\left\lbrace(s_1,s_2)_1,(s_1,s_2)_2,(s_1,s_2)_3,\cdots,(s_1,s_2)_p\right\rbrace$$

where $p$ is the amount of all compatible string pairs satisfying $p=\mathcal O \left((\sqrt2+1)^n\right)$ too.

Now setting $DP(i,r_i)$ representing the amount of different perfect coverages (till $i$-th row, that is to say the $1$-th to $i$-th rows are all fulfilled without conflicts) when $i$-th row taking state string of $r_i$.

We can initiate $DP(0,r_0)$ as:

$$DP(0,r_0)=\left\lbrace\begin{aligned}1&,~\text{if}~r_0=\underbrace{\cdots 111111\cdots}_{\text{all is 1}};\\0&,~\text{Otherwise.}\end{aligned}\right.$$

This is a compatible extension, as "0-th" row would not protrude to $1$-th row if and only if it takes all state 1. 

For any $i\in\lbrace 1,2,\cdots,n\rbrace$ , to calculate $DP(i,r_i)$ , a zero initialization is applied, then follows the calculation procedure:


$$\text{Iterating}~i~\text{From}~1~\text{to}~m:$$

$$\text{Iterating}~j~\text{From}~1~\text{to}~p:DP\left(i,\left(CSP_j\right)_{s_2}\right)+=DP\left(i-1,\left(CSP_j\right)_{s_1}\right)$$

Since $r_m$ must takes $\underbrace{\cdots 111111\cdots}_{\text{all is 1}}$, the result shall be $DP\left(m,\underbrace{\cdots 111111\cdots}_{\text{all is 1}}\right)$

Clearly the proposed Dynamic Programming method has a temporal complexity of $\mathcal O\left(\text{max}\lbrace m,n\rbrace(\sqrt2+1)^{\text{min}\lbrace m,n\rbrace}\right)$, which is non-polynomial.

### Bipartite Planar Graph

Let get back to the title, the domino tiling problem mentioned above can be analyzed with another discrete mathematical structure, the Graph Theory.

A Bipartite Planar Graph (BPG) is a graph both bipartite and planar. Note that **biplanar** graph is not an abbreviation for BPG, as
**biplanar** refers to another term of **thickness**.

If we apply a chess board dyeing (which is black and white) to the grid board, and see each square as a graph vertex. Assuming there is an edge between two vertices if and only if the two squares they representing is adjacent in row or column.

The graph constructed above is a BPG, since it can be drawn down as a planar figure, and also the black and white vertices are the two partitions.

Thus if we put a tile on the board, it mean we choose a pair of black and white vertices, we make a **match**.

The amount of perfect coverage automatically transforms into the amount of perfect match of a BPG.

### Permanent

If the two partitons ($V_1,V_2$) of a bipartite graph $G$ have equal vertices count ($|V_1|=|V_2|=\nu$), then we can write down a Bipartite Adjacency Matrix as:
$$\boldsymbol{BiA}=\left(a_{i,j}\right)_{\nu\times\nu},a_{i,j}=\left\lbrace \begin{aligned}1&,~\text{if}~v_i~\text{in}~V_1~\text{is adjacent to}~v_j~\text{in}~V2;\\0&,~\text{Otherwise}\end{aligned}\right.$$

We know that a determinat of a square matrix $\boldsymbol A=(a_{i,j})_{n\times n}$ is given by:

$$\text{det}(\boldsymbol A)=\sum\limits_{\sigma\in S_n}\prod\limits_{i=1}^n\text{sgn} (\sigma) a_{i,\sigma(i)}$$

where $S_{n}$ represents the full permutation of $\lbrace 1,2,\cdots,n\rbrace$ .

However, if we remove the term of signature, we will get:

$$\text{perm}(\boldsymbol A)=\sum\limits_{\sigma\in S_n}\prod\limits_{i=1}^n a_{i,\sigma(i)}$$

This is the so-called **Permanent**. For a Bipartite Adjacency Matrix $\boldsymbol{BiA}$, the perfect match number is equal to its permanet $perm(\boldsymbol{BiA})$.

This is trivial in fact since the permanent just tries each case of the permutation brute-forcely, with a temporal complexity $\mathcal O(n!)$

We can compute determinat with **Gaussian Elimination** in $\mathcal O(n^3)$, but it is hard to find an efficient algorithm for calculating permanent.

### Pfaffian

Now we abandon the bipartite adjacency matrix and return to the normal adjacency matrix $\boldsymbol A$. The perfect match amount for a $n,n$-bipartite graph is given by:

$$\text{PerfectMatch}(\boldsymbol A)=\frac{1}{2^nn!}\sum\limits_{\sigma\in S_{2n}}\prod\limits_{i=1}^na_{\sigma(2i-1),\sigma(2i)}$$

However, since it is bipartite, we can reorder the vertices of $V=V_1\cup V_2$ such that the $1$-th till $n$-th vertices belong to $V_1$ and $n+1$-th till $2n$-th vertices belong to $V_2$. Under the new order, the adjacency martix takes the form of:

$$\left\lbrack\begin{matrix}\boldsymbol O&\boldsymbol{BiA}\\ \boldsymbol{BiA}^T&O\end{matrix}\right\rbrack$$

The bipartite adjacency matrix returns again. Clearly we have $\text{perm}(\boldsymbol A)=\text{perm}(\boldsymbol{BiA})^2$ (for any two additive terms $\prod\limits_{i=1}^na_{i,\sigma_1(i)}$ and $\prod\limits_{i=1}^na_{i,\sigma_2(i)}$ in $\text{perm}(\boldsymbol{BiA})$, there exists additive terms $\left(\prod\limits_{i=1}^na_{i,\sigma_s(i)}\right)^2$ for $s\in\lbrace 1,2\rbrace$ and two $\left(\prod\limits_{i=1}^na_{i,\sigma_1(i)}\cdot\prod\limits_{i=1}^na_{i,\sigma_2(i)}\right)$ in $\text{perm}(\boldsymbol A)$).

Here we introduce the **Pfaffian**.

Consider an even-dimensional antisymmetric matrix $\boldsymbol A=(a_{i,j})_{2n\times 2n}$ ($\boldsymbol A+\boldsymbol A^T=\boldsymbol O$), the pfaffian of A is given by:

$$\text{pf}(\boldsymbol A)=\frac{1}{2^nn!}\sum\limits_{\sigma\in S_{2n}}\text{sgn}(\sigma)\prod\limits_{i=1}^na_{\sigma(2i-1),\sigma(2i)}$$

This looks a bit familiar, it differs from perfect match amount only by a signature factor on each additive term.

We can prove that $\text{pf}^2(\boldsymbol A)=\text{det}(\boldsymbol A)$:

#### Prove

At first, we prove that for an even-dimentional complex invertible antisymmetric matrix $\boldsymbol A_{2n\times 2n}$, there exist an invertible matrix $\boldsymbol P$ such that:

$$\boldsymbol A=\boldsymbol P^T\boldsymbol J\boldsymbol P$$
where $\boldsymbol J_{2n\times 2n}$ is given by:
$$\boldsymbol J=\text{diag}\left\lbrack\underbrace{\left(\begin{matrix}0&1\\ -1&0\end{matrix}\right),\left(\begin{matrix}0&1\\ -1&0\end{matrix}\right),\cdots,\left(\begin{matrix}0&1\\ -1&0\end{matrix}\right)}_{n}\right\rbrack$$
and for non-even or singular-even $A_{d\times d}$ case, there also exists an invertible matrix $\boldsymbol P$ such that:
$$\boldsymbol A=\boldsymbol P^T\tilde{\boldsymbol J}\boldsymbol P$$
where $\tilde{\boldsymbol J}$ takes the form of:
$$\tilde{\boldsymbol J}=\left\lbrack\begin{matrix}\boldsymbol J_{2r\times 2r}&\boldsymbol O_{2r\times(d-2r)}\\ \boldsymbol O_{(d-2r)\times2r}&\boldsymbol O_{(d-2r)\times(d-2r)}\end{matrix}\right\rbrack$$
To prove this, assuming $\boldsymbol A_{d\times d}$ have the following form:

$$\boldsymbol A_{d\times d}=\left\lbrack\begin{matrix}a_{1,1}&a_{1,2}&a_{1,3}&\cdots&a_{1,d}\\ a_{2,1}&a_{2,2}&a_{2,3}&\cdots&a_{2,d}\\ a_{3,1}&a_{3,2}&\ddots&\cdots&\cdots\\ \vdots&\vdots&\vdots&\ddots& \\ a_{d,1}&a_{d,2}&\vdots&&\ddots \end{matrix}\right\rbrack=\left\lbrack\begin{matrix}\boldsymbol U_{2\times 2}&\boldsymbol W\\ \boldsymbol -W^T&\boldsymbol V_{(d-2)\times (d-2)}\end{matrix}\right\rbrack$$

Let $\boldsymbol Q$ be an elementary operation of row (of course invertible), thus $\boldsymbol Q^T$ will be a corresponding column operation. Simultanous apply $\boldsymbol Q$ and $\boldsymbol Q^T$ to an antisymmetric matrix would not break the property of antisymmetry.

Since the rank of an antisymmetric matrix would not be $1$, we could alway reorder the indices (the reorder operation can also be treated with form $\boldsymbol Q^T\boldsymbol A\boldsymbol Q$ where $\boldsymbol Q$ is invertible) such that $\text{rank}(\boldsymbol U)=2$ until $\boldsymbol A=\boldsymbol O$.

Because $\text{rank}(\boldsymbol A)\geq\text{rank}(\boldsymbol V)$, so we can apply series of paired elementary operations such that :
$$(\boldsymbol Q\cdots)^T\boldsymbol A\boldsymbol (\boldsymbol Q\cdots)=\left\lbrack\begin{matrix}\boldsymbol U'_{2\times 2}&\boldsymbol O_{2\times (d-2)}\\ \boldsymbol O_{(d-2)\times 2}&\boldsymbol V'_{(d-2)\times (d-2)}\end{matrix}\right\rbrack$$

and then scale $\boldsymbol U'$ to $\left(\begin{matrix}0&1\\ -1&0\end{matrix}\right)$:

$$(\boldsymbol Q\cdots)^T\boldsymbol A\boldsymbol (\boldsymbol Q\cdots)=\left\lbrack\begin{matrix}0&1&0&\cdots&0\\ -1&0&0&\cdots&0\\ 0&0&\ddots&\cdots&\cdots\\ \vdots&\vdots&\vdots&\ddots& \\ 0&0&\vdots&&\ddots \end{matrix}\right\rbrack$$

With this result, the original statement is proved recursively.

Now we can write down that 
$$\text{det}(\boldsymbol A)=\text{det}(\boldsymbol P^T\boldsymbol J\boldsymbol P)=\text{det}^2(\boldsymbol P)\text{det}(\boldsymbol J)=\text{det}^2(\boldsymbol P)$$

While term $a_{i,j}$ can be written as:

$$\begin{aligned}a_{i,j}&=\sum\limits_{k=1}^{2n}\sum\limits_{l=1}^{2n}(p^T)_{i,k}j_{k,l}p_{l,j}=\sum\limits_{k=1}^{2n}\sum\limits_{l=1}^{2n}p_{k,i}j_{k,l}p_{l,j}\\ &=\sum\limits_{k=1}^n\left(p_{2k-1,i}p_{2k,j}-p_{2k,i}p_{2k-1,j}\right)\end{aligned}$$

Consider the property of one single additive term with form $p_{2k-1,i}p_{2k,j}-p_{2k,i}p_{2k-1,j}$ inside the pfaffian summation definition, then each additive term with form $p_{2k-1,i}p_{2k,j}-p_{2k,i}p_{2k-1,j}$ especially for a fixed $k$ inside the product will take the form like (here we detect what will happen when two factors in the product have the same k):

$$\begin{aligned}\sum\limits_{\sigma\in S_{2n}}&\text{sgn}(\sigma)\left(p_{2k-1,i_1}p_{2k,i_2}-p_{2k-1,i_2}p_{2k,i_1}\right)\left(p_{2k-1,i_3}p_{2k,i_4}-p_{2k-1,i_4}p_{2k,i_3}\right)\\ &\left(p_{2k_3-1,i_5}p_{2k_3,i_6}-p_{2k_3-1,i_6}p_{2k_3,i_5}\right)\times\cdots\times\left(p_{2k_n-1,i_{2n-1}}p_{2k_n,i_{2n}}-p_{2k_n-1,i_{2n}}p_{2k_n,i_{2n-1}}\right)\\ =0\end{aligned}$$

(here we abbreviate $\sigma(t)$ as $i_t$)

The zero outcome is derived by noting that if we swap $i_1$ and $i_3$ or $i_2$ and $i_4$, which then causing the signature to flip one times, will generate opposite component and elinimate each others.

So all the $k$ inside each factor shall be different in order to avoid vanishing inside the summation. It follows that:

$$\begin{aligned}\text{pf}(\boldsymbol A)&=\frac{1}{2^nn!}\sum\limits_{\sigma\in S_{2n}}\text{sgn}(\sigma)\prod\limits_{s=1}^n\left(p_{2s-1,i_{2s-1}}p_{2s,i_{2s}}-p_{2s-1,i_{2s}}p_{2s,i_{2s-1}}\right)\\ &=\sum\limits_{1\leq i_1,i_2,\cdots,i_{2n}\leq 2n}\varepsilon_{i_1i_2\cdots i_{2n}}\prod\limits_{j=1}^{2n}p_{j,i_j}\\ &=\text{det}(\boldsymbol P)\end{aligned}$$

Thus we prove that $\text{pf}^2(\boldsymbol A)=\text{det}(\boldsymbol A)$.

### Fisher-Kasteleyn-Temperley Algorithm

#### Pfaffian Orientation

Since the pfaffian differs from perfect match amount only by a signature factor, we now give each edge of the BPG a direction, and change the adjacency matrix into directional adjacency matrix $\boldsymbol A^*=(a_{i,j})_{2n\times 2n}$ with rules:
+ $a^*_{i,j}=-1$ when there exists edge $v_i\to v_j$ ;
+ $a^*_{i,j}=1$ when there exists edge $v_j\to v_i$ ;
+ $a^*_{i,j}=0$ when there is no edge relating $v_i$ with $v_j$.

If we can find an orientation for a BPG such that the signature introduced by orientation of each additive term happens to be all-same or all-opposite with $\text{sgn}(\sigma)$, thus we can calculate 
$$\sqrt{\text{det}(\boldsymbol A^*)}=|\text{pf}(\boldsymbol A^*)|=\text{PerfectMatch}(\boldsymbol A)$$ 
with temporal complexity of $\mathcal O (n^3)$.

An additive term $\text{sgn}(\sigma)\prod\limits_{i=1}^na_{\sigma(2i-1),\sigma(2i)}$ is non-zero if and only if 
$$(\sigma(1),\sigma(2)),(\sigma(3),\sigma(4)),\cdots,(\sigma(2n-1),\sigma(2n))$$
is a perfect match.

Consider an orientation strategy as:
+ Since there is no odd cycle, when we traverse any cycle clockwise, we can orient edges on the cycle with odd amount of edges in the same direction and odd amount of edges in the opposite direction (We call this state a double-odd state);
+ We can first choose a cycle and orient each edge of it till reaching double-odd state, and then choose another cycle share edges with it (still requires double-odd). Untill all cycles have been oriented.
+ The double-odd state is extensive, since, when you conjunct two cycle into a larger one, the edges of same and opposite direction are vanishing in pairs, so all the cycles can reach double-odd together.
+ Edges do not belong to any cycle can be treated arbitrarily since their matching is fixed (from the leave vertex one by one).

This orientation is **Pfaffian Orientation** which keeps the signature of all additive terms in the pfaffian summation all-same.

Now we try to prove this signature-keeping property:

If we just change the order of one pair of the perfect match permutation like $(\sigma_i,\sigma_{i+1})\to (\sigma_{i+1},\sigma_{i})$ , this will cause the signature a first flip for the permutation signature, and a second flip for the antisymmetry of the directional adjacency matrix, and therefore remains unchanged.

In fact, there are only two type of matching states on an even cycle (imagine a coloring method of alternately applying two color to the edges of an even cycle).

We can simply denote the two perfect matches as:

$$(1,2),(3,4),\cdots,(2n-1,2n)$$

and

$$(2,3),(4,5),\cdots,(2n-2,2n-1),(2n,1)$$

For both states of these two perfect matches, a half of the edges are chosen, and because of the double-odd property, their directional signature is opposite (for there must be one of them have even amount of oppsite edges and another one has odd amount), while their permutation signature is opposite too (put $1$ from head to the tail will cause $2n-1$ reverse pairs). Thus, their final signature keep same.

For two different perfect matches $\sigma$ and $\sigma'$, assuming an alternated matching pair $(x_0,y_0)$ in $\sigma$ and is changed to $(x_0,y_1)$ in $\sigma'$, since the $\sigma$ is a perfect match, there must exist $(x_1,y_1)$ in $\sigma$ but it is alternated into $(x_1,y_2)$ in $\sigma'$. And through such a locating method, we will finally meet $y_0$ again, which consist a complete even cycle in $G$. When $\sigma$ is alternated into $\sigma'$, each edge on this cycle alternate its state precisely once, and there is no other matches which related to the vertices of this cycle changed, since that will cause a bad match. In short, the difference of two different perfect matches differs only from a series of non-intersecting cycles, and the differece is a kind of one-by-one alternation, which does not change the signature.


#### FKT Procedure

The Fisher-Kasteleyn-Temperley Algorithm procedure is given by:
1. Compute a planar embedding of $G$;
2. Compute a spanning tree $T_1$ of $G$;
3. Given an arbitrary orientation to each edge of $T_1$ (also to the corresponding edge in $G$);
4. Create another undirected graph $T_2$ whose vertex set is same as the dual graph (face-to-vertex) of $G$ and initial edge set is empty;
5. Add an edge to $T_2$ if two faces of $T_2$ share an edge in $G$ which is not in $T_1$ (now $T_2$ is a tree, otherwise a cycle of $T_2$ will enclose an isolated area of $G$ which is not connected to $T_1$);
6. For each leaf v in $T_2$:
   + let $e$ be the lone edge of $G$ in the face $v$ which is yet undirected;
   + Give $e$ an orientation to ensure double-odd property of face $v$ (which is an even cycle);
   + Remove $v$ from $T_2$;
7. Return the value of the arithmetic square root of the determinant of the directional adjacency matrix.

### Return to Domino Tiling

We can now using **FKT-Algorithm** compute the domino tiling problem efficiently with temporal complexity of $\mathcal O\left((mn)^3\right)$, here is a simple pfaffian orientation of the tiling graph:

![Directing](/images/Directional.svg)

But this is not enough for getting a close-form solution.

We can first make an approximation of the $f(m,n)$. Since $f(2,n)$ relates with Fibonacci Series, we can easily derive that:
$$f(m,n)\geq \left(\sqrt{\frac{\sqrt{5}+1}{2}}\right)^{mn}\approx 1.272^{mn}$$
Also, let us try to encode a perfect coverage pattern through:
+ Traverse each grid following the row first column second order
+ If the tile corresponding to the gird has already been encode, ignore it
+ If the tile is horizontal then encode 0, and vertical one for 1

Clearly a legal encoding correspond to only one perfect coverage, while encoding dimension is $\frac{mn}{2}$, so:

$$f(m,n)\leq \left(\sqrt{2}\right)^{mn}\approx 1.414^{mn}$$

Let $\boldsymbol B$ be the bipartite adjacency matrix of graph $G$, we define $\tilde{\boldsymbol B}$ as replace any $+1$ in $\boldsymbol B$ which is related to a vertical edge in $G$ with $+i$, and adjacency matrix $\boldsymbol A,\tilde{\boldsymbol A}$ is gained through (here we reorder the vertices of $G$ so that two partitions are separatedly indexed.):

$$\boldsymbol A=\left\lbrack\begin{matrix}\boldsymbol O&\boldsymbol B\\ \boldsymbol B^T&\boldsymbol O\end{matrix}\right\rbrack,\tilde{\boldsymbol A}=\left\lbrack\begin{matrix}\boldsymbol O&\tilde{\boldsymbol B}\\ \tilde{\boldsymbol B}^T&\boldsymbol O\end{matrix}\right\rbrack$$

Assuming we have a $3\times 2$ grid board and its graph $G$. Here is an example for $\tilde{\boldsymbol B}$ (the left part shows how we index the vertices):
$$\left|\begin{matrix}1&4\\ 5&2\\ 3&6\end{matrix}\right|,\tilde{\boldsymbol B}=\left\lbrack\begin{matrix}1&i&0\\ i&1&i\\ 0&i&1\end{matrix}\right\rbrack$$
First we need to show that $\text{det}(\tilde{\boldsymbol B})=\pm f(m,n)$. Here we also need to prove that the signature of every additive term of the determinant summation keeps all same. Label the vertices of two partitions separately from $0$ to $\frac{mn}2$ , so that every perfect match now corresponds to a permutation of $\lbrace 1,\cdots,\frac{mn}{2}\rbrace$ without redundant (form a permanent on the $\boldsymbol B$ instead of a pfaffian on $\boldsymbol A$). $+1$ represents a horizontal edge in $\boldsymbol B$ and $+i$ for a vertical one. The signature of an additive term equals $\text{sgn}(\sigma)\omega(\sigma)$ , where $\omega(\sigma)=\prod\limits_{j=1}^{\frac{mn}{2}}b_{j,\sigma_j}$.

We need to show for any different permutations (also perfect match) $\sigma_1,\sigma_2$ , it holds that:

$$\text{sgn}(\sigma_1)\omega(\sigma_1)=\text{sgn}(\sigma_2)\omega(\sigma_2)$$

Define $\sigma_1+\sigma_2$ as the multigraph gained by combining the edges of $\sigma_1$ and the edges of $\sigma_2$ (which may cause double edges,namely the 2-cycles). Despite the double edges, the rest of $\sigma_1+\sigma_2$ shall split into many non-intersecting even cycles with length $4$ or more (the prove is given previously at the pfaffian orientation). If we get $r$ cycles (including the double edges) here, we can flip the states of all those $r$ even cycles rightly by once (the double edge remains unchanged) to convert $\sigma_1$ into $\sigma_2$. Assuming the length of these cycles are $2l_1,2l_1,\cdots,2l_r$ satisfying $2l_1+2l_2+\cdots+2l_r=mn$. The transforming procedure can be described using cyclic permutation, that is to say, $\sigma_2$ is gained from $\sigma_1$ times a $l_1$-cyclic permutation, a $l_2$-cyclic permutation ..., a $l_r$-cyclic permutation which implies:

$$\text{sgn}(\sigma_2)=(-1)^{(l_1+1)+(l_2+1)+\cdots+(l_r+1)}\text{sgn}(\sigma_1)=(-1)^{\frac{mn}2+r}\text{sgn}(\sigma_1)$$

Note that we are working on a gird board, so the cycles are in fact taking the form like the components in Tetris. For a cycle $C$, we can give it an arbitrary orientation (clockwise or counter-clockwise?) and get an oriented close path $\Gamma(C)$. Define $d(\Gamma(C))$ as the amount of vertical edges directing from a black to a white vertex minus the amount of vertical edges directing from a white to a black vertex. Then $\frac{\omega(\sigma_1)}{\omega(\sigma_2)}$ is in fact cumulated on each cycle:
$$\frac{\omega(\sigma_1)}{\omega(\sigma_2)}=\prod\limits_{j=1}^rd(\Gamma({C_j}))$$
Also $d(\Gamma(C))=\sum\limits_{j=1}^s\Gamma(c_j)$ where $c_1,c_2,\cdots,c_s$ are the $s$ squares on the grid board which consist $C$ (imagine that the flows on their common edges diminish each other). If we set $\Gamma$ as counter-clockwise, and set the color of a square $c$ same as the color of the vertex at its top-left. Then for a black square $c_1$ and a white square $c_2$ we have $d(\Gamma(c_1))=2,d(\Gamma(c_2))=-2$.
However, we have $(i)^{2}=(i)^{-2}=-1$ , so in fact 
$$\frac{\omega(\sigma_1)}{\omega(\sigma_2)}=\prod\limits_{j=1}^r(-1)^{A(C_j)}=(-1)^{\sum\limits_{j=1}^rA(C_j)}$$
where $A(C)$ is the area of $C$ (set the area of a regular square as $1$).
We have Pick's Theorem which states that $A(C)=I(C)+\frac12B(C)-1$ on gird board, where $I(C)$ is the amount of interior points of $C$ and $B(C)$ is the amount of points on the boundary of $C$. Here $I(C)$ must be even or otherwise the interior part cut down by $C$ could not have a perfect match. Meanwhile, $\frac12B(C)$ is in fact $l$, so
$$A(C)\equiv l(C)-1~(\text{mod} ~2),\frac{\omega(\sigma_1)}{\omega(\sigma_2)}=(-1)^{\sum\limits_{j=1}^rl_j-1}=(-1)^{\frac{mn}2-r}$$

At last, we have 
$$\frac{\text{sgn}(\sigma_2)\omega(\sigma_2)}{\text{sgn}(\sigma_1)\omega(\sigma_1)}=(-1)^{\frac{mn}2+r+\frac{mn}2+-r}=(-1)^{mn}=1$$
That is to say
$$|\text{det}(\boldsymbol B)|= \text{perm}(\boldsymbol B)=\text{PerfectMatch}(G)=f(m,n)$$

Let $V$ be the space of functions $f:\mathbb Z^2\to\mathbb C$ such that 
$$f(x,-y)=f(-x,y)=-f(x,y)$$
and
$$f(x+2(m+1),y)=f(x,y+2(n+1))=f(x,y)$$
for all $x,y\in\mathbb Z$. Note that for such a function $f$, $f(x,y)$ vanishies if either $x$ is a multiple of $m+1$ or y is a multiple of $n+1$. Let $L:V\to V$ be the modified local summation operator 
$$(Lf)(x,y)=f(x-1,y)+f(x+1,y)+if(x,y-1)+if(x,y+1)$$
$V$ is isomorphic to $\mathbb C^{mn}$ (restrict $f:\mathbb Z^2\to\mathbb C$ to $\lbrace 1,\cdots,m\rbrace\times\lbrace 1,\cdots,n\rbrace$), and the $mn\times mn$ matrix that intertwines the action of $L$ under this automorphism is $\tilde{\boldsymbol A}$. Hence $\text{det}\tilde{\boldsymbol A}$ is the product of the eigenvalues of $L$. 
While the basis for V is given by the function:
$$f_{j,k}(x,y)=\sin\frac{\pi j x}{m+1}\sin\frac{\pi k y}{n+1},(1\leq j\leq m,1\leq k\leq n)$$
It is easy to check that these are eigenfunctions of $L$:
$$\begin{aligned}(Lf_{j,k})(x,y)&=\left(\sin\frac{\pi j(x-1)}{m+1}+\sin\frac{\pi j(x+1)}{m+1}\right)\sin\frac{\pi k y}{n+1}\\ &+i\sin\frac{\pi jx}{m+1}\left(\sin\frac{\pi k(y-1)}{n+1}+\sin\frac{\pi k(y+1)}{n+1}\right)\\ &=2\left(\cos\frac{\pi j}{m+1}+i\cos\frac{\pi k}{n+1}\right)f_{j,k}(x,y)\end{aligned}$$
So
$$\text{det}(\tilde{\boldsymbol A})=\prod\limits_{j=1}^m\prod\limits_{k=1}^n\left(2\cos\frac{\pi j}{m+1}+2i\cos\frac{\pi k}{n+1}\right)$$
Assuming $n$ is even while $m$ is arbitrary, we have:
$$\text{det}(\tilde{\boldsymbol A})=\prod\limits_{j=1}^m\prod\limits_{k=1}^{\frac{n}2}\left(4\cos^2\frac{\pi j}{m+1}+4\cos^2\frac{\pi k}{n+1}\right)$$
Since the $j$ and $m+1-j$ factors are equal, while we want to get $f(m,n)=\sqrt{\text{det}(\tilde{\boldsymbol A})}$
$$f(m,n)=\prod\limits_{j=1}^{\lceil\frac{m}{2}\rceil}\prod\limits_{k=1}^{\frac{n}2}\left(4\cos^2\frac{\pi j}{m+1}+4\cos^2\frac{\pi k}{n+1}\right)$$
The above holds since it can be examined that for odd $m=2t+1$ and $n=2s$
$$\prod\limits_{k=1}^{s}\left(4\cos^2\frac{\pi \lceil\frac{m}2\rceil}{m+1}+4\cos^2\frac{\pi k}{n+1}\right)=4^s\prod\limits_{k=1}^{s}\left(\cos^2\frac{\pi k}{2s+1}\right)=1$$
where
$$\prod\limits_{k=1}^{s}(\cos\frac{\pi k}{2s+1})=\dfrac{\prod\limits_{k=1}^{s}(\sin\frac{\pi k}{2s+1}\cos\frac{\pi k}{2s+1})}{\prod\limits_{k=1}^{s}(\sin\frac{\pi k}{2s+1})}=\frac{1}{2^s}\dfrac{\prod\limits_{k=1}^{s}(\sin\frac{2\pi k}{2s+1})}{\prod\limits_{k=1}^{s}(\sin\frac{\pi k}{2s+1})}=\frac{1}{2^s}$$
In fact, the following extended equation still holds when $2\nmid mn$ for it gives the zero result
$$f(m,n)=\prod\limits_{j=1}^{\lceil\frac{m}{2}\rceil}\prod\limits_{k=1}^{\lceil\frac{n}2\rceil}\left(4\cos^2\frac{\pi j}{m+1}+4\cos^2\frac{\pi k}{n+1}\right)$$

We can analysis $f(n,n)$ when $n$ is even through:

$$\frac{1}{n^2}\log f(n,n)~\to~\frac12\int_0^1\int_0^1\log(2\cos\pi s+2i\cos\pi t)ds dt$$

Where the integrate evaluates to $\frac{G}{\pi}$ , where $G$ is Catalan's constant equals $\sum\limits_{n=1}^{+\infty}\frac{(-1)^n}{(2n-1)^2}$. And the $f(n,n)$ approximation is:
$$f(n,n)=\left(e^{\frac{G}{\pi}}\right)^{n^2}\approx 1.3385^{n^2}$$
### References

[Wikipedia FKT-Algorithm](https://en.wikipedia.org/wiki/FKT_algorithm)

[Dimers and Dominoes](https://arxiv.org/abs/1405.2615)

[Notes on antisymmetric matrices and the pfaffian](http://eik.bme.hu/~palyi/topins2-2016spring/pfaffian.pdf)
