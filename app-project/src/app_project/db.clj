 (ns app-project.db
   (:require [grape.core :refer :all]))

(use 'grape.core)

(def GTSystem (gts 'app {}))

(def GTSystem (rule 'doAction! []
      {:create (pattern (node 'n1 {:label "AppNode"}))} GTSystem))


(defn doAction []
  (attempt GTSystem (apl 'doAction!))
  )