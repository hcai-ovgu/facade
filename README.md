# FACADE: Fake Articles Classification and Decision Explanation
The **FACADE** system is designed with a cascading architecture (shown in the figure below) composed of two classification pipelines.
For each document to analyse, the detection process starts with a first classifier which exploits basic linguistic features (*low-level descriptors*) previously extracted from several fake news datasets.
The second pipeline makes use also of more complex features (*high-level descriptors*), such as sentiment, emotion, and attribution to known real or fake sources, computed by additional algorithms.
We further present an *explainable user interface* designed in a *Harry Potter style*, which can help end users understand what parts of the investigated article are likely to be fake and for what reasons through the implementation of feature importance and post-hoc methods.

![Logic architecture of Facade](figs/logic_architecture.png)