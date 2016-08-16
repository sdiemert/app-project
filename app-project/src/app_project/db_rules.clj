(ns app-project.db-rules
  (:require [grape.core :refer :all]))

(def GTSystem nil)

(defn initalizeGTS
  ([] (initalizeGTS 'app))
  ([sysName] (def GTSystem (gts (symbol sysName) {}))

   (def GTSystem
     (rule 'doAction! []
           {:create (pattern (node 'n1 {:label "AppNode"}))}
           GTSystem
           )
     )
    )
)