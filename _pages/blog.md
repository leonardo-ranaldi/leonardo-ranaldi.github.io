---
permalink: /blog/
title: "Blog"
excerpt: "Essays on reasoning, adaptation and agents."
author_profile: true
---

# Blog

Essays on reasoning, adaptation and agents, written from the research behind my papers and talks.

<div class="posts">
{% for post in site.data.blog %}
{% assign first = post.url | slice: 0 %}
<a class="post" href="{% if first == '/' %}{{ post.url | relative_url }}{% else %}{{ post.url }}{% endif %}">
  <span class="post__date">{{ post.date }}</span>
  <span class="post__title">{{ post.title }}</span>
  {% if post.subtitle %}<span class="post__dek">{{ post.subtitle }}</span>{% endif %}
  {% if post.summary %}<span class="post__summary">{{ post.summary }}</span>{% endif %}
</a>
{% endfor %}
</div>
