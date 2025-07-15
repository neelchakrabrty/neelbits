---
layout: ../../layouts/MarkdownPostLayout.astro
author: 'Neel Chakraborty'
title : 'Two Combinatorial proofs'
pubDate: 2024-09-05
tags : ["Combinatorial-Proofs","Combinatorics","Math"]
---


I love combinatorics, and one of my favorite aspects is story-based proofs, or more commonly known as combinatorial proofs. These proofs use common-sense arguments to develop results with almost no algebraic machinery. They provide great intuition behind why some combinatorial identities are true.

We start with the following identity:

$$
\binom{n}{r} = \binom{n-1}{r-1} + \binom{n-1}{r}
$$

We proceed with the proof as follows:

On the right-hand side, we have \\(\binom{n}{r}\\), which counts the number of ways to form an \\(r\\)-person group from \\(n\\) available people.

On the left-hand side, we have two terms. Let's deal with the first term first.

Assume we have a person named **Jack** from the pool of \\(n\\) people, whom we really want in our \\(r\\)-person group. The number of ways to pick **Jack** is 1, and the number of ways to pick \\(r-1\\) people from the remaining \\(n-1\\) people is \\(\binom{n-1}{r-1}\\). Therefore, the number of ways to have **Jack** in our \\(r\\)-person group is:

$$
1 \cdot \binom{n-1}{r-1} = \binom{n-1}{r-1}
$$

Now, assume we want to create an \\(r\\)-person group but not include **Jack** in it. Therefore, we have 1 fewer person from the pool of \\(n\\) people to choose from. Thus, the number of ways to create an \\(r\\)-person group without **Jack** is \\(\binom{n-1}{r}\\).

Therefore, the total number of ways to choose an \\(r\\)-person group is the number of ways to pick a group with **Jack** plus the number of ways to pick a group without **Jack**:

$$
\binom{n}{r} = \binom{n-1}{r-1} + \binom{n-1}{r}
$$

This identity is known as **Pascal's Identity**. It can also be verified by listing out a few rows of Pascal's triangle.

If you know of any other proofs of this identity, please let me know.

Next, we'll prove the following summation identity:

$$
\sum_{k \text{ odd}} \binom{n}{k} = \sum_{k \text{ even}} \binom{n}{k}
$$

The algebraic proof involves substituting \\(x = -1\\) in the binomial expansion of \\((1+x)^n\\), but that’s not very insightful.

We'll use a **pairing off** solution instead.

Of all the \\(n\\) people, suppose \\(p\\) is one of them.

Suppose a committee \\(c\\) includes the person \\(p\\). We pair off that committee with another committee \\(c-p\\), which is the committee \\(c\\) without person \\(p\\).

Similarly, if a committee \\(c\\) does not include the person \\(p\\), we pair this committee with another committee \\(c+p\\), which is the committee \\(c\\) with person \\(p\\).

Since this pairing off of committees differs by 1 member, we can guarantee that one of the committees is even while the other is odd.

Thus, we have paired off each odd committee with an even committee, proving the equality.

Here's the pairing off for a 4-person group:
Let our 4-person group be \\(\lbrace N, B, M, U \rbrace\\).

The subsets of this group \\(\lbrace N, B, M, U \rbrace\\) are as follows:

$$\lbrace \rbrace $$
$$\lbrace N \rbrace $$
$$\lbrace B \rbrace $$
$$\lbrace M \rbrace $$
$$\lbrace U \rbrace $$
$$\lbrace N, B \rbrace $$
$$\lbrace N, M \rbrace $$
$$\lbrace N, U \rbrace $$
$$\lbrace B, M \rbrace $$
$$\lbrace B, U \rbrace $$
$$\lbrace M, U \rbrace $$
$$\lbrace N, B, M \rbrace $$
$$\lbrace N, B, U \rbrace $$
$$\lbrace B, M, U \rbrace $$
$$\lbrace M, U, N \rbrace $$
$$\lbrace N, B, M, U \rbrace$$


Now suppose our person is \\(N\\). According to the rules, the following pairing off follows:

$$\lbrace N \rbrace \xrightarrow{\text{pairs off with}} \lbrace \rbrace $$
$$\lbrace B \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, B \rbrace $$
$$\lbrace M \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, M \rbrace $$
$$\lbrace U \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, U \rbrace $$
$$\lbrace B, M \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, B, M \rbrace $$
$$\lbrace B, U \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, B, U \rbrace $$
$$\lbrace M, U \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, M, U \rbrace $$
$$\lbrace B, M, U \rbrace \xrightarrow{\text{pairs off with}} \lbrace N, B, M, U \rbrace$$




That's all for this post. 