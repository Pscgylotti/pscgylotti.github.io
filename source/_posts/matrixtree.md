---
title: Matrix-Tree Theorem
date: 2021-02-11 19:25:12
tags:
  - Mathematics
  - Graph Theory
mathjax: true
---

## Counting of Spanning Tree

### Kirchhoff Matrix

Select a labeling map $\mu:\lbrace 1,2,\cdots,\nu(G)\rbrace\to V(G)$ which is an one-to-one map mapping an index to a vertex in graph $G$, define the **Kirchhoff Matrix** of $G$ as:

$$K(G,\mu)=(a_{i,j})_{n\times n},a_{i,j}=\left\lbrace \begin{aligned}\text{deg}(\mu(i)),&i=j\\ -\text{cnt}(\mu(i),\mu(j)),&i\neq j\end{aligned}\right.$$
where $\text{cnt}(\mu(i),\mu(j))$ represent the amount of edges connecting vertex $m$ and $n$ (if $G$ is a simple graph, $cnt(m,n)\in\lbrace0,1\rbrace$).
We abbreviate $K(G,\mu)$ as $K(G)$ or $K$ if $G$ and $\mu$ is already clarified.

#### Property I

Since the sum of every row and column of $K(G)$ equals $0$, so $\text{det}(K(G))=0$ .

#### Property II

If $\omega(G)>1$, then the determinant of every principal sub-matrix of $K(G)$ with order $n-1$ equals $0$, where $\omega(G)$ denotes the amount of connected branches of $G$.

***Prove***:

Since $G$ can be divided into $\omega(G)$ connected branches, we can select a labling map $\mu$ such that
$$K(G)=\text{diag}\left(K_1,K_2,\cdots,K_{\omega(G)}\right)$$
where $K_i$ represents the Kirchhoff matrix of the $i$-th connected branch of $G$, whose determinant is of course zero.
We using $C_r(K)$ denoting the sub-matrix gained through removing the $r$-th row and $r$-th column of $K$.
Assuming the vertex $\mu(r)$ we removed is the $j$-th vertex of the $s$-th connected branch, we have:
$$\text{det}(C_r(K))=\text{det}(K_1)\text{det}(K_2)\cdots\text{det}(C_j(K_s))\cdots\text{det}(K_{\omega(G)})=0$$
This is obviously since $\omega(G)>1$ and there are at least $\omega(G)-1$ zero factors.

#### Property III

If $G$ is a tree, thus $\forall r\in\lbrace1,2,\cdots,n\rbrace,\text{det}\left(C_r\left(K(G)\right)\right)=1$ .

***Prove***:

Set the removed vertex $\mu(r)$ as a root, and sort the other vertices by the depth (the distance to root) from mint to max (the order between two vertice having same depth can be treated arbitrarily), we gain:
$$\mu(a_1),\mu(a_2),\cdots,\mu(a_{\nu-1})$$

Meanwhile, applying this sorted order to labeling map as $\mu'(i)=\mu(a_i)$, and gain:

