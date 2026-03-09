---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}


<span class='anchor' id='about-me'></span>


**Leonardo Ranaldi** is an NLP Researcher focused on the development, analysis, and interpretability of neural language models. His work sits at the intersection of **Computer Science** and **Linguistics**, contributing to the evolution of machine learning techniques through a deep understanding of how artificial neural networks process language.

Currently, he holds dual affiliations with the **University of Edinburgh** and the **University of Rome Tor Vergata**. 

### Research Focus
His research focuses on the "how" and "why" of modern AI, specifically addressing:
* **Interpretability & Explainability:** Analysing linguistic phenomena learned by neural networks to move beyond "black-box" models.
* **Model Refinement:** Enhancing the multilingual capabilities and robustness of contemporary language models.
* **Reasoning & Task Optimisation:** Developing methodologies for Question Answering (QA), Neural Machine Translation (NMT), and complex reasoning tasks.

### Academic Contributions
Leonardo has authored over **30+ publications** in the field of Natural Language Processing. His research trajectory spans from foundational linguistic analysis to the practical enhancement of model performance in multilingual settings.

* **Google Scholar:** [link](https://scholar.google.com/citations?user=u2FWGIIAAAAJ)
* **Scopus ID:** [link](https://www.scopus.com/authid/detail.uri?authorId=57217633494)


I am always on the lookout for excellent visiting/PhD students to work with me on LLM reasoning, safety, interpretability, etc. 
- Fully-funded positions for exceptional candidates through KCL scholarships. These funding allocations are for full fees and a living stipend (London weighted) for any nationality.
- PhD Opening: One [K-CSC](https://www.kcl.ac.uk/study-legacy/funding/kings-china-scholarship-council-phd-scholarship-programme-k-csc) (for Chinese nationals) is available. ~~Deadline: 1st January 2026~~.
- PhD Opening: One Position "GenAI for Early Detection of Treatment Resistance and Fair Access to Clozapine in Schizophrenia" through the EPSRC [DRIVE-Health](https://showcase.drive-health.org.uk/project/genai-for-early-detection-of-treatment-resistance-and-fair-access-to-clozapine-in-schizophrenia/) CDT is available. ~~Deadline: 12 January 2026~~.
-  PhD Opening for home-fee student: One Position "From One-Size-Fits-All to Audience-Aware: Personalized Explainable AI for Decision-Making
" through the [STaR-AI CDT](https://www.findaphd.com/phds/project/from-one-size-fits-all-to-audience-aware-personalized-explainable-ai-for-decision-making/?p193523) is available. Deadline: 2 March 2026.
- [Joint PhD Scholarships 2026/27](https://www.kcl.ac.uk/study-legacy/funding/joint-phd-scholarship). Partner Universities: The University of Hong Kong/Humboldt University, Berlin/The National University of Singapore/The University of Sao Paulo. Deadline: 5 February 2026
- [Alternative fundings](https://www.kcl.ac.uk/study/postgraduate-research/funding/scholarships-and-studentships).


# Professional Service
  - Organiser
    - MathNLP
    - SemEval 2026 Task 11
  - Senior Area Chair:
    - EMNLP 25
    - EACL 26
  - Area Chair:
    - ACL,
    - EMNLP
    - EACL
    - NAACL
  - Reviewers:
    - NLP: AACL, NAACL, EACL, EMNLP, ACL, COLM
    - AI/ML: UAI, AISTATS, NEURIPS, ICLR, ICML, AAAI
    - Journal:
        - NeuroComputing
        - Transactions on Machine Learning Research
        - Transactions on Big Data
        - Transactions on Artificial Intelligence





<!-- JavaScript for Filtering -->
<script>
function filterPubs(category) {
  var papers = document.getElementsByClassName('paper-box-text');
  if (category == 'all') category = '';
  
  // Loop through all publications
  for (var i = 0; i < papers.length; i++) {
    if (papers[i].className.indexOf(category) > -1) {
      papers[i].style.display = "block"; // Show if matches category
    } else {
      papers[i].style.display = "none";  // Hide if not
    }
  }
}
</script>

<!-- Basic Styling for Buttons and Papers -->
<style>
  .filter-btn {
    background-color: #ddd;
    border: none;
    padding: 8px 16px;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 5px;
  }

  .filter-btn:hover {
    background-color: #ccc;
  }

  .publication-list {
    margin-top: 20px;
  }

  .paper-box-text {
    margin-bottom: 5px;
    padding: 5px;
    border: 0px solid #ccc;
    border-radius: 0px;
    display: block;
}

</style>
