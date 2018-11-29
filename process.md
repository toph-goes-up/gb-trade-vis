# Proposal

## Basic Info

Project title: Visualizing Imperial British Trade
Name: Christopher Kinsey
Email: toph.kinsey@gmail.com
A#: 01784086
Repository: https://github.com/tophski/gb-trade-vis

## Background and Motivation

I found this dataset while browsing the project resources. I was very interested in the paper published using the data, but there were no interesting visualizations associated with it. The data and paper describe how countries' trade relationships changed during colonization and after independence. I will focus particularly on Great Britain for this. I have always been fascinated by the economies of large empires, and 20th century Great Britain had the largest empire the world has ever seen, and there is plenty of data on it.

## Project Objectives

The visualizations will describe how former British colonies were affected economically by being colonized and gaining their independence. Naturally, different countries will be affected in different ways by these events, so I will provide a way to view specific relationships in greater detail. 

## Data

The datasets I will be using is hosted at http://econ.sciences-po.fr/thierry-mayer/data.

## Data Processing

The provided datasets have statistics covering every pair of countries 1948 - 2006. Much of this data will be irrelevant to my project, so I will filter out data covering countries that are not related to the British Empire. Most of the statistics required for the visualizations should already be present, but I may need to derive a simpler metric to describe trade relationships.

## Visualization Design

![design page 1](./design1.png)
![design page 2](./design2.png)
![design page 3](./design3.png)
![final design page](./desginfinal.png)

## Must-Have Features

### Map
- Azimuthal projection map filtered to only fully draw major colonies and former colonies within continents.
- Weighted Arrows connecting countries with GB.
- Big timeline on map to select year.
- Click to select countries

### Detail Panel
- Country name and flag
- 3-letter iso country code for 3 main trading partners with darkened flag behind, change by year.
- Linked year slider, shaded to show relationship to GB. Dark red for trade deficit, white for neutral, dark blue for trade surplus.
- Population, GDP, colony status, etc. according to year.
- Non-year specific info. Dates colonized and freed, type of separation, etc.

## Optional Featuers
- Change arrows to show full trade data for selected country, and filter out others.
- Additional color coding on the big map timeline, showing relative 'strength' of the British Empire.

## Project Schedule

I will be setting my due dates on Thursdays for my own convinience.

Nov 8: Have the dataset completely cleaned, processed, and imported into D3 in a suitable format.

Nov 15: Draw the map, showing Great Britian, its colonies, and lines linking them with some indication of trade strength. Animate the map over the time series.

Nov 22: Make the map interactive, showing details of the selected country's relationship with Great Britain over time.

Nov 29: Clean everything up, make sure everything is presentable, and submit the project.

# Checkpoint

## Exploring Data

The dataset has 37 columns for each data point, containing information such as population, whether or not two countries share a common legal system, the distance between the countries, and more. The column headers for the data are not very descriptive, and the paper that accompanies the data does not do a very good job of documenting what the headers mean. Because of this, I've spent most of my time trying to interpret the dataset. 

I still don't know exactly what the trade flor variable is, though I do know its the variable I'm interested in. It seems to be a ratio of the trade between two countries normalized against that of two arbitrary countries. I don't think the paper explicitly says which version of this variable they saved to the public dataset, but whatever it is, it will work for this visualization.

## Processing

Processing the data is as simple as writing a few Python utilities to extract the data from its normal .dta format, filter it according to the contries involved, and saving it to .csv format. These utilities are in ./python_wranglotron/wranglotron.py.

## Design Evolution

I've decided to not use an Azimutal projection. I think that the idea of the circular world with Great Britain at the center told the story very well, but the edge distortion turned out to be a problem. Azimuthal Projections have more distortion away from the center, and Inida, one of the biggest colonial stories of Great Britain, is almost on the opposite side of the world, so it turns out extremely distorted. Right now, I'm using the Natural Earth projection rotated to be cnetered on Great Britain. This has less distortion, though it does give Africa a questionable shape.

## Additional Data

I needed a list of country centroids to draw arcs from colonies to Great Britain. I found this in CSV format at http://worldmap.harvard.edu/data/geonode:country_centroids_az8.