$$K'(G\backslash\lbrace\mu(r)\rbrace,\mu')=(k'_{i,j})_{\nu-1\times\nu-1}$$

Assuming vertex $\mu'(s)$ has $m$ children, denoted as $\mu'(b_1),\mu'(b_2),\cdots,\mu'(b_m)$ , define an operation as adding $b_1$-th column,$b_2$-th column,...,$b_m$-th column to $b_s$-th column in $K'$. We perform this operation by the order of depth max to min (namely from the right of matrix to the left).

We say an $i$-th column is fine if and only if $k'_{i,i}=1$ and $\forall j\in\lbrace i+1,i+2,\cdots,\nu-1\rbrace,k'_{j,i}=0$. 

For a leaf vertex $\mu'(l)$, since it is in the maximum depth, and it just has its only parent as neighbours, so $k'_{l,l}=1$ and there is no non-zero entries below $k'_{l,l}$. $\mu'(l)$ is already fine.

Applying the proposed operation will cause $s$-column reaches fine if all its child is fine (the fine $b_i$-th column will have a $+1$ at $k'_{b_i,b_i}$ to diminish the $-1$ at $k'_{b_i,s}$, while decreaing $k'_{s,s}$ by $1$ through $b_{s,b_i}$)

So, recursively, after all the operation, every column reaches fine and the matrix transform into a upper-triangular matrix whose diagonal is all ones. Noting that the operation is elementary, so determinant is kept unchanges, which implies:

$$\text{det}\left(C_r\left(K(G)\right)\right)=\text{det}(K')=1$$

### Incidence Matrix:

Selecting both a labeling map $\mu:\lbrace1,2,\cdots,\nu(G)\rbrace$ for vertices and a labeling map $\mu:\lbrace1,2,\cdots,m(G)\rbrace$ for edges. The **incidence matrix** $B(G,\mu,\theta)=(b_{i,j})_{\nu(G)\times m(G)}$ of graph $G$ is defined by: If $\exists\theta(j)$ connects $\mu(p),\mu(q)$, then $\lbrace b_{p,j},b_{q,j}\rbrace=\lbrace -1,1\rbrace$ (which one is $1$ and which one is $-1$ is not important), the other entries are all $0$.
It can be easily seen that $K(G)=B(G)B(G)^T$ by the definition.

### Matrix-Tree Theorem
$$\forall i\in\lbrace 1,2,\cdots,\nu(G)\rbrace,\text{det}\left(C_i(K(G))\right)=\tau(G)$$
namely the determinant of an arbitrary $n-1$ order principal sub-matrix of $K(G)$ equals the amount of all spanning trees of $G$.

***Prove***:

Denoting $B_r$ as the matrix gained by getting rid of the $r$-th row of $B(G)$. Obviously $C_r(K)=B_rB_r^T$
With Cauchy-Binet Formula:
$$\begin{aligned}\text{det}(C_r(K))&=\text{det}(B_rB_r^T)\\ &=\left\lbrace\begin{aligned}0,&\nu(G)-1>m(G)\\ \sum\limits_{1\leq i_1<i_2<\cdots<i_{\nu-1}\leq m}\text{det}\left(B_r\left(\begin{matrix}1&2&\cdots&\nu-1\\ i_1&i_2&\cdots&i_{\nu}\end{matrix}\right)\right)^2,&\nu(G)-1\leq m(G)\end{aligned}\right.\end{aligned}$$
Let 
$$x=(x_1,x_2,x_3,\cdots,x_{\nu-1}),1\leq x_1<x_2<\cdots<x_{\nu-1}\leq m$$
and make a abbreviated notion:
$$B_r^x=B_r\left(\begin{matrix}1&2&\cdots&\nu-1\\ i_1&i_2&\cdots&i_{\nu}\end{matrix}\right)$$
We have:
$$\text{det}(B_r^x)^2=\text{det}(B_r^x)\text{det}((B_r^x)^T)=det(B_r^x(B_r^x)^T)$$
In fact $B_r^x(B_r^x)^T$ is a $\nu-1$ order principal sub-matrix of a $\nu$ order Kirchhoff matrix, we have $\text{det}\left(B_r^x(B_r^x)^T\right)=1$ if adding $\theta(x_1),\theta(x_2),\cdots,\theta(x_{\nu-1})$ to the empty graph of $V(G)$ is a tree, or else $\text{det}\left(B_r^x(B_r^x)^T\right)=0$ (since there are $\nu-1$ edges which is the minimal requirement for a completely connected graph).
So if we compute the $\text{det}(C_r(K))$, it will automatically traverse any possible sub graph of $G$ with $\nu-1$ edge and self-add $1$ if it find a tree. Thus
$$\text{det}\left(C_r(K(G))\right)=\tau(G)$$

### An Example

Define a **Wheel Graph** as $W_n=C_n\lor v_o$ where $v_o$ is a single vertex and $C_n$ is a $n$-cycle, please calculate the $\tau(W_n)$:

Set $\mu$ as mapping vertices on $C_n$ to $\lbrace 1,2,\cdots,n\rbrace$ and $v_o$ to $n+1$. We have the $K(W_n)$ as:

$$K(W_n)=\left(\begin{matrix}3&-1&0&\cdots&0&-1&-1\\ -1&3&-1&0&\cdots&0&-1\\ 0&-1&3&\ddots&\ddots&\vdots&\vdots\\ \vdots&0&\ddots&\ddots&\ddots&0&\vdots\\ 0&\vdots&\ddots&\ddots&3&-1&\vdots\\ -1&0&\cdots&0&-1&3&-1\\ -1&-1&\cdots&\cdots&\cdots&-1&n\end{matrix}\right)_{n+1\times n+1}$$

Get rid of the $n+1$-th row and column, we have:

$$\tau(W_n)=\left|\begin{matrix}3&-1&0&\cdots&0&-1\\ -1&3&-1&0&\cdots&0\\0&-1&3&\ddots&\ddots&\vdots\\ \vdots&0&\ddots&\ddots&\ddots&0\\ 0&\vdots&\ddots&\ddots&3&-1\\ -1&0&\cdots&0&-1&3\end{matrix}\right|_{n\times n}=\left(\dfrac{3+\sqrt{5}}{2}\right)^n+\left(\dfrac{3-\sqrt{5}}{2}\right)^n-2$$

The trick here is setting the target term as $S_n$, Let $P_n$ be
$$P_n=\left|\begin{matrix}3&-1&0&\cdots&0\\ -1&3&\ddots&\ddots&\vdots\\ 0&\ddots&\ddots&\ddots&0\\ \vdots&\ddots&\ddots&3&-1\\ 0&\cdots&0&-1&3\end{matrix}\right|_{n\times n}$$

Expand $S_n$ and $P_n$, we have:

$$S_n=2P_{n-1}-2P_{n-2}-2,P_n=3P_{n-1}-P_{n-2}$$ 
