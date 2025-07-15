---
layout: ../../layouts/MarkdownPostLayout.astro
title : 'Binomial Theorem Pictorial Proof'
author: 'Neel Chakraborty'
pubDate : 2024-09-05
tags : ["Combinatorial-Proofs","Combinatorics","Math"]
---
Hello everyone,hope you're doing well. Today, I will post a pictorial representation of the Binomial Theorem. It is said that ancient Hindu Mathematicians approached the problem in this manner. 

We start things off simply, just taking two numbers \\(a\\) and \\(b\\) and drawing two arrows from each of them. Each arrow moving towards the left, is equivalent to multiplication by \\(a\\) and each arrow moving to the right, is equivalent to multiplication by \\(b\\). Whenever two left hand arrow and right hand arrow converge to the same position, we put down the sum of the terms coming from the left hand arrow and right hand arrow.

After a few iterations, the structure looks like the picture below

![Binomial Theorem](https://i.imgur.com/wGaBtSE.jpeg "Binomial Theorem")
Since each successive row of the diagram is continuation of the previous row by \\((a+b)\\), we have the result that each row of this diagram is the expansion of \\((a+b)^n\\) where \\(n\\) is a positive integer.

And that friends, is the pictorial representation of the binomial theorem.  
