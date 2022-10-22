# FACADE: Fake Articles Classification and Decision Explanation

* [Demo Video](https://drive.google.com/file/d/1kMobWPQkyZfEHMAYBx_GN-HpTO7nlBB4/view?usp=sharing)
* [Live Webapp]() 

## System description

The **FACADE** system is designed with a cascading architecture (shown in the figure below) composed of two classification pipelines.
For each document to analyse, the detection process starts with a first classifier which exploits basic linguistic features (*low-level descriptors*) previously extracted from several fake news datasets.
The second pipeline makes use also of more complex features (*high-level descriptors*), such as sentiment, emotion, and attribution to known real or fake sources, computed by additional algorithms.
We further present an *explainable user interface* designed in a *Harry Potter style*, which can help end users understand what parts of the investigated article are likely to be fake and for what reasons through the implementation of feature importance and post-hoc methods.

![Logic architecture of Facade](figs/logic_architecture.png)

## Datasets used for features extraction

* [Fake News Corpus](https://github.com/several27/FakeNewsCorpus)
* [ISOT Fake News Dataset](https://www.uvic.ca/ecs/ece/isot/datasets/fake-news/index.php)
* [Fake News Dataset](https://www.kaggle.com/datasets/jruvika/fake-news-detection)
* [Multi-Perspective Question Answering Dataset (MPQA)](https://mpqa.cs.pitt.edu/corpora/mpqa_corpus/)
* [Myers-Briggs Personality Type Dataset (MBTI)](https://www.kaggle.com/datasets/datasnaek/mbti-type)

## Run FACADE locally

Below, we explain the easy steps to run **FACADE**, which is actually in a **non-prodution** state, on your machine:

The system has been tested with **Python 3.8.3** and **3.8.10**.

To execute the detection modules, you need to download the trained models files form this [link](https://drive.google.com/drive/folders/1LJwY2o18VMeP0sMJrJdXsi3UqUHpra4f?usp=sharing) and extract them (with the same structure) into a new folder called `pickle_files`.

Install the required libraries
```
$ pip install -r requirements.txt
```

The main file `facade_demo_nb.ipynb`, containing all the procedures for running the system, can be executed cell by cell or directly via CLI with the following command:
```
$ jupyter nbconvert --to notebook --execute facade_demo_nb.ipynb
```

Once all the variables have been loaded (it may take long time the first time), the core module runs as a [Flask](https://flask.palletsprojects.com/en/2.2.x/) application.
If everything went well, the application starts listening on `localhost:5000`:
```
* Serving Flask app '__main__' (lazy loading)
* Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
* Debug mode: on

* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

### Access the webapp and enjoy our **FACADE** system!

---

## Contributors

* **Erasmo Purificato** (erasmo.purificato@ovgu.de)
* **Saijal Shahania** (saijal.shahania@ovgu.de)
* **Marcus Thiel** (marcus.thiel@ovgu.de)