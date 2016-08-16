 (ns app-project.db
   (:require [app-project.db-rules :as rules]
             [grape.core :as grape]
             ))

(defn connect [] (rules/initalizeGTS 'app))

(defn doAction []
  (grape/attempt rules/GTSystem (grape/apl 'doAction!))
  )
