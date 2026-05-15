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

# Leonardo Ranaldi

I am a Research Associate in Natural Language Processing at the School of Informatics, University of Edinburgh. 

My research lies at the intersection of Machine Learning and NLP, focusing on enhancing the reasoning, interpretability, and controllability of generative models. My long-term goal is to engineer transparent, controllable AI technologies that integrate with high-performance computing frameworks to drive applied research in high-stakes sectors such as science, finance, and healthcare.

Prior to my current appointments, I was a Postdoctoral Fellow at the Idiap Research Institute in Martigny, Switzerland, from 2023 to 2024. During this time, I designed advanced neuro-symbolic NLP frameworks to drive robust human-model and model-model alignment. I obtained my PhD in Physical Sciences and Industrial and Energy Innovation Engineering from the University of Rome Tor Vergata in 2023. My thesis explored pre-trained LLMs and AI.


### Research Focus
My research tackles a core challenge in modern AI: steering complex architectures beyond statistical shortcuts towards reliable, human-aligned behaviour.
* **Agentic Reasoning:** Engineering advanced AI architectures and evaluating their robust controllability across heterogeneous environments.
* **Interpretability & Explainability:** Investigating model mechanics and designing robust policies for behavioural control.
* **Multilingual Generalisation:** Leveraging novel pre-training and distillation techniques to drive generalisation across knowledge-intensive tasks.

### Academic Contributions
My contributions to the field are documented through my publications in top-tier international conferences and journals.
* **Google Scholar:** [link](https://scholar.google.com/citations?user=u2FWGIIAAAAJ)
* **Scopus ID:** [link](https://www.scopus.com/authid/detail.uri?authorId=57217633494)

---

### Professional Service
**Organiser**
* Co-Organiser of the ORACLE Workshop on Open Reasoning Across Cultures & Languages (EMNLP 2026).
* Co-Organiser of the Workshop on Mathematical Natural Language Processing (MathNLP 2025 & 2026).
* Co-Organiser of SemEval 2026 Task-11 (Disentangling Content and Formal Reasoning in Large Language Model).

**Chairs & Editing**
* Senior Area Chair: EMNLP 2025, EACL 2026, EMNLP 2026.
* Area Chair: ACL Action Editor Rolling Review (2023-2025), COLING 2025, LREC-COLING 2024, EMNLP 2023.
* Guest Editor: Future Internet.

**Reviewer**
* Transactions of the Association for Computational Linguistics (TACL).
* Transactions of Machine Learning Research (TMLR).


<script>
function filterPubs(category) {
  var papers = document.getElementsByClassName('paper-box-text');
  if (category == 'all') category = '';
  
  for (var i = 0; i < papers.length; i++) {
    if (papers[i].className.indexOf(category) > -1) {
      papers[i].style.display = "block";
    } else {
      papers[i].style.display = "none";
    }
  }
}
</script>

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
    display: block;
  }
</style>
