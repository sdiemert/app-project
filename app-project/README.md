# Adherence Perceptions Project (APP) Server Codebase

A web server for the adherence perceptions project. Written in Clojure (Ring + Compujure) and backed by a Neo4j database. 

## Whats Cool About This Web App?

This web uses a novel (I think?) concept. It uses Graph Transformation (via a modified version of [GRAPE](https://github.com/sdiemert/grape), thanks [u/jenshweber](https://github.com/jenshweber)) to define valid transformations on the graph database.
 
Each API call for changing the database state (not reads - yet...) is mapped directly to one or more graph transformation rules. This puts every operation on the database on a mathematically pure footing and opens the door for all kinds of interesting things.

## Usage

### System PreReqs

* Leinigen utility installed.
* Neo4j installed and running

### Setup

* In the profiles.clj indicate the Neo4j details (user, pass, url) 

### Run It

Run from the command line using: `$ lein ring server-headless`

## License

Copyright © 2016 Simon Diemert

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
