# Biodiversity

This application provides visualizations of baterial biodiversity.

# Technologies Used

* Python
* Flask
* SQLAlchemy, SQLite
* Javascript, D3, Plotly
* Heroku

# Reference

* GitHub: https://github.com/daddyjab/Biodiversity
* Visualization (on Heroku): https://project-biodiversity.herokuapp.com/

# Contributions

* Jeffery Brown: Designed and implemented all application-specific code and visualations for this application

* Data:
    * Data on bacteria present in samples collected from belly buttons of human subjects was provided as input; it was obstained from Rob Dunn Lab: http://robdunnlab.com/projects/belly-button-biodiversity/

# Summary

This applicable uses a Flask application and SQLite database to support visualization of the study results using Javascript, D3, and Plotly.  The resulting application was then deployed to the web using Heroku.

# Backend/Database (Flask application, SQLite database)
The Flask application implemented in [`app.py`](app.py) reads the study data from a SQLite database, and then make the results available to the JavaScript front-end via routes:

* Route `/`: Renders the web page
* Route `/names`: Returns a list of unique IDs for sample participants
* Route `/metadata/<sample>`: Returns basic information associated with each participant (Age, Ethnicity, Gender, Location of Sampling, etc.)
* Route `/samples/<sample>`: Returns the type and proportion of bacterial components present in each participant's sample

# Visualization (Tableau Desktop, Tableau Public)

Figure 1 below shows a screenshot of the dashboard, which contains several elements:

* A drop-down menu allowing the user to select a particular sample participant for which results will be displayed
* A bubble chart showing the relative proportion of bacteria present in the sample for all bacteria observed
* A donut chart showing the top 10 bacteria present in the sample
* Hovering over an element of the bubble or donut chart shows additional detail about the bacteria and proportion in the results.

| Figure 1: Biodiversity - Screenshot of Interactive Dashboard Visualization |
|----------|
| ![Biodiversity Visualization - Screenshot is loading...](docs/Biodiversity-visualization.gif "Figure 1: Biodiversity - Screenshot of Interactive Dashboard Visualization") |
